# 점심 미리주문 (lunch-preorder)

같은 건물 직원들이 근처 제휴 음식점 메뉴를 미리 주문하고, 음식점은 도착 시간에 맞춰 준비하는 앱입니다.
Expo SDK 58 + Expo Router + TypeScript, 서버 없이 mock 데이터로 동작합니다.

## 설계 문서
- [서비스 기획서](docs/service-plan.md)
- [디자인 설계서](docs/design-spec.md)
- [개발 설계서](docs/dev-spec.md)

## 실행 방법

```bash
npm install
cp .env.example .env    # Windows PowerShell: Copy-Item .env.example .env
npx expo start          # Windows PowerShell에서 막히면: npx.cmd expo start
```

- 터미널의 QR코드를 Android는 Expo Go 앱, iOS는 기본 카메라로 스캔합니다.
- 폰의 Expo Go가 SDK 58을 지원해야 합니다. (dev-spec.md 2.4에 따라 SDK 57에서 58로 올림)
- PC와 폰이 같은 와이파이가 아니면 `npx expo start --tunnel`

## 점검

```bash
npx tsc --noEmit
npx expo-doctor@latest
```
