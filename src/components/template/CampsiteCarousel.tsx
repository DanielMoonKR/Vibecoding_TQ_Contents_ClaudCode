import { forwardRef, useMemo } from 'react';
import { queryCampsites, searchUrl } from '../../lib/campsites';
import { STAY_LABEL } from '../../data/meta';
import { Badge, CampsiteCard } from '../CampsiteCard';
import { useGuide } from '../GuideContext';
import { Icon } from '../ui/Icon';

// 5. 이 글에 맞는 캠핑장 — 큐레이션 조건으로 3~6개, 가로 스크롤, 쿠폰 적용가
export const CampsiteCarousel = forwardRef<HTMLElement>(function CampsiteCarousel(_, ref) {
  const { content, quizType, showCoupon, curationOverride, setCurationOverride } = useGuide();

  const query = useMemo(
    () => {
      const o = curationOverride?.filter;
      // tags는 덮어쓰지 않고 합친다 (예: solo+beginner 에 체크리스트 조건 추가)
      const tags = [...new Set([...(content.curation.tags ?? []), ...(o?.tags ?? [])])];
      return { ...content.curation, ...o, tags: tags.length ? tags : undefined };
    },
    [content.curation, curationOverride],
  );
  const list = useMemo(() => {
    const limit = Math.min(Math.max(content.curation.limit ?? 6, 3), 6);
    return queryCampsites({ ...query, limit }, { quizType });
  }, [query, quizType, content.curation.limit]);

  const subtitle = curationOverride
    ? `'${curationOverride.label}' 조건으로 골랐어요`
    : content.curation.fromQuiz && quizType
      ? `진단 결과 '${STAY_LABEL[quizType]}' 유형에 맞췄어요`
      : '초보 환영 배지가 있는 곳만 모았어요';

  return (
    <section
      ref={ref}
      id="curation"
      aria-labelledby="curation-title"
      className="scroll-mt-14 bg-semantic-background-normal-normal py-7"
    >
      <div className="flex items-end justify-between gap-2 px-5">
        <div>
          <h2 id="curation-title" className="prose-heading-two-bold">
            이 글에 맞는 캠핑장
          </h2>
          <p className="prose-label-two-regular mt-1 text-semantic-label-alternative">{subtitle}</p>
        </div>
        <a
          href={searchUrl(query)}
          className="prose-label-two-medium inline-flex min-h-touch shrink-0 items-center text-semantic-label-alternative"
        >
          전체보기
          <Icon name="chevronRight" size={16} />
        </a>
      </div>
      {curationOverride && (
        <div className="mt-3 px-5">
          <button
            type="button"
            onClick={() => setCurationOverride(null)}
            className="prose-label-two-medium inline-flex min-h-touch items-center gap-1 rounded-full bg-semantic-label-normal px-3 text-semantic-background-normal-normal"
          >
            {curationOverride.label}
            <Icon name="close" size={14} />
            <span className="sr-only">조건 해제</span>
          </button>
        </div>
      )}
      {list.length === 0 ? (
        <p className="prose-body-two-normal-regular mx-5 mt-4 rounded-xl bg-semantic-fill-alternative p-5 text-center text-semantic-label-alternative">
          조건에 맞는 캠핑장이 아직 없어요.
          <br />
          조건을 바꿔 다시 찾아볼까요?
        </p>
      ) : (
        <ul className="scrollbar-none mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1">
          {list.map((c, i) => (
            <li key={c.id} className="snap-start">
              <CampsiteCard
                campsite={c}
                position={i + 1}
                area="carousel"
                showCoupon={showCoupon}
                badge={c.tags.includes('beginner') ? <Badge tone="primary">초보 환영</Badge> : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});
