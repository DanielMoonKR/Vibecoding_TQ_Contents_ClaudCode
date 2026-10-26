import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CalloutBlock as CalloutData, ImageBlock as ImageData } from '../../types/content';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

// 디자인 시스템 v2 SectionMessage 스펙: radius 12, padding 12, gap 8, 아이콘 20px, 배경 = status 색 12%
// tip → positive, warn → cautionary (아이콘만 accent-foreground-orange: cautionary 노랑은 비텍스트 대비 3:1 미달)
const CALLOUT_TONE = {
  tip: { icon: 'tip', color: 'text-semantic-status-positive', bg: 'bg-[color-mix(in_srgb,var(--semantic-status-positive)_12%,transparent)]', label: '팁' },
  warn: { icon: 'warn', color: 'text-semantic-accent-foreground-orange', bg: 'bg-[color-mix(in_srgb,var(--semantic-status-cautionary)_12%,transparent)]', label: '주의' },
} as const;

export function CalloutBlock({ block }: { block: CalloutData }) {
  const tone = CALLOUT_TONE[block.tone];
  return (
    <aside role="note" aria-label={tone.label} className={`flex min-h-[46px] w-full items-start gap-2 rounded-[12px] p-3 ${tone.bg}`}>
      <span className={`inline-flex shrink-0 ${tone.color}`}>
        <Icon name={tone.icon} size={20} />
      </span>
      <p className="prose-body-two-normal-medium min-w-0 flex-1 text-semantic-label-normal [word-break:keep-all]">
        {block.text}
      </p>
    </aside>
  );
}

export function ImageBlock({ block }: { block: ImageData }) {
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [full]);

  return (
    <figure>
      <button
        type="button"
        onClick={() => setFull(true)}
        aria-label={`${block.alt} 크게 보기`}
        className="block w-full overflow-hidden rounded-2xl"
      >
        <Img src={block.src} alt={block.alt} className="aspect-[4/3] w-full" />
      </button>
      {block.caption && (
        <figcaption className="prose-caption-one-regular mt-2 text-center text-semantic-label-alternative">
          {block.caption}
        </figcaption>
      )}
      {full &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={block.alt}
            className="fixed inset-0 z-[9999] flex flex-col bg-semantic-static-black"
            onClick={() => setFull(false)}
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                aria-label="닫기"
                className="flex h-11 w-11 items-center justify-center text-semantic-static-white"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <Img src={block.src} alt={block.alt} className="aspect-[4/3] w-full max-w-page object-contain" />
            </div>
            {block.caption && (
              <p className="prose-label-two-regular p-5 text-center text-semantic-static-white opacity-80">{block.caption}</p>
            )}
          </div>,
          document.body,
        )}
    </figure>
  );
}
