import { useEffect, useRef, useState } from 'react';
import type { CostCalculatorBlock as CostData, RefundTimelineBlock as RefundData } from '../../types/content';
import { track } from '../../lib/track';
import { won } from '../../lib/user';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

const toNum = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;

function MoneyInput({
  value,
  onChange,
  label,
  className = '',
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={`flex h-12 items-center rounded-xl border border-semantic-line-normal-normal bg-semantic-background-normal-normal px-3 focus-within:border-semantic-label-normal ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        inputMode="numeric"
        value={value ? value.toLocaleString('ko-KR') : ''}
        placeholder="0"
        onChange={(e) => onChange(toNum(e.target.value))}
        className="prose-body-one-normal-bold w-full min-w-0 bg-transparent text-right outline-none tabular"
      />
      <span className="prose-body-two-normal-regular ml-1 text-semantic-label-alternative">원</span>
    </label>
  );
}

/** 값 변경 이벤트를 입력 멈춘 뒤 한 번만 보낸다 */
function useDebouncedTrack(type: string) {
  const t = useRef<number>();
  return () => {
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => track('calculator_use', { calculator_type: type }), 800);
  };
}

// 환불 예시 — 예약 금액 입력 시 시점별 환불액 표시 (U-02)
export function RefundTimelineBlock({ block }: { block: RefundData }) {
  const [amount, setAmount] = useState(block.defaultAmount ?? 100000);
  const ping = useDebouncedTrack('refund');
  const steps = [...block.steps].sort((a, b) => b.daysBefore - a.daysBefore);

  return (
    <section className="rounded-2xl border border-semantic-line-normal-normal bg-semantic-background-elevated-normal p-5">
      <h2 className="prose-headline-one-bold">{block.title ?? '언제 취소하면 얼마 돌려받을까?'}</h2>
      <p className="prose-label-two-regular mt-1 text-semantic-label-alternative">예약 금액을 넣으면 바로 계산해 드려요</p>
      <MoneyInput
        label="예약 금액"
        value={amount}
        onChange={(n) => {
          setAmount(Math.min(n, 10_000_000));
          ping();
        }}
        className="mt-3"
      />
      <ol className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-semantic-line-solid-normal">
        {steps.map((s) => {
          const refund = Math.floor((amount * s.rate) / 100 / 10) * 10;
          const color =
            s.rate === 100
              ? 'bg-semantic-status-positive'
              : s.rate === 0
                ? 'bg-semantic-status-negative'
                : 'bg-semantic-status-cautionary';
          return (
            <li key={s.daysBefore} className="relative flex items-center gap-3 pl-6">
              <span className={`absolute left-0 h-4 w-4 rounded-full border-[3px] border-semantic-background-elevated-normal ${color}`} />
              <div className="flex-1">
                <p className="prose-label-one-normal-bold">{s.label ?? (s.daysBefore === 0 ? '이용 당일' : `이용 ${s.daysBefore}일 전`)}</p>
                <p className="prose-caption-one-regular text-semantic-label-alternative">{s.rate}% 환불</p>
              </div>
              <p className={`prose-body-one-normal-bold tabular ${s.rate === 0 ? 'text-semantic-label-assistive' : ''}`}>
                {won(refund)}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="prose-caption-one-regular mt-4 text-semantic-label-assistive">
        예시 기준이에요. 캠핑장마다 규정이 달라 예약 전 상세페이지에서 꼭 확인해요.
      </p>
    </section>
  );
}

// 비용 계산기 — 인원·항목 금액 수정 → 1인 비용, 결과 공유 링크 (D-03)
export function CostCalculatorBlock({ block }: { block: CostData }) {
  const toast = useToast();
  const ping = useDebouncedTrack('cost_split');
  const [items, setItems] = useState(block.items);
  const [people, setPeople] = useState(block.people);

  // 공유 링크로 들어온 경우 값 복원 (?calc=)
  useEffect(() => {
    const raw = new URLSearchParams(location.search).get('calc');
    if (!raw) return;
    try {
      const d = JSON.parse(decodeURIComponent(escape(atob(raw)))) as { p: number; v: number[] };
      setPeople(d.p);
      setItems(block.items.map((it, i) => ({ ...it, price: d.v[i] ?? it.price })));
    } catch {
      /* 잘못된 링크는 무시 */
    }
  }, [block.items]);

  const total = items.reduce((s, it) => s + it.price, 0);
  const perPerson = people > 0 ? Math.ceil(total / people / 100) * 100 : 0;

  const share = async () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ p: people, v: items.map((i) => i.price) }))));
    const url = `${location.origin}${location.pathname}?entry=share&calc=${payload}`;
    await navigator.clipboard?.writeText(url).catch(() => {});
    track('share_click', { channel: 'calculator_link' });
    toast('정산 결과 링크를 복사했어요');
  };

  return (
    <section className="rounded-2xl border border-semantic-line-normal-normal bg-semantic-background-elevated-normal p-5">
      <h2 className="prose-headline-one-bold">1인당 얼마 들까?</h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="prose-body-two-normal-bold">인원</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="인원 줄이기"
            disabled={people <= 1}
            onClick={() => {
              setPeople(people - 1);
              ping();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-fill-normal disabled:opacity-40"
          >
            <Icon name="minus" size={18} />
          </button>
          <span className="prose-headline-one-bold w-12 text-center tabular" aria-live="polite">
            {people}명
          </span>
          <button
            type="button"
            aria-label="인원 늘리기"
            disabled={people >= 20}
            onClick={() => {
              setPeople(people + 1);
              ping();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-fill-normal disabled:opacity-40"
          >
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-3">
            <span className="prose-body-two-normal-medium w-20 shrink-0">{it.name}</span>
            <MoneyInput
              label={`${it.name} 금액`}
              value={it.price}
              onChange={(n) => {
                setItems(items.map((x, j) => (j === i ? { ...x, price: n } : x)));
                ping();
              }}
              className="flex-1"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl bg-primary-tint p-4">
        <div className="flex justify-between">
          <span className="prose-label-two-medium text-semantic-label-alternative">총 비용</span>
          <span className="prose-label-one-normal-bold tabular">{won(total)}</span>
        </div>
        <div className="mt-1 flex items-end justify-between">
          <span className="prose-body-two-normal-bold">1인 비용</span>
          <span className="prose-title-three-bold text-semantic-primary-normal tabular" aria-live="polite">
            {won(perPerson)}
          </span>
        </div>
      </div>
      <Button variant="outlined" size="md" className="mt-3 w-full" onClick={share}>
        <Icon name="link" size={18} /> 친구에게 정산 링크 보내기
      </Button>
    </section>
  );
}
