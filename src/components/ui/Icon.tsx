// 디자인 시스템 Icon 컴포넌트로 교체 전까지 쓰는 최소 아이콘 세트 (24px, stroke)
const paths = {
  back: 'M15 5l-7 7 7 7',
  share: 'M12 4v11M7 9l5-5 5 5M5 14v5h14v-5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M5 9l7 7 7-7',
  close: 'M6 6l12 12M18 6L6 18',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z',
  tip: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z',
  warn: 'M12 3l10 18H2zM12 10v5M12 18v.5',
  play: 'M8 5v14l11-7z',
  mute: 'M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6',
  sound: 'M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12',
  sun: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  cloud: 'M7 18h10a4 4 0 00.5-8A6 6 0 006 9.5 4.3 4.3 0 007 18z',
  rain: 'M7 15h10a4 4 0 00.5-8A6 6 0 006 6.5 4.3 4.3 0 007 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3',
  car: 'M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2M7.5 13h.01M16.5 13h.01',
  tent: 'M12 4L3 20h18zM12 4v16M9 20l3-6 3 6',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  thermo: 'M10 13.5V5a2 2 0 014 0v8.5a4 4 0 11-4 0z',
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 24,
  className = '',
  filled = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
