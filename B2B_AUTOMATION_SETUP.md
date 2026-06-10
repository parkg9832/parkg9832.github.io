# MOKDA B2B 자동화 설정

## 1. 생성된 Google Sheet

- 시트: https://docs.google.com/spreadsheets/d/1TnIel1nX5ITVIKynQQrdPG0B5Kx-6q9YOABV3KliJ20/edit

폼이 제출되면 이 시트에 자동 저장됩니다. 첫 제출 시 헤더가 자동 생성됩니다.

## 2. Google Apps Script 설정

1. https://script.google.com/ 로 이동합니다.
2. 새 프로젝트를 만들고 이름을 `MOKDA B2B Lead Automation`으로 설정합니다.
3. `apps-script/b2b-lead-automation.gs` 파일 전체 코드를 붙여넣습니다.
4. `프로젝트 설정` > `스크립트 속성`으로 이동합니다.
5. 아래 속성을 추가합니다.

```text
SHEET_ID=1TnIel1nX5ITVIKynQQrdPG0B5Kx-6q9YOABV3KliJ20
CHAT_WEBHOOK_URL=YOUR_GOOGLE_CHAT_INCOMING_WEBHOOK_URL
```

6. `배포` > `새 배포` > `웹 앱`으로 배포합니다.

```text
실행 사용자: 나
액세스 권한: 모든 사용자
```

7. 배포 후 생성되는 Web App URL을 복사합니다.
8. `b2b-config.js`에 붙여넣습니다.

```js
window.MOKDA_B2B_WEB_APP_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
```

## 3. Google Chat Webhook

알림을 받을 Google Chat 스페이스에서 Incoming Webhook을 생성합니다.

Webhook URL은 반드시 Apps Script의 `CHAT_WEBHOOK_URL` 속성에만 넣습니다. 웹사이트 코드에는 넣지 않습니다.

## 4. 동작 방식

1. 고객이 홈페이지 B2B 폼을 제출합니다.
2. 웹사이트가 Apps Script Web App으로 데이터를 보냅니다.
3. Apps Script가 원문을 Google Sheet에 저장합니다.
4. KR/EN 입력은 스페인어로 자동 번역합니다.
5. Google Chat으로 문의 요약과 스페인어 번역본을 알림으로 보냅니다.
