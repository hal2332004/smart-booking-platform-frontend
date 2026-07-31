import { useEffect, useRef, useState, forwardRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
}, forwardedRef) => {
  const [isVisible, setIsVisible] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold,
      }
    );

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getAnimationClasses = () => {
    switch (animation) {
      case 'fade-up': return 'translate-y-12 opacity-0';
      case 'fade-in': return 'opacity-0';
      case 'fade-left': return 'translate-x-12 opacity-0';
      case 'fade-right': return '-translate-x-12 opacity-0';
      case 'zoom-in': return 'scale-95 opacity-0';
      default: return 'translate-y-12 opacity-0';
    }
  };

  const getVisibleClasses = () => {
    switch (animation) {
      case 'fade-up': return 'translate-y-0 opacity-100';
      case 'fade-in': return 'opacity-100';
      case 'fade-left': return 'translate-x-0 opacity-100';
      case 'fade-right': return 'translate-x-0 opacity-100';
      case 'zoom-in': return 'scale-100 opacity-100';
      default: return 'translate-y-0 opacity-100';
    }
  };

  return (
    <div
      ref={setRefs}
      className={`transition-all ${isVisible ? getVisibleClasses() : getAnimationClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Snappy spring-like curve
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
});
