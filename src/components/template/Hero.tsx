import type { GuideContent, SeriesKey } from '../../types/content';
import { SERIES } from '../../data/meta';
import { Img } from '../ui/Img';
import { Icon } from '../ui/Icon';

export function SeriesBadge({ series }: { series: SeriesKey }) {
  const color: Record<SeriesKey, string> = {
    choose: 'bg-series-choose-bg text-series-choose',
    understand: 'bg-series-understand-bg text-series-understand',
    prepare: 'bg-series-prepare-bg text-series-prepare',
    return: 'bg-series-return-bg text-series-return',
  };
  return (
    <span className={`prose-caption-one-bold inline-flex rounded-md px-2 py-1 ${color[series]}`}>
      {SERIES[series].label}
    </span>
  );
}

// 2. 히어로 — 시리즈 배지, 제목(2줄), 부제, 읽는 시간, 대표 이미지/세로 영상 썸네일
export function Hero({ content }: { content: GuideContent }) {
  const { hero } = content;
  return (
    <section className="bg-semantic-background-normal-normal px-5 pb-6 pt-3">
      <div className="flex items-center gap-2">
        <SeriesBadge series={content.series} />
        <span className="prose-caption-one-regular text-semantic-label-alternative">
          {content.readTimeMin}분 읽기
        </span>
      </div>
      <h1 className="prose-title-three-bold mt-3 line-clamp-2 text-semantic-label-strong [word-break:keep-all]">
        {content.title}
      </h1>
      <p className="prose-body-two-normal-regular mt-2 text-semantic-label-alternative">{content.subtitle}</p>
      {content.updatedAt && (
        <p className="prose-caption-one-regular mt-1 text-semantic-label-assistive">{content.updatedAt} 기준</p>
      )}
      <div className="relative mt-5 overflow-hidden rounded-2xl">
        <Img
          src={hero.src}
          alt={hero.alt}
          className={hero.type === 'video' ? 'mx-auto aspect-[9/16] max-h-[420px]' : 'aspect-[16/9] w-full'}
        />
        {hero.type === 'video' && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-semantic-material-dimmer text-semantic-static-white">
              <Icon name="play" filled />
            </span>
          </span>
        )}
      </div>
    </section>
  );
}
