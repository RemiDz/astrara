# ASTRARA — Zodiac Heat Map: CC Solve Autonomously

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## THE GOAL

When a user looks at the Astrara wheel, zodiac signs with high planetary activity should be VISUALLY OBVIOUSLY DIFFERENT from zodiac signs with low activity. Right now they all look identical.

This has been attempted many times with different approaches and NONE have produced a visible result. You have full autonomy to solve this however you see fit.

---

## WHAT MUST BE TRUE WHEN YOU'RE DONE

1. A zodiac sign with a high impact score (like Pisces today, which has Sun, Saturn, Neptune, Mercury nearby) must look DRAMATICALLY different from a sign with zero activity (like Libra)
2. The difference must be visible at FIRST GLANCE — not requiring careful comparison
3. The colour system is: cold = default/unchanged, warm = gold, hot = orange, intense = red
4. The existing badge shape (border-radius, padding, size) must NOT change
5. All existing features must continue working
6. It must work on mobile (375px viewport)

---

## WHAT YOU MUST DO

1. First, remove ALL previous heat map visual code that isn't working. Clean slate.
2. Open the app in the browser. Look at it. Understand what the user sees.
3. Try your implementation. Open the browser again. ACTUALLY LOOK at the result.
4. If you cannot see a clear visual difference between high and low impact signs — your implementation failed. Try a different approach.
5. Repeat until the difference is UNMISSABLE.

---

## CONSTRAINTS

- The `calculateZodiacImpact()` scoring function works correctly — keep it
- The zodiac modal impact score (1-10 bar) works correctly — keep it
- Do NOT change badge border-radius, padding, width, height, or font-size
- Do NOT add heavy glow/shadow that makes the wheel look cluttered

---

## HINTS (approaches you can try — pick whatever works)

- HTML border colour changes on badges (declarative React, not useFrame DOM)
- A new set of simple flat-colour arc meshes outside the wheel ring using MeshBasicMaterial
- Coloured dots or indicators near each badge
- SVG or HTML overlays positioned around the wheel
- Changing the badge background colour subtly
- Whatever else you can think of

The approach doesn't matter. Only the visible result matters.

---

## VERIFICATION

Before committing, you MUST verify by looking at the running app:
- Screenshot or describe what Pisces looks like vs what Libra looks like
- If they look the same → your implementation failed → try again
- If Pisces is obviously warm/hot coloured and Libra is default → success

---

## After Success

1. Run `npm run build` — no errors
2. **UPDATE `engine/ARCHITECTURE.md`** — document what approach actually worked
3. Commit: `feat: zodiac heat map — [describe what approach worked]`
4. Push to **main** branch using `git push origin master:main`
