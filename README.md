# Omal Bopage — Digital Business Card

A phone-first digital card using Tapx navy (`#061e3f`), red (`#f32230`), and white, with a full-color portrait and a single-column layout. Swipe up on the card to reveal contact details, or tap the swipe cue. The contact sheet includes vCard download, WhatsApp connection, sharing, and About / Company / Gallery tabs.

## Preview
Open `index.html` in a browser. No installation or build step is needed. Share uses the browser share menu or clipboard when served over HTTP(S); it explains the limitation when opened as a local file.

Swipe up from the portrait, profile, or bottom cue to explore. Keyboard users can focus the cue and press Enter or Space. Swipe down on the sheet to close it when its content is at the top; scrolling through longer details remains available. The top handle, close button, Escape, and backdrop also close it. Connect uses a monochrome WhatsApp icon. When the profile is taller than the viewport, the page scrolls naturally and the bottom cue remains the swipe target. The layout supports phone safe areas, pinch zoom, and reduced-motion preferences.

## Personalize
Edit `profile.js` to update your details, image paths, social URLs, and gallery entries. Empty social URLs, website, and address are hidden until supplied. The current bio is draft copy.

The supplied phone number is normalized to Sri Lanka’s +94 format for WhatsApp and vCard; the page displays the local number. Confirm before publishing.

## Remaining content
Optional website/address, gallery photos, and final company copy. Your portrait and Facebook, Instagram, and TikTok links are already included. `assets/tapx-logo.svg` is a vector adaptation of the supplied logo reference; replace it with your original logo file if pixel-perfect artwork is needed.

This is a static frontend demo. Hosting and an NFC tag pointing to its public URL are separate steps. No backend, analytics, or contact submission is included. The reference video and inspection screenshots are excluded from Git.

