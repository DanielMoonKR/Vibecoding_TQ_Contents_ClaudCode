import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getCampsite } from '../lib/campsites';
import { FLOOR_LABEL, STAY_LABEL, TAG_LABEL } from '../data/meta';
import type { CampsiteTag, SiteFloor, StayType } from '../types/content';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

// 프로토타입 전용: 실제 앱의 캠핑장 상세(/camp/:id)·검색 결과(/search) 자리를 대신하는 안내 화면
export function MockAppPage({ kind }: { kind: 'camp' | 'search' }) {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { search } = useLocation();
  const camp = kind === 'camp' ? getCampsite(`camp_${id}`) : undefined;
  const q = new URLSearchParams(search);

  const conditions =
    kind === 'search'
      ? [
          ...(q.get('tags')?.split(',').map((t) => TAG_LABEL[t as CampsiteTag] ?? t) ?? []),
          ...(q.get('stay')?.split(',').map((s) => STAY_LABEL[s as StayType] ?? s) ?? []),
          ...(q.get('floor')?.split(',').map((f) => FLOOR_LABEL[f as SiteFloor] ?? f) ?? []),
          ...(q.get('drive') ? [`서울에서 ${q.get('drive')}분 이내`] : []),
          ...(q.get('weekend') ? ['이번 주말 예약 가능'] : []),
        ]
      : [];

  return (
    <div className="mx-auto flex min-h-screen max-w-page flex-col bg-semantic-background-normal-normal">
      <header className="flex h-14 items-center px-1">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full active:bg-semantic-fill-normal"
        >
          <Icon name="back" />
        </button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-24 text-center">
        <span className="prose-caption-one-bold rounded-md bg-semantic-fill-normal px-2 py-1 text-semantic-label-alternative">
          프로토타입
        </span>
        <h1 className="prose-heading-two-bold [word-break:keep-all]">
          {kind === 'camp' ? `${camp?.name ?? '캠핑장'} 상세페이지` : '캠핑장 검색 결과'}
        </h1>
        <p className="prose-body-two-normal-regular text-semantic-label-alternative [word-break:keep-all]">
          실제 앱에서는 {kind === 'camp' ? '이 캠핑장의 상세·예약 화면' : '아래 조건이 적용된 검색 결과'}으로 이동해요.
        </p>
        {conditions.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-1.5">
            {conditions.map((c) => (
              <li key={c} className="prose-label-two-medium rounded-full bg-semantic-fill-normal px-3 py-1.5">
                {c}
              </li>
            ))}
          </ul>
        )}
        <Button variant="outlined" size="md" className="mt-3" onClick={() => navigate(-1)}>
          가이드로 돌아가기
        </Button>
      </main>
    </div>
  );
}
