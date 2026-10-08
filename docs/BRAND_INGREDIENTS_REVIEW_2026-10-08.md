# 브랜드 소개·원재료·연혁·홈 소식 검수

## 적용 내용

- 브랜드 소개의 Comer Corea 오프닝, 우리가 믿는 것, Our Journey 사진 카드와 지원사업 상세 나열 제거.
- 기존 Brand Story 본문과 MOKDA 이름·상징 설명 유지.
- 브랜드 스토리에는 대표와 제품이 함께 나온 부스 사진, 원재료에는 고추를 살펴보는 사진 한 장씩 사용.
- 원재료 설명은 고추장·된장, 원재료 검토, 배합과 시제품 테스트를 중심으로 작성.
- 연혁은 2024·2025·2026 세 연도, 다섯 기록으로 정리. 연도·월·문구 모두 가운데 정렬. 빨간 밑줄 제거.
- 홈 소식은 공통 제목 크기·여백·사진 모서리를 사용하고 카드 박스 테두리 제거. 제목·분류·카드 문구·전체 보기 버튼 가운데 정렬.
- 섹션 제목과 소개 문구는 PC·모바일에서 가운데 정렬을 기본으로 한다. 실제 읽기 목록과 폼 등은 문맥에 맞춰 배치한다.
- 모션은 작은 이동과 한 번의 등장 효과, 화면에 들어온 연도의 색 변화로 제한. reduced-motion에서는 움직임 제거.

## 사진 제작

내장 image_gen으로 가로 배경을 생성했다. 생성 과정에서 인물과 제품이 다시 그려지는 문제를 확인해 원본의 인물·제품·라벨·문구를 복원했다. 원본과 생성 배경이 맞닿는 배경 가장자리만 혼합했다. 무손실 검증본에서 인물·제품·문구를 포함한 보호 영역이 원본을 동일 비율로 리사이즈한 픽셀과 같음을 확인했다. 게시용 파일은 WebP 압축본이다.

최종 파일(모두 16:9):

- `assets/images/brand-story-wide-20261008.webp` — 1600×900
- `assets/images/brand-story-wide-20261008-800.webp` — 800×450
- `assets/images/brand-ingredients-wide-20261008.webp` — 1600×900
- `assets/images/brand-ingredients-wide-20261008-800.webp` — 800×450

부스 사진의 선택 생성 프롬프트:

> Use case: precise-object-edit. Fix ONLY the generated outside panels of the supplied 1600x900 landscape booth photo. Lock central rectangle x389 through1210 at all rows y0 through899 in its EXACT present position/scale. Preserve original founder face, body, pose, hands, all sauce bottles, labels, booth typography and banners; do not redraw or move center. The left and right outside panels currently have hard seams especially the tabletop at left and right. Extend the precise existing booth's backdrop folds, top metal rail, table white cloth and gray table trim continuously outward from those fixed original edges. Continue the original tabletop's edge at the exact same y and angle at each central boundary, extend its perspective naturally. Match local exposure and folds against original central backdrop. Edit ONLY x0..388 and1211..1599. Keep center untouched. Output full16:9 canvas unchanged, no crop, zoom, new people/products or invented lettering. Seamless professional natural photo.

고추밭 사진의 선택 생성 프롬프트:

> Use case: precise-object-edit. Repair ONLY the two generated OUTER SIDE PANELS of this 1600x900 landscape photo. Keep the rectangular original central photograph (x463 through x1137, every y0 through899) pixel-for-pixel fixed in its exact current position and scale. Do not redraw that center, the man, his face, hand, chili, straw hat, plants, wires, poles, sky or anything inside the center. The current outside panels are visibly brighter with mismatching hills and perspective. Change ONLY x0..462 and x1138..1599 to continue the exact muted blue sky, hill silhouette, rice field, pepper rows and soil from the adjacent fixed central edges. Match the center exposure and color precisely, and join all rows of pixels continuously at the two boundaries. Original center appears dimmer than the outside; dim the generated sides, do NOT brighten the center. No new people, products, signs or lettering. Keep full 16:9 canvas, no crop, no zoom, no moving or resizing the center. Deliver a seamless natural photograph; preserve original pixels in center.

## 사실 표기

- 인증서나 시험성적서는 확인되지 않아 인증 통과 문구를 넣지 않았다.
- Expoalimentaria는 기존 공개 행사 기록의 2026년 9월 일정에 맞춰 09로 표기했다. 사용자가 제시한 10월과의 차이는 별도로 확인 요청했으며 답변 대기 중이다.
- 전주 엑스포는 현재 날짜 기준 미래 일정이므로 참가 예정으로 표기했다. [공식 행사 안내](https://www.iffe.or.kr/eng/theme/iffe2023/info/info_01.php)는 2026년 10월 22~26일을 안내한다.
- 2024·2025 개발 기록과 2026 지원사업 10건·약 1억원은 사용자 제공 내용이다.

## 참고와 검증

[CJ제일제당 연혁](https://www.cj.co.kr/kr/aboutus/cj-cheiljedang/history)과 [대상 연혁](https://www.daesang.com/kr/company/history.jsp)의 연도 위계와 간결한 기록 구성을 실제 브라우저에서 참고했다. 참고 사이트의 이미지나 문구는 가져오지 않았다. 최종 정렬은 사용자의 가운데 정렬 선호를 우선했다.

- 다국어 생성: 42페이지.
- 분석 회귀 14개, 타입 검사, SEO, 내비게이션, 뉴스, 사이트 무결성 검사 통과.
- 한국어·영어·스페인어의 홈 소식과 브랜드 소개를 390px·1440px에서 확인. 한국어 브랜드 소개는 320px·768px에서도 확인.
- 제목·소개·연혁 가운데 정렬, 가로 넘침 없음, 관찰한 화면의 깨진 이미지 없음. 언어 전환 확인. 콘솔 오류 없음.
- 스크린샷: `output/playwright/brand-ingredients/ko-home-news-centered-desktop.png`, `ko-home-news-centered-mobile.png`, `ko-history-centered-desktop.png`, `ko-history-centered-mobile.png`.

이 문서는 로컬 구현 검수 기록이다. 공개 배포 완료를 의미하지 않는다.
