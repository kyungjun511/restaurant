This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Project docs — read first

- `docs/service-plan.md` (기능 F-ID, 흐름 FL-ID), `docs/design-spec.md` (화면 S-ID, 공통 컴포넌트), `docs/dev-spec.md` (폴더 구조, API, 구현 순서)
- Follow `docs/dev-spec.md` 11.4: one stage / one screen at a time, refer to S-/F-/API- IDs, install only libraries listed in 2.2.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `app/` at the project root (dev-spec.md 3장) — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, api, mocks, utils) in `src/`.
- Import paths use the `@/` alias for the project root, e.g. `@/src/hooks/useMyOrders`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Rules

- This project runs in **Expo Go** only. Do not add libraries with native code that Expo Go does not bundle.
- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand.
- Never commit `.env`; only `.env.example`.
