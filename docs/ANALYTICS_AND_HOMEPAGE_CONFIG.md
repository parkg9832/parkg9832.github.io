# MOKDA 홈페이지 분석·운영 설정

## 현재 측정 구조

- GA4 웹 스트림 `MOKDA Website`가 Measurement ID `G-TGLJ91TKZF`로 연결되어 있다.
- 현재 운영 데이터는 `site-analytics.js`가 익명 이벤트를 Google Apps Script로 보내고, `Funnel Events`·`Demand Support`·`Sheet1`을 통합해 Google Sheet 대시보드에서 집계한다.
- `Users`는 고유 익명 방문자 ID, `Sessions`는 30분 유휴 만료 자체 세션, `Pageviews`는 전체 `page_view` 수다.
- 자체 세션은 GA4 세션과 같은 값이 아니다. 화면에서는 `방문 세션`으로 표시한다.
- 퍼널은 고유 세션과 클라이언트 발생 시각·세션 내 이벤트 순서를 함께 사용한다.

## 이벤트 스키마 v2

신규 이벤트에는 다음 공통값이 추가된다.

- `occurredAt`: 브라우저에서 실제 발생한 시각
- `eventSequence`: 동일 세션 내 순서
- `eventSchemaVersion = 2`
- `visitor_daypart`: `morning`, `afternoon`, `evening`, `night`
- `scroll_percent`: `25`, `50`, `75`, `90`
- `section_name`: `proof`, `products`, `field_story`, `support`, `contact`
- `product_name`: `K-Peño`, `Para Carnes`, `K-Peño + Para Carnes`, `제품 미지정`

핵심 이벤트:

- 상담: `chat_open` → `chat_qualified` → `whatsapp_click`. `chat_intent_select`는 안내 선택 현황으로 별도 집계한다.
- 문의 폼: `contact_page_view` → `b2b_form_start` → `generate_lead`. 직접 진입도 포함한다.
- 출시 응원: `support_page_view` → `support_form_start` → `support_country_select` → `support_submit`
- 콘텐츠 소비: `scroll_depth`, `section_view`

`b2b_form_start`는 이름·회사·이메일·WhatsApp·문의 내용 중 실제 값이 최초 입력될 때 세션당 1회 발생한다. `generate_lead`는 서버가 `saved: true`를 응답한 뒤에만 발생한다. `support_submit`은 중복 응원이 아닌 신규 저장 성공 시에만 발생한다.

## Legacy 호환

- `contact_view` → `contact_page_view`
- `form_start` → `b2b_form_start`로 표시 단계에서만 정규화한다.
- 과거 `Original`, `Soy Sauce` 등은 원본을 수정하지 않고 `Legacy Product`로 분리한다.
- 신규 이벤트에서는 `K-Peño`, `Para Carnes`, `K-Peño + Para Carnes`, `제품 미지정`을 저장한다. 두 제품 관심은 제품별 고유 세션에 각각 반영하며 합계는 고유 방문자 수가 아니다.
- 엄격한 B2B·출시 응원 퍼널은 이벤트 스키마 v2 배포 시점 이후 데이터만 사용한다.

## 트래픽 제외

- 전송 허용 호스트는 `mokda.kr`, `www.mokda.kr`뿐이다.
- localhost, 개발 서버, preview/staging에서는 분석이 꺼진다.
- `utm_medium=verification` 이벤트와 응원은 대시보드 집계에서 제외한다.
- 내부 운영자는 사용하는 브라우저마다 `?mokda_internal=1`을 한 번 열어 자체 분석과 GA4 전송을 모두 중지한다.
- 내부 방문 제외를 해제할 때만 `?mokda_internal=0`을 사용한다.
- 고정 사무실 IP는 프런트엔드에서 판별하지 않는다.

## GA4 관리자에서 사람이 설정할 항목

GA4를 실제 연결할 때 아래 항목은 관리자 화면에서 별도로 설정한다.

1. Custom Dimension: `visitor_daypart`, `section_name`, `product_name`, `event_schema_version`
2. Custom Metric: `scroll_percent`
3. Key Event: `generate_lead`, `support_submit`
4. Internal Traffic: 필요할 때만 사무실 고정 IP 규칙과 데이터 필터 추가
5. Enhanced Measurement: 기본 `scroll` 활성 여부 확인

MOKDA의 커스텀 이벤트는 `scroll_depth`이므로 GA4 기본 `scroll`과 이벤트명이 겹치지 않는다. `site-analytics.js`는 GA4의 자동 `page_view`는 한 번만 사용하고, 핵심 커스텀 이벤트를 `gtag`에도 전달한다. 추정 위치 기반 국가는 자체 대시보드의 확정 국가 데이터로 사용하지 않는다.

## 홈페이지 운영 설정

`index.html`의 `homepageProofConfig.verifiedLatamViews`는 검증된 누적 콘텐츠 조회 수만 표시한다. 기관 로고는 `assets/images/institutions/`, WhatsApp 번호는 `site-contact-config.js`에서 관리한다.

현재 출시 응원 페이지는 홈으로 이동하며, `Demand Support`의 과거 원본은 보존한다. 응원 기능의 기존 공개 로직은 `Demand Support`의 `Approved`와 `Homepage Featured`가 모두 `TRUE`이고 메시지가 있는 행만 표시한다. 전체 응원 수는 메시지 공개 여부와 별도로 유효 응원 전체를 집계한다.

## 대시보드 갱신 · 2026-10-20

`대시보드` 상단에 상담 시작·B2B 정보 확인·WhatsApp 이동·실제 저장된 문의를 구분한다. 상담과 제품 상세 경유, 문의 폼은 별도 퍼널로 집계한다. 종료된 출시 응원 수요는 하단 과거 기록으로 옮겨 보존한다. `세부 분석`에는 제품별 상세와 소식·보도 페이지, 안내 선택, 선택 국가별 B2B 관심을 포함한다.

상담 측정 시작은 2026-10-19 19:39:29 KST이다. 수집 전의 단계는 소급 추정하지 않는다. WhatsApp 클릭은 메시지 전송·구매·계약이 아니며, B2B 정보 확인도 유효 바이어 검증이 아니다. 원본 이벤트·응원·리드와 기간 선택 셀의 수식·유효성 검사는 보존한다.
