# Research: Visual Polish & Micro-interactions

> Phase 0 output — resolves all NEEDS CLARIFICATION from the spec.

## Decisions

### Toast Library: sonner
- **Decision**: Use `sonner` (already in `package.json`)
- **Rationale**: Already installed, lightweight, rich colors, close button, auto-dismiss. Simpler than `react-hot-toast` which is also installed but unused.
- **Alternatives considered**: `react-hot-toast` (also installed, slightly heavier API)

### Animation Approach: CSS-only
- **Decision**: All animations via Tailwind CSS transitions and custom keyframes
- **Rationale**: Zero bundle size impact, respects `prefers-reduced-motion` automatically via `motion-safe:` variant, no new dependencies
- **Alternatives considered**: framer-motion (would add ~30KB to bundle)

### Reduced Motion Support
- **Decision**: Wrap all non-essential motion with Tailwind's `motion-safe:` variant
- **Rationale**: Built into Tailwind, no extra work per animation

## Open Questions (none)

All specification details were clear. No NEEDS CLARIFICATION markers existed in the spec.
