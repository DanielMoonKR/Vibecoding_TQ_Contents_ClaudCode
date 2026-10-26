import type { ButtonHTMLAttributes } from 'react';

// 디자인 시스템 v2 Button (Solid / Outlined) 스펙: 높이 48, radius 12, body-one-normal-bold
type Variant = 'solid' | 'outlined' | 'soft';
type Size = 'lg' | 'md' | 'sm';

const variants: Record<Variant, string> = {
  solid:
    'bg-semantic-primary-normal text-semantic-static-white active:bg-semantic-primary-heavy disabled:bg-semantic-interaction-disable disabled:text-semantic-label-assistive',
  outlined:
    'border border-semantic-line-normal-normal bg-semantic-background-normal-normal text-semantic-label-normal active:bg-semantic-fill-normal',
  soft: 'bg-semantic-fill-normal text-semantic-label-normal active:bg-semantic-fill-strong',
};

const sizes: Record<Size, string> = {
  lg: 'h-12 px-7 rounded-xl prose-body-one-normal-bold',
  md: 'h-11 px-4 rounded-[10px] prose-label-one-normal-bold',
  sm: 'min-h-touch px-3 rounded-lg prose-label-two-bold',
};

export function Button({
  variant = 'solid',
  size = 'lg',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

export function Chip({
  active,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`prose-label-one-normal-medium inline-flex min-h-touch items-center gap-1 whitespace-nowrap rounded-full border px-3.5 transition-colors ${
        active
          ? 'border-semantic-label-normal bg-semantic-label-normal text-semantic-background-normal-normal'
          : 'border-semantic-line-normal-normal bg-semantic-background-normal-normal text-semantic-label-neutral'
      } ${className}`}
      {...rest}
    />
  );
}
