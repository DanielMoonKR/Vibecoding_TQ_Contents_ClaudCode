import { useMemo, useState } from 'react';
import type { Campsite, CampsiteListBlock as Data } from '../../types/content';
import { queryCampsites } from '../../lib/campsites';
import { Badge, CampsiteRow } from '../CampsiteCard';
import { useGuide } from '../GuideContext';
import { Chip } from '../ui/Button';
import { Icon } from '../ui/Icon';

function badgeFor(kind: Data['badge'], c: Campsite) {
  if (kind === 'weekend') {
    return c.availableThisWeekend ? (
      <Badge tone="positive">이번 주말 잔여</Badge>
    ) : (
      <Badge tone="info">이번 주말 마감</Badge>
    );
  }
  if (kind === 'weather' && c.weekendWeather) {
    const w = c.weekendWeather;
    return (
      <>
        <Badge tone="info">
          <Icon name={w.icon} size={12} />
          강수 {w.rainProb}%
        </Badge>
        <Badge tone="info">최저 {w.minTemp}°</Badge>
      </>
    );
  }
  if (kind === 'beginner' && c.tags.includes('beginner')) return <Badge tone="primary">초보 환영</Badge>;
  return undefined;
}

/** 앞으로 4번의 주말(토요일) */
function upcomingWeekends() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  return Array.from({ length: 4 }, (_, i) => {
    const s = new Date(d);
    s.setDate(d.getDate() + i * 7);
    return s;
  });
}

/** 목업 최저기온. 연동 단계에서 날씨 API로 교체 */
function mockMinTemp(date: Date) {
  const m = date.getMonth();
  const base = [-9, -7, -2, 4, 10, 15, 20, 20, 14, 6, 0, -6][m];
  return base - (date.getDate() % 4);
}

const PET_SIZES = [
  { label: '소형 ~10kg', kg: 10 },
  { label: '중형 ~20kg', kg: 20 },
  { label: '대형 ~40kg', kg: 40 },
];

// 본문 캠핑장 리스트 — 번호 매긴 세로 카드 + 카드별 예약 버튼
export function CampsiteListBlock({ block }: { block: Data }) {
  const { showCoupon, quizType, curationOverride } = useGuide();
  const [petKg, setPetKg] = useState<number | null>(null);
  const weekends = useMemo(upcomingWeekends, []);
  const [weekend, setWeekend] = useState(0);
  const override = block.followOverride ? curationOverride : null;

  const list = useMemo(() => {
    const o = override?.filter;
    return queryCampsites(
      {
        ...block.filter,
        ...o,
        tags: [...new Set([...(block.filter.tags ?? []), ...(o?.tags ?? [])])],
        petWeightKg: petKg ?? undefined,
        limit: block.limit,
      },
      { quizType },
    );
  }, [block.filter, block.limit, petKg, quizType, override]);

  const temp = mockMinTemp(weekends[weekend]);

  return (
    <section>
      {block.title && <h2 className="prose-heading-two-bold mb-2 [word-break:keep-all]">{block.title}</h2>}
      {override && (
        <p className="prose-label-two-medium mb-1 text-semantic-primary-normal" aria-live="polite">
          '{override.label}' 조건 적용 중 · {list.length}곳
        </p>
      )}

      {block.petWeightInput && (
        <div className="mb-2 rounded-2xl bg-semantic-fill-alternative p-4">
          <label htmlFor="pet-kg" className="prose-label-one-normal-bold">
            우리 강아지 몸무게는?
          </label>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-12 flex-1 items-center rounded-xl border border-semantic-line-normal-normal bg-semantic-background-normal-normal px-3 focus-within:border-semantic-label-normal">
              <input
                id="pet-kg"
                inputMode="decimal"
                placeholder="예: 7"
                value={petKg ?? ''}
                onChange={(e) => {
                  const n = parseFloat(e.target.value);
                  setPetKg(Number.isFinite(n) && n > 0 ? Math.min(n, 80) : null);
                }}
                className="prose-body-one-normal-bold w-full min-w-0 bg-transparent outline-none tabular"
              />
              <span className="prose-body-two-normal-regular text-semantic-label-alternative">kg</span>
            </div>
          </div>
          <div className="scrollbar-none mt-2 flex gap-1.5 overflow-x-auto">
            {PET_SIZES.map((s) => (
              <Chip key={s.kg} active={petKg === s.kg} onClick={() => setPetKg(petKg === s.kg ? null : s.kg)}>
                {s.label}
              </Chip>
            ))}
          </div>
          <p className="prose-caption-one-regular mt-2 text-semantic-label-alternative" aria-live="polite">
            {petKg ? `${petKg}kg 강아지와 갈 수 있는 곳 ${list.length}곳이에요` : '몸무게를 넣으면 갈 수 있는 곳만 보여드려요'}
          </p>
        </div>
      )}

      {block.weekendPicker && (
        <div className="mb-2 rounded-2xl bg-semantic-fill-alternative p-4">
          <p className="prose-label-one-normal-bold">언제 떠날까요?</p>
          <div className="scrollbar-none mt-2 flex gap-1.5 overflow-x-auto">
            {weekends.map((d, i) => (
              <Chip key={i} active={weekend === i} onClick={() => setWeekend(i)}>
                {d.getMonth() + 1}/{d.getDate()} 토
              </Chip>
            ))}
          </div>
          <p className="prose-body-two-normal-medium mt-3 flex items-center gap-1.5" aria-live="polite">
            <Icon name="thermo" size={18} className="text-semantic-status-informative" />
            이 주말 최저기온 <b className="tabular">{temp}°C</b>
            <span className="prose-caption-one-medium text-semantic-label-alternative">
              {temp <= 0 ? '· 난방 필수' : temp <= 8 ? '· 난방 권장' : ''}
            </span>
          </p>
        </div>
      )}

      {list.length === 0 ? (
        <p className="prose-body-two-normal-regular rounded-xl bg-semantic-fill-alternative p-5 text-center text-semantic-label-alternative">
          조건에 맞는 캠핑장이 없어요. 조건을 바꿔 볼까요?
        </p>
      ) : (
        <ol className="divide-y divide-semantic-line-normal-alternative">
          {list.map((c, i) => (
            <CampsiteRow
              key={c.id}
              campsite={c}
              position={i + 1}
              numbered={block.numbered}
              showCoupon={showCoupon}
              badge={badgeFor(block.badge, c)}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
