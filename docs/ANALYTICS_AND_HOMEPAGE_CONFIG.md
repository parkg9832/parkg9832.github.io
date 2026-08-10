# MOKDA 홈페이지 분석·운영 설정

## 현재 측정 구조

- 저장소에는 GA4 Measurement ID 또는 GTM 컨테이너가 없다.
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
- `product_name`: `K-Peño`, `Para Carnes`, `제품 미지정`

핵심 이벤트:

- B2B: `b2b_cta_click` → `contact_page_view` → `b2b_form_start` → `generate_lead`
- 출시 응원: `support_page_view` → `support_form_start` → `support_country_select` → `support_submit`
- 콘텐츠 소비: `scroll_depth`, `section_view`

`b2b_form_start`는 이름·회사·이메일·WhatsApp·문의 내용 중 실제 값이 최초 입력될 때 세션당 1회 발생한다. `generate_lead`는 서버가 `saved: true`를 응답한 뒤에만 발생한다. `support_submit`은 중복 응원이 아닌 신규 저장 성공 시에만 발생한다.

## Legacy 호환

- `contact_view` → `contact_page_view`
- `form_start` → `b2b_form_start`로 표시 단계에서만 정규화한다.
- 과거 `Original`, `Soy Sauce` 등은 원본을 수정하지 않고 `Legacy Product`로 분리한다.
- 신규 이벤트에서는 `K-Peño`, `Para Carnes`, `제품 미지정`만 저장한다.
- 엄격한 B2B·출시 응원 퍼널은 이벤트 스키마 v2 배포 시점 이후 데이터만 사용한다.

## 트래픽 제외

- 전송 허용 호스트는 `mokda.kr`, `www.mokda.kr`뿐이다.
- localhost, 개발 서버, preview/staging에서는 분석이 꺼진다.
- `utm_medium=verification` 이벤트와 응원은 대시보드 집계에서 제외한다.
- 고정 사무실 IP는 프런트엔드에서 판별하지 않는다.

## GA4 관리자에서 사람이 설정할 항목

GA4를 실제 연결할 때 아래 항목은 관리자 화면에서 별도로 설정한다.

1. Measurement ID 또는 GTM 컨테이너 연결
2. Custom Dimension: `visitor_daypart`, `section_name`, `product_name`, `event_schema_version`
3. Custom Metric: `scroll_percent`
4. Internal Traffic: 사무실 고정 IP 규칙과 데이터 필터
5. Enhanced Measurement: 기본 `scroll` 활성 여부 확인

MOKDA의 커스텀 이벤트는 `scroll_depth`이므로 GA4 기본 `scroll`과 이벤트명이 겹치지 않는다. GA4 태그가 설치되면 `site-analytics.js`는 핵심 커스텀 이벤트를 `gtag`에도 전달한다.

## 홈페이지 운영 설정

`index.html`의 `homepageProofConfig.verifiedLatamViews`는 검증된 누적 콘텐츠 조회 수만 표시한다. 기관 로고는 `assets/images/institutions/`, WhatsApp 번호는 `site-contact-config.js`에서 관리한다.

홈페이지 응원 메시지는 `Demand Support`의 `Approved`와 `Homepage Featured`가 모두 `TRUE`이고 메시지가 있는 행만 표시한다. 전체 응원 수는 메시지 공개 여부와 별도로 유효 응원 전체를 집계한다.
