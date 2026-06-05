import React, { ReactNode } from 'react';

interface AnimateContainerProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-down';
  delay?: number; // mili giây
  className?: string;
}

export const AnimateContainer: React.FC<AnimateContainerProps> = ({
  children,
  animation = 'slide-up',
  delay = 0,
  className = '',
}) => {
  const animationClass =
    animation === 'fade-in'
      ? 'animate-fade-in'
      : animation === 'slide-down'
      ? 'animate-slide-down'
      : 'animate-slide-up';

  const style = delay ? { animationDelay: `${delay}ms`, animationFillMode: 'both' } : {};

  return (
    <div className={`${animationClass} ${className}`} style={style}>
      {children}
    </div>
  );
};
export default AnimateContainer;
