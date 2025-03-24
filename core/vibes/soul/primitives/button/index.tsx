



import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'large' | 'medium' | 'small' | 'x-small';
  shape?: 'pill' | 'rounded' | 'square' | 'circle';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --button-focus: hsl(var(--primary));
 *   --button-font-family: var(--font-family-body);
 *   --button-primary-background: #D4A017;
 *   --button-primary-background-hover: #BF9117;
 *   --button-primary-foreground: white;
 *   --button-primary-border: #ca9618;
 *   --button-secondary-background: #ca9618;
 *   --button-secondary-background-hover: #BF9117;
 *   --button-secondary-foreground: white;
 *   --button-secondary-border: #ca9618;
 *   --button-tertiary-background:#ca9618;
 *   --button-tertiary-background-hover:#ca9618;
 *   --button-tertiary-foreground: white;
 *   --button-tertiary-border: #ca96187;
 *   --button-ghost-background: #ca9618;
 *   --button-ghost-background-hover: #BF9117;
 *   --button-ghost-foreground: white;
 *   --button-ghost-border: #D4A017;
 * }
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'large',
  shape = 'rounded',
  onClick,
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      aria-busy={loading}
      className={clsx(
        'border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[#ca9618] mt-2 text-white after:bg-[#BF9117] font-robotoslab font-bold',
        {
          primary:
            'border-[var(--button-primary-border,hsl(var(--primary)))] bg-[#ca9618] text-[var(--button-primary-foreground)] after:bg-[#BF9117]',
          secondary:
            'border-[var(--button-secondary-border,hsl(var(--foreground)))] bg-[#ca9618] text-white after:bg-[#BF9117] scale-90',
          tertiary:
            'border-[var(--button-tertiary-border,hsl(var(--contrast-200)))] bg-[#ca9618] text-[var(--button-tertiary-foreground,hsl(var(--foreground)))] after:bg-[#BF9117]',
          ghost:
            'border-[var(--button-ghost-border,transparent)] bg-[#ca9618] text-[var(--button-ghost-foreground,hsl(var(--foreground)))] after:bg-[#BF9117]',
        }[variant],
        {
          pill: 'rounded-full after:rounded-full',
          rounded: 'rounded-lg after:rounded-lg',
          square: 'rounded-none after:rounded-none',
          circle: 'rounded-full after:rounded-full',
        }[shape],
        !loading && !disabled && 'hover:after:translate-x-0',
        disabled && 'cursor-not-allowed opacity-30',
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-300 ease-in-out',
          loading ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100',
          shape === 'circle' && 'aspect-square',
          {
            'x-small': 'min-h-8 text-xs',
            small: 'min-h-10 text-sm',
            medium: 'min-h-12 text-base',
            large: 'min-h-14 text-base',
          }[size],
          shape !== 'circle' &&
            {
              'x-small': 'gap-x-2 px-3 py-1.5',
              small: 'gap-x-2 px-4 py-2.5',
              medium: 'gap-x-2.5 px-5 py-3',
              large: 'gap-x-3 px-6 py-4',
            }[size],
          'uppercase tracking-wider text-white'
        )}
      >
        {children}
      </span>

      <span
        className={clsx(
          'absolute inset-0 grid place-content-center transition-all duration-300 ease-in-out',
          loading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        )}
      >
        <Loader2 className={clsx('animate-spin', variant === 'tertiary' && 'text-foreground')} />
      </span>
    </button>
  );
}