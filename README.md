# Omal Bopage — Personal Digital Profile

A static, mobile-first implementation of the seven-screen design supplied in the PDF: personal contact page, social links, company, gallery, products, owner access, and profile editor. The two profile pages support swipe and tap navigation. Company and product content stays separate from Omal's personal Call, Email, and WhatsApp actions.

## Use

Open `index.html`. No installation or build step is required. Contact links open the phone, email, WhatsApp, and website handlers; Save Contact downloads a `.vcf` file. The website button opens `https://tapx.lk/`.

Edit Profile is a frontend demo. Enter the personal email listed in `profile.js` to open the editor. There is no email delivery, verified login, or server account. Saved edits, profile photos, social URLs, company information, and gallery changes persist in this browser's local storage only. They do not update other devices or visitors. The sign-in screen and editor make the demo storage scope visible.

## Content

Defaults are in `profile.js`. Personal phone, email, WhatsApp, Facebook, Instagram, and TikTok details are retained. LinkedIn is intentionally unlinked until the owner provides a URL; it can be added through Edit Profile → Manage.

The gallery's `assets/tapx-card-navy.png` and `assets/tapx-card-classic.png` were extracted from the supplied design PDF. The existing original portrait and Tapx logo are reused. Add or remove up to eight company images in the demo editor.

Clear the `tapx.personal-profile.v1` local-storage entry to restore the defaults in `profile.js`. A production version would need a backend for verified email sign-in and edits shared across devices.
