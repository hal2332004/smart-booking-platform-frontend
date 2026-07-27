import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-soft hover:shadow-lift',
  secondary: 'bg-primary-soft text-primary hover:bg-primary-ring',
  outline: 'border border-line bg-surface text-ink-heading hover:border-primary hover:text-primary',
  ghost: 'text-ink-body hover:bg-line/40 hover:text-ink-heading',
  danger: 'bg-danger text-white hover:brightness-95 shadow-soft',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { to?: undefined };
type ButtonAsLink = CommonProps &
  { to: string } & Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'>;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const variant: Variant = props.variant ?? 'primary';
  const size: Size = props.size ?? 'md';
  const className = props.className ?? '';
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ('to' in props && props.to) {
    const { to, variant: _v, size: _s, className: _c, children, ...linkRest } = props;
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children, ...buttonRest } = props as ButtonAsButton;
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
