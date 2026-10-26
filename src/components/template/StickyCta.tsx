import { useMemo } from 'react';
import { couponDaysLeft, COUPON_AMOUNT, getVariant, won } from '../../lib/user';
import { searchUrl } from '../../lib/campsites';
import { track } from '../../lib/track';
import { useGuide } from '../GuideContext';
import { Button } from '../ui/Button';

// 7. 하단 고정 CTA — 본문 30% 스크롤 이후 노출, 웰컴 쿠폰 D-day + 버튼
export function StickyCta({ visible }: { visible: boolean }) {
  const { content, showCoupon, scrollToCuration, curationOverride } = useGuide();
  const variant = useMemo(getVariant, []);
  const daysLeft = useMemo(couponDaysLeft, []);

  const label = showCoupon
    ? (variant === 'B' && content.cta.variants?.B) || content.cta.label
    : '두 번째 캠핑 준비하기';

  const onClick = () => {
    track('cta_click', { cta_label: label, variant });
    if (content.cta.target === 'search') {
      location.href = searchUrl({ ...content.curation, ...curationOverride?.filter });
    } else {
      scrollToCuration();
    }
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-[3] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-page border-t border-semantic-line-normal-alternative bg-semantic-background-normal-normal px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
        {showCoupon && COUPON_AMOUNT > 0 && (
          <p className="prose-label-two-medium mb-2 flex items-center justify-center gap-1.5 text-semantic-label-neutral">
            <span className="prose-caption-one-bold rounded bg-semantic-primary-normal px-1.5 py-0.5 text-semantic-static-white tabular">
              {daysLeft === 0 ? 'D-DAY' : `D-${daysLeft}`}
            </span>
            첫 예약 웰컴 쿠폰 <b className="text-semantic-primary-normal">{won(COUPON_AMOUNT)}</b> 할인
          </p>
        )}
        <Button className="w-full" onClick={onClick} tabIndex={visible ? 0 : -1}>
          {label}
        </Button>
      </div>
    </div>
  );
}
