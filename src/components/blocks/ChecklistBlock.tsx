import { useEffect, useMemo, useRef } from 'react';
import type { CampsiteFilter, ChecklistBlock as Data, ChecklistItem } from '../../types/content';
import { track } from '../../lib/track';
import { useStored } from '../../lib/storage';
import { useGuide } from '../GuideContext';
import { Button, Chip } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

const norm = (item: string | ChecklistItem, gi: number, ii: number): ChecklistItem =>
  typeof item === 'string' ? { id: `${gi}-${ii}`, label: item } : item;

/** 체크한 항목들의 필터를 하나로 합친다 (tags는 합집합, 나머지는 뒤 항목 우선) */
function mergeFilters(items: ChecklistItem[]): CampsiteFilter {
  return items.reduce<CampsiteFilter>(
    (acc, it) => ({
      ...acc,
      ...it.filter,
      tags: [...new Set([...(acc.tags ?? []), ...(it.filter?.tags ?? [])])],
    }),
    {},
  );
}

// 체크리스트 — 체크 상태 저장(새로고침 유지), 진행률 바, "내 체크리스트 저장"
// 확장: segments(P-03 아이 나이 선택 → 항목 조정), item.filter(G-03 체크 → 캠핑장 필터 칩)
export function ChecklistBlock({ block }: { block: Data }) {
  const { content, setCurationOverride } = useGuide();
  const toast = useToast();
  const key = `checklist.${content.id}.${block.id}`;
  const [checked, setChecked] = useStored<string[]>(key, []);
  const [savedList, setSavedList] = useStored<string[]>('myChecklists', []);
  const [segment, setSegment] = useStored<string | null>(
    `${key}.segment`,
    block.segments?.options[0]?.key ?? null,
  );

  const groups = useMemo(
    () =>
      block.groups
        .map((g, gi) => ({
          ...g,
          items: g.items
            .map((it, ii) => norm(it, gi, ii))
            .filter((it) => !it.only || (segment != null && it.only.includes(segment))),
        }))
        .filter((g) => g.items.length > 0),
    [block.groups, segment],
  );
  const visible = groups.flatMap((g) => g.items);
  const done = visible.filter((it) => checked.includes(it.id)).length;
  const total = visible.length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const isSaved = savedList.includes(key);

  // 필터 항목: 체크한 조건을 큐레이션 영역의 필터 칩으로 반영
  const filterItems = visible.filter((it) => it.filter && checked.includes(it.id));
  const hasFilterItems = visible.some((it) => it.filter);
  const appliedRef = useRef(false);
  const filterKey = filterItems.map((it) => it.id).join(',');
  useEffect(() => {
    if (!hasFilterItems) return;
    if (filterItems.length) {
      appliedRef.current = true;
      setCurationOverride({ label: filterItems.map((it) => it.label).join(' · '), filter: mergeFilters(filterItems) });
    } else if (appliedRef.current) {
      appliedRef.current = false;
      setCurationOverride(null);
    }
    // filterKey가 바뀔 때만 다시 계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, hasFilterItems]);

  const toggle = (id: string) => {
    const on = !checked.includes(id);
    const next = on ? [...checked, id] : checked.filter((x) => x !== id);
    setChecked(next);
    if (on) {
      const nextDone = visible.filter((it) => next.includes(it.id)).length;
      track('checklist_check', { item_id: `${block.id}.${id}`, progress: Math.round((nextDone / total) * 100) });
    }
  };

  const save = () => {
    if (!isSaved) setSavedList([...savedList, key]);
    track('checklist_save');
    toast('마이페이지 > 내 체크리스트에 저장했어요');
  };

  return (
    <section className="rounded-2xl border border-semantic-line-normal-normal bg-semantic-background-elevated-normal">
      <div className="sticky top-14 z-[1] rounded-t-2xl bg-semantic-background-elevated-normal px-5 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="prose-headline-one-bold">{block.title ?? '체크리스트'}</h2>
          <span className="prose-label-two-bold text-semantic-primary-normal tabular">
            {done}/{total}
          </span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-semantic-fill-normal"
          role="progressbar"
          aria-label="체크 진행률"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-semantic-primary-normal transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {block.segments && (
        <div className="px-5 pb-2">
          <p className="prose-label-two-bold text-semantic-label-alternative">{block.segments.label}</p>
          <div className="scrollbar-none mt-1.5 flex gap-1.5 overflow-x-auto" role="radiogroup" aria-label={block.segments.label}>
            {block.segments.options.map((o) => (
              <Chip key={o.key} role="radio" aria-checked={segment === o.key} active={segment === o.key} onClick={() => setSegment(o.key)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 px-5 pb-5 pt-1">
        {hasFilterItems && (
          <p className="prose-caption-one-regular flex items-center gap-1 text-semantic-label-alternative">
            <Icon name="check" size={14} />
            체크한 조건은 캠핑장 추천에 바로 반영돼요
          </p>
        )}
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="prose-label-two-bold mb-1 text-semantic-label-alternative">{g.title}</h3>
            <ul>
              {g.items.map((it) => {
                const on = checked.includes(it.id);
                return (
                  <li key={it.id}>
                    <label className="flex min-h-touch cursor-pointer items-start gap-3 py-2">
                      <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(it.id)} />
                      <span
                        className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-semantic-primary-normal ${
                          on
                            ? 'border-semantic-primary-normal bg-semantic-primary-normal text-semantic-static-white'
                            : 'border-semantic-line-normal-strong'
                        }`}
                      >
                        {on && <Icon name="check" size={16} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`prose-body-two-normal-medium block ${on && !it.filter ? 'text-semantic-label-assistive line-through' : ''}`}
                        >
                          {it.label}
                        </span>
                        {it.hint && (
                          <span className="prose-caption-one-regular mt-0.5 block text-semantic-label-alternative">
                            {it.hint}
                          </span>
                        )}
                      </span>
                      {it.filter && on && (
                        <span className="prose-caption-two-bold mt-0.5 shrink-0 rounded-md bg-primary-tint px-1.5 py-1 text-semantic-primary-normal">
                          필터 적용
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {block.saveable !== false && (
          <Button variant={isSaved ? 'soft' : 'outlined'} size="md" className="w-full" onClick={save}>
            <Icon name="bookmark" size={18} filled={isSaved} />
            {isSaved ? '내 체크리스트에 저장됨' : '내 체크리스트 저장'}
          </Button>
        )}
      </div>
    </section>
  );
}
