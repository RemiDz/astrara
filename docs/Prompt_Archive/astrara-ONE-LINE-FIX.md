# Astrara — One Line Fix: Camera Y Value

Do NOT ask for confirmation at any step. Just do it.

---

In `src/features/cosmic-reading/animation/ReadingCameraFramer.tsx`, find this line:

```typescript
const READING_CAMERA_POS = new THREE.Vector3(0, 0.5, 6.2)
```

Change it to:

```typescript
const READING_CAMERA_POS = new THREE.Vector3(0, 1.1, 6.5)
```

That's the only change. Nothing else.

Git push: `git push origin master:main`
