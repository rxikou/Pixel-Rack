# PixelRack Styling & UX Guidelines

## 1. Visual Theme
* Aesthetic: 16-bit Retro Pixel Art mixed with modern dark mode UI.
* Inspiration: Classic SNES/GBA games, retro arcade menus, and modern pixel-art indies.

## 2. Color Palette
* Primary Background: #0F172A (Deep Slate Dark)
* Container Background: #1E293B (Lighter Slate)
* Primary Accent (Neon Blue): #38BDF8
* Secondary Accent (Retro Pink): #F472B6
* Success/Action (Green): #4ADE80
* Text Primary: #F8FAFC
* Text Secondary: #94A3B8

## 3. Typography
* Headings: 'Jersey 10' (pixel font) for titles and primary labels.
* Body: 'Inter' or 'Roboto Mono' for readability in dense information areas (like settings or stats).

## 4. Spacing & Layout
* Base unit: 4px (to align with pixel grids).
* Use CSS Grid for the 'Visual Rack' display to ensure perfect alignment of pixelated cars.
* Apply strict image rendering techniques (`image-rendering: pixelated;`) to ensure pixel art remains crisp on high-DPI screens.

## 5. UI Components
* Buttons: Blocky, solid colors with a 2px bottom border (to simulate 3D depth).
* Cards: 2px solid border with primary accent color on hover.
