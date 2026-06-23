# CMS Upgrade Notes

This upgrade adds the requested CMS modules while keeping the current passcode-based CMS access pattern.

## Added

- Booking status: `pending`, `confirmed`, `cancelled`, `completed`
- Payment status: `unpaid`, `paid`, `refunded`
- Booking search/filter by name, phone, email, date, booking status, and payment status
- Booking export as CSV and Excel-compatible `.xls`
- Menu image upload through Firebase Storage
- Availability settings page: max guests per slot, opening time, closing time, booking interval, blackout dates
- Reservation API enforcement for max capacity, opening/closing hours, and blackout dates
- Audit log collection for CMS actions
- Dashboard insights: 7-day revenue bars, top-selling items, busiest slots
- Staff roles store: owner, manager, viewer
- CMS page builder with themed public pages and customizable hero/section text
- Public dynamic page route: `/<slug>`
- Navigation automatically includes published CMS pages with `showInNav = true`

## Firestore collections used

- `customers/{customerId}/bookings/{bookingId}`
- `cmsMenuItems`
- `settings/global`
- `cmsAuditLogs`
- `cmsPages`
- `cmsStaff`

## Firebase Storage

Menu/page image upload uses `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` or `FIREBASE_STORAGE_BUCKET`.
Uploaded images are saved with Firebase download tokens and the returned URL is stored in the CMS field.

## Important security note

Staff roles are stored in Firestore but are not yet enforced because the current CMS still uses a shared passcode.
For production, migrate `/cms` to Firebase Auth admin login and enforce these roles server-side.

## V3 CMS controls added

- Pages now have a clearer **Delete permanently** action with a confirmation prompt. This deletes the `cmsPages/{pageId}` document from Firestore.
- Staff now supports three separate actions:
  - **Save edits** for name, email, and role changes.
  - **Set inactive / Reactivate** for temporary access status.
  - **Delete permanently** to remove the staff document from Firestore completely.
- Availability now separates:
  - `maxGuestsPerSlot` - total capacity for one time slot, for example 20 people at 6:00 PM.
  - `maxGuestsPerBooking` - largest group one customer can book online, for example 15 people.
- Wild card feature added: **site announcement bar**. Enable it from CMS -> Availability to show a short message across the public website, optionally linked to another page.

New/updated setting fields in `settings/global`:

```txt
maxGuestsPerBooking
announcementEnabled
announcementText
announcementHref
```

## CMS page builder v6

The Pages tab is now a fuller page maker instead of a basic hero/text form.

Added page block types:

- Home-style H1 block
- Text section
- Image + text section
- Cards grid
- Image gallery
- Quote/highlight block
- Call-to-action block
- Divider/spacer block

Hero image uploads now show a preview in the CMS. After uploading, save the page to apply the new hero image to the public page.

Cards block format: one card per line using `Title | Text | Button label | /link`.
Gallery block format: one image URL per line. Uploading a gallery image appends its URL into the gallery body field.
