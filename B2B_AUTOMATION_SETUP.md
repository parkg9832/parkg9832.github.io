# MOKDA 문의 자동화 운영

홈페이지 문의는 `b2b-config.js`의 공개 Web App으로 접수하고, 기존 Google Sheet에 저장한 뒤 운영 담당자에게 알립니다. 문의 자동화는 홈페이지 GitHub Pages와 별도로 배포합니다.

## 기존 운영 프로젝트 갱신

1. 기존 운영 프로젝트를 사용합니다. 다른 MOKDA 자동화 프로젝트를 덮어쓰거나 새 문의 프로젝트를 중복 생성하지 않습니다.
2. 로컬 clasp 매핑의 프로젝트가 `b2b-config.js`의 활성 `/exec` 배포를 소유하는지 인증된 배포 목록으로 확인합니다. 자격증명, 프로젝트·배포 식별자와 운영 데이터는 공개 저장소에 넣지 않습니다.
3. 원격 `@HEAD` 소스와 매니페스트를 읽어 별도 로컬 백업하고, 이번 변경과 관계없는 원격 수정이 없는지 비교합니다.
4. `apps-script/b2b-lead-automation.gs`의 검증된 코드를 기존 프로젝트에 반영합니다. 기존 매니페스트와 Script Properties는 유지합니다.
5. `clasp push` 뒤에 불변 버전을 만들고 **기존 활성 Web App 배포를 그 버전으로 갱신**합니다. push만으로는 운영 `/exec`가 바뀌지 않습니다. 현재 공개 URL과 실행·접근 설정은 유지합니다.
6. 인증된 배포 목록에서 정확한 활성 버전을 다시 확인하고, 조회용 health와 부작용 없는 거절 경로를 검사합니다. 테스트 문의를 저장하거나 알림 메일을 보내지 않습니다.

## Script Properties

아래 연결 값은 Apps Script의 `프로젝트 설정 > 스크립트 속성`에만 저장합니다. 공개 코드나 문서에는 실제 값 대신 항목명만 남깁니다.

```text
SHEET_ID=EXISTING_OPERATING_SHEET_ID
CHAT_WEBHOOK_URL=YOUR_GOOGLE_CHAT_INCOMING_WEBHOOK_URL
NOTIFICATION_EMAIL=YOUR_EMAIL_FOR_B2B_ALERTS
TURNSTILE_SECRET=SERVER_SIDE_VERIFICATION_SECRET
```

유효한 Google Chat Incoming Webhook이 있으면 Chat으로 알립니다. 없거나 Chat 전송에 실패하면 설정된 이메일로 알림을 시도합니다. 알림 실패와 관계없이 이미 저장된 문의는 저장 성공으로 처리하며, 원문을 유지합니다.

기존 Web App의 운영 설정:

```text
실행 사용자: 나
액세스 권한: 모든 사용자
```

공개 Web App URL은 비밀값이나 인증 수단이 아닙니다. URL 변경이 필요한 경우 홈페이지 설정 원본은 `b2b-config.js` 하나이며, 다국어 페이지를 다시 생성해 반영합니다.

## 요청 방어와 처리

1. 고객이 홈페이지 B2B 폼을 제출합니다.
2. 웹사이트가 Apps Script Web App으로 데이터를 보냅니다.
3. 서버가 본문 32KB, 필드 타입·길이, 언어와 연락처를 검사합니다. honeypot과 잘못된 요청은 번역·저장·알림을 실행하지 않습니다.
4. 서버가 매 요청 Turnstile 토큰을 검증합니다. 성공 여부, `mokda_inquiry` action과 정확한 공식 hostname을 확인하고 위조·만료·재사용·검증 장애는 저장·번역·알림·예산 예약 전에 거절합니다. 공개 sitekey만 브라우저에 두며 비밀값은 Script Properties에 저장합니다.
5. Script Lock 안에서 중복 receipt와 단기 제한을 확인하고, 하루 처리 예산을 예약합니다.
6. 원문을 보존하며 한국어·스페인어 번역을 준비합니다. 번역이 실패하면 원문을 사용합니다.
7. 모든 문의·번역 셀의 수식 시작 문자를 escape한 뒤 Sheet에 저장합니다. 저장 후 가능한 채널로 알립니다.

문의 단기 제한은 전역 분당 30건, 동일 연락처 시간당 5건입니다. CacheService 기반이므로 캐시가 사라지면 이 단기 제한과 10분 중복 receipt가 초기화될 수 있습니다.

별도로 **한국시간 하루 80건의 전역 문의 처리 예산**을 Script Properties의 `PUBLIC_INQUIRY_DAILY_BUDGET`에 저장합니다. 이 값은 `{day,count}`만 포함하며 연락처·메시지를 저장하지 않습니다. 캐시 삭제나 연락처 변경으로 일일 예산을 초기화할 수 없습니다. 성공한 중복 재요청은 추가 소비하지 않고, 예약 뒤 처리 실패는 소비한 예산을 되돌리지 않습니다. 한국시간 자정에 다음 문의가 새 일자를 시작합니다. Google 계정 전체의 이메일·번역 할당량과는 별도의 홈페이지 안전 제한입니다.

일일 상태가 손상되거나 PropertiesService·Lock이 실패하면 작업을 시작하지 않고 일반 오류를 반환합니다. 운영자가 상태를 수정해야 할 때는 인증된 프로젝트의 속성에서 해당 값만 점검합니다. 고객 데이터나 연결 속성을 일괄 삭제하지 않습니다. 전송 오류 응답과 로그에 문의 내용·통합 서비스 응답·원격 오류 상세를 기록하지 않습니다.

분석 수집은 기존 분당 120개 batch, batch당 20개 event 제한을 유지합니다. 분석 데이터는 방문자가 제출한 값이므로 인증된 매출·고객 정보로 취급하지 않습니다.

Apps Script는 신뢰할 수 있는 요청 IP를 제공하지 않아 브라우저가 보낸 IP는 검증 근거로 쓰지 않습니다. 직접 공개 Web App 주소에 요청해도 같은 Turnstile 검증을 수행합니다. 검증 토큰은 5분 유효하며 일회용이므로 재시도에는 새 토큰이 필요합니다. 전체 DDoS나 Google 계정 전체의 서비스 할당량까지 보장하는 방어는 아닙니다. 분석 이벤트는 문의 검증과 분리하며 기존 제한을 유지합니다. [Turnstile 서버 검증](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## 검증

`npm run test:security`에는 문의 endpoint의 모의 검증, `scripts/inquiry-quota.test.mjs`, `scripts/inquiry-turnstile.test.mjs`가 포함됩니다. 일일 경계, 캐시 삭제, 연락처 교체, 한국시간 자정, 중복 재요청, 저장 실패, 속성 손상·읽기·쓰기 실패와 Lock 경합, 위조·재사용 토큰·잘못된 hostname/action·검증 서비스 장애를 실제 서비스 쓰기 없이 검사합니다.
