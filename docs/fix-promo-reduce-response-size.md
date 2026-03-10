Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

megathink

# CRITICAL FIX: /promo API — Stop Truncation by Reducing Response Size

## The Problem

We keep increasing max_tokens and the response still truncates. The model is generating too much text because we're asking for too much in one call. Stop increasing the token limit — instead, REDUCE what we ask for.

## The Fix: Simpler, Shorter Response Format

### Step 1: Open `src/app/api/transit-grid/route.ts` and find the system prompt / user prompt

### Step 2: Replace the expected JSON response format with this MINIMAL structure

The prompt must explicitly tell the model to be extremely concise. Replace whatever JSON structure is currently requested with this:

```
Respond ONLY in valid JSON. No markdown, no backticks, no preamble. 
Be extremely concise — each reading is MAX 2 sentences. 
Use this EXACT structure:

{
  "finance": { "s": 7, "t": "Brief theme in 1 sentence max", "r": "2 sentence reading max", "p": ["Jupiter△Venus", "Saturn□Mars"], "g": "1 sentence guidance" },
  "relationships": { "s": 5, "t": "...", "r": "...", "p": ["..."], "g": "..." },
  "career": { "s": 8, "t": "...", "r": "...", "p": ["..."], "g": "..." },
  "health": { "s": 4, "t": "...", "r": "...", "p": ["..."], "g": "..." },
  "spiritual": { "s": 6, "t": "...", "r": "...", "p": ["..."], "g": "..." },
  "summary": { "s": 6, "t": "...", "r": "..." }
}

Keys: s=impact score (1-10), t=theme, r=reading, p=planetary aspects array, g=guidance.
Keep every value SHORT. Total response must be under 800 tokens.
```

### Step 3: Update the frontend parsing to match the new short keys

Wherever the frontend reads the API response, map the short keys to display values:
- `s` → impact score
- `t` → key theme (displayed as card headline)
- `r` → reading text (displayed as card body)
- `p` → planetary aspects array (displayed as aspect pills/badges)
- `g` → practical guidance (displayed in italics)

### Step 4: Set max_tokens to 1200

With the minimal format above, the response should comfortably fit in 800-1000 tokens. Setting 1200 gives safe headroom.

### Step 5: Keep the truncation detection

Keep the existing check that detects if the response doesn't end with `}`. But now it should rarely trigger.

### Step 6: TEST LOCALLY before deploying

This is critical — do NOT deploy to Vercel without confirming it works locally first:

```bash
npm run dev
```

Then test with curl FIRST before using the UI:

```bash
curl -s -X POST http://localhost:3000/api/transit-grid \
  -H "Content-Type: application/json" \
  -d '{"month":3,"year":2026}' | head -c 2000
```

Check:
1. Does it return valid JSON?
2. Does the JSON match the expected structure with short keys?
3. Is the response under 1200 tokens? (rough check: under 4000 characters)

Only proceed to UI testing after curl works. Only deploy after UI testing works locally.

### Step 7: Add a STOP deploying safeguard

In the generation function on the client side, add this: if the FIRST month fails, STOP immediately. Do not continue burning API credits on months 2-12 if month 1 can't even work:

```typescript
// Generate month 1 first as a test
try {
  const firstResult = await generateMonthReading(months[0]);
  setReadings(prev => { const u = [...prev]; u[0] = firstResult; return u; });
} catch (error) {
  // Month 1 failed — STOP everything, don't waste money on 2-12
  setGenerationError('Generation failed on first month. Please check API configuration. Error: ' + error.message);
  setIsGenerating(false);
  return; // EXIT — do not continue
}

// Month 1 succeeded — safe to continue with months 2-12
for (let i = 1; i < months.length; i++) {
  // ... sequential generation with delay
}
```

## Verification (LOCAL ONLY — do not deploy until all pass)

1. curl test returns valid JSON with short keys — PASS/FAIL
2. JSON response is under 4000 characters — PASS/FAIL  
3. UI shows month 1 populated correctly — PASS/FAIL
4. Full 12-month generation completes with no failures — PASS/FAIL
5. No 429 errors — PASS/FAIL

Only after ALL 5 pass: deploy to Vercel.
