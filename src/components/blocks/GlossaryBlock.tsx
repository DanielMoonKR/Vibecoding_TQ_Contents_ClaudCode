import { useState } from 'react';
import type { GlossaryBlock as Data } from '../../types/content';
import { GLOSSARY_MAP } from '../../data/glossary';
import { track } from '../../lib/track';
import { useGuide } from '../GuideContext';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

// 용어 사전 — 카드 탭 시 펼침. 바닥 용어는 "이 바닥 캠핑장 보기" 버튼 노출 (U-01)
export function GlossaryBlock({ block }: { block: Data }) {
  const { setCurationOverride, scrollToCuration } = useGuide();
  const [open, setOpen] = useState<string | null>(null);
  const terms = block.terms.map((t) => GLOSSARY_MAP.get(t)).filter((t) => t != null);

  return (
    <section>
      <h2 className="prose-heading-two-bold mb-3">{block.title ?? '캠핑 용어 사전'}</h2>
      <ul className="space-y-2">
        {terms.map((t) => {
          const isOpen = open === t.term;
          return (
            <li
              key={t.term}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen
                  ? 'border-semantic-label-normal bg-semantic-background-elevated-normal'
                  : 'border-semantic-line-normal-normal bg-semantic-background-elevated-normal'
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  if (!isOpen) track('glossary_open', { term: t.term });
                  setOpen(isOpen ? null : t.term);
                }}
                className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-left"
              >
                <span className="prose-body-one-normal-bold">{t.term}</span>
                <Icon
                  name="chevronDown"
                  size={20}
                  className={`text-semantic-label-assistive transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  {t.floor && (
                    <Img
                      src={t.image}
                      alt={`${t.term} 사이트 바닥 사진`}
                      label={`${t.term} 바닥`}
                      className="mb-3 aspect-[4/3] w-full rounded-xl"
                    />
                  )}
                  <p className="prose-body-two-reading-regular text-semantic-label-neutral [word-break:keep-all]">
                    {t.desc}
                  </p>
                  {t.floor && (
                    <Button
                      variant="outlined"
                      size="md"
                      className="mt-3 w-full"
                      onClick={() => {
                        setCurationOverride({ label: `${t.term} 사이트`, filter: { siteFloor: [t.floor!] } });
                        scrollToCuration();
                      }}
                    >
                      이 바닥 캠핑장 보기
                      <Icon name="chevronRight" size={16} />
                    </Button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
