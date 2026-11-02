import {
  ENGrid,
  EngridLogger,
  DonationAmount,
  DonationFrequency,
} from "@4site/engrid-scripts";

interface MultiplyYourImpactConfig {
  enabled?: boolean;
  multiplier?: number;
  anchor?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timezone?: string;
  headline?: string;
  subheader?: string;
}

declare global {
  interface Window {
    EngridMultiplyYourImpact?:
      | MultiplyYourImpactConfig
      | MultiplyYourImpactConfig[];
  }
}

const DEFAULT_ANCHOR = ".en__field--donationAmt";
const DEFAULT_TIMEZONE = "America/New_York";
const DEFAULT_HEADLINE = "{amount} impact with 3x match";
const DEFAULT_SUBHEADER = "Your donations are being matched 3x";
const DEFAULT_START_TIME = "00:00:00";
const DEFAULT_END_TIME = "23:59:59";

export class MultiplyYourImpact {
  private logger = new EngridLogger(
    "MultiplyYourImpact",
    "#163f58",
    "#e11f28",
    "✨"
  );

  constructor() {
    const config = window.EngridMultiplyYourImpact;
    if (!config) {
      this.logger.log("Widget not configured");
      return;
    }

    // Only the first active entry renders; later entries stay hidden
    let activeEntryRendered = false;
    const entries = Array.isArray(config) ? config : [config];
    entries.forEach((entry, index) => {
      if (!entry) {
        this.logger.log(`Entry ${index + 1}: empty`);
        return;
      }
      if (entry.enabled === false) {
        this.logger.log(`Entry ${index + 1}: disabled`);
        return;
      }
      if (activeEntryRendered) {
        this.logger.log(
          `Entry ${index + 1}: another entry is already active, widget hidden`
        );
        return;
      }
      const instance = new MultiplyYourImpactInstance(
        entry,
        this.logger,
        index + 1
      );
      if (instance.active) {
        activeEntryRendered = true;
      }
    });
  }
}

class MultiplyYourImpactInstance {
  public active = false;
  private multiplier = 0;
  private headline = DEFAULT_HEADLINE;
  private subheader = DEFAULT_SUBHEADER;
  private headlineEl: HTMLElement | null = null;
  private subheaderEl: HTMLElement | null = null;

  constructor(
    config: MultiplyYourImpactConfig,
    private logger: EngridLogger,
    private entryNumber: number
  ) {
    if (
      typeof config.multiplier !== "number" ||
      !isFinite(config.multiplier) ||
      config.multiplier <= 0
    ) {
      this.log("Invalid multiplier, widget hidden");
      return;
    }
    this.multiplier = config.multiplier;

    if (!this.isWithinSchedule(config)) {
      this.log(
        "Outside of schedule or invalid date/time/timezone, widget hidden"
      );
      return;
    }

    let anchor: Element | null = null;
    try {
      anchor = document.querySelector(config.anchor ?? DEFAULT_ANCHOR);
    } catch {
      this.log("Invalid anchor selector, widget hidden");
      return;
    }
    if (!anchor) {
      this.log("Anchor element not found, widget hidden");
      return;
    }

    if (typeof config.headline === "string") {
      this.headline = config.headline;
    }
    if (typeof config.subheader === "string") {
      this.subheader = config.subheader;
    }

    anchor.insertAdjacentElement("afterend", this.buildWidget());
    this.active = true;
    this.render();

    DonationAmount.getInstance().onAmountChange.subscribe(() => this.render());
    DonationFrequency.getInstance().onFrequencyChange.subscribe(() =>
      this.render()
    );

    this.log("Widget active");
  }

  private log(message: string): void {
    this.logger.log(`Entry ${this.entryNumber}: ${message}`);
  }

  private isWithinSchedule(config: MultiplyYourImpactConfig): boolean {
    if (
      config.startDate !== undefined &&
      !this.isValidISODate(config.startDate)
    ) {
      return false;
    }
    if (config.endDate !== undefined && !this.isValidISODate(config.endDate)) {
      return false;
    }
    // A time is meaningless without its date
    if (config.startTime !== undefined && config.startDate === undefined) {
      return false;
    }
    if (config.endTime !== undefined && config.endDate === undefined) {
      return false;
    }

    const startTime = this.normalizeTime(
      config.startTime ?? DEFAULT_START_TIME,
      false
    );
    const endTime = this.normalizeTime(
      config.endTime ?? DEFAULT_END_TIME,
      true
    );
    if (startTime === null || endTime === null) {
      return false;
    }

    const now = this.nowInTimezone(config.timezone ?? DEFAULT_TIMEZONE);
    if (now === null) {
      return false;
    }

    if (config.startDate && now < `${config.startDate}T${startTime}`) {
      return false;
    }
    if (config.endDate && now > `${config.endDate}T${endTime}`) {
      return false;
    }
    return true;
  }

  private isValidISODate(date: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) {
      return false;
    }
    const [, year, month, day] = match;
    const parsed = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day))
    );
    return (
      parsed.getUTCFullYear() === Number(year) &&
      parsed.getUTCMonth() === Number(month) - 1 &&
      parsed.getUTCDate() === Number(day)
    );
  }

  // Accepts "HH:MM" or "HH:MM:SS" (24-hour) and returns "HH:MM:SS", or null if
  // invalid. End times default missing seconds to 59 so "23:59" runs to the
  // end of that minute.
  private normalizeTime(time: string, isEndTime: boolean): string | null {
    const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!match) {
      return null;
    }
    const seconds = match[3] ?? (isEndTime ? "59" : "00");
    return `${match[1]}:${match[2]}:${seconds}`;
  }

  // Returns "YYYY-MM-DDTHH:MM:SS" for the current moment in the timezone, or
  // null if the timezone is invalid. Intl handles daylight-saving time automatically.
  private nowInTimezone(timezone: string): string | null {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";
      // Some engines emit "24" for midnight with hour12: false
      const hour = get("hour") === "24" ? "00" : get("hour");
      return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get(
        "minute"
      )}:${get("second")}`;
    } catch {
      return null;
    }
  }

  private buildWidget(): HTMLElement {
    const widget = document.createElement("div");
    widget.className = "multiply-your-impact";

    this.headlineEl = document.createElement("p");
    this.headlineEl.className = "multiply-your-impact__headline";
    this.subheaderEl = document.createElement("p");
    this.subheaderEl.className = "multiply-your-impact__subheader";

    widget.appendChild(this.headlineEl);
    widget.appendChild(this.subheaderEl);
    return widget;
  }

  private render(): void {
    if (!this.headlineEl || !this.subheaderEl) {
      return;
    }
    const amount = this.formatAmount(
      DonationAmount.getInstance().amount * this.multiplier
    );
    this.headlineEl.textContent = this.headline.replace(/\{amount\}/g, amount);
    this.subheaderEl.textContent = this.subheader.replace(
      /\{amount\}/g,
      amount
    );
  }

  private formatAmount(value: number): string {
    const rounded = Math.round(value * 100) / 100;
    const formatted = rounded.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
    return `${ENGrid.getCurrencySymbol()}${formatted}`;
  }
}
