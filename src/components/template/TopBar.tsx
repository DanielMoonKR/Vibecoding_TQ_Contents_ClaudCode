import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GuideContent } from '../../types/content';
import { track } from '../../lib/track';
import { appUrl } from '../../lib/url';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';

// 1. 상단 바 — 뒤로가기, 시리즈명, 공유. 스크롤 시 상단 고정 + 제목 노출
export function TopBar({ content }: { content: GuideContent }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const share = async () => {
    // 공유 링크는 entry=share 를 붙여 유입 경로를 구분한다
    const url = `${location.origin}${appUrl(`/guide/${content.id}`)}?entry=share`;
    if (navigator.share) {
      try {
        await navigator.share({ title: content.title, url });
        track('share_click', { channel: 'native' });
      } catch {
        /* 사용자가 취소 */
      }
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    track('share_click', { channel: 'copy_link' });
    toast('링크를 복사했어요');
  };

  return (
    <header
      className={`sticky top-0 z-[2] flex h-14 items-center gap-1 bg-semantic-background-normal-normal px-1 transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_var(--semantic-line-normal-alternative)]' : ''
      }`}
    >
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => (history.length > 1 ? navigate(-1) : navigate('/'))}
        className="flex h-11 w-11 items-center justify-center rounded-full active:bg-semantic-fill-normal"
      >
        <Icon name="back" />
      </button>
      {/* 시리즈명은 히어로 배지에 있으므로 상단 바에서는 빼고, 스크롤 후에는 글 제목을 보여준다 */}
      <p
        className={`min-w-0 flex-1 truncate text-center ${
          scrolled ? 'prose-label-one-normal-bold' : 'prose-label-one-normal-medium text-semantic-label-alternative'
        }`}
      >
        {scrolled ? content.title : '첫캠핑 가이드'}
      </p>
      <button
        type="button"
        aria-label="공유하기"
        onClick={share}
        className="flex h-11 w-11 items-center justify-center rounded-full active:bg-semantic-fill-normal"
      >
        <Icon name="share" />
      </button>
    </header>
  );
}
