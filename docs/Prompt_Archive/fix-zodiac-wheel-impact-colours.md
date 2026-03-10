Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

ultrathink

# Fix: Zodiac Wheel Segment Colours Not Matching Transit Impact Score

## The Problem

The 3D zodiac wheel segment colours should reflect the computed transit impact score on a 1–10 scale, mapped from green (low impact, 1) to red (high impact, 10). Currently there's a mismatch — for example, Leo shows RED on the wheel, but when you tap it the info modal correctly shows impact 1/10 (which should be GREEN).

This means the wheel rendering is using a different value or a broken colour mapping compared to what the modal displays.

## Investigation Steps

1. **Find the colour mapping function** used for wheel segments. Search the codebase for where zodiac sign colours are determined for the 3D wheel rendering (likely in the R3F/Three.js wheel component). Look for:
   - Any function that maps impact score → colour (green-to-red gradient)
   - Any hardcoded colour assignments per sign
   - Any place where segment colour is set using a different data source than the modal

2. **Find the modal's impact source**. Locate where the info modal gets its impact value (the one correctly showing 1/10 for Leo). This is the correct/authoritative value.

3. **Compare the two data paths**. The wheel segment colour and the modal impact MUST use the exact same computed impact value. Identify where they diverge.

## Likely Root Causes (check all)

- The wheel segment colour function might be reading from a different property or computation than the modal
- The colour mapping might be inverted (1 = red instead of 1 = green)
- The wheel might be using a cached/stale value that doesn't update when transits are recalculated
- The wheel might be using element colours (fire signs = red) instead of impact-based colours — Leo is a fire sign, so if the wheel accidentally falls back to element colours, Leo would show red regardless of impact

## The Fix

- Ensure the wheel segment colour is derived from the **exact same impact score** that the modal displays
- The colour scale must be: **1 (lowest impact) = green → 10 (highest impact) = red**, interpolating through yellow/orange in between
- A simple HSL interpolation works well: `hsl(120, 70%, 45%)` (green) at impact 1 → `hsl(0, 70%, 45%)` (red) at impact 10. The hue shifts from 120 → 0 as impact goes from 1 → 10: `hue = 120 - ((impact - 1) / 9) * 120`
- If no impact data is available for a sign (no active transits), use a neutral/default colour (e.g. muted silver/grey) rather than falling back to element colours

## Verification

After fixing, check ALL 12 zodiac signs:
- Tap each sign on the wheel
- Compare the wheel segment colour against the impact value shown in the modal
- Low impact (1–3) should be green/yellow-green
- Medium impact (4–6) should be yellow/orange
- High impact (7–10) should be orange/red
- Signs with no transit data should show neutral colour

Do NOT change the modal's impact calculation — that one is correct. Only fix the wheel's colour assignment to match it.
