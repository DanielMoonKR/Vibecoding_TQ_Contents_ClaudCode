import { CAMPSITES } from '../data/campsites';
import type { Campsite, CampsiteFilter, Curation, StayType } from '../types/content';
import { appUrl } from './url';

// 캠핑장 조회. 연동 단계에서 이 파일만 검색 API 호출로 바꾸면 된다.

function matches(c: Campsite, f: Omit<CampsiteFilter, 'anyOf'>, quizType: StayType | null) {
  if (f.ids && !f.ids.includes(c.id)) return false;
  if (f.tags && !f.tags.every((t) => c.tags.includes(t))) return false;
  if (f.stayTypes && !f.stayTypes.some((s) => c.stayTypes.includes(s))) return false;
  if (f.siteFloor && !f.siteFloor.some((s) => c.siteFloor.includes(s))) return false;
  if (f.maxDriveMin != null && c.driveMinFromSeoul > f.maxDriveMin) return false;
  if (f.availableThisWeekend && !c.availableThisWeekend) return false;
  if (f.minPrice != null && c.priceFrom < f.minPrice) return false;
  if (f.maxPrice != null && c.priceFrom > f.maxPrice) return false;
  if (f.fromQuiz && quizType && !c.stayTypes.includes(quizType)) return false;
  if (f.petWeightKg != null && (c.petMaxKg ?? 0) < f.petWeightKg) return false;
  return true;
}

export function queryCampsites(
  q: Curation,
  opts: { quizType?: StayType | null } = {},
): Campsite[] {
  const quizType = opts.quizType ?? null;
  let list = CAMPSITES.filter(
    (c) => matches(c, q, quizType) && (!q.anyOf || q.anyOf.some((f) => matches(c, f, quizType))),
  );
  if (q.ids) {
    // 에디터가 넣은 순서 유지 (D-04 수동 큐레이션)
    list = q.ids.map((id) => list.find((c) => c.id === id)).filter(Boolean) as Campsite[];
  } else {
    const sort = q.sort ?? 'rating';
    list = [...list].sort((a, b) =>
      sort === 'drive'
        ? a.driveMinFromSeoul - b.driveMinFromSeoul
        : sort === 'price'
          ? a.priceFrom - b.priceFrom
          : b.rating - a.rating,
    );
  }
  if (q.pin?.length) {
    const pinned = q.pin.map((id) => list.find((c) => c.id === id)).filter(Boolean) as Campsite[];
    list = [...pinned, ...list.filter((c) => !q.pin!.includes(c.id))];
  }
  return q.limit ? list.slice(0, q.limit) : list;
}

export function getCampsite(id: string) {
  return CAMPSITES.find((c) => c.id === id);
}

/** CTA target이 search일 때 이동할 검색 결과 URL */
export function searchUrl(q: CampsiteFilter) {
  const p = new URLSearchParams();
  if (q.tags?.length) p.set('tags', q.tags.join(','));
  if (q.stayTypes?.length) p.set('stay', q.stayTypes.join(','));
  if (q.siteFloor?.length) p.set('floor', q.siteFloor.join(','));
  if (q.maxDriveMin) p.set('drive', String(q.maxDriveMin));
  if (q.availableThisWeekend) p.set('weekend', '1');
  return appUrl(`/search?${p.toString()}`);
}
