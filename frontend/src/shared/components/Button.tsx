import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ variant = 'outline', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
