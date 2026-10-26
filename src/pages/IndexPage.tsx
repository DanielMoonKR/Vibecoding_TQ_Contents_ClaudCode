import { Link } from 'react-router-dom';
import { CATALOG, SERIES, STAY_LABEL } from '../data/meta';
import { hasContent } from '../content';
import { useIsFirstBookingDone, useQuizResult } from '../lib/user';
import { SeriesBadge } from '../components/template/Hero';
import { Chip } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import type { SeriesKey } from '../types/content';

// 개발용 목록 페이지: 16편 현황 + 목업 회원 상태 전환
export function IndexPage() {
  const [quiz, setQuiz] = useQuizResult();
  const [booked, setBooked] = useIsFirstBookingDone();

  const setTheme = (t: 'light' | 'dark' | null) => {
    if (t) document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  };

  return (
    <div className="mx-auto min-h-screen max-w-page bg-semantic-background-normal-normal px-5 pb-16 pt-8">
      <p className="prose-label-two-bold text-semantic-primary-normal">땡큐캠핑</p>
      <h1 className="prose-title-three-bold mt-1">첫캠핑 가이드</h1>
      <p className="prose-body-two-normal-regular mt-1 text-semantic-label-alternative">
        16편 · 1차 8편(12/14 런칭) + 2차 8편
      </p>

      {(Object.keys(SERIES) as SeriesKey[]).map((s) => (
        <section key={s} className="mt-8">
          <h2 className="prose-headline-one-bold">{SERIES[s].label}</h2>
          <ul className="mt-2 divide-y divide-semantic-line-normal-alternative">
            {CATALOG.filter((c) => c.series === s).map((c) => {
              const ready = hasContent(c.id);
              const row = (
                <>
                  <span className="prose-caption-one-bold w-10 shrink-0 text-semantic-label-alternative">{c.id}</span>
                  <span className="prose-body-two-normal-medium flex-1 [word-break:keep-all]">{c.title}</span>
                  {c.release === 'wave2' && (
                    <span className="prose-caption-two-bold shrink-0 rounded bg-semantic-fill-normal px-1.5 py-0.5 text-semantic-label-alternative">
                      2차
                    </span>
                  )}
                  {ready && <Icon name="chevronRight" size={18} className="shrink-0 text-semantic-label-assistive" />}
                </>
              );
              return (
                <li key={c.id}>
                  {ready ? (
                    <Link to={`/guide/${c.id}?entry=home_module`} className="flex min-h-[52px] items-center gap-3 py-2">
                      {row}
                    </Link>
                  ) : (
                    <div className="flex min-h-[52px] items-center gap-3 py-2 opacity-50">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-10 rounded-2xl bg-semantic-fill-alternative p-4">
        <h2 className="prose-label-one-normal-bold flex items-center gap-2">
          <SeriesBadge series="understand" /> 개발용 도구
        </h2>
        <dl className="prose-label-two-regular mt-3 space-y-3 text-semantic-label-neutral">
          <div>
            <dt className="prose-label-two-bold">진단 결과</dt>
            <dd className="mt-1 flex items-center gap-2">
              {quiz ? `${STAY_LABEL[quiz.resultType]} · 페르소나 ${quiz.persona ?? '-'}` : '없음'}
              {quiz && (
                <Chip onClick={() => setQuiz(null)} className="min-h-0 py-1">
                  초기화
                </Chip>
              )}
            </dd>
          </div>
          <div>
            <dt className="prose-label-two-bold">첫 예약 완료 회원</dt>
            <dd className="mt-1 flex gap-1.5">
              <Chip active={!booked} onClick={() => setBooked(false)}>
                아니오 (쿠폰 노출)
              </Chip>
              <Chip active={booked} onClick={() => setBooked(true)}>
                예 (쿠폰 숨김)
              </Chip>
            </dd>
          </div>
          <div>
            <dt className="prose-label-two-bold">테마 (앱은 html[data-theme] 로 전달)</dt>
            <dd className="mt-1 flex gap-1.5">
              <Chip onClick={() => setTheme(null)}>시스템</Chip>
              <Chip onClick={() => setTheme('light')}>라이트</Chip>
              <Chip onClick={() => setTheme('dark')}>다크</Chip>
            </dd>
          </div>
          <div>
            <Link to="/preview/blocks" className="prose-label-two-bold inline-flex min-h-touch items-center text-semantic-primary-normal">
              블록 14종 미리보기 <Icon name="chevronRight" size={16} />
            </Link>
          </div>
        </dl>
      </section>
    </div>
  );
}
