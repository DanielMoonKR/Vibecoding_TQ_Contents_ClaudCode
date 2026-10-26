import { useState } from 'react';
import { Icon } from './Icon';

// 이미지 + 로딩 실패 시 토큰 색 플레이스홀더. 목업 단계에서는 실제 사진이 없어 플레이스홀더가 보인다.
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
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-1 ${tints[hash(alt) % tints.length]} ${className}`}
      >
        <Icon name="tent" size={28} />
        <span className="prose-caption-one-medium px-2 text-center opacity-80">{label ?? alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
