# ASTRARA v2 — Iteration 6: Earth Centre Design + Birth Details Button

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Two fixes needed. Read current source files before making changes.

---

## 1. Earth at the Centre of the Wheel — Recognisable Design

The centre of the astro wheel represents Earth — the geocentric viewpoint. Currently it's just a vague purple dot that users don't recognise. It needs to be immediately identifiable as Earth without any label needed.

### Design: A Miniature Earth

Create a small but beautiful Earth sphere at the centre of the 3D wheel. It should be instantly recognisable.

**Option A (Recommended): Stylised Earth with Colour Bands**

A small sphere (radius ~0.15) with a custom shader or layered materials that suggests Earth without needing a NASA texture:

```tsx
<group position={[0, 0, 0]}>
  {/* Earth sphere */}
  <mesh>
    <sphereGeometry args={[0.15, 32, 32]} />
    <meshPhysicalMaterial
      color="#1a4a7a"              // deep ocean blue base
      emissive="#0d2847"           // subtle self-illumination
      emissiveIntensity={0.4}
      roughness={0.6}
      metalness={0.1}
      clearcoat={0.5}
      clearcoatRoughness={0.3}
    />
  </mesh>
  
  {/* Atmosphere glow ring */}
  <mesh>
    <sphereGeometry args={[0.18, 32, 32]} />
    <meshBasicMaterial
      color="#4a9eff"
      transparent
      opacity={0.12}
      side={THREE.BackSide}        // renders inside-out = glow effect
    />
  </mesh>
  
  {/* Tiny point light — Earth subtly illuminates nearby elements */}
  <pointLight color="#4a9eff" intensity={0.3} distance={1.5} decay={2} />
</group>
```

To make it look like Earth rather than just a blue ball, add visual hints of continents and atmosphere:

**Land masses** — Create a second sphere at the same position, slightly larger (radius 0.151), with a partially transparent green/brown material that only shows through in patches. Use a procedural noise pattern or a simple UV-mapped silhouette:

```tsx
{/* Simple approach: use a green-tinted wireframe overlay to suggest continents */}
<mesh rotation={[0.4, 0, 0.2]}>
  <icosahedronGeometry args={[0.152, 2]} />  {/* low-poly icosahedron = irregular land shapes */}
  <meshBasicMaterial
    color="#2d5a1e"
    transparent
    opacity={0.25}
    wireframe={true}
    wireframeLinewidth={1}
  />
</mesh>
```

**Or even simpler**: Download a tiny Earth texture (free, public domain) and apply it:

```tsx
import { useTexture } from '@react-three/drei'

const earthTexture = useTexture('/textures/earth-small.jpg')  // ~50KB low-res texture

<mesh>
  <sphereGeometry args={[0.15, 32, 32]} />
  <meshStandardMaterial
    map={earthTexture}
    emissive="#0a1a3a"
    emissiveIntensity={0.3}
  />
</mesh>
```

Find a small free Earth texture (search "earth texture public domain small" — NASA Blue Marble has free ones, just resize to ~256x128px to keep it tiny). Save it to `public/textures/earth-small.jpg`.

**Earth should slowly rotate** on its own axis (independent of the wheel rotation):

```tsx
useFrame((_, delta) => {
  earthRef.current.rotation.y += delta * 0.1  // gentle spin
})
```

### Atmosphere Effect

Add a soft blue-white glow around Earth to represent the atmosphere. This also helps it stand out from the darker background:

```tsx
{/* Atmospheric halo — sprite behind Earth */}
<sprite scale={[0.6, 0.6, 1]} position={[0, 0, -0.05]}>
  <spriteMaterial
    color="#4a9eff"
    transparent
    opacity={0.15}
    blending={THREE.AdditiveBlending}
  />
</sprite>
```

### Size & Visibility

Earth should be:
- **Small enough** that it doesn't compete with the planets (radius 0.15 vs planets at 0.08–0.18)
- **Recognisable enough** that users instantly know what it is (the blue + green + atmosphere glow does this)
- **Centred perfectly** at position [0, 0, 0] in the 3D scene
- Visually distinct from all planets — it's the only object with the blue/green colour combination

### Optional: "You Are Here" Subtle Label

Below Earth, add a tiny text label that appears only on first visit or on hover/tap:

```tsx
<Html center position={[0, -0.25, 0]} style={{ pointerEvents: 'none' }}>
  <div 
    className="text-[9px] text-blue-300/40 whitespace-nowrap select-none tracking-widest uppercase"
    style={{ textShadow: '0 0 8px rgba(74, 158, 255, 0.3)' }}
  >
    you are here
  </div>
</Html>
```

This is completely optional — if the Earth visual is good enough, the label isn't needed. Use your judgement after implementing the sphere.

---

## 2. Birth Details Button — Remove from Bottom, Add Properly

The "Enter Birth Details" CTA is currently buried at the bottom of the page where nobody finds it. It needs to be accessible without scrolling.

### Remove the Old Button

Find and delete the existing birth details button/section from the bottom of the page entirely.

### Add Birth Details Access in Two Places

**Place 1: Subtle link below the day navigation buttons**

Right under the Yesterday/Today/Tomorrow row, add a single tappable line:

```tsx
{/* Day navigation */}
<div className="flex items-center justify-center gap-2 py-4">
  <button ...>← Yesterday</button>
  <button ...>Today</button>
  <button ...>Tomorrow →</button>
</div>

{/* Birth chart CTA — subtle, always visible */}
<button
  type="button"
  onClick={() => setShowBirthInput(true)}
  className="flex items-center justify-center gap-1.5 mx-auto 
             text-xs text-purple-300/50 hover:text-purple-300/80
             transition-colors select-none py-2"
>
  <span>✦</span>
  <span>{t('cta.birthChart')}</span>
  <span>→</span>
</button>
```

This sits directly below the day nav and above the cosmic weather content. It's visible without scrolling but doesn't compete with the wheel. The muted purple colour makes it feel like a gentle invitation, not a pushy CTA.

**Place 2: Inside the tappable Earth (optional but clever)**

When the user taps Earth at the centre of the wheel, instead of (or in addition to) showing "You are here", show a prompt:

```
"This is your view of the sky from Earth.
 Want to see how it connects to YOU?"
 
 [Enter Your Birth Details]
```

This is a natural discovery moment — the user explores the wheel, taps the centre, and discovers they can personalise it. This is Phase 2 functionality, but the entry point should exist now.

### Birth Details Modal

When the user taps either entry point, show a **modal/bottom sheet** (not a new page) with the birth data form:

```tsx
{showBirthInput && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowBirthInput(false)}
    />
    
    {/* Bottom sheet */}
    <div className="relative z-10 w-full max-w-md mx-auto 
                    bg-[#0D0D1A]/95 backdrop-blur-xl 
                    border border-white/10 
                    rounded-t-2xl sm:rounded-2xl 
                    p-6 pb-8
                    animate-slide-up">
      
      {/* Handle bar (mobile) */}
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
      
      <h3 className="text-lg font-serif text-white/90 text-center mb-1">
        {t('cta.birthChartTitle') || 'Your Cosmic Portrait'}
      </h3>
      <p className="text-xs text-white/40 text-center mb-6">
        {t('cta.birthChartSubtitle') || 'Enter your birth details to personalise your sky'}
      </p>
      
      {/* Date of Birth */}
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
        {t('form.dateOfBirth') || 'Date of Birth'}
      </label>
      <input
        type="date"
        className="w-full px-4 py-3 rounded-xl mb-4
                   bg-white/5 border border-white/10 
                   text-white/90 text-sm
                   focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
                   outline-none transition-all"
      />
      
      {/* Time of Birth */}
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
        {t('form.timeOfBirth') || 'Time of Birth'}
      </label>
      <input
        type="time"
        className="w-full px-4 py-3 rounded-xl mb-1
                   bg-white/5 border border-white/10 
                   text-white/90 text-sm
                   focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
                   outline-none transition-all"
      />
      <p className="text-[10px] text-white/30 mb-4">
        {t('form.timeHint') || "Don't know? Use 12:00"}
      </p>
      
      {/* City of Birth */}
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
        {t('form.cityOfBirth') || 'City of Birth'}
      </label>
      <input
        type="text"
        placeholder={t('form.cityPlaceholder') || 'Search for your city...'}
        className="w-full px-4 py-3 rounded-xl mb-6
                   bg-white/5 border border-white/10 
                   text-white/90 text-sm placeholder:text-white/20
                   focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
                   outline-none transition-all"
      />
      
      {/* Submit */}
      <button
        type="button"
        className="w-full py-3.5 rounded-xl font-medium text-sm
                   bg-gradient-to-r from-purple-600 to-indigo-600
                   text-white
                   hover:from-purple-500 hover:to-indigo-500
                   active:scale-[0.98]
                   transition-all duration-200
                   select-none"
      >
        {t('cta.birthChartButton') || 'Reveal My Cosmic Portrait'}
      </button>
      
      {/* Close */}
      <button
        type="button"
        onClick={() => setShowBirthInput(false)}
        className="absolute top-4 right-4 text-white/30 hover:text-white/60 
                   transition-colors select-none text-lg"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  </div>
)}
```

### Animation

Add a slide-up animation for the modal:

```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

### Note on Functionality

The birth chart CALCULATION is Phase 2. For now, the form collects the data and shows a "Coming soon — your personal cosmic portrait is being prepared" message on submit. Store the birth data in localStorage so it's ready when Phase 2 launches:

```tsx
const handleSubmit = () => {
  const birthData = { date: birthDate, time: birthTime, city: birthCity, lat, lng }
  localStorage.setItem('astrara-birth-data', JSON.stringify(birthData))
  // Show coming soon message or close modal
}
```

### i18n Keys to Add

Add these keys to both `en.json` and `lt.json`:

**English:**
```json
{
  "cta.birthChart": "✦ What does YOUR chart look like?",
  "cta.birthChartTitle": "Your Cosmic Portrait",
  "cta.birthChartSubtitle": "Enter your birth details to personalise your sky",
  "form.dateOfBirth": "Date of Birth",
  "form.timeOfBirth": "Time of Birth",
  "form.timeHint": "Don't know? Use 12:00",
  "form.cityOfBirth": "City of Birth",
  "form.cityPlaceholder": "Search for your city...",
  "cta.birthChartButton": "Reveal My Cosmic Portrait",
  "cta.comingSoon": "Your personal cosmic portrait is being prepared..."
}
```

**Lithuanian:**
```json
{
  "cta.birthChart": "✦ Kaip atrodo TAVO žvaigždėlapis?",
  "cta.birthChartTitle": "Tavo Kosminis Portretas",
  "cta.birthChartSubtitle": "Įvesk gimimo duomenis ir pamatyk savo dangų",
  "form.dateOfBirth": "Gimimo data",
  "form.timeOfBirth": "Gimimo laikas",
  "form.timeHint": "Nežinai? Naudok 12:00",
  "form.cityOfBirth": "Gimimo miestas",
  "form.cityPlaceholder": "Ieškoti miesto...",
  "cta.birthChartButton": "Atskleisti Mano Kosminį Portretą",
  "cta.comingSoon": "Tavo asmeninis kosminis portretas ruošiamas..."
}
```

---

## Build Steps

1. Read current source files — find the wheel centre element and the old birth details button
2. Replace the centre dot/sphere with a proper Earth design (textured or stylised sphere + atmosphere glow + gentle spin)
3. Delete the old birth details button/section from the bottom of the page
4. Add the subtle CTA link below the day navigation
5. Build the birth details modal/bottom sheet with form fields
6. Add the slide-up animation
7. Wire up form submission to localStorage storage
8. Add all new i18n keys to both en.json and lt.json
9. Test: Earth is recognisable at wheel centre
10. Test: Birth details CTA is visible without scrolling
11. Test: Modal opens, form works, closes cleanly
12. Test: No text selection on any buttons
13. Run `npm run build`
14. Commit: `feat: Earth centre design, birth details modal, remove bottom CTA`
