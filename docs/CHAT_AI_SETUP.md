# MOKDA 상담 AI 서버

작성일: 2026-10-11. 정적 GitHub Pages 홈페이지는 그대로 두고 `workers/mokda-chat`의 Cloudflare Worker만 AI 요청을 처리한다. AI 서버는 Cloudflare 계정 로그인과 별도 배포가 완료된 뒤 공개 상담창 설정에 연결한다. 로컬 파일이나 배포용 bundle이 준비됐다는 사실만으로 AI가 활성화됐다고 표시하지 않는다.

## 역할과 사실의 기준

- AI는 자유롭게 쓴 질문의 의미와 최근 대화의 지시 대상을 해석하고, 공개 제품 자료를 바탕으로 짧은 문장을 작성한다.
- 답변의 `interpretation`은 제한된 값만 허용한다. 연락 버튼의 표시, 문의 자격 확인, 내부 제품 링크는 홈페이지의 규칙 기반 엔진이 결정한다.
- 최신 대표님 지시가 이전 FAQ보다 우선한다: 대한민국에서는 소비자 판매를 진행한다. 중남미에서는 현재 유통·수입 바이어를 찾고 있으며 개인 대상 판매나 국제 배송을 안내하지 않는다.
- 제품 맛·맵기·활용법은 상세 페이지에서 먼저 안내한다. 기업 문의는 판매 국가, 업종/유통 채널, 관심 제품을 확인한 다음 담당자 상담으로 이어진다. 예상 수량을 임의로 만들거나 필수로 강제하지 않는다.
- 2026-10-12 대표님 답변을 `site-company-knowledge.js`에 기록했다. 기본 MOQ 1,000개·혼합 구성 협의, 샘플 50개 미만·1회 제품 무료·국제 운임 바이어 부담, 박스당 12개와 B2B 대용량 협의 등을 안내한다. 가격은 개별 견적, 출고는 주문별 협의다. 인증은 일반적인 존재만 확인됐으며 정확한 종류·적용 범위는 담당자 확인이 필요하다.
- 재고, 확정 가격·일정, 특정 인증 및 통관 승인은 미확인 상태다. 알레르기와 개인 건강에 관한 안전 보장은 하지 않는다. Para Carnes가 비매운 제품이라는 근거 없는 설명도 금지한다.
- MOKDA가 직접 설명하는 말투로 답한다. “제품 소개 자료에 따르면” 같은 간접 설명은 사용하지 않는다. AI라는 표시와 협의가 필요한 조건은 유지한다.

## 공개 자료 bundle

`scripts/generate-knowledge.mjs`는 `site-company-knowledge.js`의 공개 회사 지식, 홈페이지 FAQ, 제품·브랜드 페이지와 소식 데이터만 읽어 `src/knowledge.json`을 생성한다. 공개 회사 지식의 필드·문구를 검증하며 예상하지 못한 필드가 있으면 생성을 중단한다. 제품 상세의 `<dl>` 항목은 이름과 값을 함께 포함한다. Drive 자료, 원문 상담 자료, 폼에 입력된 값, API 키는 읽지 않는다. 자료를 바꾼 뒤에는 다국어 페이지 생성에 이어 knowledge를 다시 생성한다.

각 언어의 제품 핵심 FAQ, 질문과 관련된 FAQ 및 제품 페이지 일부를 프롬프트에 넣는다. 이전 구매·가격·수출 FAQ의 연락 유도 문구는 현재 퍼널에 맞지 않아 모델 자료에서 제외한다. 방문자 대화와 브라우저가 제공한 문맥은 신뢰할 수 없는 사용자 데이터이며, 서버 정책이나 공개 자료를 덮어쓸 수 없다. 브라우저가 제공한 `decision.localAnswer`를 회사의 사실로 사용하지 않는다.

## API 계약

`POST /chat`, `Content-Type: application/json`:

```json
{
  "language": "ES",
  "messages": [
    { "role": "user", "content": "Quiero ofrecer las salsas en mi restaurante en Perú." }
  ],
  "context": { "product": "kpeno", "audience": "b2b", "country": "Peru" }
}
```

메시지는 최대 8개, 각 600자, 전체 3,000자다. 마지막 메시지는 `user`여야 한다. `system`/도구 역할은 거부한다. 요청 body는 `Content-Length` 유무와 관계없이 12,000 bytes까지 읽는다.

성공 응답:

```json
{
  "text": "K-PEÑO combina gochujang y jalapeño. Para Carnes es una salsa a base de ssamjang para acompañar carnes y verduras.",
  "interpretation": {
    "intent": "horeca",
    "audience": "b2b",
    "product": "kpeno",
    "country": "Peru",
    "businessType": "restaurant",
    "quantity": "",
    "food": "",
    "heatPreference": ""
  }
}
```

- `text`는 짧은 사실 설명 1~3문장으로 최대 1,200자이고 전체 JSON은 UTF-8 기준 2,500 bytes 이하다. 링크, HTML, Markdown 링크와 후속 질문 기호를 포함한 출력은 거부한다. AI가 정보 수집 질문을 직접 만들지 않고, 홈페이지 엔진이 실제 누락된 정보를 확인한다.
- `intent`: `choose`, `pairings`, `spice`, `ingredients`, `storage`, `buy`, `pricing`, `export`, `horeca`, `brand`, `history`, `news`, `creators`, `collaboration`, `contact`, `unknown`.
- `audience`: 빈 문자열, `b2c`, `b2b`, `collaboration`.
- `product`: 빈 문자열, `kpeno`, `para_carnes`, `both`.
- `country`: 빈 문자열 또는 서버에 정한 국가 이름. `South Korea`, `Mexico`, `Peru`처럼 영어 이름을 사용한다.
- `businessType`: 빈 문자열, `importer`, `distributor`, `retailer`, `restaurant`, `horeca`, `online`, `other`.
- `quantity`: 방문자가 실제로 말한 수량만 전달하며, 수량 정보가 없으면 빈 문자열이다.
- `food`: 빈 문자열, `tacos`, `chicken`, `meat`, `vegetables`, `snacks`, `other`.
- `heatPreference`: 빈 문자열, `less_spicy`, `spicy`.
- 선택 필드 `companyTopic`: 빈 문자열 또는 `moq`, `samples`, `pricing`, `leadTime`, `packing`, `bulk`, `documents`, `certifications`, `namedCertifications`, `support`, `oem`, `exclusive`, `brand`, `specifications`. 이전 응답에 이 필드가 없어도 기존 계약을 유지한다.

모델의 반환 값은 신뢰하지 않고 JSON 구조·길이·허용 값을 다시 검사한다. 모든 해석 필드는 개별 문자열이어야 한다. 모델이 허용 값 목록을 배열로 복사하거나 필수 필드를 생략한 경우 이를 성공한 `unknown` 응답으로 바꾸지 않고 오류로 처리한다. 모델이 잘못된 JSON, 초과 출력 또는 링크를 반환하면 자동 안내로 돌아간다. 입력의 명시적인 정정이 AI 문맥 추론보다 우선하며, 연락 가능 여부는 이 응답에 포함하지 않는다. 다국어의 개인 구매·수입사 샘플 문의·맵기 선호 추출 예시를 프롬프트에 포함한다.

AI 요청은 서버에서 10초 후 응답을 포기한다. 모델 실행이 서버 내부에서 즉시 취소된다고 보장하지는 않는다. 브라우저는 12초 제한과 규칙 기반 fallback을 둔다. 서버 오류, 무료 한도, 속도 제한이 발생해도 문의 조건을 완화하거나 즉시 WhatsApp을 노출하지 않는다.

`GET /health`는 Worker 응답과 binding 설정 유무만 확인한다. 실제 모델 호출 성공 여부를 증명하지 않는다. 공개 활성화 확인은 정상 origin의 `/chat` 요청과 실제 홈페이지 상담 흐름으로 진행한다.

## 비용과 속도 제한

모델: [`@cf/qwen/qwen3-30b-a3b-fp8`](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/). 공식 모델 정보에서 다국어 지원을 확인했다. 최대 출력은 360 tokens, temperature는 0.2다. Qwen이 공식적으로 안내하는 `/no_think` 지시를 사용하며, 모델 출력의 `<think>` 부분은 고객에게 표시하지 않는다. Cloudflare의 해당 모델 API에 확인되지 않은 `enable_thinking` 필드는 전달하지 않는다. 모델의 JSON 출력은 로컬 validation을 통과해야 한다.

[Cloudflare Workers AI 가격 문서](https://developers.cloudflare.com/workers-ai/platform/pricing/) 기준(2026-10-11 확인), 무료 할당량은 계정 전체 하루 10,000 Neurons이며 UTC 00:00에 초기화된다. Workers Free에서는 한도 초과 요청이 실패한다. 유료 플랜이나 결제 등록으로 자동 전환하지 않는다. 다른 Worker의 AI 사용량과도 공유되므로 이 서버의 요청 제한만으로 계정 전체 무료 한도를 보장할 수는 없다.

이 Worker는 SQLite 기반 Durable Object 1개로 모든 지역의 호출 수를 원자적으로 제한한다.

- 전체: 하루 최대 80회. `DAILY_AI_LIMIT`를 낮출 수 있지만 코드 상한 80회를 넘길 수 없다.
- 같은 접속 IP의 일별 hash: 분당 최대 3회, 하루 최대 20회.
- 날짜가 바뀌면 누적 카운터를 새로 시작한다. 모델 오류·시간 초과도 이미 예약된 횟수로 계산한다.
- 요청이 거절됐을 때 AI binding을 우회 호출하는 fallback은 없다.

IP 제한은 통신사·회사 공용 IP를 사용하는 방문자를 함께 제한할 수 있다. 이 경우 홈페이지의 자동 안내는 계속 작동한다. 저장하는 값은 UTC 날짜, 호출 횟수와 날짜별 IP hash다. hash는 가명처리된 식별값이며 완전한 익명성 보장으로 표현하지 않는다. 대화 내용과 raw IP는 이 서버의 저장소나 로그에 남기지 않는다. Cloudflare observability는 꺼져 있다. [Cloudflare 데이터 이용 정책](https://developers.cloudflare.com/workers-ai/platform/data-usage/)도 운영 기준으로 확인한다.

Origin은 `https://www.mokda.kr`, `https://mokda.kr`, `https://parkg9832.github.io`만 허용한다. localhost는 `ALLOW_LOCALHOST=true`인 명시적인 개발 배포에서만 가능하다. Origin 검사는 API 인증 수단이 아니므로 전체 호출 상한도 함께 적용한다.

## 배포 절차

작업 디렉터리는 `workers/mokda-chat`이다. Wrangler credential은 로컬 계정 저장소에서 관리하고 공개 파일에 넣지 않는다.

```powershell
node scripts/generate-knowledge.mjs
node --test test/chat.test.mjs
npx wrangler whoami
npx wrangler deploy --dry-run
npx wrangler deploy
```

`whoami`가 로그인되지 않았다고 답하면 먼저 `npx wrangler login`에서 계정 인증을 완료한다. 계정이나 요금제 등록을 대신 선택하지 않는다. 배포 전 Workers Free 계정 사용 여부를 확인한다. 무료 계정의 SQLite Durable Objects 지원은 [공식 Durable Objects 문서](https://developers.cloudflare.com/durable-objects/platform/pricing/)에서 확인한다.

최초 배포에서 `ChatLimiter` SQLite class migration이 적용된다. 임의로 이미 존재하는 class namespace를 삭제하거나 migration 기록을 바꾸지 않는다. 실행 후 반환된 실제 Worker URL을 상담 설정에 넣고, 운영 사이트 origin의 대화 요청을 검증한다. Worker URL이 확인되지 않으면 endpoint를 지어내지 않는다.

## 검증 기록

구현 시 Node 테스트에서 origin·입력 제한, prompt 역할 분리, 출력 검증, 모델 token 제한, 시간 초과, 카운터 원자성, 일별/방문자 제한, 오류 정보 비노출을 확인한다. Wrangler dry-run으로 AI와 SQLite Durable Object binding을 포함한 Worker bundle을 검증한다. 실제 AI 품질과 운영 배포 결과는 로그인·배포 후 별도로 확인해야 하며, mock inference 테스트를 실제 모델 응답으로 설명하지 않는다.

2026-10-12 운영 Worker 배포:

- endpoint: `https://mokda-chat.mokda-chat-worker.workers.dev/chat`
- Worker version: `3dd1c184-f006-4633-bb53-f6ac1b87c4c4`
- 서버 테스트 15개, 상담 흐름 103개, AI 전송 클라이언트 28개와 다국어 페이지 48개의 연동 검사를 통과했다.
- 실제 모델은 한국어 타코 소스 질문, 스페인어 리마 개인 구매 질문, 영어 멕시코 수입사 샘플 문의에서 각각 제품 활용·개인 구매·기업 거래 의도와 국가를 해석했다. 이 세 사례가 모든 자유문장에 대한 정확도를 보장하지 않는다.
- 이번 최종 점검의 Windows 브라우저 도구는 현재 주소를 확인하지 못해 중단됐다. DOM 기반 모바일/데스크톱 분기 검사와 운영 HTTP/API 검증을 사용하며, 이를 네이티브 브라우저 시각 검증으로 설명하지 않는다.

2026-10-12 회사 지식 확장 배포:

- Worker version: `c05a02bc-5337-4db8-8a27-7b480400788e`
- 공개 지식 원본의 14개 주제·42개 안내를 홈페이지와 AI가 공유한다. 원문 상담 기록은 배포하지 않는다.
- 회사 안내·직접 설명 문체·인증의 한계·소비자/바이어 흐름 검사를 포함한 회사 안내 검사 92개, 상담 상태 검사 103개, AI 전송 검사 46개, 서버 검사 18개를 통과했다. 별도로 다국어 페이지 48개의 자료 연결도 검사했다.
- 공식 WhatsApp 번호는 대표님 정정에 따라 **+82 10 2212 7815**다.
- 모델이 계약에 맞지 않는 출력을 반환하면 내용이나 원문 오류를 공개하지 않고 `invalid_ai_response`와 HTTP 502만 반환한다. 다른 서버 오류와 구분해 진단하며 홈페이지는 기본 안내로 복구한다.
