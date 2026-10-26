import { Fragment } from 'react';
import type { InterviewBlock as Data } from '../../types/content';
import { getCampsite } from '../../lib/campsites';
import { CampsiteRow } from '../CampsiteCard';
import { useGuide } from '../GuideContext';
import { Img } from '../ui/Img';

// 후기 인터뷰 — 첫캠퍼 Q&A, 인터뷰 속 캠핑장 카드 자동 삽입
export function InterviewBlock({ block }: { block: Data }) {
  const { showCoupon } = useGuide();
  const camp = block.campsiteId ? getCampsite(block.campsiteId) : undefined;
  const insertAfter = block.campsiteAfter ?? 0;

  return (
    <section>
      <div className="flex items-center gap-3 rounded-2xl bg-semantic-fill-alternative p-4">
        <Img
          src={block.profile.avatar}
          alt={`${block.profile.name} 프로필`}
          label=""
          className="h-14 w-14 shrink-0 rounded-full"
        />
        <div>
          <p className="prose-body-one-normal-bold">{block.profile.name}</p>
          <p className="prose-label-two-regular text-semantic-label-alternative">{block.profile.desc}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-6">
        {block.qa.map((item, i) => (
          <Fragment key={i}>
            <div>
              <dt className="prose-headline-two-bold flex gap-2 [word-break:keep-all]">
                <span className="text-semantic-primary-normal">Q.</span>
                {item.q}
              </dt>
              <dd className="prose-body-one-reading-regular mt-2 text-semantic-label-neutral [word-break:keep-all]">
                {item.a}
              </dd>
            </div>
            {camp && i === insertAfter && (
              <div className="rounded-2xl border border-semantic-line-normal-normal px-4">
                <p className="prose-caption-one-bold pt-3 text-semantic-label-alternative">인터뷰 속 캠핑장</p>
                <ul>
                  <CampsiteRow campsite={camp} position={1} showCoupon={showCoupon} />
                </ul>
              </div>
            )}
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
