import { useState } from 'react';
import type { CompareTableBlock as Data } from '../../types/content';
import { useGuide } from '../GuideContext';
import { Button } from '../ui/Button';

// 비교표 — 2~4개 선택지, 가로 스크롤 + 첫 열 고정, 강조 열
export function CompareTableBlock({ block }: { block: Data }) {
  const { quizType, setCurationOverride, scrollToCuration } = useGuide();
  const [selected, setSelected] = useState<string | null>(null);

  const highlight =
    selected ?? (block.highlightFrom === 'quiz' && quizType ? quizType : block.highlight) ?? null;
  const fromQuiz = !selected && block.highlightFrom === 'quiz' && quizType === highlight;

  const choose = (key: string) => {
    if (!block.selectable) return;
    setSelected(key === selected ? null : key);
  };

  const cell = (key: string) =>
    key === highlight ? 'bg-primary-tint text-semantic-label-strong' : '';

  return (
    <section>
      {block.title && <h2 className="prose-heading-two-bold mb-3">{block.title}</h2>}
      {fromQuiz && (
        <p className="prose-label-two-medium mb-2 text-semantic-primary-normal">진단 결과에 맞는 유형을 강조했어요</p>
      )}
      {block.selectable && (
        <p className="prose-label-two-regular mb-2 text-semantic-label-alternative">열 제목을 눌러 내 예산에 맞는 등급을 골라보세요</p>
      )}
      <div className="scrollbar-none -mx-5 overflow-x-auto px-5">
        <table className="w-max min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-semantic-line-normal-normal">
          <thead>
            <tr>
              <th
                scope="col"
                className="prose-caption-one-bold sticky left-0 z-[1] w-[84px] min-w-[84px] border-b border-r border-semantic-line-normal-alternative bg-semantic-background-normal-alternative p-3 text-left text-semantic-label-alternative"
              >
                구분
              </th>
              {block.columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`min-w-[112px] border-b border-semantic-line-normal-alternative p-0 ${cell(c.key) || 'bg-semantic-background-normal-alternative'}`}
                >
                  {block.selectable ? (
                    <button
                      type="button"
                      aria-pressed={selected === c.key}
                      onClick={() => choose(c.key)}
                      className="prose-label-one-normal-bold flex min-h-touch w-full items-center justify-center gap-1 p-3"
                    >
                      <span
                        className={`h-4 w-4 rounded-full border-2 ${selected === c.key ? 'border-[5px] border-semantic-primary-normal' : 'border-semantic-line-normal-strong'}`}
                      />
                      {c.label}
                    </button>
                  ) : (
                    <span className="prose-label-one-normal-bold block p-3">
                      {c.label}
                      {c.key === highlight && <span className="ml-1 text-semantic-primary-normal">★</span>}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r, i) => (
              <tr key={r.label}>
                <th
                  scope="row"
                  className={`prose-label-two-bold sticky left-0 z-[1] border-r border-semantic-line-normal-alternative bg-semantic-background-normal-normal p-3 text-left text-semantic-label-neutral ${i < block.rows.length - 1 ? 'border-b' : ''}`}
                >
                  {r.label}
                </th>
                {r.values.map((v, j) => (
                  <td
                    key={j}
                    className={`prose-label-two-regular p-3 text-center align-middle text-semantic-label-neutral [word-break:keep-all] ${i < block.rows.length - 1 ? 'border-b border-semantic-line-normal-alternative' : ''} ${cell(block.columns[j].key)}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.selectable && selected && (
        <Button
          variant="outlined"
          size="md"
          className="mt-3 w-full"
          onClick={() => {
            const col = block.columns.find((c) => c.key === selected)!;
            setCurationOverride({ label: col.label, filter: block.selectable!.filters[selected] ?? {} });
            scrollToCuration();
          }}
        >
          {block.selectable.buttonLabel.replace('{label}', block.columns.find((c) => c.key === selected)!.label)}
        </Button>
      )}
    </section>
  );
}
