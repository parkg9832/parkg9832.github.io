# MOKDA 메인 히어로 영상

2026-10-13. Google Drive의 실제 제품 사진·박람회 촬영본과 내장 이미지 생성 도구로 만든 스튜디오 배경을 편집했다. 제품 병과 라벨은 원본 누끼컷을 그대로 합성했다. 인터뷰·시식·방문 장면에는 실제 촬영 영상을 사용했다.

## 공개 파일

- 데스크톱: `assets/videos/hero/mokda-field-desktop-20261013.mp4` — 1280×720, 24fps, 20.5초.
- 모바일: `assets/videos/hero/mokda-field-mobile-20261013.mp4` — 576×1024, 24fps, 20.5초.
- 포스터: `assets/images/mokda-hero-desktop-20261013.webp`, `assets/images/mokda-hero-mobile-20261013.webp`.
- H.264/SDR, 음성 트랙 없음, MP4 faststart. 두 해상도 중 화면에 맞는 파일 하나를 불러온다.

## 편집 구성과 원본

| 구성 | 원본 | 사용 구간 |
|---|---|---|
| 제품 스튜디오 도입·마무리 | [고추장_정면2.png](https://drive.google.com/file/d/1XBPTqS6klBWIf2pqfaWRNEHJ7JYc4g7o/view), [쌈장_정면2.png](https://drive.google.com/file/d/18CvQZU2YJupY9R4P3AW0vO_JMdTk-Ov2/view) + 생성 배경 | 느린 3.5% 카메라 확대와 역방향 마무리 |
| MOKDA 부스 인터뷰 | [20260923_115951.mp4](https://drive.google.com/file/d/1rw9h3hwsEh5SaJC-lEGIooIu1-A20Nhq/view) | 10.00초부터 약 4.51초, 속도 82% |
| 제품을 들고 함께한 방문 장면 | [20260923_134424.mp4](https://drive.google.com/file/d/1ODTEkhbWWLMcx-mHogFPUIZw847HkYm5/view) | 0.10초부터 약 0.94초, 속도 75%; 완성 영상에서 1.25초 한 컷 |
| 제품 진열과 소스 | [VID_20260923_064025_971.mp4](https://drive.google.com/file/d/1Gz34ZbsjH2XmvpkqIKh2NajCqhyu5xC0/view) | 0.12초부터 약 2.25초, 속도 75% |
| 현장 시식 | [20260923_120114.mp4](https://drive.google.com/file/d/1vQqabswnmrX27JiXHB4laJCnBEvvE0Do/view) | 60.60–65.35초, 원래 속도 |

장면 전환은 0.5초 디졸브로 통일했다. 끝을 도입과 같은 제품 장면으로 연결했다. 정치인 방문 장면은 1.25초 한 컷만 사용하며, 제품·인터뷰·시식이 영상의 중심이다. 원본 세로 영상은 모바일 구도를 유지하고, 데스크톱은 넓은 히어로에서 얼굴이 잘리지 않는 구간을 따로 크롭했다. HLG 촬영본은 SDR로 변환했다.

## 재생 정책

- 첫 화면에는 작은 포스터를 표시하고, 영상은 화면에 보일 때 무음으로 재생한다.
- 화면 밖·백그라운드·페이지 이탈에서는 정지한다. 사용자가 일시정지하면 자동 재개하지 않는다.
- 모션 줄이기·데이터 절약 설정에서는 포스터를 유지하며 영상을 요청하지 않는다.
- 재생 실패 시 포스터와 기존 문구·제품 링크를 유지한다.
- 홈페이지의 한국어·스페인어·영어 캠페인 문구는 기존 내용을 유지한다.

## 생성 배경의 최종 프롬프트

내장 `image_gen` 도구 사용. 병과 문자 없이 배경만 생성한 뒤 원본 제품 사진을 합성했다.

```text
Use case: ads-marketing. Asset type: a cinematic backdrop for a Korean sauce company's homepage hero film, to be composited with two existing real sauce bottle cutouts and website headings. Generate only the environment, without products or lettering. Photorealistic food advertising still, very wide landscape 16:9, 2048x1152 or larger. A warm dark walnut/brown tabletop in a refined food photography studio, seamless deep espresso background, soft amber daylight from the upper left and a restrained rim light on the far right, subtle real stone/wood texture, natural shallow depth of field. The central and upper 65 percent stays quiet and dark enough for cream website text. On the distant far-left and far-right lower edges there can be very subtle, deeply out-of-focus hints of grilled meat and a tortilla/food plate, keeping the food connection but leaving the product display area unobstructed. Table surface occupies the lower 30 percent with clear empty space for standing sauce bottles; warm reddish brown and cream tones consistent with #321506 and #EF5F18. Realistic low-key studio lighting, no glossy liquid graphics, no bright orange aura, no smoke, no floating food, no lens flare, no abstract swirls, no people, no bottles, no labels, no words, no logos, no watermark. Understated, appetizing, polished and suitable as a slowly moving photographic background.
```

원본 다운로드·생성 배경·편집 스크립트·검증 프레임은 Git에서 제외된 `output/hero-video/`에 보관한다. 공개 페이지는 위의 압축한 영상·포스터만 참조한다.
