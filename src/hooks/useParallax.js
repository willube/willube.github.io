import { useEffect } from 'react';

export const useParallax = (ref, intensity = 0.18) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollY = window.scrollY;
      const offset = Math.min(scrollY * intensity, 120);
      ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, intensity]);
};
