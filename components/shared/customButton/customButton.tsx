import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomButtonProps } from './customButton.types';

export default function CustomButton({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  onClick,
  fullWidth = false,
  ...props
}: CustomButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const isDisabled = disabled || loading;

  return (
    <Button
      className={cn(
        fullWidth && 'w-full',
        loading && 'relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        // Add group class for hover effects
        'group',
        className
      )}
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={isDisabled}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Content wrapper */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
            {!loadingText && children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </span>
    </Button>
  );
}
