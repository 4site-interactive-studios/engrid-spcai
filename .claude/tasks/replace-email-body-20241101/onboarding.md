# Onboarding Notes: Replace Email Body Copy

## Task Context
- Objective: Update donation autoresponder email body with user-specified gratitude message and signature.
- Source file: `src/html/email/autoresponder-donation.html` (XHTML email template with personalization tokens like `{user_data~First Name}`).
- Stakeholders: SPCA International donors receiving autoresponder.

## Key Instructions & Constraints
- Follow Cursor developer/system guidelines (concise summaries, cite edits, use provided tools).
- Replace existing placeholder body paragraphs while preserving surrounding structure, personalization tokens, and styling attributes.
- Maintain ASCII characters and XHTML compatibility for email rendering.
- Respect onboarding requirement: document exploration before editing (this file satisfies it).

## Repository Recon
- Project root confirmed at `/Users/4Site/Documents/GitHub/engrid-spcai`.
- `src/html/email` currently contains single template `autoresponder-donation.html`.
- Template structure: hero logo, personalized greeting `{user_data~First Name}`, several `<p>` blocks with placeholder lorem ipsum, signature block with image, and donation metadata tables.

## Considerations & Risks
- Ensure new copy fits email tone and formatting; adjust `<p>` tags without breaking table layout or line-height styles.
- Watch for non-breaking spaces or special characters; prefer plain ASCII logos; only include provided URL `http://www.spcai.org`.
- Preserve dynamic placeholders and donation info sections below signature.

## Open Questions
- Should signature image/text be updated alongside message? (Assuming only body copy replacement per request.)
- Confirm whether to keep greeting `{user_data~First Name},` before new paragraphs. (Plan: retain greeting, replace subsequent paragraphs down through signature text.)

## Action Plan
1. Identify paragraph range in `autoresponder-donation.html` that contains placeholder gratitude and signature text.
2. Replace paragraphs between greeting and "Sincerely," block with provided copy, retaining inline styles.
3. Update signature paragraph to "The SPCA International Team" and remove lorem ipsum contact lines if redundant.
4. Review rendered HTML section for consistent spacing and markup.
5. Communicate changes, highlight affected file, suggest verification (e.g., preview email template).

## Next Steps
- Proceed to modify `autoresponder-donation.html` according to plan.
