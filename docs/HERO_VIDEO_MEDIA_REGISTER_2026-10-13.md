# MOKDA 메인 히어로 영상

2026-10-14 수정본(v3). 같은 사람의 인터뷰가 반복되던 구성을 바꿨다. 인터뷰는 2.75초 한 컷으로 줄이고, 제품을 들고 있는 행사 참가자와 서로 다른 크리에이터 두 명을 이어 붙였다. 박람회 전경, 이전 시식 장면, 생성 누끼컷 배경, 정치인 장면은 사용하지 않는다.

## 공개 파일

- 데스크톱: `assets/videos/hero/mokda-people-desktop-20261014-v3.mp4` — 1280×720, 24fps, 9.5초.
- 모바일: `assets/videos/hero/mokda-people-mobile-20261014-v3.mp4` — 576×1024, 24fps, 9.5초.
- 포스터: `assets/images/mokda-hero-desktop-20261013-v2.webp`, `assets/images/mokda-hero-mobile-20261013-v2.webp`. 동일한 첫 인터뷰 장면에서 추출한 기존 포스터를 유지한다.
- H.264/SDR, 음성 트랙 없음, MP4 faststart. 두 해상도 중 화면에 맞는 파일 하나를 불러온다.

## 편집 구성과 원본

| 구성 | 원본 | 사용 구간 |
|---|---|---|
| MOKDA 부스 인터뷰 | [20260923_115951.mp4](https://drive.google.com/file/d/1rw9h3hwsEh5SaJC-lEGIooIu1-A20Nhq/view) | 10.00–12.75초, 원래 속도; 인터뷰는 이 한 컷만 사용 |
| 소스를 받은 KPOP STYLE 참가자 | [IMG_8179.JPG.jpeg](https://drive.google.com/file/d/10t1awnvummRN3aes_AFWZYuNntoL38MI/view) | 실제 단체사진에 3.25초 동안 2.5% 미세 확대; 데스크톱과 모바일 구도를 별도 편집 |
| 두 제품을 소개하는 크리에이터 | [Video by adriandjah.mp4](https://drive.google.com/file/d/1dRg-Ger6dq25Sh7IlUuKUPXAYhfZqM4z/view) | 9.75–12.45초, 속도 90%; 완성 영상에서 3초 |
| 두 제품을 든 다른 크리에이터 | [Video by shuritheswing.mp4](https://drive.google.com/file/d/1RjaqcalqcJEkh4dcULUzUj_ODiqIJMCg/view) | 1.00–2.60초, 속도 80%; 완성 영상에서 2초. 좌우 반전된 원본을 보정해 제품명이 바르게 보이게 함 |

장면 전환은 0.5초 디졸브로 통일했다. 한 반복 안에서 같은 인터뷰를 재사용하지 않는다. 네 장면 모두 사람과 제품을 중심으로 구성한다. 원본 세로 영상은 모바일 구도를 유지하고, 데스크톱은 얼굴과 제품 라벨이 보이도록 별도 크롭했다. HLG 인터뷰 촬영본만 SDR로 변환했으며 이미 SDR인 협업 영상에는 톤매핑을 중복하지 않는다. 파일명을 새 버전으로 변경해 이전 영상이 브라우저 캐시에 남아 계속 재생되는 것을 방지한다.

## 재생 정책

- 첫 화면에는 작은 포스터를 표시하고, 영상은 화면에 보일 때 무음으로 재생한다.
- 화면 밖·백그라운드·페이지 이탈에서는 정지한다. 사용자가 일시정지하면 자동 재개하지 않는다.
- 모션 줄이기·데이터 절약 설정에서는 포스터를 유지하며 영상을 요청하지 않는다.
- 재생 실패 시 포스터와 기존 문구·제품 링크를 유지한다.
- 홈페이지의 한국어·스페인어·영어 캠페인 문구는 기존 내용을 유지한다.

## 제외한 이전 초안의 생성 배경 기록

이전 초안은 내장 `image_gen` 도구로 병과 문자 없이 배경만 생성한 뒤 원본 제품 사진을 합성했다. 이 장면은 v2 공개 영상과 포스터에서 제외했다. 아래 프롬프트는 제작 이력으로 보관한다.

```text
Use case: ads-marketing. Asset type: a cinematic backdrop for a Korean sauce company's homepage hero film, to be composited with two existing real sauce bottle cutouts and website headings. Generate only the environment, without products or lettering. Photorealistic food advertising still, very wide landscape 16:9, 2048x1152 or larger. A warm dark walnut/brown tabletop in a refined food photography studio, seamless deep espresso background, soft amber daylight from the upper left and a restrained rim light on the far right, subtle real stone/wood texture, natural shallow depth of field. The central and upper 65 percent stays quiet and dark enough for cream website text. On the distant far-left and far-right lower edges there can be very subtle, deeply out-of-focus hints of grilled meat and a tortilla/food plate, keeping the food connection but leaving the product display area unobstructed. Table surface occupies the lower 30 percent with clear empty space for standing sauce bottles; warm reddish brown and cream tones consistent with #321506 and #EF5F18. Realistic low-key studio lighting, no glossy liquid graphics, no bright orange aura, no smoke, no floating food, no lens flare, no abstract swirls, no people, no bottles, no labels, no words, no logos, no watermark. Understated, appetizing, polished and suitable as a slowly moving photographic background.
```

원본 다운로드·생성 배경·편집 스크립트·검증 프레임은 Git에서 제외된 `output/hero-video/`에 보관한다. 공개 페이지는 위의 압축한 영상·포스터만 참조한다.
