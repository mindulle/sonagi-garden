import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', style, children, ...props }, ref) => {

        const baseStyles: React.CSSProperties = {
            backgroundColor: 'var(--sonagi-color-surface)',
            borderRadius: 'var(--sonagi-radius-lg)',
            padding: 'var(--sonagi-spacing-lg)',
            color: 'var(--sonagi-color-text-primary)',
            transition: 'box-shadow var(--sonagi-transition-base)',
            ...style,
        };

        const variantStyles: Record<string, React.CSSProperties> = {
            default: {
                boxShadow: 'var(--sonagi-shadow-md)',
                border: 'none',
            },
            bordered: {
                boxShadow: 'none',
                border: '1px solid var(--sonagi-color-border)',
            },
        };

        const combinedStyles = {
            ...baseStyles,
            ...variantStyles[variant],
        };

        return (
            <div
                ref={ref}
                style={combinedStyles}
                className={`sonagi-card ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
