import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { TextBlock as TextBlockData } from '../../types/content';
import { GLOSSARY_MAP } from '../../data/glossary';
import { track } from '../../lib/track';

/** 본문 속 용어 툴팁. 캠핑장 상세페이지 툴팁과 같은 GLOSSARY 데이터를 쓴다 */
export function TermTooltip({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const data = GLOSSARY_MAP.get(term);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  if (!data) return <>{children}</>;
  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (!open) track('glossary_open', { term, source: 'tooltip' });
          setOpen(!open);
        }}
        className="font-semibold text-semantic-label-strong underline decoration-semantic-primary-normal decoration-dotted decoration-2 underline-offset-4"
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          className="prose-label-two-regular absolute left-0 top-full z-[8] mt-2 block w-[min(260px,80vw)] rounded-xl bg-semantic-inverse-background p-3 text-left text-semantic-inverse-label shadow-xl"
        >
          <b className="prose-label-two-bold mb-1 block">{term}</b>
          {data.desc}
        </span>
      )}
    </span>
  );
}

function withTerms(text: string, terms: string[], linked: Set<string>): ReactNode[] {
  if (!terms.length) return [text];
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
  return text.split(re).map((part, i) => {
    if (terms.includes(part) && !linked.has(part)) {
      linked.add(part);
      return (
        <TermTooltip key={i} term={part}>
          {part}
        </TermTooltip>
      );
    }
    return part;
  });
}

// **굵게** 표시만 지원하는 최소 마크업
function inline(text: string, terms: string[], linked: Set<string>) {
  return text.split(/(\*\*[^*]+\*\*)/).map((seg, i) =>
    seg.startsWith('**') ? (
      <strong key={i} className="font-semibold text-semantic-label-strong">
        {withTerms(seg.slice(2, -2), terms, linked)}
      </strong>
    ) : (
      <span key={i}>{withTerms(seg, terms, linked)}</span>
    ),
  );
}

export function TextBlock({ block, linkTerms = [] }: { block: TextBlockData; linkTerms?: string[] }) {
  // 블록 안에서도 용어마다 첫 등장 한 번만 툴팁 연결
  const linked = new Set<string>();
  return (
    <section>
      {block.heading && <h2 className="prose-heading-two-bold mb-3 [word-break:keep-all]">{block.heading}</h2>}
      <div className="prose-body-one-reading-regular space-y-3 text-semantic-label-neutral [word-break:keep-all]">
        {block.body.split(/\n{2,}/).map((p, i) => {
          const lines = p.split('\n');
          const isList = lines.every((l) => /^(\d+\.|-)\s/.test(l));
          if (isList) {
            return (
              <ul key={i} className="space-y-1.5">
                {lines.map((l, j) => {
                  const m = l.match(/^(\d+\.|-)\s(.*)$/)!;
                  return (
                    <li key={j} className="flex gap-2">
                      <span className="shrink-0 font-semibold text-semantic-primary-normal tabular">
                        {m[1] === '-' ? '•' : m[1]}
                      </span>
                      <span>{inline(m[2], linkTerms, linked)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          return (
            <p key={i}>
              {lines.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {inline(l, linkTerms, linked)}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </section>
  );
}
