# Omal Bopage — Personal Digital Profile

A static, mobile-first implementation of the supplied PDF design: personal contact page, social links, company, gallery, and products. The two profile pages support swipe and tap navigation. Company and product content stays separate from Omal's personal Call, Email, and WhatsApp actions.

## Use

Open `index.html`. No installation or build step is required. Contact links open the phone, email, WhatsApp, and website handlers; Save Contact downloads a `.vcf` file. The website button opens `https://tapx.lk/`.

## Content

Profile content is configured in `profile.js`, including personal phone, email, WhatsApp, Facebook, Instagram, LinkedIn, and TikTok links.

The gallery's `assets/tapx-card-navy.png` and `assets/tapx-card-classic.png` were extracted from the supplied design PDF. The existing original portrait and Tapx logo are reused. Update the `gallery` array in `profile.js` to change company images and captions.
