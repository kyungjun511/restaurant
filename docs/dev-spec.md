# 개발 설계서 — 점심 미리주문

> 참조 문서: service-plan.md (기능 F-ID, 흐름 FL-ID), design-spec.md (화면 S-ID, 공통 컴포넌트)
> 작성일: 2026-10-25
> 구현 가능 시간: [가정] 총 2시간 (service-plan.md 기준)
> 이 문서는 사람과 AI 코딩 도구가 함께 읽는 구현 기준서입니다.

---

## 1. 문서 개요

### 1.1 목적
- service-plan.md와 design-spec.md를 실제 코드로 옮기기 위한 기준을 정한다.
- 입문자가 이 문서만 보고 순서대로 따라 만들 수 있게 한다.
- 7장의 API 명세는 나중에 백엔드 개발자가 구현할 **계약서**(앱과 서버가 주고받을 약속) 역할을 한다.

### 1.2 범위
- 화면 S-01 ~ S-19의 파일 구조와 라우트(화면 주소)
- 기능 F-01 ~ F-35의 API 정의 (이번 구현은 mock)
- 데이터 타입, 상태 관리, 환경변수, 구현 순서
- **이번 수업 구현 목표**: Must 기능 11개 (F-01, F-03, F-04, F-05, F-06, F-08, F-10, F-13, F-15, F-16, F-17)

### 1.3 이번 범위에서 제외하는 것
| 제외 항목 | 이유 | 대신 하는 것 |
|---|---|---|
| 백엔드 서버 구현 | 수업 시간·범위 밖 | mock 데이터로 동작 |
| DB 설계 | 백엔드 몫 | 6장 앱 쪽 타입만 정의 |
| 원격 푸시 알림 (F-11, F-14) | Expo Go에서 동작 안 함 | 화면 진입 시 갱신 + 당겨서 새로고침 |
| 엑셀 업로드 (F-23 일부) | 파일 해석이 복잡 | 직접 입력만 |
| 2차 기능 (F-28 ~ F-35) | service-plan.md에서 범위 밖으로 지정 | API 계약만 메모 |
| 실제 이미지 업로드 (API-25) | 서버 필요 | 폰의 사진 주소(URI)를 그대로 사용 |

### 1.4 참조 문서
| 문서 | 이 문서에서 가져오는 것 |
|---|---|
| service-plan.md | 기능 목록(4장), 사용자 흐름(5장), 화면 목록(6장), 다루는 정보(7장), 구현 순서(8장) |
| design-spec.md | 컬러·글자·간격(2장), 공통 컴포넌트(3장), 내비게이션(4장), 화면별 상태·문구(5장) |

---

## 2. 개발 환경 및 도구

### 2.1 기술 스택

| 항목 | 이름 | 버전 | 용도 |
|---|---|---|---|
| UI 라이브러리 | React | 19.2.x | 화면을 컴포넌트(재사용 가능한 화면 조각) 단위로 만듦 |
| 모바일 프레임워크 | React Native | 0.86.x | React 코드를 iOS·Android 앱으로 실행 |
| 개발 플랫폼 | Expo SDK | **57** | 개발 도구 + 기본 기능 모음. Expo Go와 버전이 맞아야 실행됨 |
| 라우팅 | Expo Router | SDK 57 포함 버전 (`npx expo install`이 맞춰줌) | 파일 위치가 곧 화면 주소가 되는 화면 이동 방식 |
| 언어 | TypeScript | 템플릿 기본값 [확인 필요] | 자바스크립트 + 타입 검사(오타·잘못된 값 미리 잡기) |
| 실행 환경 | Node.js | 현재 LTS (최소 22.13 이상 권장) [확인 필요] | 개발 도구 실행 |
| 패키지 매니저 | npm | Node.js에 포함된 버전 | 라이브러리 설치 |
| 실행 확인 앱 | Expo Go | **SDK 57을 지원하는 버전** | 폰에서 개발 중인 앱 실행 |
| 에디터 | VS Code | 최신 | 코드 작성 |
| 버전 관리 | Git / GitHub | 최신 | 변경 이력 저장, 백업 |

> 확인 근거: Expo SDK 57은 React Native 0.86, React 19.2를 사용합니다 (Expo 공식 SDK 57 변경 기록). SDK 58은 2026-10-21에 나왔지만 스토어 Expo Go는 몇 주 뒤 SDK 58 전용으로 바뀐다고 공지되었고, 그 전까지 Expo Go를 쓰려면 SDK 57을 고르라고 안내되어 있습니다 (Expo 블로그 "How to upgrade to SDK 58").

### 2.2 사용 라이브러리

라이브러리는 최소로만 씁니다. 버전은 직접 적지 말고 `npx expo install`로 설치하면 SDK 57에 맞는 버전이 자동으로 들어갑니다.

| 라이브러리 | 용도 | 설치 명령 | Expo Go 호환 | 쓰는 단계 |
|---|---|---|---|---|
| expo-router | 화면 이동, 탭 | 기본 템플릿 포함 | ✅ | Must |
| @expo/vector-icons | Ionicons 아이콘 | 기본 템플릿 포함 | ✅ | Must |
| react-native-safe-area-context | 노치·하단 바 안전 영역 | 기본 템플릿 포함 (expo-router 의존) | ✅ | Must |
| expo-secure-store | 로그인 토큰 암호화 저장 | `npx expo install expo-secure-store` | ✅ (공식 문서: Included in Expo Go) | Must |
| @react-native-async-storage/async-storage | mock 데이터·장바구니 기기 저장 | `npx expo install @react-native-async-storage/async-storage` | ✅ (공식 문서: Included in Expo Go) | Should |
| expo-image-picker | 메뉴 사진 선택·촬영 (F-19) | `npx expo install expo-image-picker` | ✅ (공식 문서: Included in Expo Go) | Should |
| expo-notifications | 원격 푸시 (F-11, F-14) | **설치하지 않음** | ❌ SDK 53부터 Expo Go에서 원격 푸시 불가 | 제외 |

- 상태 관리 라이브러리(Redux, Zustand 등)는 쓰지 않습니다. React 기본 `useState`, `Context`로 충분합니다.
- 서버 통신 라이브러리(axios 등)도 쓰지 않습니다. 기본 `fetch`를 씁니다.
- 바텀시트·상단 탭 라이브러리도 쓰지 않습니다. React Native 기본 `Modal`과 직접 만든 탭 버튼으로 구현합니다.

### 2.3 개발 환경 세팅 순서

```bash
# 1. Node.js 확인 (nodejs.org에서 LTS 설치 후)
node -v
npm -v

# 2. 프로젝트 생성 — SDK를 물어보면 57 선택
npx create-expo-app@latest lunch-preorder
#   (SDK를 묻지 않으면) npx create-expo-app@latest lunch-preorder --template default@sdk-57  [확인 필요]

# 3. 폴더 이동 후 VS Code 열기
cd lunch-preorder
code .

# 4. 예제 화면 정리 (기본 템플릿에 들어 있는 스크립트) [확인 필요]
npm run reset-project

# 5. 라이브러리 설치 (Must)
npx expo install expo-secure-store

# 6. 실행
npx expo start
#   → 터미널에 QR코드 표시
#   → Android: Expo Go 앱에서 QR 스캔 / iOS: 기본 카메라로 QR 스캔

# 7. 프로젝트 점검 (오류가 날 때)
npx expo-doctor@latest

# 8. GitHub에 올리기
git add .
git commit -m "chore: 프로젝트 생성"
git remote add origin https://github.com/<내아이디>/lunch-preorder.git
git push -u origin main
```

### 2.4 Expo Go 사용 시 제약과 주의사항

| 항목 | 내용 | 대응 |
|---|---|---|
| **SDK 버전 일치** | 프로젝트 SDK와 폰의 Expo Go가 지원하는 SDK가 다르면 앱이 열리지 않음 | 수업 당일 Expo Go 버전 확인. Expo Go가 SDK 58 전용으로 업데이트되었다면 프로젝트도 `npx expo install expo@^58.0.0 --fix`로 올림 |
| 같은 네트워크 | PC와 폰이 같은 와이파이여야 QR 접속이 잘 됨 | 안 되면 `npx expo start --tunnel` |
| 원격 푸시 | SDK 53부터 Expo Go에서 원격 푸시 불가 | 이번 범위 제외. 화면 갱신으로 대체 |
| 직접 만든 네이티브 모듈 | Expo Go에 없는 네이티브 코드는 실행 불가 | 2.2 표의 라이브러리만 사용 |
| 기기 간 데이터 공유 | mock 모드는 한 폰 안에서만 데이터가 있음 | 한 폰에서 직원·사장님 계정을 번갈아 로그인해 시연 |
| 환경변수 변경 | `.env`를 바꿨는데 반영이 안 될 때 | `npx expo start --clear`로 다시 실행 |

---

## 3. 파일 및 폴더 구조

### 3.1 전체 폴더 트리

```
lunch-preorder/
├── app/                                  # 화면 (Expo Router: 파일 위치 = 화면 주소)
│   ├── _layout.tsx                       # 앱 최상위 틀: Provider 감싸기
│   ├── index.tsx                         # 시작 화면: 로그인 상태 보고 이동
│   ├── login.tsx                         # S-01 로그인
│   ├── change-password.tsx               # S-02 비밀번호 변경
│   ├── employee/                         # 직원 영역
│   │   ├── _layout.tsx                   # 하단 탭 (홈 / 내 주문 / 마이)
│   │   ├── home/
│   │   │   ├── _layout.tsx               # 홈 탭 안의 화면 쌓기(Stack)
│   │   │   ├── index.tsx                 # S-03 홈 (음식점 목록)
│   │   │   ├── restaurant/
│   │   │   │   └── [restaurantId].tsx    # S-04 음식점 상세 (메뉴판)
│   │   │   ├── cart.tsx                  # S-05 장바구니 / 주문하기
│   │   │   └── order-complete/
│   │   │       └── [orderId].tsx         # S-06 주문 완료
│   │   ├── orders.tsx                    # S-07 내 주문
│   │   └── my.tsx                        # S-08 마이페이지
│   ├── owner/                            # 사장님 영역
│   │   ├── _layout.tsx                   # 하단 탭 (주문 / 요약 / 메뉴 / 설정)
│   │   ├── orders/
│   │   │   ├── _layout.tsx               # Stack
│   │   │   ├── index.tsx                 # S-09 오늘의 주문
│   │   │   └── [orderId].tsx             # S-10 주문 상세
│   │   ├── summary.tsx                   # S-11 시간대별 요약
│   │   ├── menus/
│   │   │   ├── _layout.tsx               # Stack
│   │   │   ├── index.tsx                 # S-12 메뉴 관리
│   │   │   └── edit.tsx                  # S-13 메뉴 등록·수정 (?menuId=)
│   │   └── settings.tsx                  # S-14 가게 설정
│   ├── company-admin/                    # 회사 관리자 영역
│   │   ├── _layout.tsx                   # Stack (화면 위쪽에 직접 만든 탭 버튼)
│   │   ├── employees.tsx                 # S-15 직원 명단
│   │   └── signup-requests.tsx           # S-16 가입 승인 (2차)
│   └── admin/                            # 총괄 관리자 영역
│       ├── _layout.tsx                   # 하단 탭 (회사 / 음식점 / 주문 현황)
│       ├── companies.tsx                 # S-17 회사 관리
│       ├── restaurants.tsx               # S-18 음식점 관리
│       └── orders.tsx                    # S-19 주문 현황
│
├── src/
│   ├── config/
│   │   └── env.ts                        # 환경변수를 읽는 유일한 파일
│   ├── api/                              # 데이터 출처 계층
│   │   ├── index.ts                      # mock / http 중 하나를 골라 내보냄
│   │   ├── contracts.ts                  # API 함수 모양(인터페이스) 정의
│   │   ├── client.ts                     # HTTP 클라이언트 (fetch 감싸기)
│   │   ├── http/                         # 실제 서버 호출 구현
│   │   │   ├── auth.ts
│   │   │   ├── restaurants.ts
│   │   │   ├── orders.ts
│   │   │   ├── owner.ts
│   │   │   ├── companyAdmin.ts
│   │   │   └── admin.ts
│   │   └── mock/                         # mock 구현 (http/와 같은 함수 이름)
│   │       ├── auth.ts
│   │       ├── restaurants.ts
│   │       ├── orders.ts
│   │       ├── owner.ts
│   │       ├── companyAdmin.ts
│   │       └── admin.ts
│   ├── mocks/                            # mock 데이터 원본
│   │   ├── data/
│   │   │   ├── companies.ts
│   │   │   ├── users.ts
│   │   │   ├── restaurants.ts
│   │   │   ├── menus.ts
│   │   │   └── orders.ts
│   │   ├── db.ts                         # 메모리 저장소 (Should: 기기 저장 추가)
│   │   └── delay.ts                      # 응답 지연 흉내
│   ├── hooks/                            # 화면이 쓰는 데이터 훅
│   │   ├── useAsync.ts                   # 로딩·오류·데이터 공통 처리
│   │   ├── useCompanies.ts
│   │   ├── useRestaurants.ts
│   │   ├── useRestaurantDetail.ts
│   │   ├── useMyOrders.ts
│   │   ├── useMyOrder.ts
│   │   ├── useOwnerOrders.ts
│   │   ├── useOwnerOrder.ts
│   │   ├── useOrderSummary.ts
│   │   ├── useOwnerMenus.ts
│   │   ├── useOwnerRestaurant.ts
│   │   ├── useEmployees.ts
│   │   ├── useSignupRequests.ts
│   │   ├── useAdminCompanies.ts
│   │   ├── useAdminRestaurants.ts
│   │   └── useAdminOrders.ts
│   ├── contexts/                         # 앱 전체 공유 상태
│   │   ├── AuthContext.tsx               # 로그인 사용자, 토큰
│   │   └── CartContext.tsx               # 장바구니
│   ├── components/
│   │   ├── common/                       # design-spec.md 3장 공통 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ListItem.tsx
│   │   │   ├── Stepper.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── SegmentedTab.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── BottomBar.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorView.tsx
│   │   │   └── Banner.tsx
│   │   └── domain/                       # 이 앱 전용 조합 컴포넌트
│   │       ├── RestaurantCard.tsx
│   │       ├── MenuItemRow.tsx
│   │       ├── EmployeeOrderCard.tsx
│   │       └── OwnerOrderCard.tsx
│   ├── constants/
│   │   ├── colors.ts                     # design-spec.md 2.1 HEX 값
│   │   ├── typography.ts                 # 글자 크기·굵기
│   │   ├── spacing.ts                    # 간격·모서리
│   │   ├── orderStatus.ts                # 상태 이름(한글)·배지 색·다음 단계
│   │   ├── messages.ts                   # 화면 문구 모음
│   │   └── rules.ts                      # 운영 규칙 (마감 시간, 인원 범위 등)
│   ├── types/
│   │   ├── models.ts                     # 6장 데이터 타입
│   │   └── api.ts                        # 공통 응답·오류 타입
│   └── utils/
│       ├── format.ts                     # 가격·시간 표시
│       ├── timeSlots.ts                  # 도착 시간 칩 목록 계산
│       └── secureStorage.ts              # expo-secure-store 감싸기
│
├── assets/
│   └── images/                           # 로고, 앱 아이콘, mock 음식 사진
├── .env                                  # 실제 환경변수 (깃에 올리지 않음)
├── .env.example                          # 변수 이름만 (깃에 올림)
├── .gitignore
├── app.json                              # Expo 앱 설정
├── package.json
├── tsconfig.json
└── README.md
```

> [가정] Expo Router의 그룹 폴더 `(이름)`은 주소에 나타나지 않아 `employee/orders`와 `admin/orders`가 같은 주소 `/orders`로 겹칩니다. 그래서 그룹 폴더 대신 **일반 폴더**(`employee/`, `owner/`, `admin/`)로 사용자 유형을 나눴습니다.

### 3.2 폴더·파일별 역할

| 경로 | 역할 | 규칙 |
|---|---|---|
| `app/` | 화면 파일만 둠. 파일 위치가 화면 주소 | 화면 안에 데이터 읽기 코드(fetch, mock 직접 import) 금지. 훅만 사용 |
| `app/**/_layout.tsx` | 탭·화면 쌓기 등 화면 틀 | 로그인 여부·유형 검사도 여기서 |
| `src/config/env.ts` | 환경변수 읽기 | `process.env`는 이 파일에서만 사용 |
| `src/api/contracts.ts` | API 함수 이름·입력·출력 모양 | mock과 http가 똑같이 따름 |
| `src/api/index.ts` | mock/http 선택 | 훅은 여기서만 import |
| `src/api/client.ts` | 서버 주소 붙이기, 토큰 헤더, 오류 변환 | http/ 파일만 사용 |
| `src/api/http/` | 실제 서버 호출 | 서버 연결 시 채움 |
| `src/api/mock/` | 가짜 서버 동작 | 실제 서버와 같은 응답 모양 반환 |
| `src/mocks/` | 가짜 데이터 원본과 저장소 | 비밀번호는 테스트용 가짜 값만 |
| `src/hooks/` | 화면이 쓰는 데이터 묶음 (로딩·오류·새로고침 포함) | 훅 하나 = 화면 데이터 하나 |
| `src/contexts/` | 로그인 정보, 장바구니 | 서버 데이터(주문 목록 등)는 넣지 않음 |
| `src/components/common/` | 디자인 공통 컴포넌트 | 데이터 모름. props(전달값)로만 동작 |
| `src/components/domain/` | 음식점 카드, 주문 카드 등 | 타입은 `src/types/models.ts` 사용 |
| `src/constants/` | 색, 글자, 문구, 규칙 값 | 화면에 숫자·색·문구 직접 쓰지 않고 여기서 가져옴 |
| `src/types/` | 타입 정의 | 6장 기준 |
| `src/utils/` | 계산·표시 도우미 함수 | 화면과 무관한 순수 함수 |

### 3.3 화면-파일 대응표

| 화면 ID | 화면명 | 라우트 경로 | 파일 경로 |
|---|---|---|---|
| S-01 | 로그인 | `/login` | `app/login.tsx` |
| S-02 | 비밀번호 변경 | `/change-password` | `app/change-password.tsx` |
| S-03 | 홈 — 음식점 목록 | `/employee/home` | `app/employee/home/index.tsx` |
| S-04 | 음식점 상세 — 메뉴판 | `/employee/home/restaurant/[restaurantId]` | `app/employee/home/restaurant/[restaurantId].tsx` |
| S-05 | 장바구니 / 주문하기 | `/employee/home/cart` | `app/employee/home/cart.tsx` |
| S-06 | 주문 완료 | `/employee/home/order-complete/[orderId]` | `app/employee/home/order-complete/[orderId].tsx` |
| S-07 | 내 주문 | `/employee/orders` | `app/employee/orders.tsx` |
| S-08 | 마이페이지 | `/employee/my` | `app/employee/my.tsx` |
| S-09 | 오늘의 주문 | `/owner/orders` | `app/owner/orders/index.tsx` |
| S-10 | 주문 상세 | `/owner/orders/[orderId]` | `app/owner/orders/[orderId].tsx` |
| S-11 | 시간대별 요약 | `/owner/summary` | `app/owner/summary.tsx` |
| S-12 | 메뉴 관리 | `/owner/menus` | `app/owner/menus/index.tsx` |
| S-13 | 메뉴 등록·수정 | `/owner/menus/edit` (`?menuId=` 있으면 수정) | `app/owner/menus/edit.tsx` |
| S-14 | 가게 설정 | `/owner/settings` | `app/owner/settings.tsx` |
| S-15 | 직원 명단 | `/company-admin/employees` | `app/company-admin/employees.tsx` |
| S-16 | 가입 승인 (2차) | `/company-admin/signup-requests` | `app/company-admin/signup-requests.tsx` |
| S-17 | 회사 관리 | `/admin/companies` | `app/admin/companies.tsx` |
| S-18 | 음식점 관리 | `/admin/restaurants` | `app/admin/restaurants.tsx` |
| S-19 | 주문 현황 | `/admin/orders` | `app/admin/orders.tsx` |

### 3.4 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 화면 파일 (`app/`) | 소문자 + 하이픈. 동적 값은 `[이름]` | `order-complete/[orderId].tsx` |
| 컴포넌트 파일·이름 | PascalCase (단어 첫 글자 대문자) | `RestaurantCard.tsx`, `RestaurantCard` |
| 훅 | `use` + PascalCase | `useMyOrders` |
| 함수 | camelCase (첫 단어 소문자), 동사로 시작 | `getRestaurants`, `createOrder`, `acceptOrder` |
| 타입·인터페이스 | PascalCase | `Order`, `OrderStatus` |
| 상수 | 대문자 + 밑줄 | `ORDER_DEADLINE`, `PARTY_SIZE_MAX` |
| 환경변수 | `EXPO_PUBLIC_` + 대문자 + 밑줄 | `EXPO_PUBLIC_API_BASE_URL` |
| 주문 상태 값 | 영어 소문자 + 밑줄 (화면 표시는 한글) | `no_show` → "노쇼" |
| 화면 파일 맨 위 주석 | 화면 ID와 기능 ID 표기 | `// S-04 음식점 상세 (F-04, F-05, F-20)` |

### 3.5 파일 생성 순서

1. `src/constants/` (colors, typography, spacing, orderStatus, messages, rules)
2. `src/types/models.ts`, `src/types/api.ts`
3. `.env`, `.env.example`, `src/config/env.ts`
4. `src/mocks/data/*`, `src/mocks/db.ts`, `src/mocks/delay.ts`
5. `src/api/contracts.ts` → `src/api/mock/*` → `src/api/client.ts` → `src/api/http/*`(빈 껍데기라도) → `src/api/index.ts`
6. `src/hooks/useAsync.ts`
7. `src/components/common/` (Button, Input, Card, Loading, ErrorView, EmptyState부터)
8. `src/contexts/AuthContext.tsx`, `src/utils/secureStorage.ts`
9. `app/_layout.tsx`, `app/index.tsx`, `app/login.tsx`
10. 직원 화면: S-03 → S-04 → `CartContext` → S-05 → S-06 → S-07
11. 사장님 화면: S-09 → S-10
12. 나머지 (Should → Could)

---

## 4. 환경변수 및 보안

### 4.1 핵심 원칙 (꼭 기억할 것)

> **앱에 들어가는 env 값은 비밀이 아닙니다.**
> Expo에서 앱 코드가 읽을 수 있는 환경변수는 `EXPO_PUBLIC_`으로 시작하는 것뿐이고, 이 값은 실행할 때 앱 코드(번들) 안에 그대로 써 넣어집니다. 앱을 받은 사람은 누구나 이 값을 꺼내볼 수 있습니다.
> 따라서 `.env`에는 **노출되어도 괜찮은 환경별 설정값**만 넣고, 비밀 키는 앱에 절대 넣지 않습니다.

### 4.2 환경변수 목록

| 변수명 | 설명 | 예시 값 | 노출되어도 되는가 |
|---|---|---|---|
| `EXPO_PUBLIC_APP_ENV` | 실행 환경 이름 | `development` | ✅ 됨 |
| `EXPO_PUBLIC_USE_MOCK` | mock 사용 여부 (`true`/`false`) | `true` | ✅ 됨 |
| `EXPO_PUBLIC_API_BASE_URL` | 서버 주소 (mock일 때는 사용 안 함) | `https://api.example.com/v1` | ✅ 됨 (서버 주소는 공개 정보) |
| `EXPO_PUBLIC_MOCK_DELAY_MS` | mock 응답 지연 시간(밀리초) | `500` | ✅ 됨 |

### 4.3 `.env`, `.env.example`, `.gitignore` 규칙

| 파일 | 내용 | 깃에 올리는가 |
|---|---|---|
| `.env` | 실제 값 | ❌ 올리지 않음 |
| `.env.example` | 변수 이름 + 빈 값 또는 안전한 예시 | ✅ 올림 |
| `.gitignore` | `.env` 제외 규칙 | ✅ 올림 |

**.env.example**
```bash
# 복사해서 .env 파일을 만들고 값을 채우세요.
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_USE_MOCK=true
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_MOCK_DELAY_MS=500
```

**.gitignore에 추가할 줄**
```gitignore
# 환경변수
.env
.env.local
.env.*.local
```

> 새로 클론(내려받기)한 사람은 `.env.example`을 복사해 `.env`를 만듭니다: `cp .env.example .env`

### 4.4 코드에서 env 읽기 (`src/config/env.ts`)

규칙: `process.env`는 **이 파일에서만** 씁니다. 다른 파일은 `env` 객체를 가져다 씁니다.

```ts
// src/config/env.ts
// 주의: process.env.EXPO_PUBLIC_XXX 처럼 "점(.)으로 한 번에" 써야 값이 들어갑니다.
//       process.env['EXPO_PUBLIC_XXX'] 나 구조 분해({ ... } = process.env)는 동작하지 않습니다.

const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const useMock = process.env.EXPO_PUBLIC_USE_MOCK !== 'false'; // 값이 없으면 mock 사용
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const mockDelayMs = Number(process.env.EXPO_PUBLIC_MOCK_DELAY_MS ?? '500');

if (!useMock && !apiBaseUrl) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL이 비어 있습니다. .env를 확인하세요.');
}

export const env = {
  appEnv,
  useMock,
  apiBaseUrl,
  mockDelayMs: Number.isNaN(mockDelayMs) ? 500 : mockDelayMs,
} as const;
```

### 4.5 앱에 넣으면 안 되는 값

| 값 | 이유 | 관리 위치 |
|---|---|---|
| 서버 비밀 키 (시크릿 키, 서비스 롤 키) | 앱에서 꺼내면 누구나 서버를 마음대로 조작 가능 | 백엔드 서버 환경변수 |
| DB 접속 정보 (주소+아이디+비밀번호) | 데이터 전체 유출 위험 | 백엔드 서버 |
| 관리자 토큰, 마스터 계정 비밀번호 | 관리자 권한 탈취 | 백엔드 서버 |
| 푸시 발송 키 (FCM 서버 키, APNs 키) | 다른 사람에게 가짜 알림 발송 가능 | 백엔드 서버 / EAS 비밀 변수 |
| 실제 직원 명단·사번 | 개인정보 | 백엔드 DB |

**방침**: 위 값들은 백엔드가 붙을 때 서버 쪽에서 관리합니다. 앱은 서버 주소만 알고, 권한은 로그인 후 받은 토큰으로만 증명합니다.

> mock 데이터의 비밀번호(`test1234` 등)는 **테스트용 가짜 값**이라 코드에 있어도 됩니다. 실제 직원 비밀번호는 절대 넣지 않습니다.

### 4.6 민감한 사용자 정보 저장

| 정보 | 저장 방식 | Expo Go | 이유 |
|---|---|---|---|
| 로그인 토큰 | `expo-secure-store` | ✅ 포함 | 기기 보안 영역(iOS 키체인, Android 키스토어)에 암호화 저장. 앱을 껐다 켜도 로그인 유지(F-13) |
| 로그인 사용자 정보 (이름, 유형) | 메모리(AuthContext). 앱 시작 시 토큰으로 API-05 호출해 다시 받음 | ✅ | 비밀은 아니지만 최신 상태 유지 목적 |
| 비밀번호 | **저장하지 않음** | — | 로그인할 때만 보내고 버림 |
| 장바구니 | 메모리 (Should: AsyncStorage) | ✅ | 민감 정보 아님 |
| mock 주문 데이터 | 메모리 (Should: AsyncStorage) | ✅ | 가짜 데이터, 암호화 불필요 |

- `expo-secure-store`는 값 하나에 큰 데이터를 넣으면 실패할 수 있습니다(공식 문서상 약 2KB 기준 주의). **토큰 문자열만** 저장합니다.
- AsyncStorage는 **암호화되지 않습니다**. 토큰은 절대 AsyncStorage에 넣지 않습니다.
- mock 모드의 토큰은 `mock-token-<사용자ID>` 형태의 가짜 문자열입니다.

```ts
// src/utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};
```

---

## 5. 백엔드/DB 확장 대비 설계

### 5.1 데이터 흐름 계층도

```
┌──────────────────────────────┐
│ 화면 (app/**)                │  화면은 데이터가 어디서 오는지 모름
│ 예: app/employee/orders.tsx  │
└──────────────┬───────────────┘
               │ useMyOrders()
┌──────────────▼───────────────┐
│ 데이터 훅 (src/hooks)         │  로딩·오류·새로고침 처리
└──────────────┬───────────────┘
               │ api.orders.getMyOrders()
┌──────────────▼───────────────┐
│ API 선택 (src/api/index.ts)   │  env.useMock 보고 하나 선택
└───────┬──────────────┬───────┘
        │ true         │ false
┌───────▼──────┐ ┌─────▼──────────────┐
│ mock 구현     │ │ http 구현           │
│ src/api/mock │ │ src/api/http        │
└───────┬──────┘ └─────┬──────────────┘
        │              │
┌───────▼──────┐ ┌─────▼──────────────┐
│ mock 저장소   │ │ HTTP 클라이언트      │
│ src/mocks/db │ │ src/api/client.ts   │
└──────────────┘ └─────┬──────────────┘
                       │ fetch
                 ┌─────▼──────┐
                 │ 실제 서버    │  (이번 범위 아님)
                 └────────────┘
```

### 5.2 핵심 코드 형태

**① API 함수 모양 정의 (`src/api/contracts.ts`)** — mock과 http가 똑같이 따름
```ts
import type { Order, OrderListScope, CreateOrderInput } from '@/src/types/models';

export interface OrdersApi {
  createOrder(input: CreateOrderInput): Promise<Order>;          // API-10
  getMyOrders(scope: OrderListScope): Promise<Order[]>;          // API-11
  getMyOrder(orderId: string): Promise<Order>;                   // API-12
  cancelMyOrder(orderId: string): Promise<Order>;                // API-13
}
// AuthApi, RestaurantsApi, OwnerApi, CompanyAdminApi, AdminApi도 같은 방식
```

**② HTTP 클라이언트 (`src/api/client.ts`)**
```ts
import { env } from '@/src/config/env';
import { tokenStorage } from '@/src/utils/secureStorage';
import { ApiError, type ApiResponse } from '@/src/types/api';

export async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await tokenStorage.get();
  let res: Response;
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('NETWORK_ERROR', '연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요', 0);
  }
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new ApiError(json.error.code, json.error.message, res.status);
  return json.data;
}
```

**③ http 구현 예 (`src/api/http/orders.ts`)**
```ts
import { request } from '../client';
import type { OrdersApi } from '../contracts';

export const httpOrdersApi: OrdersApi = {
  createOrder: (input) => request('POST', '/orders', input),
  getMyOrders: (scope) => request('GET', `/me/orders?scope=${scope}`),
  getMyOrder: (orderId) => request('GET', `/me/orders/${orderId}`),
  cancelMyOrder: (orderId) => request('POST', `/me/orders/${orderId}/cancel`),
};
```

**④ mock 구현 예 (`src/api/mock/orders.ts`)**
```ts
import { db } from '@/src/mocks/db';
import { delay } from '@/src/mocks/delay';
import { ApiError } from '@/src/types/api';
import type { OrdersApi } from '../contracts';

export const mockOrdersApi: OrdersApi = {
  async cancelMyOrder(orderId) {
    await delay();
    const order = db.findOrder(orderId);
    if (!order) throw new ApiError('NOT_FOUND', '주문을 찾을 수 없어요', 404);
    if (order.status !== 'requested') {
      throw new ApiError('INVALID_STATUS_TRANSITION', '이미 사장님이 확인한 주문이에요. 매장에 전화해 주세요', 409);
    }
    return db.updateOrder(orderId, { status: 'cancelled' });
  },
  // createOrder, getMyOrders, getMyOrder ...
};
```

**⑤ 선택 (`src/api/index.ts`)**
```ts
import { env } from '@/src/config/env';
import { mockOrdersApi } from './mock/orders';
import { httpOrdersApi } from './http/orders';
// ...나머지도 같은 방식

export const api = {
  orders: env.useMock ? mockOrdersApi : httpOrdersApi,
  // auth, restaurants, owner, companyAdmin, admin
};
```

**⑥ 훅 예 (`src/hooks/useMyOrders.ts`)**
```ts
import { api } from '@/src/api';
import { useAsync } from './useAsync';
import type { OrderListScope } from '@/src/types/models';

export function useMyOrders(scope: OrderListScope) {
  // useAsync: { data, isLoading, isRefreshing, error, refresh } 반환
  return useAsync(() => api.orders.getMyOrders(scope), [scope]);
}
```

### 5.3 mock 사용 방식

| 항목 | 내용 |
|---|---|
| mock 데이터 위치 | `src/mocks/data/*.ts` (회사 3개, 직원 6명, 사장님 3명, 회사 관리자 3명, 총괄 관리자 1명, 음식점 3개, 메뉴 각 5개, 오늘 주문 4건) |
| 저장소 | `src/mocks/db.ts` — 앱 실행 중 메모리에 데이터를 들고 있음. 함수: `findOrder`, `listOrders`, `insertOrder`, `updateOrder` 등 |
| 데이터 유지 | Must: 메모리만 (앱을 완전히 다시 켜면 초기화) / Should: 변경할 때마다 AsyncStorage에 저장, 시작 시 불러옴 |
| 전환 env | `EXPO_PUBLIC_USE_MOCK=true` |
| 응답 지연 | `delay()`가 `EXPO_PUBLIC_MOCK_DELAY_MS`만큼 기다림 → 로딩 화면 확인 가능 |
| 오류 흉내 | mock도 7장의 오류 코드를 똑같이 던짐 (예: 이미 수락된 주문 취소 → `INVALID_STATUS_TRANSITION`) |
| 규칙 검사 | 상태 변경 가능 여부(6.3 표), 주문 마감, 품절은 mock에서도 검사 |
| 시연 방법 | 같은 폰에서 직원 로그인 → 주문 → 로그아웃 → 사장님 로그인 → 처리 → 다시 직원 로그인 → 상태 확인 |

**mock 테스트 계정 (가짜 값)**

| 유형 | 회사/아이디 | 사번 | 비밀번호 |
|---|---|---|---|
| 직원 | A회사 | 1001 | test1234 |
| 직원 | B회사 | 1001 | test1234 (A회사 1001과 다른 사람) |
| 사장님 | owner1 (건물 앞 백반집) | — | test1234 |
| 회사 관리자 | admin-a (A회사) | — | test1234 |
| 총괄 관리자 | superadmin | — | test1234 |

### 5.4 실제 서버로 전환하는 절차

1. 백엔드 개발자가 7장 API 명세대로 서버를 만든다.
2. 서버 응답이 6장 타입과 같은지 확인하고, 다르면 `src/types/models.ts`를 맞춘다.
3. `src/api/http/*.ts`의 함수가 7장 경로와 같은지 확인한다. (이미 다 만들어 두었다면 그대로)
4. `.env` 수정:
   ```bash
   EXPO_PUBLIC_USE_MOCK=false
   EXPO_PUBLIC_API_BASE_URL=https://실제서버주소/v1
   ```
5. `npx expo start --clear`로 다시 실행한다.
6. 로그인(API-02) → 음식점 목록(API-07) → 주문(API-10) 순서로 확인한다.
7. 문제가 생기면 `.env`의 `EXPO_PUBLIC_USE_MOCK=true`로 바로 되돌린다.

### 5.5 서버 연결 시 바뀌는 곳 / 바뀌지 않는 곳

| 구분 | 경로 | 비고 |
|---|---|---|
| 바뀜 | `.env` | `USE_MOCK=false`, 서버 주소 |
| 바뀜 | `src/api/http/*` | 서버 경로·응답에 맞게 채우기 |
| 바뀔 수 있음 | `src/api/client.ts` | 토큰 만료 처리, 재시도 추가 시 |
| 바뀔 수 있음 | `src/types/models.ts` | 서버 응답 필드명이 다를 때 |
| 바뀔 수 있음 | API-14 관련 코드 | 개발용 빌드로 푸시 붙일 때 |
| 안 바뀜 | `app/**` (모든 화면) | 훅만 쓰기 때문 |
| 안 바뀜 | `src/hooks/*` | `api` 객체만 부르기 때문 |
| 안 바뀜 | `src/components/*` | 데이터 출처를 모름 |
| 안 바뀜 | `src/contexts/*` | |
| 안 바뀜 | `src/constants/*`, `src/utils/*` | |
| 안 바뀜 | `src/api/contracts.ts`, `src/api/index.ts` | |
| 남겨둠 | `src/api/mock/*`, `src/mocks/*` | 서버 없이 화면 테스트할 때 계속 사용 |

### 5.6 이번 범위에서 하지 말 것
- 서버 만들기 (Node 서버, Supabase, Firebase 등 연결)
- DB 테이블 설계
- 외부 서비스 연동 (푸시 발송, 지도, 결제, 문자)
- 개발용 빌드(development build) 만들기, 앱스토어 배포
- 실제 직원 명단·개인정보 입력
- 화면 파일에서 mock 데이터를 직접 import 하기

---

## 6. 데이터 타입 정의

> DB 스키마가 아닙니다. 나중에 서버 응답과 맞출 **앱 쪽 타입 초안**입니다. (service-plan.md 7장 "다루는 정보" 기준)

### 6.1 도메인 타입 (`src/types/models.ts`)

```ts
// ── 공통 ─────────────────────────────
export type Id = string;
export type DateString = string;   // 'YYYY-MM-DD'      예: '2026-10-26'
export type TimeString = string;   // 'HH:mm' (24시간)  예: '12:10'
export type DateTimeString = string; // ISO 8601 + 한국 시간대  예: '2026-10-26T11:02:00+09:00'

// ── 회사 ─────────────────────────────
export interface Company {
  id: Id;
  name: string;          // 회사명
  location: string;      // 층/호수
  isActive: boolean;     // 사용 여부
}

// ── 사용자 ───────────────────────────
export type UserRole = 'employee' | 'owner' | 'company_admin' | 'super_admin';
export type AccountStatus = 'pending' | 'active' | 'disabled'; // 대기 / 승인(사용 중) / 비활성

export interface User {
  id: Id;
  role: UserRole;
  name: string;
  status: AccountStatus;
  companyId?: Id;        // 직원·회사 관리자
  companyName?: string;
  employeeNo?: string;   // 직원 사번 (회사 + 사번으로 구분)
  department?: string;
  loginId?: string;      // 사장님·관리자 아이디
  restaurantId?: Id;     // 사장님 소속 음식점
}

// ── 음식점 ───────────────────────────
export interface Restaurant {
  id: Id;
  name: string;
  location: string;
  phone: string;
  openTime: TimeString;
  closeTime: TimeString;
  orderDeadline: TimeString;   // 주문 마감 시간
  imageUrl?: string;           // 대표 사진
  isAcceptingOrders: boolean;  // 오늘 주문 받기 (F-21)
  isActive: boolean;           // 총괄 관리자 비활성화 (F-26)
}

// ── 메뉴 ─────────────────────────────
export interface Menu {
  id: Id;
  restaurantId: Id;
  name: string;
  price: number;         // 원, 정수
  imageUrl?: string;
  description?: string;
  isSoldOut: boolean;    // F-20
}

// ── 주문 ─────────────────────────────
export type OrderStatus =
  | 'requested'   // 주문 요청
  | 'accepted'    // 주문 수락
  | 'rejected'    // 주문 거절
  | 'cancelled'   // 주문 취소
  | 'preparing'   // 준비 중
  | 'ready'       // 준비 완료
  | 'served'      // 제공 완료
  | 'no_show';    // 노쇼

export type RejectReason = 'sold_out' | 'full' | 'time_unavailable' | 'other'; // 품절/만석/시간 불가/기타

export interface OrderItem {
  menuId: Id;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: Id;
  orderNo: string;               // 화면 표시용 '#0123'
  orderDate: DateString;
  arrivalTime: TimeString;       // 도착 예정 시간
  partySize: number;             // 식사 인원
  status: OrderStatus;
  rejectReason?: RejectReason;
  requestNote?: string;          // 요청사항 (F-07)
  items: OrderItem[];
  totalPrice: number;            // 참고용, 결제는 현장
  employee: { id: Id; name: string; companyName: string };
  restaurant: { id: Id; name: string };
  createdAt: DateTimeString;
}

export type OrderListScope = 'active' | 'past';        // 직원 내 주문 탭
export type OwnerOrderTab = 'new' | 'active' | 'done'; // 사장님 오늘의 주문 탭

// ── 입력값 ───────────────────────────
export interface CreateOrderInput {
  restaurantId: Id;
  arrivalTime: TimeString;
  partySize: number;
  requestNote?: string;
  items: { menuId: Id; quantity: number }[];
}

// ── 장바구니 (기기 안에서만) ───────────
export interface CartItem {
  menuId: Id;
  name: string;
  price: number;
  quantity: number;
}
export interface Cart {
  restaurantId: Id | null;
  restaurantName: string | null;
  items: CartItem[];
}

// ── 시간대별 요약 (F-18) ───────────────
export interface TimeSlotSummary {
  slotStart: TimeString;   // '12:00'
  slotEnd: TimeString;     // '12:10'
  totalPartySize: number;
  menus: { menuId: Id; menuName: string; quantity: number }[];
}

// ── 주문 현황 (F-27) ──────────────────
export interface AdminOrderStats {
  total: number;
  served: number;
  rejected: number;
  noShow: number;
}

// ── 가입 신청 (F-28, 2차) ─────────────
export interface SignupRequest {
  id: Id;
  companyId: Id;
  employeeNo: string;
  name: string;
  department: string;
  requestedAt: DateTimeString;
}
```

### 6.2 공통 응답·오류 타입 (`src/types/api.ts`)

```ts
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
  }
}
```

### 6.3 주문 상태 변경 규칙 (`src/constants/orderStatus.ts`에 정의)

| 현재 상태 | 바꿀 수 있는 상태 | 누가 | 관련 API |
|---|---|---|---|
| requested | accepted | 사장님 | API-17 |
| requested | rejected (사유 필수) | 사장님 | API-18 |
| requested | cancelled | 직원 | API-13 |
| accepted | preparing | 사장님 | API-19 |
| preparing | ready | 사장님 | API-19 |
| ready | served | 사장님 | API-19 |
| ready | no_show | 사장님 | API-19 |
| rejected / cancelled / served / no_show | 없음 (끝) | — | — |

> service-plan.md 5장 [가정]에 따라 노쇼는 "준비 완료" 이후에만 처리합니다.

**상태 묶음**
| 묶음 | 포함 상태 |
|---|---|
| 직원 "진행 중" (`active`) | requested, accepted, preparing, ready |
| 직원 "지난 주문" (`past`) | served, rejected, cancelled, no_show |
| 사장님 "신규" (`new`) | requested |
| 사장님 "진행 중" (`active`) | accepted, preparing, ready |
| 사장님 "완료" (`done`) | served, rejected, cancelled, no_show |

### 6.4 운영 규칙 상수 (`src/constants/rules.ts`)

| 상수 | 값 | 근거 |
|---|---|---|
| `DEFAULT_ORDER_DEADLINE` | `'11:30'` | service-plan.md [가정] |
| `ARRIVAL_SLOT_START` / `END` | `'11:30'` / `'13:00'` | [가정] |
| `ARRIVAL_SLOT_INTERVAL_MIN` | `10` | [가정] |
| `PARTY_SIZE_MIN` / `MAX` | `1` / `10` | [가정] |
| `REQUEST_NOTE_MAX` | `50` | design-spec.md [가정] |
| `MENU_NAME_MAX` / `MENU_DESC_MAX` | `20` / `40` | design-spec.md [가정] |
| `PASSWORD_MIN` | `8` | design-spec.md S-02 |

---

## 7. 기능별 API 명세

### 7.1 공통 규칙

| 항목 | 규칙 |
|---|---|
| Base URL | `env.apiBaseUrl` (예: `https://api.example.com/v1`). 아래 Path는 이 뒤에 붙음 |
| 요청/응답 형식 | JSON (`Content-Type: application/json`) |
| 날짜 | `YYYY-MM-DD` |
| 시간 | `HH:mm` (24시간) |
| 일시 | ISO 8601 + 한국 시간대 (`2026-10-26T11:02:00+09:00`) |
| 금액 | 원 단위 정수 |
| 인증 | 로그인 후 받은 토큰을 `Authorization: Bearer <토큰>` 헤더로 보냄 |
| 권한 | 서버가 토큰으로 사용자 유형을 확인. 다른 유형의 API 호출 시 `403 FORBIDDEN` |
| ID | 문자열 |

**성공 응답 구조**
```json
{ "success": true, "data": { } }
```

**오류 응답 구조**
```json
{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "사번 또는 비밀번호가 맞지 않아요" } }
```

**오류 코드 표**

| HTTP | code | 의미 | 기본 화면 문구 |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | 입력값이 규칙에 안 맞음 | 입력 내용을 확인해 주세요 |
| 401 | `UNAUTHORIZED` | 토큰 없음·만료 | 다시 로그인해 주세요 |
| 401 | `INVALID_CREDENTIALS` | 아이디(사번)·비밀번호 불일치 | 사번 또는 비밀번호가 맞지 않아요 |
| 403 | `FORBIDDEN` | 권한 없음 | 접근 권한이 없어요 |
| 403 | `ACCOUNT_DISABLED` | 비활성 계정 | 사용이 중지된 계정이에요. 회사 담당자에게 문의해 주세요 |
| 404 | `NOT_FOUND` | 대상 없음 | 찾을 수 없어요 |
| 409 | `DUPLICATE` | 사번·아이디 중복 | 이미 등록된 값이에요 |
| 409 | `INVALID_STATUS_TRANSITION` | 바꿀 수 없는 상태 | 이미 처리된 주문이에요 |
| 409 | `ORDER_CLOSED` | 주문 마감 시간 지남 | 오늘 주문이 마감됐어요 |
| 409 | `RESTAURANT_NOT_ACCEPTING` | 음식점이 오늘 주문 안 받음 | 오늘은 주문을 받지 않는 음식점이에요 |
| 409 | `MENU_SOLD_OUT` | 품절 메뉴 포함 | 품절된 메뉴가 있어요 |
| 500 | `SERVER_ERROR` | 서버 오류 | 잠시 후 다시 시도해 주세요 |
| — | `NETWORK_ERROR` | 서버 응답 없음 (앱이 만드는 코드) | 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요 |

> 아래 명세의 "오류"에는 해당 API에서 생길 수 있는 대표 오류만 적습니다. `UNAUTHORIZED`, `FORBIDDEN`, `SERVER_ERROR`, `NETWORK_ERROR`는 인증이 필요한 모든 API에서 생길 수 있습니다.

---

### F-01 로그인 (회사 선택 + 사번 + 비밀번호) / 로그아웃 — Must

#### API-01 회사 목록 조회 (로그인용)
| 항목 | 값 |
|---|---|
| 기능 ID | F-01 |
| Method / Path | `GET /companies` |
| 인증 | 불필요 |
| 호출 화면 | S-01 |
| 이번 구현 | mock |

요청: 없음
성공:
```json
{ "success": true, "data": [
  { "id": "c1", "name": "A회사", "location": "5층 501호", "isActive": true },
  { "id": "c2", "name": "B회사", "location": "7층 701호", "isActive": true }
] }
```
- 사용 중(`isActive: true`)인 회사만 반환
오류: `SERVER_ERROR`

#### API-02 직원 로그인
| 항목 | 값 |
|---|---|
| 기능 ID | F-01 |
| Method / Path | `POST /auth/employee-login` |
| 인증 | 불필요 |
| 호출 화면 | S-01 |
| 이번 구현 | mock |

요청:
```json
{ "companyId": "c1", "employeeNo": "1001", "password": "test1234" }
```
성공:
```json
{ "success": true, "data": {
  "token": "mock-token-u1",
  "mustChangePassword": false,
  "user": { "id": "u1", "role": "employee", "name": "김대리", "status": "active",
            "companyId": "c1", "companyName": "A회사", "employeeNo": "1001", "department": "재무팀" }
} }
```
오류:
```json
{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "사번 또는 비밀번호가 맞지 않아요" } }
```
- `ACCOUNT_DISABLED` (403), `VALIDATION_ERROR` (400, 빈 값)

#### API-04 로그아웃
| 항목 | 값 |
|---|---|
| 기능 ID | F-01, F-13 |
| Method / Path | `POST /auth/logout` |
| 인증 | 필요 |
| 호출 화면 | S-08, S-14, S-15, S-17 |
| 이번 구현 | mock (앱에서 토큰 삭제가 핵심) |

요청: 없음
성공:
```json
{ "success": true, "data": null }
```
- 응답과 상관없이 앱은 `tokenStorage.clear()` 후 S-01로 이동
오류: `UNAUTHORIZED` (이미 만료 — 앱은 무시하고 로그아웃 처리)

#### API-05 내 정보 조회 (로그인 유지 확인)
| 항목 | 값 |
|---|---|
| 기능 ID | F-01, F-13 |
| Method / Path | `GET /me` |
| 인증 | 필요 |
| 호출 화면 | 앱 시작(`app/index.tsx`), S-08 |
| 이번 구현 | mock |

요청: 없음
성공:
```json
{ "success": true, "data": { "id": "u1", "role": "employee", "name": "김대리", "status": "active",
  "companyId": "c1", "companyName": "A회사", "employeeNo": "1001", "department": "재무팀" } }
```
오류:
```json
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "다시 로그인해 주세요" } }
```
- 앱 시작 시 이 오류가 나면 토큰 삭제 후 S-01로 이동

---

### F-02 첫 로그인 시 비밀번호 변경 — Could

#### API-06 비밀번호 변경
| 항목 | 값 |
|---|---|
| 기능 ID | F-02 |
| Method / Path | `PATCH /me/password` |
| 인증 | 필요 |
| 호출 화면 | S-02 |
| 이번 구현 | mock |

요청:
```json
{ "newPassword": "newpass1234" }
```
성공:
```json
{ "success": true, "data": null }
```
오류:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "8자 이상 입력해 주세요" } }
```
- "새 비밀번호 확인" 일치 검사는 앱에서만 함

---

### F-03 음식점 목록 — Must

#### API-07 음식점 목록 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-03, F-21, F-22 |
| Method / Path | `GET /restaurants` |
| 인증 | 필요 (직원) |
| 호출 화면 | S-03 |
| 이번 구현 | mock |

요청: 없음
성공:
```json
{ "success": true, "data": [
  { "id": "r1", "name": "건물 앞 백반집", "location": "건물 1층", "phone": "02-123-4567",
    "openTime": "11:00", "closeTime": "21:00", "orderDeadline": "11:30",
    "imageUrl": "https://example.com/r1.jpg", "isAcceptingOrders": true, "isActive": true }
] }
```
- `isActive: false` 음식점은 반환하지 않음
- "영업 중" 배지와 "오늘 주문 마감" 배지는 앱이 `isAcceptingOrders`, `orderDeadline`, 현재 시각으로 계산
오류: `UNAUTHORIZED`

---

### F-04 음식점별 메뉴 보기 — Must

#### API-08 음식점 상세 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-04, F-06 |
| Method / Path | `GET /restaurants/{restaurantId}` |
| 인증 | 필요 (직원) |
| 호출 화면 | S-04, S-05 (마감 시간 확인) |
| 이번 구현 | mock |

요청: 경로 파라미터 `restaurantId`
성공: API-07의 음식점 객체 1개
```json
{ "success": true, "data": { "id": "r1", "name": "건물 앞 백반집", "location": "건물 1층", "phone": "02-123-4567",
  "openTime": "11:00", "closeTime": "21:00", "orderDeadline": "11:30", "isAcceptingOrders": true, "isActive": true } }
```
오류:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "음식점을 찾을 수 없어요" } }
```

#### API-09 음식점 메뉴 목록 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-04, F-20 |
| Method / Path | `GET /restaurants/{restaurantId}/menus` |
| 인증 | 필요 (직원) |
| 호출 화면 | S-04 |
| 이번 구현 | mock |

요청: 경로 파라미터 `restaurantId`
성공:
```json
{ "success": true, "data": [
  { "id": "m1", "restaurantId": "r1", "name": "김치찌개", "price": 9000,
    "imageUrl": "https://example.com/m1.jpg", "description": "돼지고기 듬뿍", "isSoldOut": false },
  { "id": "m3", "restaurantId": "r1", "name": "제육볶음", "price": 10000, "isSoldOut": true }
] }
```
오류: `NOT_FOUND`

---

### F-05 메뉴 담기 및 수량 지정 (장바구니) — Must

**API 없음** — 장바구니는 주문 요청 전까지 기기 안에만 있는 임시 정보입니다. `CartContext`가 관리하고, 주문 요청 때 API-10 바디의 `items`로 보냅니다.
- 이번 구현: 기기 내 상태 (Must: 메모리 / Should: AsyncStorage)
- 한 번에 한 음식점 규칙은 `CartContext`에서 검사 [가정]

---

### F-06 도착 예정 시간 선택 + 식사 인원 입력 — Must

**별도 API 없음** — 도착 시간 칩 목록은 앱이 계산합니다 (`src/utils/timeSlots.ts`: 11:30~13:00, 10분 단위, 현재 시각 이전은 비활성). 마감 시간은 API-08 응답의 `orderDeadline`을 씁니다. 선택한 값은 API-10 바디의 `arrivalTime`, `partySize`로 보냅니다.
- 이번 구현: 앱 내 계산

---

### F-07 요청사항 입력 — Should

**별도 API 없음** — API-10 바디의 `requestNote` 필드로 보내고, API-16 응답으로 사장님이 봅니다.

---

### F-08 주문 요청 — Must

#### API-10 주문 생성
| 항목 | 값 |
|---|---|
| 기능 ID | F-08 (F-05, F-06, F-07 값 포함) |
| Method / Path | `POST /orders` |
| 인증 | 필요 (직원) |
| 호출 화면 | S-05 |
| 이번 구현 | mock |

요청:
```json
{
  "restaurantId": "r1",
  "arrivalTime": "12:10",
  "partySize": 2,
  "requestNote": "덜 맵게 해주세요",
  "items": [ { "menuId": "m1", "quantity": 2 }, { "menuId": "m2", "quantity": 1 } ]
}
```
성공 (`201`):
```json
{ "success": true, "data": {
  "id": "o123", "orderNo": "#0123", "orderDate": "2026-10-26", "arrivalTime": "12:10", "partySize": 2,
  "status": "requested", "requestNote": "덜 맵게 해주세요",
  "items": [ { "menuId": "m1", "menuName": "김치찌개", "quantity": 2, "unitPrice": 9000 },
             { "menuId": "m2", "menuName": "된장찌개", "quantity": 1, "unitPrice": 8000 } ],
  "totalPrice": 26000,
  "employee": { "id": "u1", "name": "김대리", "companyName": "A회사" },
  "restaurant": { "id": "r1", "name": "건물 앞 백반집" },
  "createdAt": "2026-10-26T11:02:00+09:00"
} }
```
- 금액(`unitPrice`, `totalPrice`)은 서버가 메뉴 가격으로 다시 계산 (앱이 보낸 금액을 믿지 않음)

오류:
```json
{ "success": false, "error": { "code": "ORDER_CLOSED", "message": "오늘 주문이 마감됐어요" } }
```
- `MENU_SOLD_OUT` (409), `RESTAURANT_NOT_ACCEPTING` (409), `VALIDATION_ERROR` (400: 도착 시간 없음, 인원 범위 밖, 메뉴 0개, 요청사항 50자 초과)

#### API-12 내 주문 단건 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-08, F-10 |
| Method / Path | `GET /me/orders/{orderId}` |
| 인증 | 필요 (직원, 본인 주문만) |
| 호출 화면 | S-06 |
| 이번 구현 | mock |

요청: 경로 파라미터 `orderId`
성공: API-10 응답의 주문 객체와 같음
오류:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "주문을 찾을 수 없어요" } }
```

---

### F-09 주문 취소 — Should

#### API-13 내 주문 취소
| 항목 | 값 |
|---|---|
| 기능 ID | F-09 |
| Method / Path | `POST /me/orders/{orderId}/cancel` |
| 인증 | 필요 (직원, 본인 주문만) |
| 호출 화면 | S-07 |
| 이번 구현 | mock |

요청: 경로 파라미터 `orderId`, 바디 없음
성공: 상태가 `cancelled`로 바뀐 주문 객체
```json
{ "success": true, "data": { "id": "o124", "orderNo": "#0124", "status": "cancelled" } }
```
(실제 응답은 주문 객체 전체. 위는 줄인 예시)
오류:
```json
{ "success": false, "error": { "code": "INVALID_STATUS_TRANSITION", "message": "이미 사장님이 확인한 주문이에요. 매장에 전화해 주세요" } }
```

---

### F-10 내 주문 상태 실시간 확인 — Must

#### API-11 내 주문 목록 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-10, F-12 |
| Method / Path | `GET /me/orders?scope=active` 또는 `?scope=past` |
| 인증 | 필요 (직원) |
| 호출 화면 | S-07 |
| 이번 구현 | mock |

요청: 쿼리 `scope` = `active`(진행 중) | `past`(지난 주문)
성공:
```json
{ "success": true, "data": [
  { "id": "o123", "orderNo": "#0123", "orderDate": "2026-10-26", "arrivalTime": "12:10", "partySize": 2,
    "status": "accepted", "items": [ { "menuId": "m1", "menuName": "김치찌개", "quantity": 2, "unitPrice": 9000 } ],
    "totalPrice": 18000, "employee": { "id": "u1", "name": "김대리", "companyName": "A회사" },
    "restaurant": { "id": "r1", "name": "건물 앞 백반집" }, "createdAt": "2026-10-26T11:02:00+09:00" }
] }
```
- 정렬: `active`는 도착 시간 빠른 순, `past`는 최신 순
- "실시간"은 [가정] **화면에 들어올 때 + 당겨서 새로고침** 할 때 이 API를 다시 부르는 방식
오류:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "scope 값이 올바르지 않아요" } }
```

---

### F-11 주문 수락·거절·준비 완료 알림 — Should (Expo Go 제약)

#### API-14 푸시 토큰 등록
| 항목 | 값 |
|---|---|
| 기능 ID | F-11, F-14 |
| Method / Path | `PUT /me/push-token` |
| 인증 | 필요 |
| 호출 화면 | S-08 (알림 설정), 로그인 직후 |
| 이번 구현 | **이번 범위 제외** (Expo Go에서 원격 푸시 토큰을 받을 수 없음) |

요청 (계약 메모):
```json
{ "pushToken": "ExponentPushToken[xxxx]", "enabled": true }
```
성공:
```json
{ "success": true, "data": null }
```
오류: `VALIDATION_ERROR`
- **대체 구현**: S-08 알림 스위치는 화면만 만들고 비활성 + "준비 중인 기능" 표시. 상태 확인은 S-07에서 API-11로.

---

### F-12 지난 주문 내역 — Should
→ **API-11** (`scope=past`) 사용. 별도 API 없음.

---

### F-13 로그인 / 로그아웃 (로그인 유지) — Must

#### API-03 아이디 로그인 (사장님·회사 관리자·총괄 관리자)
| 항목 | 값 |
|---|---|
| 기능 ID | F-13 |
| Method / Path | `POST /auth/login` |
| 인증 | 불필요 |
| 호출 화면 | S-01 ("음식점·관리자" 탭) |
| 이번 구현 | mock |

요청:
```json
{ "loginId": "owner1", "password": "test1234" }
```
성공:
```json
{ "success": true, "data": {
  "token": "mock-token-o1",
  "mustChangePassword": false,
  "user": { "id": "o1", "role": "owner", "name": "박사장", "status": "active", "loginId": "owner1", "restaurantId": "r1" }
} }
```
- 응답의 `role`로 첫 화면 결정: `owner` → S-09, `company_admin` → S-15, `super_admin` → S-17
- [가정] 회사 관리자·총괄 관리자도 이 API로 로그인 (service-plan.md에 별도 기능 없음)

오류:
```json
{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "아이디 또는 비밀번호가 맞지 않아요" } }
```
- `ACCOUNT_DISABLED` (403)

로그아웃: **API-04**, 로그인 유지 확인: **API-05**

---

### F-14 새 주문 푸시 알림 + 알림음 — Should (Expo Go 제약)
→ **API-14** (이번 범위 제외)
- **대체 구현**: S-09에서 **API-15**를 화면 진입 시와 당겨서 새로고침 때 호출. 신규 탭 개수 배지 + 신규 카드 강조로 새 주문을 알아보게 함.

---

### F-15 오늘 주문 목록 (도착 시간순) — Must

#### API-15 사장님 오늘 주문 목록
| 항목 | 값 |
|---|---|
| 기능 ID | F-15, F-14(대체) |
| Method / Path | `GET /owner/orders?date=2026-10-26&tab=new` |
| 인증 | 필요 (사장님, 본인 음식점만) |
| 호출 화면 | S-09 |
| 이번 구현 | mock |

요청: 쿼리 `date`(생략 시 오늘), `tab` = `new` | `active` | `done`
성공:
```json
{ "success": true, "data": {
  "counts": { "new": 3, "active": 5, "done": 2 },
  "orders": [
    { "id": "o123", "orderNo": "#0123", "orderDate": "2026-10-26", "arrivalTime": "12:00", "partySize": 3,
      "status": "requested", "items": [ { "menuId": "m1", "menuName": "김치찌개", "quantity": 2, "unitPrice": 9000 } ],
      "totalPrice": 18000, "employee": { "id": "u1", "name": "김대리", "companyName": "A회사" },
      "restaurant": { "id": "r1", "name": "건물 앞 백반집" }, "createdAt": "2026-10-26T10:41:00+09:00" }
  ]
} }
```
- `orders`는 도착 시간 빠른 순
- `counts`는 상단 탭 개수 배지용
오류: `VALIDATION_ERROR` (tab 값 오류)

---

### F-16 주문 수락 / 거절 (사유 선택형 버튼) — Must

#### API-16 사장님 주문 상세
| 항목 | 값 |
|---|---|
| 기능 ID | F-16, F-17, F-07 |
| Method / Path | `GET /owner/orders/{orderId}` |
| 인증 | 필요 (사장님, 본인 음식점 주문만) |
| 호출 화면 | S-10 |
| 이번 구현 | mock |

요청: 경로 파라미터 `orderId`
성공: 주문 객체 1개 (API-10 응답과 같은 모양, `requestNote` 포함)
오류: `NOT_FOUND`, `FORBIDDEN` (다른 음식점 주문)

#### API-17 주문 수락
| 항목 | 값 |
|---|---|
| 기능 ID | F-16 |
| Method / Path | `POST /owner/orders/{orderId}/accept` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-10 |
| 이번 구현 | mock |

요청: 바디 없음
성공: 상태가 `accepted`로 바뀐 주문 객체
오류:
```json
{ "success": false, "error": { "code": "INVALID_STATUS_TRANSITION", "message": "직원이 취소한 주문이에요" } }
```

#### API-18 주문 거절
| 항목 | 값 |
|---|---|
| 기능 ID | F-16 |
| Method / Path | `POST /owner/orders/{orderId}/reject` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-10 (거절 사유 바텀시트) |
| 이번 구현 | mock |

요청:
```json
{ "reason": "sold_out" }
```
- `reason` = `sold_out`(품절) | `full`(만석) | `time_unavailable`(시간 불가) | `other`(기타)

성공: 상태 `rejected`, `rejectReason` 포함된 주문 객체
오류:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "거절 사유를 선택해 주세요" } }
```
- `INVALID_STATUS_TRANSITION` (409)

---

### F-17 상태 변경 (준비 중 → 준비 완료 → 제공 완료 / 노쇼) — Must

#### API-19 주문 상태 변경
| 항목 | 값 |
|---|---|
| 기능 ID | F-17 |
| Method / Path | `PATCH /owner/orders/{orderId}/status` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-10 |
| 이번 구현 | mock |

요청:
```json
{ "status": "preparing" }
```
- 허용 값: `preparing` | `ready` | `served` | `no_show` (6.3 표의 순서만 허용)

성공: 상태가 바뀐 주문 객체
오류:
```json
{ "success": false, "error": { "code": "INVALID_STATUS_TRANSITION", "message": "이미 처리된 주문이에요" } }
```

---

### F-18 시간대별 요약 — Should

#### API-20 시간대별 요약
| 항목 | 값 |
|---|---|
| 기능 ID | F-18 |
| Method / Path | `GET /owner/orders/summary?date=2026-10-26` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-11 |
| 이번 구현 | mock |

요청: 쿼리 `date`(생략 시 오늘)
성공:
```json
{ "success": true, "data": [
  { "slotStart": "12:00", "slotEnd": "12:10", "totalPartySize": 6,
    "menus": [ { "menuId": "m1", "menuName": "김치찌개", "quantity": 5 }, { "menuId": "m2", "menuName": "된장찌개", "quantity": 3 } ] }
] }
```
- [가정] 수락 이후 상태(accepted, preparing, ready, served)만 집계
오류: `VALIDATION_ERROR` (날짜 형식)

---

### F-19 메뉴 등록·수정·삭제 — Should

#### API-21 내 음식점 메뉴 목록
| 항목 | 값 |
|---|---|
| 기능 ID | F-19, F-20 |
| Method / Path | `GET /owner/menus` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-12, S-13(수정 시 기존 값) |
| 이번 구현 | mock |

요청: 없음 (토큰으로 음식점 판단)
성공: 메뉴 배열 (API-09와 같은 모양)
오류: `UNAUTHORIZED`

#### API-22 메뉴 등록
| 항목 | 값 |
|---|---|
| 기능 ID | F-19 |
| Method / Path | `POST /owner/menus` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-13 |
| 이번 구현 | mock |

요청:
```json
{ "name": "김치찌개", "price": 9000, "description": "돼지고기 듬뿍", "imageUrl": "file:///.../photo.jpg" }
```
성공 (`201`): 생성된 메뉴 객체 (`isSoldOut: false`)
오류:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "메뉴명을 입력해 주세요" } }
```
- 가격이 숫자가 아니거나 0 이하, 메뉴명 20자 초과, 설명 40자 초과도 `VALIDATION_ERROR`

#### API-23 메뉴 수정 (품절 포함)
| 항목 | 값 |
|---|---|
| 기능 ID | F-19, F-20 |
| Method / Path | `PATCH /owner/menus/{menuId}` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-13, S-12(품절 스위치) |
| 이번 구현 | mock |

요청 (바꿀 필드만):
```json
{ "isSoldOut": true }
```
성공: 수정된 메뉴 객체
오류: `NOT_FOUND`, `VALIDATION_ERROR`

#### API-24 메뉴 삭제
| 항목 | 값 |
|---|---|
| 기능 ID | F-19 |
| Method / Path | `DELETE /owner/menus/{menuId}` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-13 |
| 이번 구현 | mock |

요청: 경로 파라미터 `menuId`
성공:
```json
{ "success": true, "data": null }
```
오류:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "메뉴를 찾을 수 없어요" } }
```

#### API-25 이미지 업로드
| 항목 | 값 |
|---|---|
| 기능 ID | F-19 |
| Method / Path | `POST /uploads/images` (`multipart/form-data`) |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-13 |
| 이번 구현 | mock — 업로드하지 않고 `expo-image-picker`가 준 폰 사진 주소(URI)를 그대로 `imageUrl`로 사용 |

요청: 폼 필드 `file` (이미지)
성공:
```json
{ "success": true, "data": { "imageUrl": "https://cdn.example.com/menus/m1.jpg" } }
```
오류: `VALIDATION_ERROR` (이미지 아님, 용량 초과)
- 폰 사진 주소는 그 폰에서만 보임. 실제 공유는 서버 연결 후 가능

---

### F-20 메뉴 품절 처리 (당일 토글) — Should
→ **API-23** (`{ "isSoldOut": true | false }`). 직원 쪽은 **API-09** 응답의 `isSoldOut`으로 표시. 별도 API 없음.

---

### F-21 오늘 주문 받기 on/off — Could

#### API-26 내 가게 정보 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-21, F-22 |
| Method / Path | `GET /owner/restaurant` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-14, S-09(헤더 음식점명) |
| 이번 구현 | mock |

요청: 없음
성공: 음식점 객체 (API-08과 같은 모양)
오류: `UNAUTHORIZED`

#### API-27 내 가게 정보 수정
| 항목 | 값 |
|---|---|
| 기능 ID | F-21, F-22 |
| Method / Path | `PATCH /owner/restaurant` |
| 인증 | 필요 (사장님) |
| 호출 화면 | S-14 |
| 이번 구현 | mock |

요청 (바꿀 필드만):
```json
{ "isAcceptingOrders": false }
```
성공: 수정된 음식점 객체
오류: `VALIDATION_ERROR`

---

### F-22 가게 정보 설정 (영업시간, 주문 마감 시간) — Could
→ **API-26**, **API-27** (`openTime`, `closeTime`, `orderDeadline`)
```json
{ "openTime": "11:00", "closeTime": "21:00", "orderDeadline": "11:30" }
```
오류: `VALIDATION_ERROR` — "11:30처럼 입력해 주세요"

---

### F-23 자기 회사 직원 명단 등록 — Could

#### API-28 직원 명단 조회
| 항목 | 값 |
|---|---|
| 기능 ID | F-23, F-24 |
| Method / Path | `GET /company-admin/employees?query=김` |
| 인증 | 필요 (회사 관리자, 자기 회사만) |
| 호출 화면 | S-15 |
| 이번 구현 | mock |

요청: 쿼리 `query`(선택, 이름·사번 검색)
성공:
```json
{ "success": true, "data": [
  { "id": "u1", "role": "employee", "name": "김대리", "status": "active",
    "companyId": "c1", "companyName": "A회사", "employeeNo": "1001", "department": "재무팀" }
] }
```
오류: `FORBIDDEN`

#### API-29 직원 추가
| 항목 | 값 |
|---|---|
| 기능 ID | F-23 |
| Method / Path | `POST /company-admin/employees` |
| 인증 | 필요 (회사 관리자) |
| 호출 화면 | S-15 (직원 추가 바텀시트) |
| 이번 구현 | mock |

요청:
```json
{ "employeeNo": "1003", "name": "최사원", "department": "개발팀" }
```
성공 (`201`): 생성된 사용자 객체 (`status: "active"`)
- [가정] 초기 비밀번호는 서버가 정함 (mock: `test1234`). 첫 로그인 시 `mustChangePassword: true`

오류:
```json
{ "success": false, "error": { "code": "DUPLICATE", "message": "이미 등록된 사번이에요" } }
```
- 엑셀 업로드 API는 이번 범위 제외 (직접 입력만)

---

### F-24 퇴사자 계정 비활성화 — Could

#### API-30 직원 상태 변경
| 항목 | 값 |
|---|---|
| 기능 ID | F-24 |
| Method / Path | `PATCH /company-admin/employees/{userId}` |
| 인증 | 필요 (회사 관리자) |
| 호출 화면 | S-15 |
| 이번 구현 | mock |

요청:
```json
{ "status": "disabled" }
```
- `disabled`(비활성화) | `active`(다시 사용)

성공: 수정된 사용자 객체
오류: `NOT_FOUND`, `FORBIDDEN` (다른 회사 직원)

---

### F-25 입주 회사 등록 및 회사 관리자 계정 발급 — Could

#### API-31 회사 목록 조회 (관리용)
| 항목 | 값 |
|---|---|
| 기능 ID | F-25 |
| Method / Path | `GET /admin/companies` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-17, S-19(회사 필터) |
| 이번 구현 | mock |

요청: 없음
성공: 회사 배열 (사용 중지 회사 포함)
오류: `FORBIDDEN`

#### API-32 회사 등록
| 항목 | 값 |
|---|---|
| 기능 ID | F-25 |
| Method / Path | `POST /admin/companies` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-17 (회사 등록 바텀시트) |
| 이번 구현 | mock |

요청:
```json
{ "name": "C회사", "location": "9층 901호", "adminLoginId": "admin-c", "adminTempPassword": "temp1234" }
```
성공 (`201`):
```json
{ "success": true, "data": { "company": { "id": "c3", "name": "C회사", "location": "9층 901호", "isActive": true },
  "admin": { "id": "a3", "role": "company_admin", "name": "C회사 관리자", "status": "active", "loginId": "admin-c", "companyId": "c3" } } }
```
오류:
```json
{ "success": false, "error": { "code": "DUPLICATE", "message": "이미 있는 아이디예요" } }
```

#### API-33 회사 수정 (사용 중지 / 다시 사용)
| 항목 | 값 |
|---|---|
| 기능 ID | F-25 |
| Method / Path | `PATCH /admin/companies/{companyId}` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-17 |
| 이번 구현 | mock |

요청:
```json
{ "isActive": false }
```
성공: 수정된 회사 객체
오류: `NOT_FOUND`

---

### F-26 음식점 등록 및 사장님 계정 발급 — Could

#### API-34 음식점 목록 조회 (관리용)
| 항목 | 값 |
|---|---|
| 기능 ID | F-26 |
| Method / Path | `GET /admin/restaurants` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-18, S-19(음식점 필터) |
| 이번 구현 | mock |

요청: 없음
성공: 음식점 배열 (비활성 포함)
오류: `FORBIDDEN`

#### API-35 음식점 등록
| 항목 | 값 |
|---|---|
| 기능 ID | F-26 |
| Method / Path | `POST /admin/restaurants` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-18 (음식점 등록 바텀시트) |
| 이번 구현 | mock |

요청:
```json
{ "name": "국수나무", "location": "건물 B1", "phone": "02-222-3333",
  "ownerLoginId": "owner2", "ownerTempPassword": "temp1234" }
```
성공 (`201`):
```json
{ "success": true, "data": { "restaurant": { "id": "r2", "name": "국수나무", "location": "건물 B1", "phone": "02-222-3333",
  "openTime": "11:00", "closeTime": "21:00", "orderDeadline": "11:30", "isAcceptingOrders": true, "isActive": true },
  "owner": { "id": "o2", "role": "owner", "name": "국수나무 사장님", "status": "active", "loginId": "owner2", "restaurantId": "r2" } } }
```
- [가정] 영업시간·마감 시간은 기본값으로 만들고 사장님이 S-14에서 수정

오류: `DUPLICATE`, `VALIDATION_ERROR`

#### API-36 음식점 수정 (비활성화)
| 항목 | 값 |
|---|---|
| 기능 ID | F-26 |
| Method / Path | `PATCH /admin/restaurants/{restaurantId}` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-18 |
| 이번 구현 | mock |

요청:
```json
{ "isActive": false }
```
성공: 수정된 음식점 객체
오류: `NOT_FOUND`

---

### F-27 전체 주문 현황 조회 — Could

#### API-37 전체 주문 현황
| 항목 | 값 |
|---|---|
| 기능 ID | F-27 |
| Method / Path | `GET /admin/orders?date=2026-10-26&restaurantId=r1&companyId=c1` |
| 인증 | 필요 (총괄 관리자) |
| 호출 화면 | S-19 |
| 이번 구현 | mock |

요청: 쿼리 `date`(필수), `restaurantId`(선택), `companyId`(선택)
성공:
```json
{ "success": true, "data": {
  "stats": { "total": 42, "served": 35, "rejected": 3, "noShow": 1 },
  "orders": [ { "id": "o123", "orderNo": "#0123", "arrivalTime": "12:00", "status": "served",
                "employee": { "id": "u1", "name": "김대리", "companyName": "A회사" },
                "restaurant": { "id": "r1", "name": "건물 앞 백반집" } } ]
} }
```
(`orders`의 실제 항목은 주문 객체 전체. 위는 줄인 예시)
오류: `VALIDATION_ERROR` (날짜 형식)

---

### F-28 가입 후 승인 방식 전환 — Could (2차)

#### API-38 직원 가입 신청
| 항목 | 값 |
|---|---|
| 기능 ID | F-28 |
| Method / Path | `POST /auth/signup` |
| 인증 | 불필요 |
| 호출 화면 | 가입 화면 (service-plan.md [가정] 추후 추가, 이번 화면 없음) |
| 이번 구현 | **이번 범위 제외** |

요청:
```json
{ "companyId": "c1", "employeeNo": "1003", "name": "최사원", "department": "개발팀", "password": "pass1234" }
```
성공 (`201`): `status: "pending"` 사용자 객체
오류: `DUPLICATE`, `VALIDATION_ERROR`

#### API-39 가입 신청 목록
| 항목 | 값 |
|---|---|
| 기능 ID | F-28 |
| Method / Path | `GET /company-admin/signup-requests` |
| 인증 | 필요 (회사 관리자) |
| 호출 화면 | S-16 |
| 이번 구현 | mock (Could 단계에서 화면 확인용) |

성공:
```json
{ "success": true, "data": [ { "id": "s1", "companyId": "c1", "employeeNo": "1003", "name": "최사원",
  "department": "개발팀", "requestedAt": "2026-10-25T09:00:00+09:00" } ] }
```
오류: `FORBIDDEN`

#### API-40 가입 신청 승인·거절
| 항목 | 값 |
|---|---|
| 기능 ID | F-28 |
| Method / Path | `POST /company-admin/signup-requests/{requestId}/decision` |
| 인증 | 필요 (회사 관리자) |
| 호출 화면 | S-16 |
| 이번 구현 | mock (Could 단계) |

요청:
```json
{ "decision": "approve" }
```
- `approve` | `reject`

성공:
```json
{ "success": true, "data": null }
```
오류: `NOT_FOUND`, `INVALID_STATUS_TRANSITION` (이미 처리됨)

---

### F-29 ~ F-35 (2차 버전, 화면 미정) — Could

| 기능 ID | 기능명 | API | 사유 / 예상 API 메모 |
|---|---|---|---|
| F-29 | 음식점별 시간대 주문 한도 | **API 없음 (이번 범위 제외)** | 화면 미정. 2차 때 `PATCH /owner/restaurant`에 한도 필드 추가 + API-10에 `SLOT_FULL` 오류 추가 예상 |
| F-30 | 자주 먹는 메뉴 즐겨찾기 / 재주문 | **API 없음 (이번 범위 제외)** | 화면 미정. 즐겨찾기 조회·추가·삭제 API 예상 |
| F-31 | 단체 주문 | **API 없음 (이번 범위 제외)** | 화면 미정. API-10 확장 예상 |
| F-32 | 노쇼 누적 시 주문 제한 | **API 없음 (이번 범위 제외)** | 화면 미정. 서버 규칙 + API-10에 제한 오류 추가 예상 |
| F-33 | 메뉴 옵션 | **API 없음 (이번 범위 제외)** | 화면 미정. 메뉴·주문 타입에 옵션 필드 추가 예상 |
| F-34 | 공지사항 | **API 없음 (이번 범위 제외)** | 화면 미정. 공지 목록·등록 API 예상 |
| F-35 | 월별 통계 | **API 없음 (이번 범위 제외)** | 화면 미정. 월 단위 통계 API 예상 |

---

### 7.2 전체 API 목록 요약

| API ID | 기능 ID | Method | Path | 이번 구현 |
|---|---|---|---|---|
| API-01 | F-01 | GET | `/companies` | mock |
| API-02 | F-01 | POST | `/auth/employee-login` | mock |
| API-03 | F-13 | POST | `/auth/login` | mock |
| API-04 | F-01, F-13 | POST | `/auth/logout` | mock |
| API-05 | F-01, F-13 | GET | `/me` | mock |
| API-06 | F-02 | PATCH | `/me/password` | mock |
| API-07 | F-03, F-21, F-22 | GET | `/restaurants` | mock |
| API-08 | F-04, F-06 | GET | `/restaurants/{restaurantId}` | mock |
| API-09 | F-04, F-20 | GET | `/restaurants/{restaurantId}/menus` | mock |
| API-10 | F-08 (F-05, F-06, F-07) | POST | `/orders` | mock |
| API-11 | F-10, F-12 | GET | `/me/orders?scope=` | mock |
| API-12 | F-08, F-10 | GET | `/me/orders/{orderId}` | mock |
| API-13 | F-09 | POST | `/me/orders/{orderId}/cancel` | mock |
| API-14 | F-11, F-14 | PUT | `/me/push-token` | 이번 범위 제외 |
| API-15 | F-15, F-14 | GET | `/owner/orders?date=&tab=` | mock |
| API-16 | F-16, F-17, F-07 | GET | `/owner/orders/{orderId}` | mock |
| API-17 | F-16 | POST | `/owner/orders/{orderId}/accept` | mock |
| API-18 | F-16 | POST | `/owner/orders/{orderId}/reject` | mock |
| API-19 | F-17 | PATCH | `/owner/orders/{orderId}/status` | mock |
| API-20 | F-18 | GET | `/owner/orders/summary?date=` | mock |
| API-21 | F-19, F-20 | GET | `/owner/menus` | mock |
| API-22 | F-19 | POST | `/owner/menus` | mock |
| API-23 | F-19, F-20 | PATCH | `/owner/menus/{menuId}` | mock |
| API-24 | F-19 | DELETE | `/owner/menus/{menuId}` | mock |
| API-25 | F-19 | POST | `/uploads/images` | mock (폰 사진 주소 그대로) |
| API-26 | F-21, F-22 | GET | `/owner/restaurant` | mock |
| API-27 | F-21, F-22 | PATCH | `/owner/restaurant` | mock |
| API-28 | F-23, F-24 | GET | `/company-admin/employees?query=` | mock |
| API-29 | F-23 | POST | `/company-admin/employees` | mock |
| API-30 | F-24 | PATCH | `/company-admin/employees/{userId}` | mock |
| API-31 | F-25 | GET | `/admin/companies` | mock |
| API-32 | F-25 | POST | `/admin/companies` | mock |
| API-33 | F-25 | PATCH | `/admin/companies/{companyId}` | mock |
| API-34 | F-26 | GET | `/admin/restaurants` | mock |
| API-35 | F-26 | POST | `/admin/restaurants` | mock |
| API-36 | F-26 | PATCH | `/admin/restaurants/{restaurantId}` | mock |
| API-37 | F-27 | GET | `/admin/orders?date=&restaurantId=&companyId=` | mock |
| API-38 | F-28 | POST | `/auth/signup` | 이번 범위 제외 |
| API-39 | F-28 | GET | `/company-admin/signup-requests` | mock |
| API-40 | F-28 | POST | `/company-admin/signup-requests/{requestId}/decision` | mock |

**API가 없는 기능**: F-05(기기 내 장바구니), F-06(앱 내 계산, 값은 API-10), F-07(API-10 필드), F-12(API-11 재사용), F-20(API-23 재사용), F-22(API-26·27 재사용), F-29~F-35(2차, 화면 미정)

---

## 8. 화면-기능-API 연결표

| 화면 ID | 화면명 | 관련 기능 ID | 호출 API ID | 파일 경로 | 사용 데이터 타입 |
|---|---|---|---|---|---|
| S-01 | 로그인 | F-01, F-13 | API-01, API-02, API-03 | `app/login.tsx` | `Company`, `User` |
| S-02 | 비밀번호 변경 | F-02 | API-06 | `app/change-password.tsx` | — |
| S-03 | 홈 — 음식점 목록 | F-03, F-21, F-22 | API-07 | `app/employee/home/index.tsx` | `Restaurant` |
| S-04 | 음식점 상세 — 메뉴판 | F-04, F-05, F-20 | API-08, API-09 | `app/employee/home/restaurant/[restaurantId].tsx` | `Restaurant`, `Menu`, `Cart` |
| S-05 | 장바구니 / 주문하기 | F-05, F-06, F-07, F-08 | API-08, API-10 | `app/employee/home/cart.tsx` | `Cart`, `CreateOrderInput`, `Order` |
| S-06 | 주문 완료 | F-08 | API-12 | `app/employee/home/order-complete/[orderId].tsx` | `Order` |
| S-07 | 내 주문 | F-09, F-10, F-11, F-12 | API-11, API-13 | `app/employee/orders.tsx` | `Order`, `OrderListScope` |
| S-08 | 마이페이지 | F-01, F-02, F-11 | API-05, API-04, (API-14 제외) | `app/employee/my.tsx` | `User` |
| S-09 | 오늘의 주문 | F-14, F-15 | API-15, API-26 | `app/owner/orders/index.tsx` | `Order`, `OwnerOrderTab`, `Restaurant` |
| S-10 | 주문 상세 | F-07, F-16, F-17 | API-16, API-17, API-18, API-19 | `app/owner/orders/[orderId].tsx` | `Order`, `RejectReason` |
| S-11 | 시간대별 요약 | F-18 | API-20 | `app/owner/summary.tsx` | `TimeSlotSummary` |
| S-12 | 메뉴 관리 | F-19, F-20 | API-21, API-23 | `app/owner/menus/index.tsx` | `Menu` |
| S-13 | 메뉴 등록·수정 | F-19 | API-21, API-22, API-23, API-24, API-25 | `app/owner/menus/edit.tsx` | `Menu` |
| S-14 | 가게 설정 | F-13, F-21, F-22 | API-26, API-27, API-04 | `app/owner/settings.tsx` | `Restaurant` |
| S-15 | 직원 명단 | F-23, F-24 | API-28, API-29, API-30, API-04 | `app/company-admin/employees.tsx` | `User` |
| S-16 | 가입 승인 (2차) | F-28 | API-39, API-40 | `app/company-admin/signup-requests.tsx` | `SignupRequest` |
| S-17 | 회사 관리 | F-25 | API-31, API-32, API-33, API-04 | `app/admin/companies.tsx` | `Company`, `User` |
| S-18 | 음식점 관리 | F-26 | API-34, API-35, API-36 | `app/admin/restaurants.tsx` | `Restaurant`, `User` |
| S-19 | 주문 현황 | F-27 | API-37, API-31, API-34 | `app/admin/orders.tsx` | `Order`, `AdminOrderStats` |

---

## 9. 상태 관리와 데이터 처리 규칙

### 9.1 상태를 어디에 두는가

| 상태 | 위치 | 이유 |
|---|---|---|
| 로그인 사용자, 토큰 | `AuthContext` + `expo-secure-store`(토큰) | 모든 화면이 사용자 유형을 알아야 함 |
| 장바구니 | `CartContext` | S-04, S-05가 같이 씀 |
| 서버 데이터 (음식점, 메뉴, 주문 목록) | 각 화면의 훅 안 `useState` | 화면에 들어올 때마다 새로 받음. 전역에 두지 않음 |
| 입력 중인 값 (사번, 요청사항 등) | 화면 안 `useState` | 그 화면에서만 씀 |
| 모달·바텀시트 열림 여부 | 화면 안 `useState` | |

**AuthContext가 제공하는 것**
| 이름 | 설명 |
|---|---|
| `user` | 로그인 사용자 (`User` 또는 `null`) |
| `isRestoring` | 앱 시작 시 토큰 확인 중 여부 |
| `loginEmployee(companyId, employeeNo, password)` | API-02 호출 → 토큰 저장 → 유형별 이동 |
| `loginWithId(loginId, password)` | API-03 호출 → 토큰 저장 → 유형별 이동 |
| `logout()` | API-04 호출 → 토큰 삭제 → 장바구니 비움 → S-01 |

**CartContext가 제공하는 것**
| 이름 | 설명 |
|---|---|
| `cart` | 현재 장바구니 (`Cart`) |
| `addItem(restaurant, menu)` | 다른 음식점이면 `false` 반환 → 화면이 확인 모달 표시 |
| `changeQuantity(menuId, quantity)` | 0이면 빼기 |
| `clear()` | 비우기 (주문 성공, 로그아웃, "비우고 담기") |
| `totalCount`, `totalPrice` | 하단 장바구니 바 표시용 |

### 9.2 사용자 유형별 화면 보호 (`_layout.tsx`)

| 레이아웃 | 검사 | 통과 못 하면 |
|---|---|---|
| `app/_layout.tsx` | `AuthProvider`, `CartProvider`로 감싸기 | — |
| `app/index.tsx` | `isRestoring` 끝나면 `user.role`로 이동 | `user` 없음 → `/login` |
| `app/employee/_layout.tsx` | `user.role === 'employee'` | `/login`으로 `Redirect` |
| `app/owner/_layout.tsx` | `user.role === 'owner'` | `/login` |
| `app/company-admin/_layout.tsx` | `user.role === 'company_admin'` | `/login` |
| `app/admin/_layout.tsx` | `user.role === 'super_admin'` | `/login` |

### 9.3 로딩·오류·빈 상태 처리 규칙

모든 목록·상세 화면은 `useAsync` 훅의 결과로 아래 순서를 따릅니다.

| 순서 | 조건 | 표시 (design-spec.md 3장) |
|---|---|---|
| 1 | 처음 불러오는 중 (`isLoading`) | `<Loading />` 화면 가운데 |
| 2 | 오류 (`error`) | `<ErrorView message={...} onRetry={refresh} />` |
| 3 | 데이터가 빈 배열 | `<EmptyState />` + 화면별 문구 |
| 4 | 그 외 | 목록 표시 |

| 규칙 | 내용 |
|---|---|
| 새로고침 | 목록 화면은 `FlatList`의 `refreshing`, `onRefresh`로 당겨서 새로고침 |
| 화면 재진입 갱신 | S-03, S-07, S-09, S-11, S-12는 Expo Router의 `useFocusEffect`로 화면이 다시 보일 때 `refresh()` |
| 버튼 처리 중 | 버튼 로딩 표시 + 중복 클릭 막기 (특히 API-10 주문 요청) |
| 처리 실패 | 화면 위 빨간 `<Banner />` 3초 표시. 문구는 `ApiError.message` 사용 |
| 처리 성공 | 초록 `<Banner />` ("수락했어요" 등) 후 목록 갱신 |
| 401 오류 | 어느 화면이든 `logout()` 호출 후 S-01 |
| 오류 문구 | 서버 `message`를 그대로 쓰되, 없으면 `src/constants/messages.ts`의 기본 문구 |

### 9.4 화면 간 데이터 전달

| 출발 → 도착 | 전달 방식 | 전달 값 |
|---|---|---|
| S-01 → 유형별 첫 화면 | `router.replace()` | 없음 (사용자 정보는 AuthContext) |
| S-03 → S-04 | 경로 파라미터 | `restaurantId` |
| S-04 → S-05 | `CartContext` | 장바구니 전체 (파라미터로 넘기지 않음) |
| S-05 → S-06 | 경로 파라미터 + `router.replace()` | `orderId` (S-06은 API-12로 다시 조회) |
| S-06 → S-07 / S-03 | `router.replace()` | 없음 |
| S-09 → S-10 | 경로 파라미터 | `orderId` |
| S-10 → S-09 | `router.back()` | 없음 (S-09는 `useFocusEffect`로 갱신) |
| S-12 → S-13 | 쿼리 파라미터 | `menuId` (없으면 등록 모드) |
| S-08 → S-02 | `router.push()` | 없음 |

**규칙**: 화면 사이에는 **ID만** 넘깁니다. 객체 전체를 넘기지 않고, 도착 화면이 ID로 다시 조회합니다. (데이터가 오래된 상태로 보이는 것을 막기 위함)

S-06에서 뒤로가기를 막기 위해 S-05 → S-06 이동은 `router.replace()`를 씁니다.

---

## 10. 구현 순서와 단계별 완료 기준

### 10.1 Must 단계 (목표: 2시간)

| 단계 | 시간 | 만드는 것 | 기능 / 화면 | Expo Go에서 이렇게 보이면 완료 |
|---|---|---|---|---|
| 0 | 10분 | 프로젝트 생성, 예제 정리, `expo-secure-store` 설치, GitHub 연결 | — | 폰에서 빈 앱이 열린다 |
| 1 | 15분 | constants, types, env, mock data/db, api 계층(Must API만), `useAsync`, 공통 컴포넌트 일부(Button, Input, Card, Loading, ErrorView, EmptyState, StatusBadge) | — | 앱이 오류 없이 열리고, 터미널 로그에 `MOCK 모드` 출력 |
| 2 | 15분 | `AuthContext`, `app/index.tsx`, S-01, 유형별 `_layout.tsx` 틀 | F-01, F-13 / S-01 | 직원 `A회사/1001/test1234` → 하단 탭 3개 화면, 사장님 `owner1/test1234` → 하단 탭 4개 화면. 틀린 비밀번호 → 오류 문구 |
| 3 | 35분 | S-03, S-04, `CartContext`, S-05, S-06 | F-03, F-04, F-05, F-06, F-08 / S-03~S-06 | 음식점 선택 → 김치찌개 2개 담기 → 하단 바 "2개 · 18,000원" → 12:10, 2명 선택 → 주문 요청 → "주문을 보냈어요"와 주문 번호 |
| 4 | 30분 | S-09, S-10 (거절 바텀시트 포함) | F-15, F-16, F-17 / S-09, S-10 | 직원 로그아웃 → 사장님 로그인 → "신규" 탭에 방금 주문 → 수락 → 준비 시작 → 준비 완료 → 제공 완료 순서로 배지가 바뀜. 다른 주문은 "품절"로 거절됨 |
| 5 | 15분 | S-07 (진행 중 탭) + 직원 로그아웃 버튼(S-08 최소) | F-10, F-01 / S-07, S-08 | 사장님 로그아웃 → 직원 로그인 → 내 주문에서 당겨서 새로고침하면 상태가 사장님이 바꾼 대로 보임 |

> FL-01(직원 주문)과 FL-02(사장님 처리)가 한 폰에서 끝까지 이어지면 Must 완료입니다.

### 10.2 Should 단계

| 순서 | 만드는 것 | 기능 / 화면 | 완료 기준 |
|---|---|---|---|
| 6 | 요청사항 입력, 주문 취소, 지난 주문 탭 | F-07, F-09, F-12 / S-05, S-07, S-10 | 요청사항이 사장님 상세에 보이고, "주문 요청" 상태에서만 취소 가능 |
| 7 | 시간대별 요약 | F-18 / S-11 | 10분 단위 메뉴 수량·인원 합계 표시 |
| 8 | 메뉴 관리 (`expo-image-picker` 설치) | F-19, F-20 / S-12, S-13 | 품절 스위치를 켜면 직원 메뉴판에 "품절" |
| 9 | 알림 화면만 | F-11, F-14 / S-08 | 알림 스위치가 비활성 + "준비 중인 기능" |
| 10 | mock 데이터 기기 저장 (`AsyncStorage` 설치) | — | 앱을 완전히 껐다 켜도 주문이 남아 있음 |

### 10.3 Could 단계

| 순서 | 만드는 것 | 기능 / 화면 |
|---|---|---|
| 11 | 비밀번호 변경 | F-02 / S-02 |
| 12 | 가게 설정 | F-21, F-22 / S-14 |
| 13 | 회사 관리자 화면 | F-23, F-24 / S-15 |
| 14 | 총괄 관리자 화면 | F-25, F-26, F-27 / S-17, S-18, S-19 |
| 15 | 가입 승인 화면 (mock) | F-28 / S-16 |

---

## 11. 개발 규칙

### 11.1 코딩 규칙

| 규칙 | 내용 |
|---|---|
| 언어 | 모든 파일 TypeScript (`.ts`, `.tsx`). `any` 쓰지 않기 |
| 화면 파일 | 데이터는 훅으로만. `src/api`, `src/mocks` 직접 import 금지 |
| 스타일 | `StyleSheet.create` 사용. 색·크기·간격은 `src/constants`에서 가져오기 (HEX 직접 입력 금지) |
| 문구 | 화면 문구는 design-spec.md 5장 그대로. 반복 문구는 `src/constants/messages.ts` |
| 컴포넌트 | 한 파일에 컴포넌트 하나. 공통 컴포넌트는 데이터를 모르게 |
| import 경로 | `@/` 별칭 사용 (`@/src/hooks/useMyOrders`) [확인 필요: 템플릿 `tsconfig.json`의 경로 설정] |
| 주석 | 화면 파일 맨 위에 화면 ID·기능 ID |
| 터치 영역 | 누르는 요소 최소 44×44 (design-spec.md 6장) |
| 안전 영역 | 화면 바깥은 `SafeAreaView`(react-native-safe-area-context) 사용 |
| 키보드 | 입력 화면은 `KeyboardAvoidingView` + 빈 곳 탭 시 키보드 닫기 |
| 목록 | 긴 목록은 `ScrollView` 대신 `FlatList` |

### 11.2 커밋 메시지 규칙

형식: `종류: 내용 (ID)`

| 종류 | 쓰는 때 | 예시 |
|---|---|---|
| `feat` | 기능·화면 추가 | `feat: 음식점 목록 화면 (S-03, F-03)` |
| `fix` | 버그 수정 | `fix: 품절 메뉴 담기 막기 (F-20)` |
| `style` | 디자인만 수정 | `style: 주문 카드 간격 조정 (S-09)` |
| `refactor` | 동작 같고 코드 정리 | `refactor: 주문 상태 상수 분리` |
| `docs` | 문서 | `docs: README 실행 방법 추가` |
| `chore` | 설정, 설치 | `chore: expo-secure-store 설치` |

- 단계(10장) 하나 끝날 때마다 커밋 + push

### 11.3 브랜치 방식

| 상황 | 방식 |
|---|---|
| 수업 중 (2시간) | [가정] `main` 브랜치 하나에 단계별 커밋. 되돌릴 때는 커밋 단위로 |
| 수업 후 확장 | `main`(항상 실행되는 상태) + `feature/F-xx-설명` 브랜치에서 작업 후 합치기. 예: `feature/F-18-summary` |

### 11.4 AI 코딩 도구에 작업을 시킬 때의 지침

작업을 맡기기 전에 이 문서(dev-spec.md)를 먼저 읽게 하고, 아래 규칙을 함께 줍니다.

| 지침 | 이유 |
|---|---|
| **한 번에 한 단계(10장)·한 화면만** 시키기. 예: "10.1의 3단계 중 S-03만 만들어줘" | 범위가 크면 엉뚱한 파일까지 바뀜 |
| 화면 ID·기능 ID·API ID로 지시하기 | 문서와 코드가 어긋나지 않게 |
| 3장 폴더 구조와 3.4 네이밍 규칙을 지키게 하기 | 파일 위치가 흩어지지 않게 |
| 라이브러리는 2.2 표에 있는 것만, `npx expo install`로만 설치 | Expo Go 호환·버전 일치 |
| **전역 설치(`npm install -g`), 시스템 설정 변경 금지** | 다른 프로젝트·컴퓨터 환경이 망가질 수 있음 |
| **`.env` 내용을 채팅에 붙이거나 깃에 올리지 않기** | 설정값 유출 방지. 필요하면 `.env.example`만 보여주기 |
| 비밀 키를 코드나 `.env`에 넣으라는 제안은 거절 | 4.5 참고 |
| 화면에서 mock 데이터를 직접 import하지 않게 하기 | 5장 계층 분리 유지 |
| 작업 후 `npx expo start`로 실행 확인 + 10장 완료 기준으로 점검 | 동작하는지 바로 확인 |
| 바뀐 파일 목록을 알려달라고 하기 | 무엇이 바뀌었는지 검토 |
| 끝나면 커밋 메시지 규칙(11.2)대로 커밋 | 이력 정리 |
| 코드를 지우거나 크게 바꿀 땐 먼저 물어보게 하기 | 의도치 않은 삭제 방지 |

**지시 예시**
```
dev-spec.md를 읽고 10.1의 3단계 중 S-04(음식점 상세)만 구현해줘.
- 관련 기능: F-04, F-05, F-20 / 호출 API: API-08, API-09
- 화면 디자인과 문구는 design-spec.md의 S-04를 따라줘
- 데이터는 useRestaurantDetail 훅으로만 가져오고, 장바구니는 CartContext를 써줘
- 새 라이브러리는 설치하지 마
- 끝나면 바뀐 파일 목록과 Expo Go에서 확인할 방법을 알려줘
```

---

## 12. 가정 및 확인 필요 사항

### 12.1 이 문서의 가정

| 번호 | 가정 | 관련 |
|---|---|---|
| 1 | Expo SDK 57 사용 (스토어 Expo Go 지원 버전 기준) | 2장 |
| 2 | 구현 가능 시간 2시간 (service-plan.md 기준) | 10장 |
| 3 | 사장님·회사 관리자·총괄 관리자 모두 API-03 아이디 로그인 | F-13, S-01 |
| 4 | 사용자 유형 폴더는 그룹 폴더 대신 일반 폴더 (주소 겹침 방지) | 3장 |
| 5 | 주문 상태 갱신은 화면 재진입 + 당겨서 새로고침 | F-10, F-14 |
| 6 | Must 단계 mock 데이터는 메모리만 (앱 완전 재시작 시 초기화) | 5.3 |
| 7 | 시간대별 요약은 수락 이후 상태만 집계 | API-20 |
| 8 | 직원 추가 시 초기 비밀번호는 서버가 정하고 첫 로그인 때 변경 | API-29 |
| 9 | 음식점 등록 시 영업시간·마감은 기본값, 사장님이 수정 | API-35 |
| 10 | 회사 관리자 상단 탭(S-15/S-16)은 라이브러리 없이 직접 만든 탭 버튼 + 화면 교체 | 3장 |
| 11 | 수업 중에는 `main` 브랜치 하나 사용 | 11.3 |

### 12.2 확인 필요 사항

| 번호 | 내용 | 왜 중요한가 |
|---|---|---|
| 1 | **수업 당일 폰의 Expo Go가 지원하는 SDK** (57인지 58인지) | 다르면 앱이 안 열림. 58이면 `npx expo install expo@^58.0.0 --fix` |
| 2 | **구현 가능 시간** — 프롬프트 예시는 6시간, service-plan.md는 2시간 [가정] | 6시간이면 Should 단계(10.2)까지 Must로 포함 가능 |
| 3 | 직원 주문이 사장님 폰에 보이려면 서버가 필요. 수업에서 서버를 다루는가? | 다루지 않으면 한 폰 시연 방식 |
| 4 | TypeScript 버전, `@/` 경로 별칭, `reset-project` 스크립트, `--template default@sdk-57` 옵션 | 템플릿마다 다를 수 있음 [확인 필요] |
| 5 | Node.js 최소 버전 (22.13 이상으로 가정) | 낮으면 프로젝트 생성 실패 [확인 필요] |
| 6 | service-plan.md에 회사 관리자·총괄 관리자 로그인 기능 ID가 따로 없음 (F-13은 음식점만) | 이 문서는 F-13·API-03으로 함께 처리 |
| 7 | design-spec.md는 S-08 알림 스위치를 비활성으로, service-plan.md는 F-11을 Should로 둠 | 충돌은 아님. 이번엔 화면만 구현 |
| 8 | 가입 화면(F-28)은 화면 ID가 없음 | 2차에 화면 ID 추가 필요 |
| 9 | 원문 확인 사항 (운영 주체, 직원 명단 확보, 좌석 한도, 규모, 음식점 위치, 노쇼 대응) | service-plan.md 10장 그대로 유효 |
