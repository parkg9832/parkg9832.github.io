# MOKDA 상담창 디자인과 적용 기록

2026-10-11. 대표님이 흰색·차콜 시안을 승인하고 구현·배포를 요청했다. 같은 날 AI 서버 없이 상담창과 WhatsApp 연결을 먼저 제공하도록 범위를 확정했다.

## 직접 확인한 레퍼런스

| 참고 | 확인한 화면 | 채택한 구조 |
|---|---|---|
| [Intercom](https://www.intercom.com/live-chat?bbpage=1) | 실제 열린 데스크톱 메신저와 모바일 화면. 문의 전송 없이 확인 | 간결한 헤더, 대화 중심의 화면, 고정 입력창 |
| [Tidio](https://www.tidio.com/) | 실제 상담 런처·홈 진입 패널과 채팅 화면. 답변 성능은 시험하지 않음 | 원형 런처, 담당자 연결의 분명한 위치 |
| [assistant-ui](https://www.assistant-ui.com/) | 공개 실행 예제의 전체 화면, 입력창·제안 버튼·새 대화 | 대화/입력 영역 분리, 새 메시지 보기, 짧은 제안 |

assistant-ui 홈페이지는 MIT 라이선스의 React 라이브러리라고 명시한다. 현재 공개 사이트는 정적 HTML과 공통 JavaScript이므로 React 런타임·AI transport를 추가하는 대신 위 구조를 기존 방식으로 직접 구현했다. 템플릿 소스 코드를 복사하거나 해당 라이브러리를 설치하지 않았다.

화면 증거는 공개 저장소에 넣지 않는 `output/chat-redesign/`에 보관한다: `intercom-desktop.png`, `intercom-mobile.png`, `tidio-desktop.png`, `assistant-ui-template.png`, `messenger-preview-full.png`와 로컬/운영 검증 화면.

## 확정 시안

[Superdesign 시안 버전 2](https://superdesign.dev/teams/205b7882-7d98-431c-bc3e-b90671bf58aa/projects/f0de2ff9-4b28-4ad4-a834-a04a4a8a1979?node=draft-variant-18e009e9-4212-47f9-bcbd-0157aab087b6). 기존 UI 재현 후 시안을 직접 작성하여 가져왔다. 후속 모델 생성 없이 적용했다. 실제 MOKDA 로고를 사용한다.

- 흰색 헤더와 푸터, 회색 대화 배경, 차콜 사용자 말풍선, 녹색 담당자 연결.
- 본문/입력 16px, 제안/CTA 14px, 부제/안내 13px. 최소 44px 조작 영역.
- 처음에는 제안 3개, 답변 후에는 필요한 제안 2개. 담당자 요청에는 추가 메뉴를 내지 않는다.
- 데스크톱 비모달 패널, 모바일 네이티브 전체 화면 모달과 visualViewport 대응.
- 입력 포커스 유지, 짧은 처리 표시와 메시지 모션, 모션 줄이기 대응.

## 검증 한계

JSDOM 검사는 실제 네이티브 모달이나 휴대폰 키보드 증거가 아니다. 실제 브라우저에서 패널/입력/포커스/닫기/페이지 이동과 세 언어의 작은 화면을 확인한다. 실물 iOS/Android 키보드와 스크린리더 음성 출력은 별도 기기 검증 대상이며 완료했다고 주장하지 않는다. 로컬 엔진은 제한된 공개 정보 안내이며 생성형 AI가 아니다. WhatsApp 링크를 검증하고 실제 메시지는 보내지 않는다.
