# Spec exclusions

Spec units that a component library can't build or test, each with its
reason: usage advice for designers ("Use X when ..."), content guidance for
the app author, platform-only rules (Android, iOS), and figure captions with
no requirement of their own. `scripts/m3/spec-checks.mjs` reads every
`spec-exclude:` comment and counts those units as excluded instead of
tracked. One file per area; one line per reason:

    - Usage advice for designers <!-- spec-exclude: <unit-id>, <unit-id> -->

Exclude a unit only when no code could satisfy it. If the library could
enforce or default it, it is a gap (`spec-gap:` in CHECKLIST.md) instead.
