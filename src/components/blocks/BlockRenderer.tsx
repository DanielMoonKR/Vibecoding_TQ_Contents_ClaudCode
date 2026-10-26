import { useMemo } from 'react';
import type { Block } from '../../types/content';
import { GLOSSARY } from '../../data/glossary';
import { TextBlock } from './TextBlock';
import { CalloutBlock, ImageBlock } from './SimpleBlocks';
import { CompareTableBlock } from './CompareTableBlock';
import { QuizBlock } from './QuizBlock';
import { ChecklistBlock } from './ChecklistBlock';
import { GlossaryBlock } from './GlossaryBlock';
import { ShortVideoBlock } from './ShortVideoBlock';
import { PhotoTourBlock, StepCardsBlock } from './SwipeBlocks';
import { InterviewBlock } from './InterviewBlock';
import { CostCalculatorBlock, RefundTimelineBlock } from './CalculatorBlocks';
import { CampsiteListBlock } from './CampsiteListBlock';

/**
 * text 블록마다 툴팁을 붙일 용어를 미리 계산한다.
 * 용어는 페이지에서 처음 나올 때 한 번만 연결 (기획안 10장)
 */
function planTermLinks(blocks: Block[]) {
  const used = new Set<string>();
  return blocks.map((b) => {
    if (b.type !== 'text') return [];
    const text = `${b.heading ?? ''} ${b.body}`;
    const terms = GLOSSARY.map((g) => g.term).filter((t) => !used.has(t) && text.includes(t));
    terms.forEach((t) => used.add(t));
    // 긴 용어부터 매칭해야 '데크팩'이 '데크'로 잘리지 않는다
    return terms.sort((a, b) => b.length - a.length);
  });
}

export function renderBlock(block: Block, linkTerms: string[] = []) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} linkTerms={linkTerms} />;
    case 'callout':
      return <CalloutBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'compareTable':
      return <CompareTableBlock block={block} />;
    case 'quiz':
      return <QuizBlock block={block} />;
    case 'checklist':
      return <ChecklistBlock block={block} />;
    case 'glossary':
      return <GlossaryBlock block={block} />;
    case 'shortVideo':
      return <ShortVideoBlock block={block} />;
    case 'stepCards':
      return <StepCardsBlock block={block} />;
    case 'photoTour':
      return <PhotoTourBlock block={block} />;
    case 'interview':
      return <InterviewBlock block={block} />;
    case 'costCalculator':
      return <CostCalculatorBlock block={block} />;
    case 'refundTimeline':
      return <RefundTimelineBlock block={block} />;
    case 'campsiteList':
      return <CampsiteListBlock block={block} />;
    default: {
      // 14종 외 블록은 렌더링하지 않는다 (컨텐츠 JSON 오류)
      const unknown: never = block;
      console.warn('[guide] unknown block', unknown);
      return null;
    }
  }
}

// 4. 본문 블록 — 컨텐츠 JSON의 blocks 배열을 순서대로 렌더링
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const termPlan = useMemo(() => planTermLinks(blocks), [blocks]);
  return (
    <div className="space-y-9">
      {blocks.map((b, i) => (
        <div key={i} data-block={b.type}>
          {renderBlock(b, termPlan[i])}
        </div>
      ))}
    </div>
  );
}
