# MOKDA 홈페이지 분석·운영 설정

## 분석 감사 결과

- 저장소에는 GA4 또는 GTM 태그가 없다.
- 현재 분석은 `site-analytics.js`가 익명 이벤트를 Google Apps Script로 보내고, `Funnel Events` 시트와 자체 대시보드에서 집계하는 구조다.
- 기존 30분 세션 ID는 자체 대시보드용이다. GA4 세션과 동일한 값으로 간주하면 안 된다.
- `generate_lead`는 B2B 문의가 백엔드에서 정상 접수된 뒤에만 발생한다.
- 개발 트래픽은 전송하지 않는다. 분석 허용 호스트는 `mokda.kr`, `www.mokda.kr`뿐이다.

## 이벤트

- `hero_product_click`
- `scroll_depth`: `25%`, `50%`, `75%`, `90%`
- `section_view`: `proof`, `products`, `field_story`, `support`, `contact`
- `support_cta_click`
- `whatsapp_click`
- `b2b_cta_click`
- `b2b_form_start`
- `generate_lead`: 접수 성공 후에만 기록

모든 이벤트에는 브라우저 현지 시간 기준 `visitorDaypart`가 붙는다.

- `morning`: 05:00–11:59
- `afternoon`: 12:00–16:59
- `evening`: 17:00–21:59
- `night`: 22:00–04:59

브라우저 현지 시간대와 GA 보고 시간대는 별개다. 향후 GA4를 설치하면 GA4 속성의 보고 시간대를 별도로 확인해야 한다.

## GA4 관리자에서 별도로 해야 할 일

현재 저장소에서 GA4 속성 연결 여부와 관리자 설정은 확인할 수 없다. 향후 GA4를 연결할 때 고정 사무실 IP 제외는 프런트엔드 코드가 아니라 GA4 관리자 화면의 내부 트래픽 규칙으로 설정한다.

## 홈페이지 설정값

### 누적 콘텐츠 조회 수

`index.html`의 `homepageProofConfig.verifiedLatamViews` 한 곳에서만 관리한다. 검증된 값이 없거나 `null`이면 홈페이지에 노출되지 않는다.

### 기관 로고

공식 원본을 `assets/images/institutions/`에 넣고 `homepageProofConfig.institutionalLogos`에 `src`, `alt`를 추가한다. 공식 파일이 없으면 영역 전체가 숨겨진다.

### WhatsApp

`site-contact-config.js`의 `whatsappNumber`에 국가번호를 포함한 숫자만 입력한다. 빈 값이면 홈페이지의 빠른 질문 카드가 숨겨지고 B2B 카드만 표시된다.

### 홈페이지 후원 메시지

Google Sheet의 `Demand Support` 시트에 다음 열이 추가된다.

- `Approved`
- `Homepage Featured`

두 값이 모두 `TRUE`이고 메시지가 있는 행만 홈페이지에 표시된다. 총 응원 수는 메시지 공개 여부와 별도로 유효 응원 전체를 집계한다.
