import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', style, ...props }, ref) => {

        const baseStyles: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--sonagi-radius-md)',
            fontWeight: 500,
            transition: 'all var(--sonagi-transition-fast)',
            cursor: 'pointer',
            border: '1px solid transparent',
            fontFamily: 'var(--sonagi-font-family-base)',
            ...style,
        };

        const variantStyles: Record<string, React.CSSProperties> = {
            primary: {
                backgroundColor: 'var(--sonagi-color-primary)',
                color: '#FFFFFF',
                border: '1px solid var(--sonagi-color-primary)',
            },
            secondary: {
                backgroundColor: 'var(--sonagi-color-secondary)',
                color: '#FFFFFF',
                border: '1px solid var(--sonagi-color-secondary)',
            },
            outline: {
                backgroundColor: 'transparent',
                color: 'var(--sonagi-color-primary)',
                border: '1px solid var(--sonagi-color-primary)',
            },
            ghost: {
                backgroundColor: 'transparent',
                color: 'var(--sonagi-color-text-primary)',
                border: '1px solid transparent',
            },
        };

        const sizeStyles: Record<string, React.CSSProperties> = {
            sm: {
                padding: '0.25rem 0.5rem',
                fontSize: 'var(--sonagi-font-size-sm)',
            },
            md: {
                padding: '0.5rem 1rem',
                fontSize: 'var(--sonagi-font-size-base)',
            },
            lg: {
                padding: '0.75rem 1.5rem',
                fontSize: 'var(--sonagi-font-size-lg)',
            },
        };

        const combinedStyles = {
            ...baseStyles,
            ...variantStyles[variant],
            ...sizeStyles[size],
        };

        return (
            <button
                ref={ref}
                style={combinedStyles}
                className={`sonagi-button ${className}`}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
