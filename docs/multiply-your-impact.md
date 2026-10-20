# Multiply Your Impact Widget

The Multiply Your Impact widget shows donors how much further their gift goes during a matching campaign. When a donor picks a gift amount or types their own, the message updates straight away. With a 3x match, choosing $100 shows:

> **$300 impact with 3x match**
> Your donations are being matched 3x

You manage everything from a short block of settings on the page. You can turn the widget on, change the wording, or schedule it without help from a developer.

## Adding the widget to a page

1. Open the donation page in the Engaging Networks page builder.
2. On the same page as the gift amount buttons, add a **Code block**. The block itself is invisible to donors, so it can go anywhere on that page.
3. Paste in the settings below and save.

```html
<script>
  window.EngridMultiplyYourImpact = {
    multiplier: 3,
  };
</script>
```

That's all you need. The widget appears just below the gift amount buttons, using the default wording.

## Writing the settings

Every setting goes on its own line between the curly braces `{ }`, like this:

```
name: value,
```

A few rules keep the settings working:

- **Put text in double quotes**, for example `headline: "Double your gift today",`
- **Don't put numbers or true/false in quotes**, for example `multiplier: 2,` and `enabled: false,`
- **End every setting line with a comma.**
- **Type or paste the quotes as plain straight quotes (`"`).** Word, Google Docs, and some email apps turn them into curly quotes (`“ ”`), and curly quotes stop the widget from working. If you copy settings from a document, check the quotes.

If the settings have a mistake, the widget stays hidden. The rest of the donation form keeps working normally.

## Settings reference

| Setting      | Required? | What it controls                      | Default                                 |
|--------------|-----------|---------------------------------------|-----------------------------------------|
| `multiplier` | Yes       | The size of the match                 | None. You must set it                   |
| `enabled`    | No        | Turns the widget on or off            | `true` (on)                             |
| `headline`   | No        | The main, bold message                | `"{amount} impact with 3x match"`       |
| `subheader`  | No        | The smaller line under the headline   | `"Your donations are being matched 3x"` |
| `anchor`     | No        | Where on the page the widget appears  | Just below the gift amount buttons      |
| `startDate`  | No        | The first day the widget shows        | No start date. Shows right away         |
| `startTime`  | No        | The time it starts on the start date  | `"00:00"` (midnight)                    |
| `endDate`    | No        | The last day the widget shows         | No end date. Shows indefinitely         |
| `endTime`    | No        | The time it stops on the end date     | `"23:59"` (end of the day)              |
| `timezone`   | No        | The timezone used for dates and times | `"America/New_York"` (Eastern Time)     |

Each setting is explained in more detail below.

### `multiplier` (required)

The size of the match. The widget multiplies the donor's chosen amount by this number.

- **Format:** a number greater than 0, without quotes
- **Examples:** `multiplier: 2,` for a 2x match, or `multiplier: 1.5,` for a 50% top-up

If `multiplier` is missing, zero, negative, or not a number, the widget stays hidden.

### `enabled`

Turns the widget on or off without deleting your settings. This is useful for pausing a campaign or preparing one in advance.

- **Format:** `true` or `false`, without quotes
- **Example:** `enabled: false,` hides the widget

If you leave this out, the widget is on.

### `headline`

The main, bold message. Wherever you type `{amount}`, the widget fills in the donor's multiplied gift, for example `$300`.

- **Format:** text in double quotes. `{amount}` is optional and can go anywhere in the text
- **Example:** `headline: "Your gift becomes {amount} today!",`

> **Important:** the default wording says "3x". If your match isn't 3x, change both the `headline` and the `subheader` to match your `multiplier`. Otherwise donors will see the wrong number.

### `subheader`

The smaller line of text under the headline. You can use `{amount}` here too.

- **Format:** text in double quotes
- **Example:** `subheader: "Every dollar is matched until midnight",`

### `anchor`

Controls where the widget appears. The widget is placed just after the page element you name here. Most pages never need this setting, because by default the widget appears below the gift amount buttons.

- **Format:** a CSS selector in double quotes. Your developer can tell you the right value
- **Examples:**
  - `anchor: ".en__field--donationAmt",` places it below the gift amounts (the default)
  - `anchor: ".en__field--recurrfreq",` places it below the one-time/monthly buttons

If the selector doesn't match anything on the page, the widget stays hidden.

### `startDate` and `endDate`

Schedule when the widget appears. Both are optional:

- **Neither date:** the widget shows indefinitely
- **Only `endDate`:** the widget shows now and stops after the end date. This suits a campaign that's already running
- **Only `startDate`:** the widget starts on that date and keeps showing
- **Both dates:** the widget shows only during that window

Both dates count as full days. An `endDate` of `"2026-12-31"` keeps the widget showing through the end of December 31.

- **Format:** `"YYYY-MM-DD"` in double quotes: a 4-digit year, then a 2-digit month, then a 2-digit day
- **Example:** `startDate: "2026-11-01",` for November 1, 2026

> Write dates as `"2026-12-01"`. Formats such as `"12/01/2026"` or `"Dec 1 2026"` won't work, and the widget will stay hidden.

### `startTime` and `endTime`

Narrow the schedule to a time of day. Use these to start a match at a set time or end it at midnight.

- **Format:** `"HH:MM"` on a 24-hour clock, in double quotes
- **Examples:**
  - `startTime: "09:00",` for 9:00am
  - `startTime: "17:30",` for 5:30pm
  - `endTime: "23:59",` for the end of the day (midnight)

A few things to know:

- A start or end time only works together with its date. `startTime` needs a `startDate`, and `endTime` needs an `endDate`. A time without its date hides the widget.
- An end time includes that whole minute. `endTime: "23:59"` keeps the widget showing until the clock strikes midnight.
- Use the 24-hour clock. For 5:00pm write `"17:00"`, not `"5:00"` or `"5pm"`.

### `timezone`

The timezone used for all dates and times. The schedule follows this timezone wherever the donor is. With Eastern Time, a match that ends at midnight ends at midnight Eastern for every donor. Daylight saving time is handled for you.

- **Format:** a timezone name in double quotes
- **Common values:**

  | Timezone                | Value                   |
  |-------------------------|-------------------------|
  | US Eastern (default)    | `"America/New_York"`    |
  | US Central              | `"America/Chicago"`     |
  | US Mountain             | `"America/Denver"`      |
  | US Pacific              | `"America/Los_Angeles"` |
  | UK                      | `"Europe/London"`       |

  For other locations, see the [full list of timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) and use the value in the "TZ identifier" column.

## A complete example

Here is every setting in use:

```html
<script>
  window.EngridMultiplyYourImpact = {
    enabled: true,
    multiplier: 3,
    anchor: ".en__field--donationAmt",
    startDate: "2026-11-01",
    startTime: "09:00",
    endDate: "2026-12-31",
    endTime: "23:59",
    timezone: "America/New_York",
    headline: "{amount} impact with 3x match",
    subheader: "Your donations are being matched 3x",
  };
</script>
```

The widget shows a 3x match from 9:00am Eastern on November 1, 2026 until midnight Eastern at the end of December 31, 2026.

## Running more than one match

You can set up several matches on the same page, such as a 2x match on Giving Tuesday followed by a 3x match afterwards. Each match has its own settings, and the widget picks the right one based on the schedule.

There are two ways to do this. Both work the same, so choose whichever is easier for you to manage.

### Option 1: all matches in one code block

Wrap the matches in square brackets `[ ]`. Give each match its own set of curly braces `{ }` and put a comma between them:

```html
<script>
  window.EngridMultiplyYourImpact = [
    {
      multiplier: 2,
      endDate: "2026-12-01",
      endTime: "23:59",
      headline: "{amount} impact with 2x match",
      subheader: "Your donations are being matched 2x until midnight",
    },
    {
      multiplier: 3,
      startDate: "2026-12-02",
      startTime: "00:00",
      headline: "{amount} impact with 3x match",
      subheader: "Your donations are being matched 3x",
    },
  ];
</script>
```

In this example, donors see the 2x match until midnight Eastern at the end of Giving Tuesday (December 1). From midnight, they see the 3x match instead.

### Option 2: each match in its own code block

This suits you if you want to switch matches on and off separately in the page builder. Each code block uses a slightly different first line, which adds the match to a list instead of replacing what's already there:

```html
<script>
  window.EngridMultiplyYourImpact = [].concat(window.EngridMultiplyYourImpact ?? [], {
    multiplier: 2,
    endDate: "2026-12-01",
    endTime: "23:59",
    headline: "{amount} impact with 2x match",
    subheader: "Your donations are being matched 2x until midnight",
  });
</script>
```

```html
<script>
  window.EngridMultiplyYourImpact = [].concat(window.EngridMultiplyYourImpact ?? [], {
    multiplier: 3,
    startDate: "2026-12-02",
    startTime: "00:00",
    headline: "{amount} impact with 3x match",
    subheader: "Your donations are being matched 3x",
  });
</script>
```

Note the closing `});` at the end of each block, rather than the usual `};`.

> **Don't mix the two first lines.** If one code block starts with `window.EngridMultiplyYourImpact = {` and another uses the `[].concat(...)` version, one will replace the other and a match will go missing. When you use separate code blocks, every block should use the `[].concat(...)` version.

### Which match shows if schedules overlap?

Only one widget shows at a time. If more than one match is active at the same moment, **the first one in the list wins**:

- In Option 1, "first" means the first match inside the square brackets.
- In Option 2, "first" means the code block nearest the top of the page.

Matches that are switched off (`enabled: false`), outside their schedule, or set up incorrectly are skipped, and the next match in the list is used instead.

To avoid surprises, schedules shouldn't overlap. When they do on purpose, put the match you want to take priority first.

## Things to know about timing

The widget checks the schedule **when the page loads**. A donor who opens the page at 11:55pm and stays on it past midnight keeps seeing the earlier match until they refresh or move to another page. Everyone who arrives after midnight sees the new match right away.

## Recipes

**Always on, no schedule:**

```html
<script>
  window.EngridMultiplyYourImpact = {
    multiplier: 2,
    headline: "{amount} impact with 2x match",
    subheader: "Your donations are being matched 2x",
  };
</script>
```

**A campaign that's already live and ends on a set date:**

```html
<script>
  window.EngridMultiplyYourImpact = {
    multiplier: 3,
    endDate: "2026-12-31",
  };
</script>
```

**A match that starts at 6:00pm Pacific and runs for one evening:**

```html
<script>
  window.EngridMultiplyYourImpact = {
    multiplier: 2,
    startDate: "2026-11-15",
    startTime: "18:00",
    endDate: "2026-11-15",
    endTime: "23:59",
    timezone: "America/Los_Angeles",
    headline: "{amount} impact with 2x match",
    subheader: "Tonight only: your gift is matched 2x",
  };
</script>
```

**Pausing a match without deleting it:**

```html
<script>
  window.EngridMultiplyYourImpact = {
    enabled: false,
    multiplier: 3,
  };
</script>
```

## Troubleshooting

If the widget isn't showing, work through this checklist:

1. **Is the code block on the same page as the gift amount buttons?** The widget only appears on a page that has them, unless you've set a different `anchor`.
2. **Is `multiplier` set to a number above 0, without quotes?**
3. **Is `enabled` set to `false`?** Remove that line or change it to `true`.
4. **Are you inside the scheduled dates and times?** Check them against the `timezone`, not your own local time.
5. **Are the dates written as `"YYYY-MM-DD"` and the times as `"HH:MM"` on a 24-hour clock?**
6. **Does every time have its date?** `startTime` needs `startDate`, and `endTime` needs `endDate`.
7. **Are all the quotes straight (`"`) rather than curly (`“ ”`)?** This often happens when settings are copied from a document.
8. **Does every setting line end with a comma, and does text have quotes on both sides?**
9. **Running more than one match?** Check that an earlier match in the list isn't active and taking priority. If you use separate code blocks, check that every block uses the `[].concat(...)` first line.

If you've checked everything and the widget still won't appear, your developer can add `?debug=true` to the end of the page address and look in the browser console for messages starting with **MultiplyYourImpact**. Each message explains why a match was hidden, for example "Outside of schedule" or "Anchor element not found".
