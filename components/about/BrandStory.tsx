const storyParagraphs = [
  '2024년 봄, 가방 하나메고 남미로 간 청년의 이야기입니다.',
  '남미에 특별한 연고가 있었던 건 아니었습니다. 오래전 다큐멘터리에서 본 지구 반대편의 남미가 계속 마음에 남았고, 한국에서도 타코, 엠빠나다, 살사 같은 남미 음식을 자주 찾아 먹을 만큼 그 문화가 좋았습니다.',
  '그곳에서 살아가며 많은 친구들을 만났습니다. 말도 잘 통하지 않고, 살아온 환경도 달랐지만 이상하게도 음식 앞에서는 금방 가까워졌습니다.',
  '친구들과 집에 모여 서로의 나라 음식을 만들어 먹던 날, 저는 처음으로 분명하게 느꼈습니다. 음식은 단순히 맛을 즐기는 것이 아니라, 한 나라의 문화와 사람을 이해하는 가장 쉬운 방법이라는 것을요.',
  '제가 남미를 좋아하게 된 것도 음식에서 시작됐습니다. 그리고 이제는 제가 한국을 좋아하는 남미의 친구들에게 오늘날의 한국을 전하고 싶었습니다. 그 마음에서 MOKDA가 시작되었습니다.',
  '한국 로컬의 신선한 재료, 한국 청년이 직접 느낀 진심, 그리고 지금의 한국적인 감각을 담아 남미의 식탁 위에 전하고자 합니다.',
  'MOKDA는 소스 한 병으로 한국과 남미가 조금 더 가까워지는 순간을 만들고 싶습니다.',
];

export function BrandStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Brand Story
          </p>
          <h2 className="mb-8 break-keep text-3xl font-extrabold leading-tight text-neutral-950 md:text-4xl">
            남미로 떠난 한국인 청년
          </h2>
          <div className="space-y-4 text-gray-700">
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph} className="break-keep leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="surface-depth relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
          <img
            src="/assets/story-vibe.webp"
            alt="Brand Story"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
