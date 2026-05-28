export function OurStory() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#ef5f18]">
              Our Story
            </p>
            <h2 className="break-keep text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-5xl">
              소스가 아닌 문화를
              <br />
              만듭니다
            </h2>
          </div>

          <div className="space-y-6 break-keep text-base font-semibold leading-relaxed text-gray-700 md:text-lg">
            <p>MOKDA는 한국을 더 쉽고 가깝게 경험하게 하는 브랜드입니다.</p>
            <p>한국을 가장 쉽고 가깝게 만나는 방법은 무엇일까요?</p>
            <p>음식은 문화를 이어주는 가장 멋진 수단입니다.</p>
            <p>
              타코, 그릴, 밥, 스낵처럼 익숙한 음식과 만날 때 한국은 더
              가깝고, 더 일상적인 경험이 됩니다.
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
