import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "shadow-sm hover:opacity-90",
      secondary: "border shadow-sm hover:opacity-90",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const getVariantStyles = () => {
      const baseStyle = {
        borderRadius: '8px',
      };

      if (variant === 'primary') {
        return {
          ...baseStyle,
          backgroundColor: 'var(--primary)',
          color: 'var(--bg-light)',
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--text)',
          borderColor: 'var(--border)',
        };
      }
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        style={getVariantStyles()}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 