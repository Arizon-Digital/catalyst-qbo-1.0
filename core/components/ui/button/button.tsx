import { Slot } from '@radix-ui/react-slot';
import { Loader2 as Spinner } from 'lucide-react';
import { ComponentPropsWithRef, ComponentRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

interface Props extends ComponentPropsWithRef<'button'> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
}

const Button = forwardRef<ComponentRef<'button'>, Props>(
  (
    {
      asChild = false,
      children,
      className,
      variant = 'primary',
      loading,
      loadingText,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'bg-[#CA9618] -500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center',
          variant === 'primary' &&
            'bg-[#CA9618] -500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center',
          variant === 'secondary' &&
            'bg-[#CA9618] -500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center',
          variant === 'subtle' &&
            'bg-[#CA9618] -500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center',
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <span className="absolute z-10 flex h-full w-full items-center justify-center">
              <Spinner aria-hidden="true" className="animate-spin" />
              <span className="sr-only">{loadingText}</span>
            </span>
            <span className="invisible flex items-center">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
