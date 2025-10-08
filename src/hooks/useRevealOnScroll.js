import { useEffect } from 'react';

export const useRevealOnScroll = (selector = '.fade-section') => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.24,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);
};
