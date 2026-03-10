Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

megathink

# Feature: Add Detailed Transit Breakdown to Zodiac Sign Info Modal

## Context

When users tap a zodiac sign on the 3D wheel, an info modal opens. Currently it shows generic sign information and an impact score (e.g. 7/10). But there's no explanation of WHY the score is what it is. Users need to understand what's actually happening in their sign right now — which planets are transiting, what aspects are active, and what it all means practically.

## What to Add

Inside the existing zodiac sign info modal, add a new section BELOW the existing content that explains the current transit activity for that sign. Structure it as follows:

### 1. Active Transits Section

Header: "What's Happening Now" (EN) / "Kas Vyksta Dabar" (LT)

For each planet currently transiting through the selected sign, show:
- **Planet name + icon** (use existing planet icons/symbols from the app)
- **Transit description** — a 1–2 sentence human-readable explanation of what this planet's presence in this sign means right now
- **Individual impact contribution** — how much this specific transit contributes to the overall score (e.g. "Impact: +2")

### 2. Active Aspects Section

Header: "Key Aspects" (EN) / "Svarbūs Aspektai" (LT)

For each significant aspect involving planets in this sign:
- **Aspect name** (e.g. "Mars square Saturn", "Venus trine Jupiter")
- **Aspect type icon/indicator** — use colour coding: harmonious aspects (trine, sextile) in green/teal, challenging aspects (square, opposition) in orange/red, conjunction in purple
- **Brief interpretation** — 1–2 sentences explaining what this aspect means in practical terms for the person

### 3. Impact Summary

At the bottom of the new section, show a brief summary sentence that ties it all together:
- e.g. "Your sign is experiencing heightened energy from Mars transit and a challenging square with Saturn, creating tension between action and restriction."
- This should be dynamically generated based on the actual transits, NOT a static template

## Content Generation Approach

Check how the app currently generates transit interpretations. The descriptions and interpretations should be:
- **Practitioner-quality** — written as a knowledgeable astrologer would explain to a client, not generic horoscope fluff
- **Specific to the actual planetary positions** — reference the actual planets and aspects, not vague generalisations
- **Actionable where possible** — give the reader something to work with ("good time for...", "be mindful of...", "this energy supports...")

If the app already has a transit interpretation engine or text content system, plug into that. If not, create a transit interpretation data file that maps planet-in-sign combinations and aspect types to meaningful descriptions. Keep interpretations concise but substantive.

## UI/UX Requirements

- The new content should scroll naturally within the existing modal (the modal likely already scrolls)
- Use the existing app design system — glass morphism cards, the established colour palette (silver/white for structure, element colours for zodiac, purple for interactive elements)
- Each transit entry should be a subtle glass card within the modal
- Aspect type indicators should use small coloured dots or pills, not large badges
- Add smooth fade-in animation for the transit details (200–300ms stagger between items)
- The section should feel like a natural extension of the existing modal, not bolted on
- Ensure full EN/LT bilingual support for all new text content

## Impact Score Transparency

Make the impact score at the top of the modal feel connected to the detail below:
- Consider making the score tappable/expandable to scroll down to the breakdown
- Or add a subtle "See why ↓" link next to the score that anchors to the transit details section

## Technical Notes

- All transit data should already be computed somewhere in the app (since the impact score exists). Find where that computation happens and expose the granular data to the modal
- Do NOT recalculate transits in the modal component — consume the already-computed data
- Respect the existing data flow patterns in the codebase
- Ensure the modal doesn't become sluggish — if interpretation text is heavy, lazy-load the detail section

## Verification

- Open the modal for several different signs
- Confirm the listed transits match what astronomy-engine computes for the current moment
- Confirm the individual impact contributions add up to (or logically relate to) the total impact score
- Confirm all text appears in both EN and LT
- Confirm the modal scrolls smoothly and animations feel polished
- Check on mobile viewport — the modal must remain usable and readable
