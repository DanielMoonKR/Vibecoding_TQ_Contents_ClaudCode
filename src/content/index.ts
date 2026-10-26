import type { GuideContent } from '../types/content';

// 컨텐츠 JSON 레지스트리. 새 컨텐츠는 이 폴더에 {ID}.json 을 추가하면 /guide/{ID} 로 열린다.
const modules = import.meta.glob<GuideContent>('./*.json', { eager: true, import: 'default' });

const CONTENTS: Record<string, GuideContent> = Object.fromEntries(
  Object.values(modules).map((c) => [c.id, c]),
);

export function getContent(id: string): GuideContent | undefined {
  return CONTENTS[id];
}

export function hasContent(id: string) {
  return id in CONTENTS;
}

export function listContents() {
  return Object.values(CONTENTS);
}
