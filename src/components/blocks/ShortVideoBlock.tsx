import { useEffect, useRef, useState } from 'react';
import type { ShortVideoBlock as Data } from '../../types/content';
import { track } from '../../lib/track';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// 숏폼 영상 — 9:16, 화면 진입 시 음소거 자동재생, 자막 필수, 구간 이동(chapters)
// 영상 파일이 없으면(목업) 타이머로 재생을 흉내 내 자막·구간 이동 동작을 확인할 수 있게 한다
export function ShortVideoBlock({ block }: { block: Data }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mock, setMock] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const watched = useRef(0);
  const reported = useRef(false);

  // 화면 진입/이탈 시 자동 재생/정지
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.intersectionRatio >= 0.6), { threshold: [0, 0.6] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (mock || !v) return;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing, mock]);

  // 목업 재생 시계 + 시청 시간 집계
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      watched.current += 0.25;
      if (mock) setTime((t) => (t + 0.25 >= block.durationSec ? 0 : t + 0.25));
      if (!reported.current && watched.current >= 3) {
        reported.current = true;
        track('video_play', { video_id: block.id, watched_sec: 3 });
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [playing, mock, block.durationSec, block.id]);

  const seek = (t: number) => {
    setTime(t);
    if (!mock && videoRef.current) videoRef.current.currentTime = t;
    setPlaying(true);
  };

  const caption = block.captions.find((c) => time >= c.start && time < c.end);

  return (
    <section>
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-[9/16] max-h-[560px] overflow-hidden rounded-2xl bg-semantic-static-black"
      >
        {mock ? (
          <Img src={block.poster} alt="영상 미리보기" label="영상 준비 중 (목업)" className="h-full w-full" />
        ) : (
          <video
            ref={videoRef}
            src={block.src}
            poster={block.poster}
            muted={muted}
            playsInline
            loop
            preload="metadata"
            onError={() => setMock(true)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            className="h-full w-full object-cover"
          />
        )}

        {/* 자막 (필수) */}
        <div className="absolute inset-x-4 bottom-16 flex justify-center" aria-live="off">
          {caption && (
            <p className="prose-body-two-normal-bold rounded-lg bg-semantic-material-dimmer px-3 py-1.5 text-center text-semantic-static-white [word-break:keep-all]">
              {caption.text}
            </p>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
          <button
            type="button"
            aria-label={playing ? '일시정지' : '재생'}
            onClick={() => setPlaying(!playing)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-material-dimmer text-semantic-static-white"
          >
            {playing ? <span className="prose-label-one-normal-bold">❚❚</span> : <Icon name="play" filled size={20} />}
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-static-white)_30%,transparent)]">
            <div className="h-full bg-semantic-static-white" style={{ width: `${(time / block.durationSec) * 100}%` }} />
          </div>
          <span className="prose-caption-one-medium text-semantic-static-white tabular">
            {fmt(time)} / {fmt(block.durationSec)}
          </span>
          <button
            type="button"
            aria-label={muted ? '소리 켜기' : '소리 끄기'}
            onClick={() => setMuted(!muted)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-semantic-material-dimmer text-semantic-static-white"
          >
            <Icon name={muted ? 'mute' : 'sound'} size={20} />
          </button>
        </div>
      </div>

      {block.chapters && (
        <ul className="scrollbar-none -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {block.chapters.map((c) => (
            <li key={c.at}>
              <button
                type="button"
                onClick={() => seek(c.at)}
                className="prose-label-two-medium inline-flex min-h-touch items-center gap-1.5 whitespace-nowrap rounded-full bg-semantic-fill-normal px-3"
              >
                <span className="text-semantic-primary-normal tabular">{fmt(c.at)}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
