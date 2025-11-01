# Onboarding Notes

## Task Summary
- Replace existing body copy in `src/html/email/autoresponder-lorem-ipsum.html` with lorem ipsum placeholder text.
- Remove the receipt information table block from the same template.

## Codebase Recon
- Email templates live under `src/html/email/`; each file is standalone HTML with inline styles for email client compatibility.
- `autoresponder-lorem-ipsum.html` currently contains donor-facing copy plus Gift/Donor info tables and placeholders like `{user_data~First Name}`.
- Multiple inline `<style>` blocks repeat `.jcpwm-preloader`; leave untouched unless specified.
- Footer includes social links and address; requirement does not mention altering these.

## Plan
1. Update the body section paragraphs after the greeting so the content is lorem ipsum copy while retaining overall structure and styling.
2. Remove the Gift Information/Donor Information table block, ensuring surrounding markup remains valid.
3. Manually sanity-check resulting HTML for structural integrity (balanced tags, preserved footer).

## Open Questions
- None; requirements are straightforward.

## Validation Thoughts
- No automated tests; rely on visual diff/inspection.
- Optional: load HTML in a browser/email previewer if needed (not requested).
