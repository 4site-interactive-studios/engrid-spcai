import {
  Options,
  App,
  DonationAmount,
  DonationFrequency,
  EnForm,
  OptInLadder,
} from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import {
//   Options,
//   App,
//   DonationAmount,
//   DonationFrequency,
//   EnForm,
// } from "../../engrid/packages/scripts"; // Uses ENGrid via Visual Studio Workspace

import "./sass/main.scss";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import { customScript } from "./scripts/main";
import { sendSupporterDataToTatango } from "./scripts/tatango";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  Debug: App.getUrlParameter("debug") === "true",
  Placeholders: {
    ".en__field--donationAmt.en__field--withOther .en__field__input--other":
      "Custom Amount",
    "input#en__field_supporter_phoneNumber2": "Phone Number (Optional)",
  },
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    new OptInLadder();
    customScript(App, EnForm);
  },
  onResize: () => App.log("Starter Theme Window Resized"),
  VGS: {
    "transaction.ccnumber": {
      showCardIcon: {
        right: "20px",
      },
    },
  },
  onSubmit: () => {
    sendSupporterDataToTatango();
  }
};
new App(options);
