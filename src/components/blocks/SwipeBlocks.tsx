import { useRef, useState, type ReactNode } from 'react';
import type { PhotoTourBlock as TourData, StepCardsBlock as StepData } from '../../types/content';
import { useGuide } from '../GuideContext';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

/** 좌우 스와이프 + 현재 위치 표시 공통 컨테이너 (scroll-snap) */
function Swiper({
  count,
  children,
  label,
}: {
  count: number;
  children: (i: number) => ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={ref}
        onScroll={onScroll}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
      >
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} / ${count}`}>
            {children(i)}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="이전"
          disabled={index === 0}
          onClick={() => go(index - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-fill-normal disabled:opacity-40"
        >
          <Icon name="back" size={20} />
        </button>
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-semantic-primary-normal' : 'w-1.5 bg-semantic-line-normal-strong'}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="다음"
          disabled={index === count - 1}
          onClick={() => go(index + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-fill-normal disabled:opacity-40"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}

// 단계 카드 — 순서가 있는 방법, 좌우 스와이프 + 현재 단계 표시
export function StepCardsBlock({ block }: { block: StepData }) {
  return (
    <section>
      {block.title && <h2 className="prose-heading-two-bold mb-3">{block.title}</h2>}
      <Swiper count={block.steps.length} label={block.title ?? '단계 카드'}>
        {(i) => {
          const s = block.steps[i];
          return (
            <div className="h-full overflow-hidden rounded-2xl border border-semantic-line-normal-normal bg-semantic-background-elevated-normal">
              <Img src={s.image} alt={s.title} label={`STEP ${i + 1}`} className="aspect-[4/3] w-full" />
              <div className="p-4">
                <p className="prose-caption-one-bold text-semantic-primary-normal tabular">
                  STEP {i + 1} / {block.steps.length}
                </p>
                <h3 className="prose-headline-two-bold mt-1">{s.title}</h3>
                <p className="prose-body-two-reading-regular mt-1 text-semantic-label-neutral [word-break:keep-all]">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        }}
      </Swiper>
    </section>
  );
}

// 사진 투어 — 공간 둘러보기, 공간명 라벨 + "이 시설 있는 카라반" 필터 (U-04)
export function PhotoTourBlock({ block }: { block: TourData }) {
  const { setCurationOverride, scrollToCuration } = useGuide();
  return (
    <section>
      {block.title && <h2 className="prose-heading-two-bold mb-3">{block.title}</h2>}
      <Swiper count={block.spots.length} label={block.title ?? '사진 투어'}>
        {(i) => {
          const s = block.spots[i];
          return (
            <div>
              <div className="relative overflow-hidden rounded-2xl">
                <Img src={s.image} alt={`${s.label} 사진`} label={s.label} className="aspect-[4/3] w-full" />
                <span className="prose-label-two-bold absolute left-3 top-3 rounded-md bg-semantic-material-dimmer px-2 py-1 text-semantic-static-white">
                  {s.label}
                </span>
              </div>
              <p className="prose-body-two-reading-regular mt-3 text-semantic-label-neutral [word-break:keep-all]">
                {s.desc}
              </p>
              {s.filter && (
                <button
                  type="button"
                  onClick={() => {
                    setCurationOverride({ label: s.label, filter: s.filter! });
                    scrollToCuration();
                  }}
                  className="prose-label-two-bold mt-1 inline-flex min-h-touch items-center gap-0.5 text-semantic-primary-normal"
                >
                  이 시설 있는 카라반 보기 <Icon name="chevronRight" size={16} />
                </button>
              )}
            </div>
          );
        }}
      </Swiper>
    </section>
  );
}
