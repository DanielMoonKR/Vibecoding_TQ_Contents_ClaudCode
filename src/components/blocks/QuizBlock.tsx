import { useState } from 'react';
import type { PersonaCode, QuizBlock as Data, StayType } from '../../types/content';
import { STAY_LABEL } from '../../data/meta';
import { track } from '../../lib/track';
import { useQuizResult } from '../../lib/user';
import { useGuide } from '../GuideContext';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

// 진단 테스트 — 3~5문항 → 결과 유형. 결과는 회원 정보(목업: 로컬)에 저장되어 큐레이션 조건에 반영
export function QuizBlock({ block }: { block: Data }) {
  const [saved, setSaved] = useQuizResult();
  const { scrollToCuration } = useGuide();
  const [answers, setAnswers] = useState<number[]>([]);
  const [retake, setRetake] = useState(false);

  const step = answers.length;
  const done = step >= block.questions.length;
  const showResult = (saved && !retake) || done;

  const choose = (optionIdx: number) => {
    const next = [...answers, optionIdx];
    setAnswers(next);
    if (next.length < block.questions.length) return;

    const score: Record<StayType, number> = { auto: 0, glamping: 0, caravan: 0 };
    let persona: PersonaCode | null = null;
    next.forEach((oi, qi) => {
      const opt = block.questions[qi].options[oi];
      for (const [k, v] of Object.entries(opt.scores)) score[k as StayType] += v ?? 0;
      if (opt.persona) persona = opt.persona;
    });
    const resultType = (Object.keys(score) as StayType[]).reduce((a, b) => (score[b] > score[a] ? b : a));
    setSaved({ resultType, persona, savedAt: new Date().toISOString() });
    setRetake(false);
    track('quiz_complete', { result_type: resultType });
  };

  const restart = () => {
    setAnswers([]);
    setRetake(true);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-semantic-line-normal-normal bg-semantic-background-elevated-normal">
      <div className="bg-series-choose-bg px-5 py-4">
        <p className="prose-caption-one-bold text-series-choose">1분 진단 테스트</p>
        <h2 className="prose-headline-one-bold mt-0.5">{block.title ?? '나한테 맞는 캠핑은?'}</h2>
      </div>

      {showResult && saved ? (
        <div className="p-5" aria-live="polite">
          <p className="prose-label-two-medium text-semantic-label-alternative">나에게 맞는 캠핑은</p>
          <p className="prose-title-three-bold mt-1 text-semantic-primary-normal">{STAY_LABEL[saved.resultType]}</p>
          <p className="prose-body-one-normal-bold mt-3">{block.results[saved.resultType].title}</p>
          <p className="prose-body-two-reading-regular mt-1 text-semantic-label-neutral [word-break:keep-all]">
            {block.results[saved.resultType].desc}
          </p>
          <p className="prose-caption-one-regular mt-3 flex items-center gap-1 text-semantic-status-positive">
            <Icon name="check" size={14} /> 결과를 저장했어요. 맞춤 캠핑장 추천에 반영돼요
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="soft" size="md" onClick={restart}>
              다시 하기
            </Button>
            <Button size="md" className="flex-1" onClick={scrollToCuration}>
              {STAY_LABEL[saved.resultType]} 캠핑장 보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-semantic-fill-normal"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={block.questions.length}
            >
              <div
                className="h-full rounded-full bg-semantic-primary-normal transition-all"
                style={{ width: `${((step + 1) / block.questions.length) * 100}%` }}
              />
            </div>
            <span className="prose-caption-one-medium text-semantic-label-alternative tabular">
              {step + 1}/{block.questions.length}
            </span>
          </div>
          <p className="prose-headline-two-bold mt-4 [word-break:keep-all]">{block.questions[step].text}</p>
          <ul className="mt-3 space-y-2">
            {block.questions[step].options.map((o, i) => (
              <li key={o.label}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  className="prose-body-two-normal-medium flex min-h-[52px] w-full items-center justify-between rounded-xl border border-semantic-line-normal-normal px-4 text-left active:border-semantic-primary-normal active:bg-primary-tint"
                >
                  {o.label}
                  <Icon name="chevronRight" size={18} className="text-semantic-label-assistive" />
                </button>
              </li>
            ))}
          </ul>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setAnswers(answers.slice(0, -1))}
              className="prose-label-two-medium mt-2 min-h-touch text-semantic-label-alternative"
            >
              이전 질문
            </button>
          )}
        </div>
      )}
    </section>
  );
}
