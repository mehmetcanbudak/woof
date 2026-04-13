# Woofbox Design 100/100 Plan

**Goal:** Take the Woofbox site from 7.7/10 to 10/10 across every design dimension.

**Constraint:** Vanilla HTML/CSS/JS stack stays. No framework migration. Shopify Liquid conversion compatibility must be preserved (class names, section structure, image paths).

---

## Phase 1: Typography — 8→10

### 1.1 Replace Instrument Sans with a more distinctive body font
- **Current:** Instrument Sans (trending heavily in AI-generated sites)
- **Target:** A warm, characterful sans-serif that matches the boutique personality
- **Candidates (pick one):** 
  - **General Sans** (clean but with more personality than Instrument Sans)
  - **Figtree** (geometric warmth, great readability)
  - **Outfit** (modern, slightly quirky)
  - **DM Sans** (refined, less overused)
- **File:** `css/tokens.css` line 59 — update `--font-sans`
- **File:** `index.html` line 42 — update Google Fonts URL

### 1.2 Add a third accent font for micro-copy
- Add a monospaced or handwriting-style font for labels, prices, or the "Puppuccino" featured callout
- **Candidates:** 
  - **JetBrains Mono** for prices (tabular nums, modern café vibes)
  - **Caveat** or **Sora** for playful accent moments
- **File:** `css/tokens.css` — add `--font-accent` variable
- **File:** `index.html` — add to Google Fonts link

### 1.3 Refine typographic scale
- Add `.heading-hero` level above `.heading-display` with even more dramatic sizing
- Add `.text-eyebrow` style for the "Williamsburg, Brooklyn" and "Downstairs" / "Street Level" labels with extended tracking and micro-size
- **Files:** `css/base.css`

---

## Phase 2: Color & Theme — 9→10

### 2.1 Add a secondary accent color
- Coral is the only accent. Add a muted green or gold for specific moments:
  - Green for the "Puppuccino" featured callout (organic/natural)
  - Gold/warm-yellow for the booking section glow
- **File:** `css/tokens.css` — add `--color-sage`, `--color-gold` + dark variants
- Apply sparingly to `.shop__featured`, `.booking` radial gradient

### 2.2 Add gradient mesh backgrounds to 2 sections
- The booking section already has a radial gradient. Extend this pattern:
  - About section: subtle warm gradient blob behind the gallery
  - Contact section: soft gradient in the map placeholder area
- **File:** `css/layout.css` — add `background-image` to `.about`, `.contact__map`

---

## Phase 3: Motion & Animation — 7→10

### 3.1 Activate `reveal--clip` and `reveal--scale` in the HTML
- The CSS classes exist but are unused. Apply them:
  - `.grooming__services` → `reveal--clip` (services list reveals by unclipping top-to-bottom)
  - `.merch-bento` items → `reveal--scale` with stagger
  - `.about__gallery` → `reveal--scale`
- **File:** `index.html` — add CSS classes to target elements

### 3.2 Add scroll-linked parallax to the hero "W" watermark
- The giant translucent "W" in `hero::before` should shift vertically on scroll
- **File:** `js/scroll-reveal.js` — add a scroll handler that adjusts `transform: translateY()` on `.hero::before` via a CSS variable
- Use `--hero-w-offset` custom property, updated via `requestAnimationFrame` on scroll
- **File:** `css/layout.css` — reference `var(--hero-w-offset)` in `.hero::before` transform

### 3.3 Add image zoom-on-hover for gallery and merch bento
- Gallery items: slow `scale(1.05)` on the `img` within `.gallery__item:hover`
- Merch bento: slow `scale(1.08)` on the `img` within `.merch-bento__item:hover`
- Overlay darkens slightly on hover (opacity shift 0.55→0.35 for more image visibility)
- **File:** `css/components.css` — add `img` transitions inside hover states
- Duration: `0.6s ease-out` for smooth, luxurious feel

### 3.4 Menu-row hover: add underline reveal animation
- Currently just shifts left with `padding-left`. Add an animated underline:
  - A `::after` pseudo-element that grows from left on hover (like the navbar links)
  - Color: `var(--color-coral)` at low opacity
- **File:** `css/components.css` — `.menu-row__name::after` 

### 3.5 Mobile nav staggered entrance
- Mobile nav links should appear with staggered delay when overlay opens
- Each `.mobile-nav__link` gets `animation-delay: nth-child * 0.08s`
- Use `translateY(20px) → translateY(0)` + `opacity` animation
- **File:** `css/layout.css` — add keyframes and `.mobile-nav--active .mobile-nav__link` rules
- Add `will-change: transform, opacity` to prevent jank

### 3.6 Booking modal entrance animation
- Currently slides up 20px. Make it more dramatic:
  - Panel scales from `0.96` to `1` + slides up
  - Backdrop blur increases from `blur(4px)` to `blur(8px)`
- **File:** `css/components.css` — update `.booking-modal__panel` transform

### 3.7 Form error shake animation
- When a field shows error, add a subtle horizontal shake
- **File:** `css/base.css` — add `@keyframes shake` 
- **File:** `css/components.css` — `.form-field--error` gets `animation: shake 0.3s`

---

## Phase 4: Spatial Composition — 6→10

### 4.1 About section: break the grid
- Currently: safe 2-column grid. Make it asymmetric:
  - Gallery takes 55% width, text 45%
  - Gallery overlaps into the right column by ~40px (negative margin + higher z-index)
  - Gallery is slightly rotated (-1.5deg) for a "pinned to a corkboard" feel
- **File:** `css/layout.css` — `.about__inner` grid template + `.about__gallery` transform

### 4.2 Grooming services: offset card with decorative accent
- The services card already has a coral left border. Push further:
  - Card shifts 20px to the right of its grid column (negative margin-left on the text side or positive on the card)
  - Add a small decorative "✂" or scissors icon in the top-right corner of the card via `::before`
  - The coral border extends 8px taller than the card (via pseudo-element)
- **File:** `css/layout.css` — `.grooming__services` positioning + `::before`/`::after`

### 4.3 Shop section: offset columns
- Currently: 2 equal columns with right column having `padding-top`. Make it more dramatic:
  - Right column (merch) starts 80px lower than left column (coffee)
  - Add a vertical decorative line between columns (1px gradient line)
  - Left column background has subtle clip-path for a diagonal bottom edge
- **File:** `css/layout.css` — `.shop__column:nth-child(2)` padding + decorative line

### 4.4 Hero: add diagonal crop or floating element
- The hero bottom edge is flat. Add a subtle diagonal or wave:
  - `clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%)` for a gentle angle
  - Or add a SVG wave divider between hero and about section
- **File:** `css/layout.css` — `.hero` clip-path or add a `.hero__divider` element

### 4.5 Footer: overlapping "book now" CTA
- Add a floating CTA card that overlaps between the booking section and footer
- A small card with "Book an Appointment" that sits at the boundary, half in booking section, half in footer
- **File:** `index.html` — add a `.floating-cta` element between booking and contact or between contact and footer
- **File:** `css/layout.css` — position it with negative margins, higher z-index, coral background

---

## Phase 5: Backgrounds & Visual Details — 8→10

### 5.1 Add subtle noise texture to section backgrounds
- The grain overlay is global (fixed). Add per-section texture variation:
  - About section: slightly more visible grain (opacity 0.05)
  - Shop section: very subtle diagonal line pattern (SVG repeating pattern)
- **File:** `css/layout.css` — `.about::before`, `.shop::before` pseudo-elements

### 5.2 Add decorative geometric accents
- Small decorative shapes that reinforce the brand:
  - A small circle (dot) before section labels like "Downstairs", "Street Level"
  - A thin horizontal rule before `.heading-section` with coral gradient
- **File:** `css/layout.css` — `.label-text::before`, `.heading-section::before`

### 5.3 Map placeholder: animated pin drop
- The map placeholder currently has a static pin SVG. Add a gentle bounce animation:
  - Pin drops from -20px with a bounce easing
  - Repeats subtly every 3 seconds
- **File:** `css/layout.css` — `.contact__map-placeholder svg` animation

### 5.4 Custom cursor on interactive elements
- For desktop, change cursor to a small custom SVG cursor on:
  - Menu rows → small arrow cursor
  - Merch items → magnifying glass
  - Buttons → pointer with a subtle scale
- **File:** `css/components.css` — `cursor: url(...)` on hover states

---

## Phase 6: Accessibility — 9→10

### 6.1 Add `aria-live="polite"` announcements for dynamic content
- Theme toggle: announce "Switched to dark theme" / "Switched to light theme"
- **File:** `js/theme.js` — add a visually-hidden live region update

### 6.2 Add skip links for each major section
- Currently only one skip link to `#main`. Add:
  - "Skip to booking" link
  - "Skip to contact" link
- **File:** `index.html` — additional skip links after the main one
- **File:** `css/base.css` — `.skip-link` already handles this

### 6.3 Add `role` and `aria-label` to decorative elements
- The hero "W" watermark is decorative — ensure `aria-hidden="true"` on the pseudo-element (CSS-only, already not accessible, but document it)
- Gallery images: add more descriptive alt text (currently good but can be more specific about what's shown)

### 6.4 Form: add `aria-describedby` linking errors to fields
- Each `.form-field__error` should be linked to its input via `aria-describedby`
- **File:** `index.html` — add `id` to error spans, `aria-describedby` to inputs
- **File:** `js/form.js` — dynamically toggle `aria-invalid` on fields

---

## Phase 7: Dark Mode — 7→10

### 7.1 Consolidate all hardcoded dark colors into token layer
- Replace all `#1a1612`, `#1e1a15`, `#232019`, `#141110` in `layout.css` and `components.css` with semantic tokens
- Add these to `tokens.css` under `html.dark :root`:
  ```css
  --color-surface-1: #1a1612;
  --color-surface-2: #1e1a15;
  --color-surface-3: #232019;
  --color-surface-4: #141110;
  ```
- Replace every hardcoded hex in dark overrides with `var(--color-surface-N)`
- **Files:** `css/tokens.css`, `css/layout.css`, `css/components.css`
- **Impact:** ~80 lines of dark overrides become token references

### 7.2 Add smooth dark mode transition
- When toggling themes, add a brief transition on `background-color` and `color` for `body`, `section` elements
- **File:** `css/base.css` — `body { transition: background-color 0.3s, color 0.3s; }` (only when `html.dark` class is being toggled, not on page load — use a `html.theme-transitioning` class)
- **File:** `js/theme.js` — add class briefly on toggle, remove after transition

### 7.3 Add dark mode grain texture adjustment
- Grain opacity and blend mode already changes (multiply → soft-light). Verify the opacity values create enough texture in dark mode without being distracting.
- Test and potentially increase dark grain to `opacity: 0.05` (currently 0.04)
- **File:** `css/base.css` line 43

---

## Phase 8: Responsiveness — 7→10

### 8.1 Keep "Book Now" CTA visible on mobile
- Currently hidden at `max-width: 768px`. Show it as a sticky bottom bar or within the mobile nav as the primary action
- **Option A:** Sticky bottom bar with coral background, "Book Now" text
- **Option B:** Make the mobile nav's "Book Now" link more prominent (larger, full-width, coral background)
- **File:** `css/layout.css` — 768px breakpoint, `.navbar__cta` display change
- **File:** `index.html` — potentially add a `.mobile-cta` element

### 8.2 Add touch-optimized hover states for mobile
- Gallery and merch items have hover transforms that don't translate to touch
- Add `:active` states that provide tactile feedback (slight scale-down `scale(0.98)`)
- **File:** `css/components.css` — `.gallery__item:active`, `.merch-bento__item:active`

### 8.3 Mobile hero: adjust content density
- On small screens, the hero title + subtitle + actions + address is a lot of content
- Reduce `.hero__subtitle` font size on mobile
- Hide `.hero__right` (address/note) on small mobile, show it only on tablet+
- **File:** `css/layout.css` — 480px breakpoint adjustments

### 8.4 Merch bento: 2-column mobile grid with smart span
- Currently drops to 2 columns at 768px with `--wide` becoming `span 1`
- Keep one "featured" item as full-width on mobile for visual variety
- **File:** `css/layout.css` — `.merch-bento__item--featured` span 2 on mobile

---

## Phase 9: Performance — 8→10

### 9.1 Add `font-display: swap` verification
- Google Fonts URL should include `&display=swap` (already present — verify)
- **File:** `index.html` line 42

### 9.2 Preload critical fonts
- Add `<link rel="preload">` for Fraunces wght 400 and Instrument Sans wght 400
- **File:** `index.html` — add preload links before the Google Fonts stylesheet

### 9.3 Add `content-visibility: auto` to below-fold sections
- Add `content-visibility: auto; contain-inset-size: 0 600px;` to `.about`, `.grooming`, `.shop`, `.booking`, `.contact`
- This lets the browser skip rendering off-screen sections
- **File:** `css/layout.css` — add to section selectors

### 9.4 Lazy-load the merch bento images
- Merch images already have `loading="lazy"` — verify this is working
- Consider adding `decoding="async"` to all below-fold images
- **File:** `index.html` — add `decoding="async"` to merch/gallery images

---

## Phase 10: Micro-interactions & Delight

### 10.1 Button press feedback
- All `.btn` elements should have a subtle `scale(0.97)` on `:active` for tactile feedback
- **File:** `css/components.css` — `.btn:active`

### 10.2 Theme toggle rotation
- The sun/moon icon should rotate 180° during transition (moon → sun spins, sun → moon spins)
- **File:** `css/layout.css` — `.navbar__theme-toggle svg` transition transform
- **File:** `js/theme.js` — add/remove a transitioning class

### 10.3 Booking section: animated gradient shift
- The radial gradient in the booking section should slowly pulse/shift position
- Use `@keyframes` to animate `background-position` or `radial-gradient` center point
- **File:** `css/layout.css` — `.booking` animation

### 10.4 Footer social icons: individual hover effects
- Instagram → gentle scale + color shift to Instagram gradient color
- YouTube → gentle scale + red color shift  
- TikTok → "coming soon" tooltip on hover
- **File:** `css/layout.css` — `.footer__social-link:hover` per-icon overrides

### 10.5 Cursor hover image: add border-radius and shadow on load
- When the cursor image loads, it should fade in rather than pop in
- Add a brief opacity transition on the `<img>` inside `.cursor-img__inner`
- **File:** `css/components.css` — `.cursor-img img` transition
- **File:** `js/cursor-hover.js` — add opacity class after image load

---

## Execution Order (Dependency-Aware)

### Wave 1 — Foundation (no visual dependencies)
1. Phase 7.1: Dark mode token consolidation
2. Phase 9.2: Font preloading
3. Phase 9.3: Content visibility
4. Phase 6.4: Form aria-describedby

### Wave 2 — Typography + Color (affects everything)
5. Phase 1.1: Replace body font
6. Phase 1.2: Add accent font
7. Phase 1.3: Refine type scale
8. Phase 2.1: Secondary accent colors
9. Phase 7.2: Smooth dark mode transition

### Wave 3 — Layout (structural changes)
10. Phase 4.1: About section grid break
11. Phase 4.2: Grooming card offset
12. Phase 4.3: Shop column offset
13. Phase 4.4: Hero diagonal crop
14. Phase 4.5: Footer floating CTA

### Wave 4 — Motion (depends on layout being set)
15. Phase 3.1: Activate unused reveal classes
16. Phase 3.2: Hero W parallax
17. Phase 3.3: Image zoom on hover
18. Phase 3.4: Menu row underline
19. Phase 3.5: Mobile nav stagger
20. Phase 3.6: Modal entrance
21. Phase 3.7: Form error shake

### Wave 5 — Polish (details and delight)
22. Phase 5.1: Section textures
23. Phase 5.2: Decorative accents
24. Phase 5.3: Map pin animation
25. Phase 5.4: Custom cursors
26. Phase 10.1–10.5: All micro-interactions

### Wave 6 — Mobile + Accessibility
27. Phase 8.1: Mobile Book Now CTA
28. Phase 8.2: Touch feedback
29. Phase 8.3: Mobile hero density
30. Phase 8.4: Mobile merch grid
31. Phase 6.1: aria-live announcements
32. Phase 6.2: Additional skip links
33. Phase 6.3: Decorative element audit

### Wave 7 — Final QA
34. Phase 7.3: Dark grain adjustment
35. Phase 9.1: Font display verification
36. Phase 9.4: Image decoding
37. Full cross-browser + mobile test
38. Lighthouse audit (target: 95+ on all metrics)

---

## Files Modified

| File | Changes |
|------|---------|
| `css/tokens.css` | Font variables, new color tokens, dark surface tokens |
| `css/base.css` | Type scale additions, animations (shake, bounce), section reveals, dark grain |
| `css/components.css` | Hover zoom, button press, cursor improvements, form error animation, dark overrides → tokens |
| `css/layout.css` | Grid breaks, offsets, decorative accents, hero clip-path, mobile CTA, dark overrides → tokens |
| `index.html` | Font link update, reveal classes on elements, floating CTA, aria attributes, decode hints |
| `js/scroll-reveal.js` | Hero W parallax via scroll handler |
| `js/theme.js` | Smooth transition class, aria-live |
| `js/form.js` | aria-invalid toggling |

## Estimated Effort
- **Wave 1–2:** ~3 hours (foundation + typography)
- **Wave 3:** ~4 hours (layout — the biggest visual change)
- **Wave 4:** ~3 hours (motion)
- **Wave 5:** ~2 hours (polish)
- **Wave 6:** ~2 hours (mobile + a11y)
- **Wave 7:** ~1 hour (QA)
- **Total:** ~15 hours

## Success Criteria
- [ ] Every scorecard dimension ≥ 9/10
- [ ] No visual regressions on Chrome, Firefox, Safari, mobile Safari
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] `prefers-reduced-motion` still fully respected
- [ ] Dark mode fully functional with smooth transition
- [ ] All new animations have reduced-motion fallbacks
- [ ] Build (`npm run build`) produces working dist/
- [ ] No hardcoded colors remain in dark overrides (all token-referenced)
