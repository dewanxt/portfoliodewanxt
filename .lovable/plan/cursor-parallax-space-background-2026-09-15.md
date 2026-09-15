# Cursor-Parallax Space Background

## Build

- Replace the existing simple fixed star backdrop with a dedicated, full-viewport background component behind every section.
- Create four depth layers: atmospheric nebula, far stars, mid stars, and near stars with 7 varied CSS planets distributed across the viewport.
- Add restrained navy, purple, blue, and pink light within an otherwise near-black scene, as requested.
- Track pointer position once and update layer transforms directly through CSS variables in a requestAnimationFrame loop, avoiding React re-renders during movement.
- Give deeper layers less movement and closer layers more movement, with slightly inverted motion for a camera-panning feel.
- Add independent slow drifting and subtle star twinkling so the scene remains alive when the pointer is idle.

## Responsive and accessibility

- Keep the entire scene fixed, non-interactive, clipped to the viewport, and unable to block links or controls.
- Reduce planet count and visual intensity on smaller screens, using slow automatic motion instead of cursor tracking.
- Disable parallax, drift, and twinkle when reduced motion is requested.

## Verification

- Check desktop cursor response, mobile layout, reduced-motion behavior, page scrolling, clickable controls, overflow, browser errors, and build health.
