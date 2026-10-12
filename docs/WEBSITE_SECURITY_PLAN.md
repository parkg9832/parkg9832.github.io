# MOKDA 홈페이지 보호 실행 계획

## 현재 실행 범위 · 2026-10-13

대표님의 최신 지시에 따라 Cafe24 로그인·도메인 등록기관 설정·네임서버 변경은 진행하지 않는다. 아래 1~3절의 도메인 보호 절차는 향후 참고이며 이번 완료 조건에 포함하지 않는다. 현재 GitHub Pages 홈페이지와 문의 endpoint를 유지하면서 문의·AI 직접 주소에 서버 검증을 적용한다.

- Turnstile 검증은 실제 AI 질문과 문의 제출 때만 불러오고, 실패·위조·재사용 토큰은 저장·알림·AI 실행 전에 차단한다. 기존 일일 예산과 자동 안내 fallback은 유지한다.
- 생성한 검증 비밀값은 공개 코드에 넣지 않고 Worker Secret 및 기존 Apps Script 속성에 저장했다. 기존 Apps Script 속성 두 개의 보존도 확인했다. 공개 sitekey만 홈페이지에 둔다.
- Cloudflare Free 도메인 영역, Full (strict) 및 HTTP 헤더 규칙은 준비했지만 DNS가 Cafe24를 계속 사용하므로 **홈페이지 전체 방화벽·보안 헤더가 운영에 적용된 상태는 아니다**. 유료 상품은 신청하지 않았다.
- 계정 보호 확인 결과는 비공개 `output/security/account-check.json`에 기록한다. 공개 저장소에 계정의 인증수단·복구 설정을 공개하지 않으며, 이번 범위에서는 계정 인증수단을 변경하지 않는다.
- 구현·로컬 검사와 운영 반영을 구분한다. 배포 SHA, Worker 활성 버전, Apps Script 활성 버전 및 직접 주소 차단 결과를 완료 후 별도로 기록한다.

아래의 최초 상태와 전체 도메인 절차는 진단 당시의 기록이다.

작성: 2026-10-12. 이 문서는 적용 설정과 검증 기준을 기록한다. 계획에 적힌 설정을 실제 운영에서 확인하기 전에는 적용 완료로 표시하지 않는다. DNS·계정 ID·API 토큰·복구 코드 등 비공개 운영 정보는 이 문서에 저장하지 않는다.

## 확인한 출발점

| 항목 | 확인 상태 | 근거와 한계 |
| --- | --- | --- |
| 홈페이지 | GitHub Pages, 공식 주소 `www.mokda.kr` | 현재 저장소 CNAME과 공개 응답 |
| DNS | Cafe24 네임서버 사용 | 공개 NS 조회. 도메인 등록기관 로그인이나 전체 DNS 목록은 별도 확인 필요 |
| 기존 홈페이지 레코드 | apex A `185.199.108.153`, www CNAME `parkg9832.github.io` | 공개 조회로 확인한 값. 전체 목록을 뜻하지 않음 |
| Cloudflare 도메인 보호 | 아직 미등록 | 로그인된 대시보드의 도메인 목록 확인. AI Worker 운영과 별개 |
| 브라우저 CSP | HTML의 기존 meta CSP 있음 | 기존 생성기와 페이지의 해시 기반 정책 보존 |
| HTTP 보안 헤더 | 아직 추가 적용 필요 | 기존 공개 응답에 CSP, X-Frame-Options, nosniff 없음 |
| AI·문의 직접 주소 | 별도 보호 필요 | 홈페이지 WAF만으로 workers.dev 및 Apps Script 직접 요청은 차단되지 않음 |
| GitHub·Google·Cloudflare MFA | 미확인 | 계정 설정 화면을 읽기 전에는 활성·비활성을 추정하지 않음 |

## 1. 기존 DNS를 보존하고 무료 Cloudflare 영역 준비

1. 기존 DNS 관리 화면에서 전체 레코드를 확인하고 비공개 `output`에 변경 전 백업을 저장한다. DNS 자동 스캔이나 공개 조회만으로 전체 목록이 확보됐다고 판단하지 않는다.
2. Cloudflare에 `mokda.kr`을 Free 요금제로 추가한다. 도메인 구매·이전이나 유료 상품 신청은 하지 않는다.
3. A/AAAA/CNAME뿐 아니라 MX, SPF, DKIM, DMARC, 사이트 소유권 TXT, CAA, 사용 중인 서비스의 하위 도메인을 원본과 대조한다. 메일과 인증용 레코드는 DNS Only를 유지한다.
4. 먼저 기존 값을 유지해 가져온다. GitHub 권장 A/AAAA를 추가로 정리할 필요가 있으면 DNS 이전과 분리하고 정확한 운영 값을 확인한다.
5. GitHub Pages의 custom domain·Enforce HTTPS와 해당 호스트 인증서가 유효한지 확인한다. `www` 및 apex의 웹 레코드는 Cloudflare Proxy를 켜되 메일용 주소는 켜지 않는다.
6. Cloudflare SSL/TLS를 Full (strict), Always Use HTTPS를 On으로 준비한다. Flexible은 사용하지 않는다. Full (strict)은 오리진 인증서의 유효기간·신뢰체인·호스트 일치를 검사하므로 설정 전 확인이 필요하다. [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
7. 기존 DNSSEC DS 레코드의 유무를 확인한다. 활성 DNSSEC를 그대로 둔 채 네임서버를 바꾸지 않는다. 기존 DS 처리와 전체 레코드 대조가 끝나면 등록기관에 **해당 영역에 배정된 두 네임서버**만 설정한다. 영역이 Active로 확인된 뒤 DNSSEC 재설정을 검토한다. [Cloudflare DNS 이전 절차](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)

웹사이트 원본·브랜치·CNAME은 유지한다. GitHub Pages DNS 관리와 HTTPS 확인은 [GitHub 공식 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)를 기준으로 한다.

## 2. HTTP 응답에 보안 헤더 추가

Cloudflare Response Header Transform Rule 하나를 추가한다. 적용 조건:

```text
http.host in {"mokda.kr" "www.mokda.kr"}
```

| 헤더 | 작업 | 값 |
| --- | --- | --- |
| Content-Security-Policy | Add static | `frame-ancestors 'none'` |
| X-Frame-Options | Set static | `DENY` |
| X-Content-Type-Options | Set static | `nosniff` |
| Referrer-Policy | Set static | `strict-origin-when-cross-origin` |
| Permissions-Policy | Set static | `camera=(), microphone=(), geolocation=(), payment=()` |

`frame-ancestors`는 HTTP 헤더에서 적용한다. 기존 meta CSP의 script/hash/connect/font/img 정책은 유지한다. 이 헤더에 별도 `default-src`를 넣어 기존 기능을 막지 않는다. 기존 HTTP CSP가 생겨도 덮어쓰지 않도록 CSP는 **Add**를 사용한다. 단순 iframe 방어만으로 XSS가 해결됐다고 표현하지 않는다. [MDN frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)

기존 Transform Rules를 먼저 읽고 백업한 뒤 위 규칙만 추가한다. 전체 ruleset을 단일 규칙으로 교체하지 않는다. 규칙은 나중에 실행되는 규칙으로 덮어써질 수 있으므로 저장 후 실제 응답을 확인한다. [Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/), [API 생성 절차](https://developers.cloudflare.com/rules/transform/response-header-modification/create-api/)

HSTS 및 preload는 이번 기본 설정에 추가하지 않는다. Rocket Loader나 HTML/JavaScript 변환 최적화도 켜지 않는다. 보안 작업 중 기존 스크립트 실행 순서와 해시를 바꾸지 않는다.

## 3. 현재 정적 홈페이지에 맞는 WAF 규칙

Free에서는 custom rule 5개까지 사용할 수 있고 정규식 연산은 지원하지 않는다. 아래 3개는 `lower`, `starts_with`, `ends_with`, `contains` 연산자, 집합 비교만 사용한다. 추가 전 기존 규칙 수·순서를 확인한다. 모두 Action **Block**, 호스트 범위는 위 공식 두 호스트로 제한한다. [Cloudflare custom rules](https://developers.cloudflare.com/waf/custom-rules/), [Rules 언어 함수](https://developers.cloudflare.com/ruleset-engine/rules-language/functions/)

### 규칙 A: 비공개 소스·설정 경로

```text
(http.host in {"mokda.kr" "www.mokda.kr"} and (
  lower(http.request.uri.path) in {"/.env" "/.git" "/package.json" "/package-lock.json" "/wrangler.json" "/wrangler.jsonc" "/tsconfig.json" "/.clasp.json" "/_config.yml"}
  or starts_with(lower(http.request.uri.path), "/.env.")
  or lower(http.request.uri.path) contains "/.git/"
  or starts_with(lower(http.request.uri.path), "/.github/")
  or starts_with(lower(http.request.uri.path), "/.aws/")
  or starts_with(lower(http.request.uri.path), "/.codex/")
  or starts_with(lower(http.request.uri.path), "/.agents/")
  or starts_with(lower(http.request.uri.path), "/node_modules/")
  or starts_with(lower(http.request.uri.path), "/workers/")
  or starts_with(lower(http.request.uri.path), "/apps-script/")
  or starts_with(lower(http.request.uri.path), "/output/")
  or starts_with(lower(http.request.uri.path), "/docs/")
  or starts_with(lower(http.request.uri.path), "/scripts/")
  or starts_with(lower(http.request.uri.path), "/app/")
  or starts_with(lower(http.request.uri.path), "/components/")
))
```

이 규칙은 오리진의 기존 공개 제외 설정을 대체하지 않는다. 우회 오리진에서도 비공개 자료는 계속 404여야 한다. 공개 코드 저장소 자체의 접근 권한도 WAF로 바뀌지 않는다.

### 규칙 B: 정적 사이트에서 쓰지 않는 HTTP 메서드

```text
(http.host in {"mokda.kr" "www.mokda.kr"}
 and not http.request.method in {"GET" "HEAD"}
 and not starts_with(http.request.uri.path, "/cdn-cgi/"))
```

현재 폼과 AI는 별도 서버로 fetch를 보내므로 홈페이지 호스트에 POST할 필요가 없다. 추후 동일 호스트 API를 도입하면 **실제 배포한 정확한 경로와 허용 메서드만** 예외로 추가한다. 예외가 필요한 API를 준비하기 전에 이 규칙부터 켜서 서비스를 막지 않는다.

### 규칙 C: 사용하지 않는 PHP·WordPress·관리 도구 탐색

```text
(http.host in {"mokda.kr" "www.mokda.kr"} and (
  ends_with(lower(http.request.uri.path), ".php")
  or starts_with(lower(http.request.uri.path), "/wp-admin/")
  or starts_with(lower(http.request.uri.path), "/wp-content/")
  or starts_with(lower(http.request.uri.path), "/wp-includes/")
  or starts_with(lower(http.request.uri.path), "/phpmyadmin/")
  or starts_with(lower(http.request.uri.path), "/vendor/phpunit/")
))
```

무료 Managed Rules 및 DDoS 기본 보호의 상태도 대시보드에서 확인한다. 국가 전체 차단, 일반 방문자 대상 무조건 challenge, 공격을 가정한 무차별 트래픽 생성은 하지 않는다. Security Events에서 실제 규칙 이름과 요청 결과를 확인한다.

## 4. 봇·AI·문의 주소 우회 보호

Bot Fight Mode는 도메인 전체에 적용되고 WAF Skip으로 예외를 만들 수 없다. API 호출·모니터링도 challenge될 수 있다. 또한 자동 JavaScript Detections는 현재 해시 기반 meta CSP와 호환성 확인이 필요하다. `unsafe-inline`을 켜서 해결하지 않는다. 따라서 무료 WAF 규칙과 서버 검증을 먼저 적용하고, Bot Fight Mode는 실제 브라우저의 CSP 오류·모바일·검색 봇·API 정상 동작을 확인한 경우에만 켠다. 문제가 생기면 해당 기능만 끈다. [Cloudflare Bot Fight Mode 제한](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)

AI와 문의의 직접 공개 주소에는 서버에서 확인하는 anti-abuse 증명이 필요하다. Turnstile을 선택할 경우 서버가 token의 성공 여부뿐 아니라 hostname/action/만료·일회성까지 확인하고 실패 시 AI 호출·시트 저장·메일 발송 전에 거절한다. 공유 비밀값이나 사이트 검증 키는 서버 Secret/Script Properties에 보관한다. 클라이언트 코드, 문서, 로그에 넣지 않는다. [Turnstile 서버 검증](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

CORS는 브라우저의 읽기 제한이고 임의 HTTP 클라이언트의 호출을 인증하지 않는다. 홈페이지의 WAF가 workers.dev 또는 Google Apps Script를 보호한다고 설명하지 않는다. 기존 AI·문의의 크기·타입 검사, atomic quota, 일일 제한, honeypot, 중복 저장 방지와 입력 이스케이프는 유지한다. 검증 환경에서는 실제 문의·메일을 생성하거나 일일 AI 제한을 늘려 테스트하지 않는다.

GitHub Pages는 오리진 IP 또는 GitHub 도메인을 통한 접근을 완전히 제한할 수 없다. 정적 자료의 공개 제외와 기존 meta CSP는 오리진에도 남겨 두고, 서버 요청은 직접 주소에서도 검증해야 한다. 오리진까지 강제 제한이 필요하면 별도 호스팅 구조 변경을 설계한다.

## 5. 운영 계정 보호 확인

GitHub, Google, Cloudflare의 로그인된 보안 설정을 각각 읽어 MFA·복구 수단·최근 보안 활동을 확인한다. 기록은 `확인 일시 / 활성 여부 / 필요한 후속 조치`만 남긴다. 비밀번호, OTP, QR, passkey 등록 자료, 복구 코드는 읽어 저장하거나 공유하지 않는다. 신규 MFA 등록과 복구 코드 보관은 대표님이 직접 완료한다. 계정 접근이 없으면 `미확인`으로 유지하고 기존 세션·앱 권한을 무작정 취소하지 않는다.

## 6. 운영 검증과 되돌리기

배포 전 공개 상태를 저장한다.

```powershell
node scripts/verify-edge-security.mjs --baseline --output output/security/edge-before.json
```

DNS 전환 후에는 다음 검증이 모두 통과해야 한다.

```powershell
node scripts/verify-edge-security.test.mjs
node scripts/verify-edge-security.mjs --compare output/security/edge-before.json --output output/security/edge-after.json
```

검증 스크립트는 공용 DNS 두 곳의 Cloudflare NS, HTTP→HTTPS, 3개 언어의 응답 헤더와 기존 meta CSP, robots/sitemap 접근, 비공개·스캐너 경로 Block, 읽기 전용 OPTIONS 거절을 확인한다. MX·TXT·CAA·DMARC는 변경 전 결과와 비교한다. 조회한 TXT/DS는 원문 대신 해시로 기록한다. 요청은 GET·HEAD·OPTIONS뿐이며 8초 timeout과 최대 2회 시도로 제한된다. 전체 DNS 관리 목록, MFA, 원본 인증서 모드와 브라우저 기능은 이 스크립트만으로 확인되지 않는다.

추가로 Cloudflare 영역 Active·Full (strict)·저장된 규칙을 재조회하고, 실제 브라우저에서 `/ko`, `/es`, `/en`의 모바일·데스크톱, 언어 변경, 동영상, 챗봇 응답/fallback, WhatsApp 링크, 폼 입력 및 상태, 콘솔 CSP 오류를 확인한다. GitHub의 배포 commit과 공개 HTML을 대조한다.

되돌리기는 실패한 개별 규칙이나 Bot Fight Mode부터 비활성화한다. HTTPS 문제는 origin 인증서·DNS·호스트를 먼저 확인하고 Flexible로 낮추지 않는다. DNS 원복은 변경 전 전체 백업과 원래 네임서버로 복원하며, DS 상태도 함께 맞춘다. 메일·인증 레코드를 삭제해 문제를 해결하지 않는다.

## 실행 기록

| 작업 | 상태 | 완료 근거 |
| --- | --- | --- |
| 기존 DNS·Cloudflare 영역 확인 | 확인 | 위 출발점 |
| 무료 영역·레코드 준비 | 대기 | 저장된 영역과 전체 DNS 대조 필요 |
| 네임서버 전환·Active 확인 | 대기 | 등록기관 설정 및 공용 DNS 확인 필요 |
| HTTP 헤더·WAF | 대기 | 대시보드 규칙 재조회와 공개 검증 필요 |
| 직접 API 주소 보호 | 별도 실행 | 서버 검증을 배포하고 실패 요청을 확인해야 완료 |
| 운영 계정 MFA | 미확인 | 로그인된 계정 설정의 읽기 확인 필요 |
| 검증 도구 | 준비·로컬 검증 통과 | 보안 헤더, DNS 변경, WAF와 오리진 404 구분, 읽기 전용 요청, TXT 비노출 fixture 검사 및 Node 문법 검사 통과. 공개 운영 검증은 별도 실행 |

작업 완료 여부는 실행 기록과 운영 증거로 결정한다. 계획·로컬 테스트 성공·Cloudflare 로그인 성공만으로 전체 홈페이지 보호가 완료됐다고 표현하지 않는다.
