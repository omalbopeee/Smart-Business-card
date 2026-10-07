# Omal Bopage — Digital Business Card

A phone-first digital card built around a large full-color portrait, a navy (`#061e3f`) identity section, white contact actions, and restrained red (`#f32230`) accents. The exact attached portrait and original Tapx logo are included as local assets. Save Contact and WhatsApp are available directly on the profile. Swipe up or tap the bottom cue for a white contact sheet with a profile summary, sharing, and About / Company / Gallery tabs.

## Preview
Open `index.html` in a browser. No installation or build step is needed. Share uses the browser share menu or clipboard when served over HTTP(S); it explains the limitation when opened as a local file.

Swipe up from the portrait, profile, or bottom cue to explore. Keyboard users can focus the cue and press Enter or Space. Swipe down on the sheet to close it when its content is at the top; scrolling through longer details remains available. The top handle, close button, Escape, and backdrop also close it. Connect uses a monochrome WhatsApp icon. When the profile is taller than the viewport, the page scrolls naturally and the bottom cue remains the swipe target. The layout supports phone safe areas, pinch zoom, and reduced-motion preferences.

## Personalize
Edit `profile.js` to update your details, image paths, social URLs, and gallery entries. Empty social URLs, website, and address are hidden until supplied. The current bio is draft copy.

The supplied phone number is normalized to Sri Lanka’s +94 format for WhatsApp and vCard; the page displays the local number. Confirm before publishing.

## Remaining content
Optional website/address, gallery photos, and final company copy. Your new portrait, original logo, and Facebook, Instagram, and TikTok links are already included. `assets/omal-profile.png` and `assets/tapx-logo.png` are the original supplied images. The older portrait and vector logo remain in assets but are no longer used by the page.

This is a static frontend demo. Hosting and an NFC tag pointing to its public URL are separate steps. No backend, analytics, or contact submission is included. The reference video and inspection screenshots are excluded from Git.

