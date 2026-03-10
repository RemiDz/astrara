Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

ultrathink

# URGENT: All 12 Months Failing on /promo Generation — Diagnose & Fix

## Situation

After the optimisation refactor, the /promo page now fails on ALL months (including March which previously worked). Generation runs for ~4 minutes but every month ends in the error/failed state. This means the bug was introduced in the refactor itself.

## Step 1: Diagnose FIRST — Do NOT change code until you understand the problem

Run `npm run dev` and trigger a generation. Check the following in the terminal/server console output:

1. **Are the API calls reaching the route handler?** Check if the console.log statements in `src/app/api/transit-grid/route.ts` fire at all.

2. **What is the API response status?** Log the full response from the Anthropic API — not just the parsed body, the raw status code and headers too.

3. **If the API returns 200, what does the raw response body look like?** Log the FULL raw text response from the API before any JSON parsing. The most likely issue is:
   - The prompt asks for JSON but the model returns markdown-wrapped JSON (```json ... ```) and the parser chokes
   - max_tokens: 1500 is too low and the response gets truncated mid-JSON, causing a parse error
   - The compact prompt format changed the expected response structure and the parser expects different keys

4. **Check the actual error** — In the catch block of each month's generation, log the FULL error object:
   ```typescript
   console.error(`[Month ${monthName}] FULL ERROR:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
   ```
   Don't just log `error.message` — log everything.

5. **Test ONE month manually** — Use curl or a simple test script to call the API route directly for a single month and inspect the raw response:
   ```bash
   curl -X POST http://localhost:3000/api/transit-grid \
     -H "Content-Type: application/json" \
     -d '{"month": 3, "year": 2026, "birthDate": "1981-06-15", "birthTime": "10:00", "language": "lt"}' \
     -v
   ```
   Check the full response — status code, headers, body.

## Step 2: Most Likely Root Causes (check in this order)

### Cause A: max_tokens too low (MOST LIKELY)
The previous working version used max_tokens: 4000. It was cut to 1500. But the response needs to contain 5 full category readings + a monthly summary in structured JSON. 1500 tokens is probably not enough — the JSON structure alone with all category keys, planetary breakdowns, and readings likely needs 2000–3000 tokens.

**Fix**: Increase max_tokens to 3000. This is still a significant saving from 4000 but gives enough room for the full response. Test and see if responses complete without truncation.

### Cause B: JSON parsing failure
The prompt says "respond only in JSON" but Claude might wrap it in ```json fences or add a preamble. The parser needs to handle this:

```typescript
function parseAPIResponse(rawText: string): any {
  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  
  return JSON.parse(cleaned);
}
```

### Cause C: Compact prompt broke the response structure
The refactored compact prompt format (abbreviated planet positions) might confuse the model into returning a different JSON structure than what the frontend expects. Compare:
- What JSON keys does the frontend code expect?
- What JSON keys does the API actually return?
Log both and check for mismatches (e.g. frontend expects `finance` but API returns `finance_abundance`, or frontend expects `impact_score` but API returns `score`).

### Cause D: API route auth/middleware blocking
If the password protection middleware was added, check it's not blocking the API route calls from the frontend. The API route at `/api/transit-grid` needs the session cookie passed through in the fetch call from the client side. Check the fetch call includes `credentials: 'include'` or `credentials: 'same-origin'`.

### Cause E: Request body format changed
Check if the refactored client sends the request body in the format the refactored API route expects. Log `request.json()` at the top of the route handler to see exactly what arrives.

## Step 3: Fix

Once you identify the actual cause from the diagnostics above, fix it. Do NOT guess — diagnose first, then apply the targeted fix.

After fixing:
- Test a full 12-month generation
- Verify all months populate with actual reading content
- Check console for any remaining errors
- Confirm the retry button works on any individually failed months
- Remove or guard all diagnostic console.log statements behind a `DEBUG` flag:
  ```typescript
  const DEBUG = process.env.NODE_ENV === 'development';
  if (DEBUG) console.log(...);
  ```
