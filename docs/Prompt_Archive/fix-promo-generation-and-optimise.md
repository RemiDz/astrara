Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

megathink

# Diagnose & Fix: /promo Page — Only First Month Generates + API Cost Optimisation

## Problem

The /promo page grid only generates readings for the first month (March 2026). All remaining 11 months show empty skeleton cards. Additionally, the generation burned through a significant amount of API credits, meaning either:
- Too many API calls are being made
- Prompts are too large (too many input/output tokens)
- API calls for months 2–12 are firing but failing silently
- Or only month 1 fires and the rest never trigger

## Step 1: Diagnose

Open the browser console and the Network tab, then trigger a generation. Check:

1. **How many API calls fire?** — Look at the Network tab for requests to the Claude API (either direct or via Next.js API routes). Count them.
2. **Do months 2–12 fire at all?** — If only 1 request goes out, the loop/parallel logic is broken.
3. **Do months 2–12 fail?** — If all 13 fire but 12 return errors, check the error responses. Common issues:
   - Rate limiting (429 errors) — too many concurrent calls
   - Timeout — prompts too large, response takes too long
   - Token limit exceeded — max_tokens too low or prompt too large
   - JSON parse errors — API returns valid response but parsing fails
4. **Check the prompt size** — Log the actual prompt being sent for each month. How many tokens is it? If it includes the full transit computation data, it might be enormous.
5. **Check max_tokens setting** — If set too low, the response gets cut off mid-JSON and parsing fails.

Add temporary `console.log` statements throughout the API call chain to trace exactly what happens:
```
console.log(`[Promo] Starting generation for month ${i+1}/13`);
console.log(`[Promo] API call for ${monthName} - prompt length: ${prompt.length} chars`);
console.log(`[Promo] API response for ${monthName} - status: ${response.status}`);
console.log(`[Promo] API response for ${monthName} - body length: ${body.length} chars`);
console.log(`[Promo] Parsed data for ${monthName}:`, parsedData ? 'OK' : 'FAILED');
```

## Step 2: Fix the Generation Logic

Based on common issues, apply these fixes:

### Fix parallel execution with concurrency control
Do NOT fire all 13 calls simultaneously — Claude API will rate-limit you. Use a concurrency limiter:

```typescript
async function generateWithConcurrency(
  months: MonthData[],
  maxConcurrent: number = 2 // Only 2 at a time
): Promise<ReadingData[]> {
  const results: ReadingData[] = new Array(months.length);
  let index = 0;

  async function worker() {
    while (index < months.length) {
      const currentIndex = index++;
      try {
        results[currentIndex] = await generateMonthReading(months[currentIndex]);
      } catch (error) {
        console.error(`Failed to generate month ${currentIndex + 1}:`, error);
        results[currentIndex] = createEmptyReading(months[currentIndex]);
      }
    }
  }

  const workers = Array.from({ length: maxConcurrent }, () => worker());
  await Promise.all(workers);
  return results;
}
```

### Add proper error handling per month
Each month's API call must be wrapped in try/catch. If one month fails, it should NOT kill the entire generation. Show an error state on that month's cards and continue with the rest.

### Add retry logic
If a month fails with a 429 (rate limit) or 529 (overloaded), retry after a delay:
```typescript
async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 3000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries) throw error;
      if (error?.status === 429 || error?.status === 529) {
        await new Promise(r => setTimeout(r, delay * (i + 1)));
      } else {
        throw error; // Don't retry non-rate-limit errors
      }
    }
  }
}
```

## Step 3: Optimise API Cost

This is critical. Every token costs money. Optimise aggressively:

### 3a. Reduce prompt size

The transit data sent to the API should be MINIMAL — just the computed positions and aspects, not verbose descriptions. Example of an efficient prompt payload for one month:

```
Month: April 2026
Planets: Sun Ari 15°, Moon Lib 22°, Merc Tau 3°, Venus Gem 18°, Mars Leo 7°, Jup Can 14°, Sat Pis 28°, Ura Gem 2°, Nep Ari 4°, Plu Aqu 6°
Aspects: Sun□Sat, Ven△Jup, Mars☌Nep, Sat⚹Plu
Retrogrades: Saturn Rx from Apr 12
Ingresses: Sun→Tau Apr 19, Merc→Gem Apr 22
```

That's maybe 200 tokens. If the current prompt sends paragraphs of explanation about what each transit means, strip all of that out — let the API model do the interpretation work, that's what it's for.

### 3b. Reduce output size

Set `max_tokens` to the MINIMUM needed. For 5 categories + summary with concise readings:
- Each category: ~150–200 tokens (impact score, key theme, 3-sentence reading, planetary breakdown, guidance)
- Monthly summary: ~150 tokens
- Total per month: ~1000–1200 tokens
- Set `max_tokens: 1500` — enough headroom but not wasteful

### 3c. Use a smaller/cheaper model where possible

Check which model the API calls use. If it's `claude-sonnet-4-20250514`, that's fine and cost-effective. If it's using Opus, switch to Sonnet — the quality difference for astrological interpretation is negligible and the cost difference is significant.

### 3d. Combine the overview row into the last month's call

Instead of a separate 13th API call for the year overview, include an instruction in the LAST month's call: "Also provide a 12-month overview summary based on all the monthly transit data provided." Send all 12 months' transit data (just positions/aspects, not the readings) in that final call. This saves one full API call.

### 3e. Cache aggressively

- Store completed readings in localStorage keyed by birth data + month
- Before making an API call, check if a cached reading exists for that month + birth data combination
- Add a "force regenerate" option (the existing button) that bypasses cache
- Show a subtle indicator on cached vs freshly generated cards

### 3f. Consider generating on demand

Instead of generating all 12 months upfront, consider:
- Generate the current month + next month automatically (2 calls)
- Show "Generate" button on remaining months — user clicks to generate individual months as needed
- This dramatically reduces cost for casual use while still allowing full generation when needed for a client

Actually — evaluate whether this on-demand approach makes more sense for the workflow. If Remigijus is generating readings for a paying client, he'll want all 12 at once. But for testing/development, on-demand saves money. Perhaps:
- "Generate All" button (current behaviour, fixed) for client sessions
- Individual month "Generate" buttons for testing/exploration
- Both options available

## Step 4: Fix the UI for Loading/Error States

### Progressive loading feedback
- Show which month is currently being generated: "Generating April 2026... (2/12)"
- Progress bar showing overall completion
- Each card transitions from skeleton → loading spinner → content as its data arrives
- Failed cards show a retry button with the error reason

### Cost awareness
- After generation completes, show a subtle info line: "12 months generated • ~X API calls used"
- This helps Remigijus track usage during development

## Verification

After fixes:
- [ ] Click "Generate" — all 12 months populate progressively, not just month 1
- [ ] Watch the Network tab — see exactly 12–13 API calls fire sequentially (2 at a time max)
- [ ] Check console — no silent errors, each month logs success or shows a clear error
- [ ] Verify prompt size is compact (check logged character count — should be under 1000 chars per month prompt, excluding system prompt)
- [ ] Verify max_tokens is set to 1500, not 4096 or higher
- [ ] Verify model is claude-sonnet-4-20250514
- [ ] Refresh the page — cached readings load instantly without new API calls
- [ ] Click "Generate" again — should regenerate fresh (bypass cache)
- [ ] Check failed months show retry buttons
- [ ] Remove all temporary console.log statements when done (or guard them behind a DEBUG flag)
