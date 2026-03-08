# Astrara — Fix Reading Card Overlapping Wheel Bottom

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## ONE FIX ONLY

The reading card's bottom-positioned container extends too high and overlaps the bottom of the Astro Wheel. Reduce the card's maximum height so it stays below the wheel.

---

## In `src/features/cosmic-reading/components/ReadingOverlay.tsx`:

Find the content container div that holds the card. It currently has `maxHeight: '45vh'` or similar. The card is positioned at the bottom of the screen and extends upward — the problem is it extends too far up and covers the wheel.

Change the max height of the bottom content area to `38vh`:

Find the div that contains the PhaseCard/ReadingSummaryCard. It will have a style or className with a max-height. Change it:

```
max-h-[45vh]  →  max-h-[38vh]
```

Or if it's an inline style:
```
maxHeight: '45vh'  →  maxHeight: '38vh'
```

Also, in `PhaseCard.tsx`, find the scrollable content area's max-height and change it:

```
max-h-[45vh]  →  max-h-[35vh]
```

Or whatever its current value is — reduce it by about 7-10vh so the card doesn't reach up into the wheel.

The reading text will be scrollable within the smaller card — users can scroll to read more. The important thing is the wheel stays fully visible above the card.

---

## VERIFICATION

- [ ] Wheel bottom edge is fully visible — not covered by the reading card
- [ ] Reading card text is scrollable if content exceeds the card height
- [ ] "Toliau ✦" button is visible above the phone bottom bar
- [ ] No other changes — wheel, interaction, translations all unchanged

## DO NOT CHANGE ANYTHING ELSE

Git push: `git push origin master:main`
