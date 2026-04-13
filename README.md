# Woofbox — Williamsburg, Brooklyn

> Coffee, curated goods, and a grooming studio for small pets and their humans.

Static frontend site at `/`. Designed and built as a single-page site with modular CSS, vanilla JS (ES modules), and a build step via esbuild.

---

## Project Structure

```
woof/
├── index.html                  ← Main page (dev mode, ES modules)
├── css/
│   ├── tokens.css              ← Design tokens (colors, spacing, typography)
│   ├── base.css                ← Reset, focus system, typography, utilities, scroll reveal
│   ├── components.css          ← Buttons, badges, menu-row, merch-bento, gallery, modal, form, cursor-img
│   └── layout.css              ← Navbar, hero, about, shop, grooming, booking, contact, footer, responsive
├── js/
│   ├── main.js                 ← Entry point (imports all modules)
│   ├── utils.js                ← Shared helpers ($, $$, prefersReducedMotion, trapFocus)
│   ├── navbar.js               ← Scroll effect + active section tracking (rAF throttled)
│   ├── slideshow.js            ← Hero background slideshow (respects reduced motion)
│   ├── mobile-nav.js           ← Mobile overlay nav with focus trapping
│   ├── modal.js                ← Booking modal with focus trapping + ESC key
│   ├── form.js                 ← Form validation UX (inline errors, loading state, success)
│   ├── cursor-hover.js         ← Cursor-following hover image on menu items
│   ├── smooth-scroll.js        ← Smooth scroll for anchor links + logo-to-top
│   ├── scroll-reveal.js        ← IntersectionObserver-based reveal animations
│   └── lazy-map.js             ← Lazy loads Google Maps iframe on scroll/click
├── images/
│   ├── hero.jpg                ← Hero background slide 1
│   ├── hero2.png               ← Hero background slide 2
│   └── placeholder.jpg         ← Placeholder image
├── build.mjs                   ← Build script (esbuild JS + CSS concat/minify → dist/)
├── favicon.svg                 ← Favicon (W on bark background)
├── manifest.json               ← Web app manifest
├── package.json                ← Scripts: dev, build, preview
└── README.md                   ← This file
```

---

## Quick Start

```bash
# Install optional dependencies
npm install

# Development (serves ES modules directly)
npm run dev          # → npx serve . -p 3000

# Production build
npm run build        # → node build.mjs → dist/

# Preview production build
npm run preview      # → build + serve dist/ on :3001
```

---

## Tech Stack

| Layer       | Choice                          |
|-------------|---------------------------------|
| Markup      | Semantic HTML5                  |
| Styles      | Vanilla CSS with custom properties (50+ design tokens) |
| Scripts     | Vanilla JS, ES modules          |
| Build       | esbuild (optional fallback)     |
| Fonts       | Playfair Display + Inter (Google Fonts) |
| Map         | Google Maps (lazy loaded)       |
| Structured Data | JSON-LD LocalBusiness        |

---

## Roadmap

### Phase 1 — Current: Static Site ✅

- [x] Modular CSS with design tokens
- [x] ES module JS architecture
- [x] Build pipeline (esbuild)
- [x] SEO meta tags + JSON-LD
- [x] Accessibility (skip link, focus trapping, aria attributes, reduced motion)
- [x] Performance (lazy map, scroll reveal, throttled scroll handler)
- [x] Responsive design (1024 / 768 / 480 breakpoints)

### Phase 2 — Shopify Liquid Theme Conversion

Convert the static site into a Shopify theme so it can be uploaded to the existing Shopify store, replacing the old site.

#### Why Shopify

- Existing Shopify account already active and paid for
- Old site is still live on Shopify — needs replacement
- Booking + payments handled through Shopify's app ecosystem
- Future product sales (merch, coffee beans) happen natively
- No additional hosting cost

#### Target Shopify Theme Structure

```
woofbox-theme/
├── layout/
│   └── theme.liquid              ← <head>, <body>, font/loader tags, {{ content_for_header }}
│
├── templates/
│   ├── index.json                ← Homepage (references sections)
│   ├── page.contact.json         ← Contact page (if split out)
│   ├── page.coffee.json          ← Coffee & shop page (if split out)
│   ├── 404.json                  ← Not found
│   ├── product.json              ← For future product pages
│   └── collection.json           ← For future collection pages
│
├── sections/
│   ├── hero.liquid               ← Hero slideshow
│   ├── about.liquid              ← About section + gallery
│   ├── shop.liquid               ← Coffee menu + merch display
│   ├── grooming.liquid           ← Grooming services list
│   ├── booking.liquid            ← BookThatApp embed placeholder
│   ├── contact.liquid            ← Map + contact details
│   ├── navbar.liquid             ← Navigation bar
│   └── footer.liquid             ← Footer
│
├── snippets/
│   ├── menu-row.liquid           ← Reusable menu-row component
│   └── booking-modal.liquid      ← Booking modal (if not using app widget)
│
├── assets/
│   ├── styles.css                ← Combined CSS (all 4 files concatenated)
│   └── main.js                   ← Combined JS (all modules bundled)
│
├── config/
│   ├── settings_schema.json      ← Theme customization options (colors, fonts, text)
│   └── settings_data.json        ← Current settings values
│
├── locales/
│   └── en.default.json           ← English text strings
│
└── images/                       ← Theme assets uploaded via Shopify admin
```

#### Conversion Steps

1. **Create theme directory structure** — all folders above
2. **Convert `index.html` → `layout/theme.liquid`**
   - Replace hardcoded `<head>` with Liquid tags: `{{ content_for_header }}`, `{{ 'styles.css' | asset_url | stylesheet_tag }}`
   - Wrap body in `{% sections 'header' %}` / `{% section 'footer' %}`
3. **Split each `<section>` into `sections/*.liquid`**
   - Add `{% schema %}` blocks for editable settings (heading text, images, colors)
   - Example: hero section gets settings for slide images, title text, subtitle text
4. **Port CSS** → `assets/styles.css`
   - Concatenate all 4 CSS files into one (already done by build)
   - Replace `../images/` paths with Shopify's `{{ 'filename.jpg' | asset_url }}`
   - Minimal changes expected — Shopify respects standard CSS
5. **Port JS** → `assets/main.js`
   - Bundle all modules into one file (already done by build)
   - Remove ES module imports/exports (esbuild handles this)
   - Test all interactions (slideshow, mobile nav, modal, scroll reveal)
6. **Make content editable via `{% schema %}`**
   - Hero: title, subtitle, slide images, label text
   - About: heading, body text, gallery images
   - Shop: coffee items (or pull from Shopify products)
   - Grooming: service names, prices, descriptions
   - Contact: address, hours, email, phone
   - Footer: brand text, social links
7. **Upload images** to Shopify admin → Settings → Files
8. **Test** using Shopify CLI (`shopify theme dev`) or Theme Kit
9. **Push live** via Shopify admin or GitHub integration

#### Files & What Changes

| Current File | Shopify Equivalent | Change Level |
|---|---|---|
| `index.html` full page | `layout/theme.liquid` + `sections/*.liquid` | Full rewrite (split into pieces) |
| `css/tokens.css` | Part of `assets/styles.css` | Minimal (concat only) |
| `css/base.css` | Part of `assets/styles.css` | Minimal |
| `css/components.css` | Part of `assets/styles.css` | Minimal |
| `css/layout.css` | Part of `assets/styles.css` | Medium (image URL paths) |
| `js/main.js` + all modules | `assets/main.js` | Minimal (bundled by esbuild) |
| `images/*` | Shopify Files admin or `assets/` | Upload |
| `favicon.svg` | Shopify admin → Theme settings | Upload |
| `manifest.json` | Not needed (Shopify handles PWA) | Remove |

#### Liquid Schema Example (hero section)

```liquid
{%- schema -%}
{
  "name": "Hero",
  "settings": [
    {
      "type": "text",
      "id": "label",
      "label": "Label text",
      "default": "Williamsburg, Brooklyn"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Woof"
    },
    {
      "type": "image_picker",
      "id": "slide_1",
      "label": "Background slide 1"
    },
    {
      "type": "image_picker",
      "id": "slide_2",
      "label": "Background slide 2"
    }
  ]
}
{%- endschema -%}
```

This lets anyone edit the hero section from Shopify's theme editor without touching code.

---

### Phase 3 — Booking App: BookThatApp

Add online appointment booking with payment collection through Shopify.

#### Why BookThatApp

- Native Shopify app (works inside the store, no iframe hacks)
- Free tier for testing (up to 10 bookings)
- $10/mo for unlimited bookings
- Customers can upload vaccination records / pet photos during booking
- Supports waiver/contract attachments
- Handles deposits or full payment upfront
- Automatic confirmation + reminder emails
- Reduces no-shows

#### Alternatives Considered

| App | Price | Why Not |
|-----|-------|---------|
| Sesami | $19–29/mo | Better POS integration, but more expensive for current needs |
| Square Appointments | Free | Requires leaving Shopify ecosystem — defeats the purpose |
| Fresha | Free | Not on Shopify App Store, separate platform |

#### Setup Steps

1. **Install BookThatApp** from Shopify App Store
2. **Configure services** to match the grooming menu:
   - Bath & Brush — from $45 — 60 min
   - Full Groom — from $75 — 90 min
   - Nail Trim — $20 — 15 min
   - Ear Cleaning — $15 — 15 min
   - Teeth Brushing — $12 — 15 min
   - Puppy Intro Groom — from $40 — 45 min
3. **Set staff availability** (groomer schedule, opening hours)
   - Mon–Fri: 8 AM – 7 PM
   - Sat–Sun: 9 AM – 6 PM
4. **Enable payment collection**
   - Full payment or deposit at booking
   - No-show protection (require card)
5. **Add booking form fields**
   - Pet name (required)
   - Pet type: Dog / Cat / Other
   - Breed
   - Upload: vaccination records / pet photo
   - Notes field
6. **Embed in the theme**
   - Replace the current booking modal (`#bookingModal`) with BookThatApp's widget
   - The "Book Now" CTA buttons throughout the site open the BookThatApp flow
   - Map the booking section's `booking.liquid` to render the app widget
7. **Configure notifications**
   - Confirmation email to customer
   - Reminder email (24h before)
   - New booking alert to store email
8. **Test the full flow**: book → pay → confirm → reminder

#### What Changes in the Theme

- `sections/booking.liquid` — replace the manual form with BookThatApp's embed code
- `snippets/booking-modal.liquid` — likely removed entirely (app provides its own UI)
- `assets/main.js` — remove `form.js` and `modal.js` imports (no longer needed)
- All `#booking` href links — redirect to BookThatApp's booking page/widget
- Booking section in `index.json` — updated to render app block

#### BookThatApp Embed (conceptual)

BookThatApp provides either:
- **A dedicated booking page** (e.g. `woofbox.nyc/pages/book`) — link all "Book Now" buttons here
- **An embedded widget** — rendered inside the existing booking section
- **A Shopify app block** — added through the theme editor directly

The approach depends on BookThatApp's current integration method at the time of setup. Check their docs at [support.bookthatapp.com](https://support.bookthatapp.com).

---

### Phase 4 — Future: Online Merchandise Sales

When ready to sell products online, the Shopify infrastructure is already in place.

#### What's Already There

- The merch bento grid in the Shop section displays 6 products with names and prices
- Currently hardcoded — needs to pull from Shopify's product catalog instead

#### Setup Steps

1. **Add products in Shopify admin**
   - Products → Add product
   - Name, price, description, photos, variants (size, color)
   - Organize into collections: "Merch", "Coffee Beans", "Accessories"

2. **Convert merch bento grid to dynamic Liquid**
   ```liquid
   {% for product in collections.merch.products %}
     <div class="merch-bento__item">
       <img src="{{ product.featured_image | image_url: width: 400 }}" 
            alt="{{ product.title }}">
       <div class="merch-bento__info">
         <p class="merch-bento__name">{{ product.title }}</p>
         <p class="merch-bento__price">{{ product.price | money }}</p>
       </div>
     </div>
   {% endfor %}
   ```

3. **Add "Add to Cart" buttons** to each product card
   ```liquid
   {% form 'product', product %}
     <input type="hidden" name="id" value="{{ product.variants.first.id }}">
     <button type="submit" class="btn btn--small">Add to Cart</button>
   {% endform %}
   ```

4. **Set up cart page** (`templates/cart.json` + `sections/cart.liquid`)
   - Slide-out cart or dedicated cart page
   - Shopify handles checkout, shipping, taxes

5. **Set up Shopify Payments** (if not already)
   - Accepts credit cards, Apple Pay, Google Pay, Shop Pay
   - Transaction fees depend on Shopify plan

6. **Coffee menu stays static** (it's an in-store menu, not shippable products)
   - Unless selling coffee beans / subscriptions later
   - Then same pattern: create collection, loop with Liquid

#### Products to Add (matching current merch bento)

| Product | Price | Category |
|---------|-------|----------|
| Woofbox Tote Bag | $22 | Merch |
| Dog Bandana | $16 | Merch |
| Ceramic Dog Mug | $18 | Merch |
| Branded Leash | $28 | Merch |
| Mini Treat Jar | $14 | Merch |
| Woofbox Hoodie | $48 | Merch |

#### Future Enhancements to Consider

- **Coffee bean subscriptions** — recurring billing via Shopify
- **Gift cards** — built into Shopify natively
- **Instagram shopping** — tag products in posts, link to Shopify
- **Email marketing** — Shopify integrates with Klaviyo / Mailchimp
- **Analytics** — Shopify's built-in dashboard + Google Analytics

---

## Timeline Summary

| Phase | Description | Status | Est. Effort |
|-------|-------------|--------|-------------|
| 1 | Static site build | ✅ Done | Complete |
| 2 | Shopify Liquid theme conversion | 📋 Planned | ~10–12 hours |
| 3 | BookThatApp integration | 📋 Planned | ~2–3 hours |
| 4 | Online product sales | 🔮 Future | ~3–4 hours |

---

## Useful Links

- **Shopify Theme Docs**: https://shopify.dev/docs/themes
- **Liquid Reference**: https://shopify.dev/docs/api/liquid
- **BookThatApp**: https://apps.shopify.com/bookthatapp
- **BookThatApp Docs**: https://support.bookthatapp.com
- **Shopify CLI**: https://shopify.dev/docs/themes/tools/cli
- **Theme Kit** (alternative): https://shopify.dev/docs/themes/tools/theme-kit
- **Sesami** (booking alternative): https://apps.shopify.com/sesami

---

## Local Development

```bash
# Dev server (ES modules, no build needed)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Shopify Theme Development

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Login to store
shopify auth login --store woofbox.myshopify.com

# Create theme from converted files
shopify theme init woofbox-theme

# Develop with live preview
cd woofbox-theme
shopify theme dev

# Push to production
shopify theme push
```
