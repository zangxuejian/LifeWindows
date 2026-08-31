# Life Windows V3 Design QA

## Comparison setup

- Reference 1: `C:\Users\zangx\AppData\Local\Temp\codex-clipboard-ea6fa055-1795-4834-b1d6-5ac0e4d0725a.png`
- Reference 2: `C:\Users\zangx\AppData\Local\Temp\codex-clipboard-4f0fc7e5-12e8-44d2-9470-602017778cd3.png`
- Implementation state: V3 home at age 33.
- Exact comparison viewport: 1488 × 1056 CSS pixels at device scale factor 1.
- Responsive viewport: 390 × 844 CSS pixels at device scale factor 1.
- Combined comparison input: `C:\Users\zangx\.codex\visualizations\2026\08\30\01a0506b-e65f-7440-b6e4-27395e6037f3\v3-reference-comparison.jpg`

## Fidelity review

- Typography: the editorial Chinese serif hierarchy, compact bilingual brand, numeric age readout, and consistent card sequence (title, age range, category, status) preserve reference 1's clarity.
- Layout: the home page uses one restrained hero and three organic event fields. 正盛 is the dominant field, 将谢 is secondary, and 余温 is quieter and smaller, matching reference 2's spatial hierarchy without restoring a timeline or dashboard.
- Spacing: cards are capped at 4 / 4 / 2 visible items. Controlled offsets remain on desktop, but widths are reduced where shifted so cards never overlap. Mobile removes offsets and stacks groups and cards vertically.
- Color: the page canvas remains warm near-white. Saturated color is confined to cards, borders, badges, and low-contrast group atmospheres. 正盛 uses mint/teal, 将谢 uses amber/orange, and 余温 uses desaturated blue-gray.
- Surfaces: group radii are asymmetric but restrained. Cards keep clear boundaries and modest elevation. Botanical illustration textures and pronounced card rotations were intentionally not copied because the brief asked for a mature product surface rather than a poster.
- Icons: all event icons use the existing Lucide line-icon family with consistent stroke weight; no emoji, placeholder art, or handcrafted SVG illustration substitutes are used in the UI.
- Copy: hero and group copy stays brief and supports the event field rather than competing with it.

## Interaction and lifecycle review

- The age slider is the only time controller; no timeline grid or objective/relative scale switch appears on V3.
- `notBorn` and `gone` are not rendered. `emerging`, `fresh`, and `mature` enter 正盛; `withering` enters 将谢; `memorial` enters 余温.
- Shared Framer Motion `layoutId` values keep the same card continuous across groups. A browser trace verified 第一次创业 at age 33 in 正盛, age 37 in 将谢, age 40.5 in 余温, and removed at age 43.
- Motion uses 360 ms ease-out layout/opacity/scale changes, no bounce, and respects `prefers-reduced-motion`.
- Detail routing and the age slider were verified on `/v3/window/adolescent-orthodontics?age=18`.

## Responsive and accessibility review

- Desktop was checked at 1440 × 1024 and the exact 1488 × 1056 reference viewport.
- Mobile was checked at 390 × 844; measured `scrollWidth` is 390, with no horizontal overflow.
- The slider and navigation are semantic controls with accessible labels. Cards are links, focus styles match hover elevation, and reduced motion is supported.
- At 60 years the page still renders 10 active windows, including 9 in 正盛 and 1 in 将谢; the late-life field is not blank.

## Iteration history

1. Initial browser pass exposed a hidden transition card caused by the three-card 将谢 cap and a missing favicon request.
2. The cap was raised to four and the favicon was embedded; the cross-group trace became continuous and browser console errors dropped to zero.
3. Exact-viewport comparison exposed a compressed center gap and excess dead space in 正盛. The shifted card width, card heights, and group height were corrected, then desktop/mobile screenshots were refreshed.

## Final result

Pass. The implementation preserves reference 1's scan-friendly card system and reference 2's breathing three-field composition while keeping the product's lifecycle interaction central. Remaining product risk is content authority: policy and medical entries are explicitly marked as editorial examples and still need jurisdiction-specific source review before production use.
