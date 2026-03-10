Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

ultrathink

# Fix: /promo Generation — Two Confirmed Bugs

## Bug 1: JSON Parse Error — max_tokens Too Low

**Evidence**: Months 1–4 and 10–12 fail with "JSON parse error — response may be truncated"

**Root cause**: max_tokens was reduced from 4000 to 1500 in the optimisation pass. The structured JSON response with 5 categories (each containing impact_score, key_theme, full_reading, planetary_breakdown, practical_guidance, dates_to_watch) plus a monthly summary CANNOT fit in 1500 tokens.

**Fix**: In `src/app/api/transit-grid/route.ts`, increase max_tokens to 2500. This is still a saving from the original 4000 but gives enough room for the complete JSON response.

Additionally, add a safety check — if the response text doesn't end with `}` (indicating truncation), log it and return a clear error instead of trying to parse broken JSON:

```typescript
const responseText = data.content[0].text.trim();

// Strip markdown fences if present
let jsonText = responseText;
if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7);
if (jsonText.startsWith('```')) jsonText = jsonText.slice(3);
if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
jsonText = jsonText.trim();

// Check for truncation
if (!jsonText.endsWith('}')) {
  console.error(`[transit-grid] Response appears truncated for ${month}/${year}. Last 100 chars:`, jsonText.slice(-100));
  return NextResponse.json(
    { error: 'Response truncated — increase max_tokens', truncated: true },
    { status: 500 }
  );
}

const parsed = JSON.parse(jsonText);
```

## Bug 2: 429 Rate Limiting

**Evidence**: Months 5–9 fail with "API error 429"

**Root cause**: Even with MAX_CONCURRENT = 2, when early months fail and retry, the combined load of retries + new months exceeds the API rate limit. Also the retry backoff delay may be too short.

**Fix — change to fully sequential generation (concurrency = 1) with a delay between calls:**

In the client code (`src/app/promo/page.tsx`), change the generation to run ONE month at a time with a mandatory pause between calls:

```typescript
const DELAY_BETWEEN_CALLS = 2000; // 2 seconds between API calls

async function generateAllMonths(months: MonthData[]) {
  for (let i = 0; i < months.length; i++) {
    setCurrentGeneratingMonth(i);
    try {
      const result = await generateMonthReading(months[i]);
      // Update state with this month's result immediately (so user sees progress)
      setReadings(prev => {
        const updated = [...prev];
        updated[i] = result;
        return updated;
      });
    } catch (error) {
      console.error(`Month ${i + 1} failed:`, error);
      setMonthErrors(prev => {
        const updated = [...prev];
        updated[i] = error.message;
        return updated;
      });
    }
    
    // Wait between calls to avoid rate limiting
    if (i < months.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
    }
  }
}
```

This means total generation time will be ~12 × (API response time + 2s delay), probably around 2–3 minutes. That's fine — the user sees months filling in one by one which is actually a better UX than watching everything fail.

Also increase the retry backoff delay:
```typescript
// In the retry logic in the API route
const RETRY_DELAYS = [5000, 10000, 20000]; // 5s, 10s, 20s backoff
```

## Summary of Changes

1. `src/app/api/transit-grid/route.ts`:
   - Change `max_tokens: 1500` → `max_tokens: 2500`
   - Add JSON truncation detection before parsing
   - Add markdown fence stripping if not already present
   - Increase retry backoff delays to 5s, 10s, 20s

2. `src/app/promo/page.tsx`:
   - Change from parallel worker pattern to sequential generation (one month at a time)
   - Add 2-second delay between API calls
   - Update progress UI to show months populating one by one

## Verification

- Trigger a full generation
- Watch months populate one at a time, sequentially
- No 429 errors in console
- No JSON parse errors in console
- All 12 months + overview successfully generate
- Check Anthropic dashboard — usage should be reasonable
