# ASTRARA — Find The Badge Glow Source

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## Task

There is a visible glow/halo around zodiac sign badges on the wheel. We cannot find the source. Instead of searching code, use a TOGGLE approach — disable things one at a time and check the browser to see when the glow disappears.

---

## Process

Run `npm run dev` and open the app in the browser. You should see the glow around zodiac badges.

Now disable each of these one at a time. After each change, refresh the browser and check if the glow is gone:

### Toggle 1: Disable ConditionalBloom / post-processing
Comment out the `<ConditionalBloom>` or any `<EffectComposer>` / `<Bloom>` component in the scene. Refresh. Is the glow gone?

### Toggle 2: Disable the OrbitingLight
Comment out the `<OrbitingLight>` component (the point light that orbits the ring to create shimmer). Refresh. Is the glow gone?

### Toggle 3: Disable ALL point lights and directional lights except ambient
Comment out every `<pointLight>` and `<directionalLight>` in the scene. Refresh. Is the glow gone?

### Toggle 4: Disable the Environment preset
Comment out `<Environment preset="night" />`. Refresh. Is the glow gone?

### Toggle 5: Disable the zodiac segment meshes entirely
Comment out the 12 zodiac ring segment meshes (the 30° wedges). Refresh. Are the badge glows gone? If YES — the glow is light reflecting off/through the segment meshes, not from the badges themselves.

### Toggle 6: Disable the badge textShadow
Set textShadow to 'none' on all badges. Refresh. Is the glow gone?

### Toggle 7: Disable badge background entirely
Set backgroundColor to 'transparent' on all badges. Refresh. Is the glow gone?

---

## Report

After finding which toggle removes the glow, report:

```
GLOW SOURCE FOUND:
Toggle [N] removed the glow.
Component/line: [exact component and line]
Description: [what it is]
```

Then UNDO all other toggles (restore them to working state) and ONLY fix the glow source.

The fix should remove the unwanted glow while keeping everything else working. The badge backgroundColor heat map (gold/orange/red for hot signs, purple for cold) must remain.

---

## After Fix

1. Verify: NO glow/halo around zodiac badges
2. Verify: badge background colours still reflect heat map scores
3. Verify: ALL other features work
4. Run `npm run build`
5. **UPDATE `engine/ARCHITECTURE.md`**
6. Commit: `fix: remove zodiac badge glow — source was [describe what it was]`
7. Push to **main** branch using `git push origin master:main`
