# Learn & Lead — GSAP rebuild

A responsive rebuild of https://learnandlead.ae/ with a charcoal, ivory, and sage visual system.

## Run locally

Use Node.js, then run `npm start` from this folder. Open http://127.0.0.1:4173/.

The production files are in `dist/`. There is no build step or package installation. GSAP 3.14.2 and ScrollTrigger are included locally. The optional DM Sans web font loads from Google Fonts, with an Arial fallback.

## Interactions

- GSAP timeline for the hero entrance, reversible ScrollTrigger reveals, and desktop skyline parallax.
- Responsive `gsap.matchMedia()` setup respects `prefers-reduced-motion`; contexts revert on page exit and remount on a back-forward cache return.
- Service detail dialogs, accessible keyboard-operated training filters, mobile navigation, and section-aware navigation.
- Validated enquiry form generates a WhatsApp message preview. Opening WhatsApp prepares a draft; the visitor sends it. There is no enquiry database or email backend.

## Content and assets

Service categories, training subjects, company name, phone, email, and Abu Dhabi location were verified against the original website on 29 October 2026. New editorial copy introduces those same offerings. No pricing, credentials, clients, or testimonials have been invented.

- Original brand logo: https://learnandlead.ae/learn-and-lead-logo.jpeg
- Skyline photograph: https://images.unsplash.com/photo-1512453979798-5ea266f8880c
- GSAP: https://gsap.com/ and https://gsap.com/community/standard-license/

## Verification

JavaScript syntax, local HTTP response, desktop and 390px/320px layouts, image loading, service dialogs, training filters and keyboard selection, mobile navigation, and enquiry draft generation were checked. Reduced-motion behavior was reviewed in source; the browser test environment did not expose media-preference emulation. WhatsApp messages were not sent during testing.

The `.openai/hosting.json` file identifies the private hosted Site. The deliverable can also be hosted as ordinary static files from `dist/`.
