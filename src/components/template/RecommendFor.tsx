import type { PersonaCode } from '../../types/content';
import { PERSONAS } from '../../data/meta';
import { useQuizResult } from '../../lib/user';

// 3. 이런 분께 추천해요 — 페르소나 칩 1~3개, 진단 결과와 일치하면 "나에게 맞는 글"
export function RecommendFor({ personas }: { personas: PersonaCode[] }) {
  const [quiz] = useQuizResult();
  const mine = quiz?.persona ?? null;
  // personas 가 비어 있으면 전 페르소나 공통 컨텐츠
  const isMine = personas.length === 0 ? quiz != null : mine != null && personas.includes(mine);
  const chips = personas.length ? personas.slice(0, 3).map((p) => PERSONAS[p]) : ['캠핑이 처음인 누구나'];

  return (
    <section className="border-t border-semantic-line-solid-alternative bg-semantic-background-normal-normal px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="prose-label-one-normal-bold text-semantic-label-neutral">이런 분께 추천해요</h2>
        {isMine && (
          <span className="prose-caption-one-bold rounded-md bg-semantic-primary-normal px-2 py-1 text-semantic-static-white">
            나에게 맞는 글
          </span>
        )}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {chips.map((c, i) => (
          <li
            key={c}
            className={`prose-label-two-medium rounded-full px-3 py-1.5 ${
              isMine && (personas.length === 0 || personas[i] === mine)
                ? 'bg-primary-tint text-semantic-primary-normal ring-1 ring-semantic-primary-normal'
                : 'bg-semantic-fill-normal text-semantic-label-neutral'
            }`}
          >
            # {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
