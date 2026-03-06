# Astrara — Astro Wheel "Today" Button Fix

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use megathink for this task.

## Problem

The "Today" button in the Astro Wheel date navigation currently changes its label to show a date string when the user navigates away (e.g. clicks "Tomorrow"). This is misleading because the button's function is always to **return the wheel to today's date** — it should always read "Today".

## Fix Requirements

1. **Find the Today button component** in the Astro Wheel date navigation UI.
2. **Ensure the button label is hardcoded to "Today"** — it must never dynamically update to show a date string.
3. The button's **onClick behaviour stays the same** — it resets the Astro Wheel to the current date/time.
4. If there is a separate date display element showing the currently selected date, that can continue to update dynamically — the fix is specifically about the **Today button label**.

## Verification

- Load the app → "Today" button shows "Today" ✓
- Click "Tomorrow" → "Today" button still shows "Today" ✓
- Click any other date offset → "Today" button still shows "Today" ✓
- Click "Today" → wheel returns to current date/time ✓

## Technical Notes

- `git push origin master:main` for Vercel deployment.
- Do not introduce framer-motion.
