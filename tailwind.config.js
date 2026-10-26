import plugin from 'tailwindcss/plugin';

// 땡큐캠핑 디자인 시스템 v2 (storybook.thankqcamping.com) 토큰 이름을 그대로 클래스명으로 쓴다.
// 예: bg-semantic-primary-normal, text-semantic-label-alternative, prose-body-one-reading-regular
const semanticColors = [
  'primary-normal', 'primary-strong', 'primary-heavy',
  'label-normal', 'label-strong', 'label-neutral', 'label-alternative', 'label-assistive', 'label-disable',
  'background-normal-normal', 'background-normal-alternative',
  'background-elevated-normal', 'background-elevated-alternative',
  'interaction-inactive', 'interaction-disable',
  'line-normal-normal', 'line-normal-gray', 'line-normal-alternative', 'line-normal-strong',
  'line-solid-normal', 'line-solid-neutral', 'line-solid-alternative', 'line-solid-strong',
  'fill-normal', 'fill-strong', 'fill-alternative',
  'status-positive', 'status-cautionary', 'status-negative', 'status-informative',
  'static-white', 'static-black',
  'accent-background-red-orange', 'accent-background-lime', 'accent-background-cyan',
  'accent-background-light-blue', 'accent-background-violet', 'accent-background-purple',
  'accent-background-pink',
  'accent-foreground-red', 'accent-foreground-red-orange', 'accent-foreground-orange',
  'accent-foreground-lime', 'accent-foreground-green', 'accent-foreground-cyan',
  'accent-foreground-light-blue', 'accent-foreground-blue', 'accent-foreground-violet',
  'accent-foreground-purple', 'accent-foreground-pink',
  'material-dimmer',
  'inverse-primary', 'inverse-background', 'inverse-label',
];

const colors = Object.fromEntries(
  semanticColors.map((name) => [`semantic-${name}`, `var(--semantic-${name})`]),
);
// 첫캠핑 가이드 전용 추가 토큰: 시리즈 배지 4종 (기획안 10장)
for (const s of ['choose', 'understand', 'prepare', 'return']) {
  colors[`series-${s}`] = `var(--series-${s})`;
  colors[`series-${s}-bg`] = `var(--series-${s}-bg)`;
}

// [name, weight, lineHeight, size, letterSpacing]
const typography = [
  ['title-three-bold', 600, '133.4%', 24, '-2.3%'],
  ['heading-one-bold', 600, '136.4%', 22, '-1.94%'],
  ['heading-one-regular', 400, '136.4%', 22, '-1.94%'],
  ['heading-two-bold', 600, '140%', 20, '-1.2%'],
  ['headline-one-bold', 600, '144.5%', 18, '-0.02%'],
  ['headline-one-regular', 400, '144.5%', 18, '-0.02%'],
  ['headline-two-bold', 600, '141.2%', 17, '0%'],
  ['headline-two-medium', 500, '141.2%', 17, '0%'],
  ['body-one-normal-regular', 400, '150%', 16, '0.57%'],
  ['body-one-normal-medium', 500, '150%', 16, '0.57%'],
  ['body-one-normal-bold', 600, '150%', 16, '0.57%'],
  // 기획안 10장: 본문 16px / 행간 1.6 → reading 계열(162.5%)이 가장 가깝다
  ['body-one-reading-regular', 400, '162.5%', 16, '0.57%'],
  ['body-one-reading-bold', 600, '162.5%', 16, '0.57%'],
  ['body-two-normal-regular', 400, '146.7%', 15, '0.96%'],
  ['body-two-normal-medium', 500, '146.7%', 15, '0.96%'],
  ['body-two-normal-bold', 600, '146.7%', 15, '0.96%'],
  ['body-two-reading-regular', 400, '160%', 15, '0.96%'],
  ['label-one-normal-bold', 600, '142.9%', 14, '1.45%'],
  ['label-one-normal-medium', 500, '142.9%', 14, '1.45%'],
  ['label-one-normal-regular', 400, '142.9%', 14, '1.45%'],
  ['label-two-regular', 400, '138.5%', 13, '1.94%'],
  ['label-two-medium', 500, '138.5%', 13, '1.94%'],
  ['label-two-bold', 600, '138.5%', 13, '1.94%'],
  ['caption-one-regular', 400, '133.4%', 12, '2.52%'],
  ['caption-one-medium', 500, '133.4%', 12, '2.52%'],
  ['caption-one-bold', 600, '133.4%', 12, '2.52%'],
  ['caption-two-regular', 400, '127.3%', 11, '3.11%'],
  ['caption-two-medium', 500, '127.3%', 11, '3.11%'],
  ['caption-two-bold', 600, '127.3%', 11, '3.11%'],
];

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '640px' },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(
        Object.fromEntries(
          typography.map(([name, weight, lh, size, ls]) => [
            `.prose-${name}`,
            {
              fontWeight: String(weight),
              lineHeight: lh,
              fontSize: `${size}px`,
              letterSpacing: `${parseFloat(ls) / 100}em`,
            },
          ]),
        ),
      );
    }),
  ],
};
