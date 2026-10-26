import { Link } from 'react-router-dom';
import { CATALOG } from '../../data/meta';
import { hasContent } from '../../content';
import { track } from '../../lib/track';
import { SeriesBadge } from './Hero';
import { Icon } from '../ui/Icon';

// 6. 다음에 읽을 글 — 같은 여정의 다음 시리즈 2편
export function NextReads({ ids }: { ids: string[] }) {
  const items = ids
    .map((id) => CATALOG.find((c) => c.id === id))
    .filter((c): c is (typeof CATALOG)[number] => !!c)
    .slice(0, 2);
  if (!items.length) return null;

  return (
    <section className="bg-semantic-background-normal-normal px-5 py-7">
      <h2 className="prose-heading-two-bold">다음에 읽을 글</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((c) => {
          const ready = hasContent(c.id);
          const inner = (
            <>
              <div className="min-w-0 flex-1">
                <SeriesBadge series={c.series} />
                <p className="prose-body-two-normal-bold mt-1.5 line-clamp-2 [word-break:keep-all]">{c.title}</p>
                {!ready && (
                  <p className="prose-caption-one-regular mt-1 text-semantic-label-assistive">곧 공개돼요</p>
                )}
              </div>
              {ready && <Icon name="chevronRight" className="shrink-0 text-semantic-label-assistive" />}
            </>
          );
          const cls =
            'flex min-h-touch items-center gap-3 rounded-2xl border border-semantic-line-normal-alternative bg-semantic-background-elevated-normal p-4';
          return (
            <li key={c.id}>
              {ready ? (
                <Link
                  to={`/guide/${c.id}?entry=next`}
                  onClick={() => track('next_content_click', { to_content_id: c.id })}
                  className={`${cls} active:bg-semantic-fill-alternative`}
                >
                  {inner}
                </Link>
              ) : (
                <div className={`${cls} opacity-60`} aria-disabled="true">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
