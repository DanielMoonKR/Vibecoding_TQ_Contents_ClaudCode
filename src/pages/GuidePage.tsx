import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import type { GuideContent } from '../types/content';
import { getContent } from '../content';
import { setTrackPage, track } from '../lib/track';
import { syncBookedFromQuery, useIsFirstBookingDone, useQuizResult } from '../lib/user';
import { GuideContext, type CurationOverride } from '../components/GuideContext';
import { TopBar } from '../components/template/TopBar';
import { Hero } from '../components/template/Hero';
import { RecommendFor } from '../components/template/RecommendFor';
import { BlockRenderer } from '../components/blocks/BlockRenderer';
import { CampsiteCarousel } from '../components/template/CampsiteCarousel';
import { NextReads } from '../components/template/NextReads';
import { StickyCta } from '../components/template/StickyCta';

const SCROLL_DEPTHS = [25, 50, 80];
const CTA_SHOW_AT = 0.3;

// /guide/{contentId}
export function GuidePage() {
  const { contentId = '' } = useParams();
  const { search } = useLocation();
  // 목업 회원 상태(?booked=1)는 렌더 전에 반영
  useMemo(() => syncBookedFromQuery(search), [search]);
  const content = getContent(contentId);

  if (!content) {
    return (
      <main className="mx-auto flex min-h-screen max-w-page flex-col items-center justify-center gap-4 bg-semantic-background-normal-normal px-5 text-center">
        <p className="prose-headline-one-bold">아직 준비 중인 글이에요</p>
        <Link to="/" className="prose-label-one-normal-bold text-semantic-primary-normal">
          첫캠핑 가이드 목록으로
        </Link>
      </main>
    );
  }
  return <GuideView key={content.id} content={content} entry={new URLSearchParams(search).get('entry')} />;
}

// 공통 렌더러: 3장 7개 영역을 같은 순서로 그린다. 본문(4번)만 컨텐츠마다 다르다
export function GuideView({ content, entry }: { content: GuideContent; entry?: string | null }) {
  const [quiz] = useQuizResult();
  const [bookingDone] = useIsFirstBookingDone();
  const [curationOverride, setCurationOverride] = useState<CurationOverride | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const bodyRef = useRef<HTMLElement>(null);
  const curationRef = useRef<HTMLElement>(null);
  const viewed = useRef(false);

  // 페이지 진입 (StrictMode 개발 모드의 effect 재실행에도 1회만 기록)
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    window.scrollTo(0, 0);
    setTrackPage({ content_id: content.id, series: content.series });
    track('guide_view', { entry: entry ?? 'direct' });
    document.title = `${content.title} | 첫캠핑 가이드`;
    // 진입 시점 1회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 본문 스크롤 깊이 (25·50·80%) + 하단 CTA 노출(30%)
  useEffect(() => {
    const sent = new Set<number>();
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
      setCtaVisible(progress >= CTA_SHOW_AT);
      for (const d of SCROLL_DEPTHS) {
        if (progress * 100 >= d && !sent.has(d)) {
          sent.add(d);
          track('guide_scroll', { depth: d });
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToCuration = useCallback(() => {
    curationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <GuideContext.Provider
      value={{
        content,
        quizType: quiz?.resultType ?? null,
        showCoupon: !bookingDone,
        curationOverride,
        setCurationOverride,
        scrollToCuration,
      }}
    >
      <div className="mx-auto min-h-screen max-w-page bg-semantic-background-normal-alternative pb-36">
        <TopBar content={content} />
        <Hero content={content} />
        <RecommendFor personas={content.personas} />
        <main ref={bodyRef} className="mt-2 bg-semantic-background-normal-normal px-5 py-8">
          <BlockRenderer blocks={content.blocks} />
        </main>
        <div className="mt-2">
          <CampsiteCarousel ref={curationRef} />
        </div>
        <div className="mt-2">
          <NextReads ids={content.next} />
        </div>
      </div>
      <StickyCta visible={ctaVisible} />
    </GuideContext.Provider>
  );
}
