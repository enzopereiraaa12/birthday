import { GALLERY_ITEMS } from "@/lib/event-config";
import SectionReveal from "./section-reveal";
import ImageWithFallback from "./image-with-fallback";

export default function Gallery() {
  return (
    <SectionReveal className="relative z-20 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">memories</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Camera roll fantasy
          </h2>
        </div>
        <div className="-mx-5 flex snap-x items-end gap-4 overflow-x-auto px-5 pb-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 lg:gap-5">
          {GALLERY_ITEMS.map((item, index) => (
            <figure
              key={item.src}
              className="snap-center rounded-[1.15rem] bg-white p-2.5 shadow-[0_18px_48px_rgba(255,105,180,.22)] rotate-[-2deg] odd:rotate-[2deg] sm:min-w-0 sm:p-3"
              style={{
                width: `clamp(210px, 72vw, ${item.width}px)`,
                minWidth: `clamp(210px, 72vw, ${item.width}px)`
              }}
            >
              <div
                className="relative overflow-hidden rounded-xl bg-[#211018]"
                style={{ aspectRatio: item.aspectRatio }}
              >
                <ImageWithFallback
                  src={item.src}
                  fallback={item.fallback}
                  alt={item.alt}
                  fit={item.fit as "cover" | "contain"}
                  position={item.position}
                  className="h-full w-full"
                />
              </div>
              <figcaption className="px-2 py-3 font-display text-sm uppercase tracking-[0.12em] text-pink-700">
                memory 0{index + 1}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
