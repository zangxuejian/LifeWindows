# Life Windows V2 Design QA

## Comparison target

- Source visual truth: `C:/Users/zangx/AppData/Local/Temp/codex-clipboard-81e42618-fd63-435d-bcf6-4253e9bd341d.png`
- Source pixels: 1448 × 1086.
- Browser implementation: `design/v2/final/v2-home-linear-desktop.png`
- Implementation pixels: 1425 × 891.
- Configured CSS viewport: 1440 × 900 at device scale factor 1. The in-app browser capture area was 1425 × 891 after scrollbar/browser-surface reservation.
- Normalization: the source was top-cropped to the implementation aspect ratio, then resized to 1425 × 891. No density upscaling was used.
- State: home route, current age 33, objective-age mode, all stages, all categories.
- Full-view same-input evidence: `design/v2/final/design-qa-full-comparison.png`
- Focused timeline same-input evidence: `design/v2/final/design-qa-timeline-comparison.png`
- Scale transformation evidence: `design/v2/final/scale-mode-comparison-desktop.png` and `design/v2/final/scale-mode-comparison-mobile.png`

## Findings

No actionable P0, P1, or P2 differences remain.

- Typography: passed. The implementation keeps the reference's Chinese serif display hierarchy, compact utility text, deep navy tone, and restrained weights. The hero, age readout, summary numerals, and timeline title remain optically distinct without wrapping at 1440 × 900 or 1280 × 800.
- Spacing and layout rhythm: passed. Header, hero/age split, compact summary strip, and timeline order follow the reference. The timeline is intentionally taller and its cards larger than the reference because the requested product change prioritizes card scanning over a dense static overview.
- Colors and visual tokens: passed. The former page-wide beige field was removed. Warm near-white canvas, white cards, low-contrast gray grid lines, deep navy text, teal active, amber closing, blue future, blue-gray possible, and fully desaturated memorial-gray closed states now match the target direction.
- Image quality and asset fidelity: passed for the requested scope. The auxiliary illustrations and avatar visible in the reference were intentionally not introduced because the brief explicitly lowers decoration outside the timeline. No placeholder art, CSS illustration, handcrafted SVG, emoji, or fake image asset was substituted. Existing line icons remain a consistent project-wide icon family.
- Copy and content: passed. The interface describes a life-event time map, labels the experimental model as “相对时间模型（仅用于说明）”, and preserves “黄金窗口已过 ≠ 硬限制关闭”.
- States and interactions: passed. Objective/relative toggle, explanation popover, stage/category tabs, real-age input, inverse-mapped range control, current-age line, card status changes, detail stage map, and route links were exercised.
- Accessibility: passed for the tested surfaces. Controls have semantic roles and labels, keyboard endpoint handling reaches ages 0 and 100, focus states remain visible, tap targets remain usable at 390 px, and reduced-motion CSS removes the 380 ms layout transition.
- Responsive behavior: passed at configured 1440 × 900, 1280 × 800, and 390 × 844. Mobile keeps the scale control on its own row and makes the timeline horizontally scrollable instead of compressing cards below readable width.

## Comparison history

1. Baseline/current screenshot finding — P1: the V2 page used a nearly continuous beige canvas, so cards, sections, and grid had weak separation. Fix: replaced the global palette with warm near-white and white surfaces, preserved color only for state and small accents, and strengthened gray dividers. Post-fix evidence: `design/v2/final/design-qa-full-comparison.png`.
2. Baseline/current screenshot finding — P1: large supporting card regions competed with the event map. Fix: converted “你现在还能做什么” and “接下来什么会关闭” into two compact secondary lists below the timeline. Post-fix evidence: browser full-page inspection and the final home implementation.
3. First browser iteration finding — P2: the initial 27-card overview produced a 1924 px timeline canvas, making scanning excessively vertical. Fix: introduced an age-balanced 16-card overview while retaining all 88 cards through stage/category filters and the Explore route. The final objective canvas is 1028 px and still deliberately larger than the previous V2 timeline. Post-fix evidence: `design/v2/final/v2-home-linear-desktop.png` and `design/v2/final/v2-home-linear-mobile.png`.
4. Final comparison: no actionable P0/P1/P2 mismatch remained. Objective and relative screenshots show age 10 moving from 10% to 36.08%, the 90 tick being removed from the crowded relative axis, and cards changing position, width, and lane packing.

## Browser verification

- Page identity: passed for `/`, `/window/orthodontics-golden-period`, and V2 title.
- Meaningful render / framework overlay: passed; no blank shell or Vite/React error overlay.
- Console: no relevant warnings or errors across desktop, mobile, home, and detail states.
- Relative annual proportion: 8 → 12.5%, 33 → 3.0%, 80 → 1.25%.
- Slider endpoints in relative mode: Home key → real age 0 / slider position 0; End key → real age 100 / slider position 10000.
- Detail transformation: adult orthodontic stage changed from left 45%, width 55% to left 69.45%, width 30.55%.
- Primary interactions tested: scale toggle, info popover open/close, body category filter, age input, slider endpoints, mobile scale switch, detail scale switch.

## Follow-up polish

- P3: the 16-card default overview favors readability over the reference's denser single-screen map. A later optional pass could add a “紧凑 / 舒展” density preference without changing event coordinates.
- P3: the Chinese display font uses system serif fallbacks; exact appearance can vary slightly by operating system font availability.

## Implementation checklist

- [x] Reference-derived warm-white visual hierarchy.
- [x] Timeline and Window Cards promoted to the primary surface.
- [x] Objective and relative scales share one mapping abstraction.
- [x] Slider, ticks, age line, cards, and detail timeline transform together.
- [x] Closed state uses explicit memorial-gray styling instead of opacity.
- [x] Desktop and mobile interactions and console verified.
- [x] Unit tests, build, lint, and browser QA passed.

final result: passed
