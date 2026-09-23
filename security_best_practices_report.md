# MOKDA 웹사이트 보안 점검 (2026-09-22)

범위: GitHub Pages에 게시되는 정적 페이지 21개, 문의용 Google Apps Script의 공개 요청 경계, 로컬 미리보기 서버. 브라우저에서 보이는 값과 공개 저장소의 코드는 비밀로 취급하지 않는다.

## 확인된 항목

### SEC-01 · Medium · 운영 응답에 보안 HTTP 헤더가 없음 — 호스팅 계층 작업 필요

- 위치: `https://www.mokda.kr/es/`의 2026-09-22 실제 응답 헤더; 현재 HTML 정책은 `scripts/static-security.mjs:5-22`에서 생성.
- 증거: 응답에는 `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`가 없다. HTML에는 `<meta http-equiv="Content-Security-Policy">`와 `<meta name="referrer">`가 있다.
- 영향: 스크립트에 대한 메타 CSP는 작동하지만, 메타 정책은 `frame-ancestors`를 적용할 수 없으므로 클릭재킹을 막는 헤더가 없다. MIME 스니핑 방지도 운영 응답에는 없다. 현재 정적 사이트에서 곧바로 악용 가능한 취약점을 확인했다는 뜻은 아니다.
- 조치: 브라우저에 실리는 폐기된 외부 스크립트는 SEC-02에서 제거했다. 현재의 해시 기반 스크립트 CSP와 `script-src-attr 'none'`은 유지한다.
- 다음 호스팅 작업: 커스텀 응답 헤더를 지원하는 엣지/호스팅 계층에서 `Content-Security-Policy`(기존 정책을 옮기고 `frame-ancestors 'none'` 추가), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`을 설정하고 실제 응답 및 GA4/문의 흐름을 재검증한다. GitHub Pages의 저장소 파일만 수정해서 이 헤더를 적용할 수는 없다. 지금의 메타 CSP를 제거하지 않는다.
- 오탐 확인: CDN이나 프록시가 별도 환경에서 헤더를 주입한다면 해당 경로의 실제 응답을 다시 검사한다. 이번 공개 URL에서는 주입되지 않았다.

### SEC-02 · Low · 폐기된 안내 페이지의 고정되지 않은 외부 스크립트 — 해결

- 위치: 변경 전 `coming-soon.html:8`의 `https://cdn.tailwindcss.com` 로드.
- 증거: 안내 페이지가 `noindex`여도 공개 URL에서 제3자 JavaScript를 실행했다.
- 영향: 해당 CDN 응답이 변조되면 그 페이지에서 우리 출처의 권한으로 코드가 실행될 수 있다.
- 조치: `coming-soon.html`을 스크립트가 없는 `noindex` 안내/링크 페이지로 교체했고 `scripts/security-regression.test.mjs`에서 재발을 검사한다.
- 완화/오탐: 배포 전까지 운영 URL에는 기존 파일이 남을 수 있다. 배포 후 `/coming-soon.html`을 확인한다.

## 적용된 경계와 검증

- 언어별 HTML은 `scripts/static-security.mjs`가 CSP와 외부화된 스크립트를 생성한다. 실행 가능한 인라인 스크립트 해시를 사용하며 `unsafe-inline`/`unsafe-eval`을 `script-src`에 허용하지 않는다. 기존 인라인 스타일 때문에 `style-src 'unsafe-inline'`은 남아 있다.
- 문의·분석 요청은 `apps-script/b2b-lead-automation.gs`에서 요청 크기와 필드 형식을 검사하고, 수식으로 시작하는 스프레드시트 값을 이스케이프하며, 중복 및 사용량을 제한한다. 공개 엔드포인트이므로 클라이언트의 필드 값은 신뢰하지 않는다. 실제 Apps Script 배포 버전은 코드 검사만으로 단정할 수 없다.
- 의존성: `npm audit --omit=dev --audit-level=moderate`에서 알려진 취약점 0건. 이는 새 취약점이나 제3자 서비스 설정까지 보증하지 않는다.
- 검증: `npm run test:security`, `npm run test:seo`, `npm run test:navigation`, `npm run test:integrity`, `npm run typecheck`.
