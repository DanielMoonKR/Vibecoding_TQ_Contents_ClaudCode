import { useState } from 'react';
import { Icon } from './Icon';

// 이미지 + 토큰 색 플레이스홀더. 플레이스홀더를 먼저 깔고 사진은 로드가 끝난 뒤에만 덮어
// 로딩 중·실패(목업 단계엔 실제 사진이 없음) 어느 경우에도 빈 칸이 보이지 않게 한다.
const tints = [
  'bg-series-choose-bg text-series-choose',
  'bg-series-understand-bg text-series-understand',
  'bg-series-prepare-bg text-series-prepare',
  'bg-series-return-bg text-series-return',
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Img({
  src,
  alt,
  className = '',
  label,
}: {
  src?: string;
  alt: string;
  className?: string;
  /** 플레이스홀더에 보일 짧은 라벨 (없으면 alt) */
  label?: string;
}) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(src ? 'loading' : 'failed');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {state !== 'loaded' && (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${tints[hash(alt) % tints.length]}`}
        >
          <Icon name="tent" size={28} />
          {label !== '' && (
            <span className="prose-caption-one-medium px-2 text-center opacity-80">{label ?? alt}</span>
          )}
        </div>
      )}
      {src && state !== 'failed' && (
        <img
          src={src}
          alt={state === 'loaded' ? alt : ''}
          loading="lazy"
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
