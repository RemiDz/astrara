Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish.

# Install Plausible Analytics in Astrara

## Task

Add Plausible analytics to astrara.app using Next.js `<Script>` component.

## Implementation

1. Open `app/layout.tsx` (or `app/layout.js` — whichever exists).

2. Add this import at the top (if not already present):

```tsx
import Script from 'next/script'
```

3. Inside the `<body>` tag (just before the closing `</body>`), add the following:

```tsx
{/* Plausible Analytics */}
<Script
  src="https://plausible.io/js/pa-kP7NC2980l34MzdHVVVhR.js"
  strategy="afterInteractive"
/>
<Script id="plausible-init" strategy="afterInteractive">
  {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
</Script>
```

4. Do NOT use a regular `<script>` tag — must use Next.js `<Script>` with `strategy="afterInteractive"` for proper hydration.

5. Verify the app still builds cleanly:

```bash
npm run build
```

That's it. No other files need changing.
