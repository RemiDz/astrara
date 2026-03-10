# Increase Zodiac Sign Size on Wheel

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

**Thinking level: ultrathink**

## Task

The zodiac sign glyphs/icons around the outer rim of the 3D astrology wheel are far too small — they're barely readable at normal viewing distance. They need to be significantly larger to be visually prominent and instantly recognisable.

## What to do

1. Find where the 12 zodiac sign labels/sprites/meshes are rendered on the wheel rim (likely in the wheel component using React Three Fiber — look for Text, Sprite, or HTML components that render the zodiac symbols like ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓).

2. Increase their size by approximately **2–2.5x** the current value. The signs should be bold, clearly visible, and feel like a defining visual element of the wheel — not tiny afterthoughts.

3. After scaling up, verify that:
   - Signs don't overlap with each other or with planet glyphs
   - Signs remain properly positioned on the outer rim
   - Signs still face the camera correctly (billboarding if applicable)
   - The visual hierarchy is: planets are focal, zodiac signs are clearly secondary but still prominent

4. If the signs use a `fontSize`, `scale`, or `size` prop — increase it. If they're texture-based sprites, increase the sprite scale. Adjust whatever parameter controls their rendered size.

5. Do a `npm run build` to confirm no errors.

## Reference

See the uploaded screenshot — the zodiac glyphs (♈ ♉ ♊ etc.) around the rim are tiny compared to the planet spheres. They should be much more prominent.
