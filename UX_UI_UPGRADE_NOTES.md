# UX/UI Upgrade Notes

This version refreshes the Sunset View Point web app with a warmer restaurant-focused interface and a clearer booking experience.

## Updated areas

- Global theme: new sunset-inspired color tokens, softer surfaces, smoother focus states, rounded controls, glass panels, and improved page background.
- Navigation: redesigned sticky glass navbar, active-link pills, clearer mobile menu, login/logout actions, and stronger booking CTA.
- Home page: modern hero section, benefit stats, improved offering cards, refined story copy, better imagery layouts, and stronger conversion CTA.
- Booking page: improved hero, three-step booking explanation, sticky reservation card on large screens, upgraded menu search/category tabs, selected-item states, and live subtotal UI.
- Forms: larger fields, clearer helper text, friendlier status messages, better success cards, and improved member-discount communication.
- Contact page: stronger hero, direct call/email actions, upgraded contact cards, and cleaner embedded map section.
- Auth/member pages: modern split-panel login/sign-up screens, clearer member value proposition, and redesigned member dashboard.
- Small fixes: corrected story copy typos and fixed the 1.5L water image path in the menu data.

## Notes

- The project package intentionally excludes local build output and sensitive environment/service-account files.
- Add your real environment values back using `.env.local` before running the app locally or deploying.
- I could not run a full Next.js build in this environment because package installation was not available, but all TypeScript/TSX files were syntax-checked with the TypeScript compiler parser.
