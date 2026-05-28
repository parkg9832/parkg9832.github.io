export function OurStory() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-bold text-orange-500">
              OUR STORY
            </span>
            <h2 className="break-keep text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              소스가 아닌 문화를
              <br />
              만듭니다
            </h2>
          </div>

          <div className="flex flex-col justify-center space-y-5 break-keep text-gray-700 leading-relaxed md:text-lg">
            <p>
              MOKDA는 한국을 더 쉽고 가깝게 경험하게 하는 브랜드입니다.
              <br />
              한국의 맛은 낯설고 특별한 음식 안에만 머물 필요가 없습니다.
            </p>
            <p>
              타코, 그릴, 밥, 스낵처럼 익숙한 음식과 만날 때
              <br />
              한국은 더 자연스럽고 일상적인 문화가 됩니다.
            </p>
            <p>
              MOKDA는 한 병의 소스에
              <br />
              한국 로컬의 재료와 지금의 감각을 담아
              <br />
              남미의 식탁 위에 새로운 한국의 경험을 제안합니다.
            </p>
            <p>
              우리는 단순히 소스를 만드는 것이 아니라,
              <br />
              한국을 즐기는 새로운 방식을 만듭니다.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl shadow-lg shadow-neutral-950/10">
          <img
            src="/assets/story-vibe.png"
            alt="MOKDA sauce culture table"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
