import type { ReactNode } from 'react';
import type { Campsite } from '../types/content';
import { couponPrice, COUPON_AMOUNT, won } from '../lib/user';
import { track } from '../lib/track';
import { appUrl } from '../lib/url';
import { STAY_LABEL } from '../data/meta';
import { Icon } from './ui/Icon';
import { Img } from './ui/Img';

interface Props {
  campsite: Campsite;
  position: number;
  area: 'body' | 'carousel';
  showCoupon: boolean;
  /** 썸네일 위 배지 (이번 주말 잔여·날씨 등) */
  badge?: ReactNode;
  numbered?: boolean;
}

function onOpen(c: Campsite, position: number, area: Props['area']) {
  track('campsite_card_click', { campsite_id: c.id, position, area });
}

// 1행: 쿠폰 라벨 + 원가(취소선), 2행: 쿠폰 적용가. 금액과 '~'가 줄바꿈되지 않게 한 덩어리로 둔다
function Price({ c, showCoupon }: { c: Campsite; showCoupon: boolean }) {
  const coupon = showCoupon && COUPON_AMOUNT > 0;
  return (
    <div className="min-w-0">
      {coupon && (
        <p className="prose-caption-one-regular flex items-center gap-1 whitespace-nowrap">
          <span className="prose-caption-one-bold text-semantic-primary-normal">쿠폰 적용가</span>
          <span className="text-semantic-label-assistive line-through tabular">{won(c.priceFrom)}</span>
        </p>
      )}
      <p className="prose-body-one-normal-bold whitespace-nowrap tabular">
        {won(coupon ? couponPrice(c.priceFrom) : c.priceFrom)}
        <span className="prose-caption-one-regular text-semantic-label-alternative">~/1박</span>
      </p>
    </div>
  );
}

function Meta({ c }: { c: Campsite }) {
  return (
    <p className="prose-caption-one-regular flex flex-wrap items-center gap-x-1.5 text-semantic-label-alternative">
      <span>{c.region}</span>
      <span aria-hidden>·</span>
      <span>서울에서 {c.driveMinFromSeoul}분</span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-0.5 text-semantic-label-neutral">
        <Icon name="star" size={12} filled className="text-semantic-status-cautionary" />
        {c.rating.toFixed(1)}
      </span>
    </p>
  );
}

/** 이 글에 맞는 캠핑장 캐러셀용 세로 카드 */
export function CampsiteCard({ campsite: c, position, area, showCoupon, badge }: Props) {
  return (
    <a
      href={appUrl(c.detailUrl)}
      onClick={() => onOpen(c, position, area)}
      className="block w-[180px] shrink-0 snap-start overflow-hidden rounded-2xl border border-semantic-line-normal-alternative bg-semantic-background-elevated-normal"
    >
      <div className="relative">
        <Img src={c.thumbnail} alt={`${c.name} 전경`} label={c.name} className="aspect-[4/3] w-full" />
        {badge && <div className="absolute left-2 top-2 flex gap-1">{badge}</div>}
      </div>
      <div className="space-y-1 p-3">
        <p className="prose-caption-one-medium text-semantic-label-alternative">
          {c.stayTypes.map((s) => STAY_LABEL[s]).join(' · ')}
        </p>
        <h4 className="prose-body-two-normal-bold line-clamp-1">{c.name}</h4>
        <Meta c={c} />
        <div className="pt-1">
          <Price c={c} showCoupon={showCoupon} />
        </div>
      </div>
    </a>
  );
}

/** 본문 campsiteList 블록용 가로 행 카드 (번호 + 예약 버튼) */
export function CampsiteRow({
  campsite: c,
  position,
  showCoupon,
  badge,
  numbered,
}: Omit<Props, 'area'>) {
  return (
    <li className="flex gap-3 py-4">
      {numbered && (
        <span className="prose-headline-one-bold w-6 shrink-0 pt-1 text-center text-semantic-primary-normal tabular">
          {position}
        </span>
      )}
      <a
        href={appUrl(c.detailUrl)}
        onClick={() => onOpen(c, position, 'body')}
        className="relative block shrink-0 overflow-hidden rounded-xl"
      >
        <Img src={c.thumbnail} alt={`${c.name} 전경`} label={c.region} className="aspect-[4/3] w-[104px]" />
      </a>
      <div className="min-w-0 flex-1">
        {badge && <div className="mb-1 flex flex-wrap gap-1">{badge}</div>}
        <a href={appUrl(c.detailUrl)} onClick={() => onOpen(c, position, 'body')}>
          <h4 className="prose-body-two-normal-bold line-clamp-1">{c.name}</h4>
        </a>
        <Meta c={c} />
        <div className="mt-1.5 flex items-end justify-between gap-2">
          <Price c={c} showCoupon={showCoupon} />
          {/* 주황 Solid는 하단 고정 CTA에만 쓰고, 카드 버튼은 Outlined로 위계를 낮춘다 */}
          <a
            href={appUrl(c.detailUrl)}
            onClick={() => onOpen(c, position, 'body')}
            className="prose-label-two-bold -mb-1.5 inline-flex min-h-touch shrink-0 items-center"
          >
            <span className="rounded-lg border border-semantic-line-normal-normal px-2.5 py-1.5 text-semantic-label-normal active:bg-semantic-fill-normal">
              예약하기
            </span>
          </a>
        </div>
      </div>
    </li>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'primary' | 'positive' | 'info';
}) {
  const tones = {
    neutral: 'bg-semantic-material-dimmer text-semantic-static-white',
    primary: 'bg-semantic-primary-normal text-semantic-static-white',
    positive: 'bg-semantic-status-positive text-semantic-static-white',
    info: 'bg-semantic-fill-normal text-semantic-label-neutral',
  };
  return (
    <span className={`prose-caption-two-bold inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}
