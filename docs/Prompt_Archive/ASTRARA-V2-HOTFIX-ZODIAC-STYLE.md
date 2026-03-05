# ASTRARA v2 — Hotfix: Zodiac Badge Redesign — Ethereal Glyphs

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

Zodiac sign taps must still work after this change. The tap target size (minimum 44×44px) must remain. Only the VISUAL appearance changes — not the interaction logic.

---

## Problem

The zodiac sign badges are solid coloured squares with thick borders and backgrounds. They visually overpower the planets and make the wheel feel cluttered. The planets should be the visual focus.

## Solution

Replace the boxy badges with ethereal, transparent floating glyphs. The signs should feel engraved into the wheel — luminous symbols that glow softly in their element colour, with no background, no border, no box.

### Find the Zodiac Badge Rendering

Locate where zodiac sign badges are rendered on the wheel (likely inside an `<Html>` overlay in the wheel component). Replace ONLY the visual styling — keep the onClick handler, the positioning, and the tap target.

### New Badge Style

```tsx
<Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }} occlude={false}>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onSignTap(sign)
    }}
    onPointerDown={(e) => e.stopPropagation()}
    className="flex items-center justify-center select-none cursor-pointer
               w-11 h-11 rounded-full
               active:scale-90 transition-transform duration-150"
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      color: sign.colour,
      opacity: 0.5,
      textShadow: `0 0 10px ${sign.colour}50, 0 0 20px ${sign.colour}25, 0 0 40px ${sign.colour}10`,
      fontFamily: 'serif',
      lineHeight: 1,
    }}
    aria-label={`View ${sign.name} details`}
  >
    {sign.glyph}
  </button>
</Html>
```

### Key Visual Properties

- `background: 'transparent'` — NO background at all
- `border: 'none'` — NO border at all
- `opacity: 0.5` — soft, not demanding attention
- `textShadow` with THREE layers — creates a gentle glowing halo around the glyph in its element colour
- `fontSize: '20px'` — slightly larger glyph since there is no box around it
- `fontFamily: 'serif'` — serif fonts render astrological glyphs more elegantly
- The tap target is still `w-11 h-11` (44px) — fully tappable even though invisible

### Hover/Active States

When tapped, the glyph briefly becomes brighter:

```css
active state:
  opacity: 0.9
  textShadow with stronger glow values
  scale: 0.9
```

This can be done with the existing `active:scale-90` and by adding a brief CSS animation on tap if desired. The key point is that the resting state is subtle (0.5 opacity) and only brightens on interaction.

### What to Remove

Delete ALL of the following from the zodiac badge styling if present:
- Any `background` or `bg-` class (other than transparent)
- Any `border` class or inline border style
- Any `backdropFilter` or `backdrop-blur`
- Any `borderRadius` on a visible box (the invisible tap target can keep rounded-full)
- Any `boxShadow`
- Any `padding` that was creating visual space around a box

### Visual Result

The wheel should now look like:
- Planets: bright, colourful, prominent — the stars of the show
- Zodiac glyphs: soft, glowing, transparent — like constellations etched in light
- Aspect lines: subtle connections between planets
- Glass rings: shimmering structure
- Earth: recognisable at centre

The hierarchy is: Planets > Rings > Signs > Lines

---

## Fix 2: Rotation Sound — Harsh on Phone Speakers

The rotation whoosh/noise layer sounds like strong wind or crunching snow through mobile speakers. This is because phone speakers cannot reproduce sub-bass (below 80 Hz), so the deep vortex hum is inaudible and all the user hears is the mid/high frequency noise layer — which sounds like static wind.

### Root Cause

The noise layer's bandpass filter allows too much mid-high frequency content through, and its volume is too high relative to the bass on small speakers.

### Fix: In RotationSoundLayer

**1. Cut the noise volume in half:**

Find where `noiseGain` volume is set in `updateVelocity()`. Change:
```typescript
// OLD: noiseGain was too loud
this.noiseGain.gain.linearRampToValueAtTime(normalised * 0.07, now + smoothing)

// NEW: much quieter — noise is texture, not the main sound
this.noiseGain.gain.linearRampToValueAtTime(normalised * 0.02, now + smoothing)
```

**2. Narrow the noise filter to remove harsh frequencies:**

Find where the noise bandpass filter is configured. Change:
```typescript
// OLD: filter opened too wide, letting harsh mids through
this.noiseFilter.frequency.value = 200
this.noiseFilter.Q.value = 2

// NEW: much narrower, centred lower — only deep rumble texture
this.noiseFilter.frequency.value = 80
this.noiseFilter.Q.value = 6    // narrow Q = less harsh content
```

And in `updateVelocity()`, limit how high the filter opens:
```typescript
// OLD: noise filter went up to 800 Hz — way too bright for phone speakers
this.noiseFilter.frequency.linearRampToValueAtTime(200 + normalised * 600, now + smoothing)

// NEW: stays in the low range, max 250 Hz
this.noiseFilter.frequency.linearRampToValueAtTime(80 + normalised * 170, now + smoothing)
```

**3. Add a hard low-pass ceiling on the noise output:**

After the existing bandpass filter, add a second lowpass filter that cuts everything above 300 Hz. This prevents ANY harsh content from reaching the speakers:

```typescript
// In start(), after creating noiseFilter:
const noiseCeiling = this.ctx.createBiquadFilter()
noiseCeiling.type = 'lowpass'
noiseCeiling.frequency.value = 300   // nothing above 300 Hz gets through
noiseCeiling.Q.value = 1

// Update the audio chain:
// noiseNode → noiseFilter (bandpass) → noiseCeiling (lowpass) → noiseGain → masterGain
this.noiseNode.connect(this.noiseFilter)
this.noiseFilter.connect(noiseCeiling)
noiseCeiling.connect(this.noiseGain)
this.noiseGain.connect(this.masterGain)
```

### Result

On headphones: deep vortex hum with a subtle low rumble texture — same quality as before but cleaner.
On phone speakers: the bass oscillators provide a gentle throb (phone speakers reproduce some of 60-100 Hz range), and the noise layer is barely audible instead of dominating. The overall effect is a soft, non-annoying hum rather than harsh wind.

---

## Build Steps

1. Find the zodiac badge rendering code in the wheel component
2. Replace the visual styling with the ethereal glyph style above
3. Keep all onClick handlers and tap logic unchanged
4. Keep the tap target at minimum 44×44px
5. Find RotationSoundLayer — reduce noise volume, narrow bandpass filter, add lowpass ceiling at 300 Hz
6. Test: all 12 zodiac signs still visible as glowing glyphs
7. Test: tap each sign — detail panel still opens
8. Test: planets are now clearly the visual focus
9. Test: rotation sound on phone speakers — no harsh wind noise, just soft hum
10. Test: rotation sound on headphones — deep vortex still sounds good
11. Run `npm run build`
12. Push to **main** branch
13. Commit: `design: ethereal zodiac glyphs + fix rotation sound harshness on speakers`
