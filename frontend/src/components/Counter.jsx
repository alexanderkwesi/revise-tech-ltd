import React, { useEffect, useState, useRef } from 'react';

export default function Counter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target]);

  const animate = () => {
    const duration = 1500; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // easeOutQuad
      const currentValue = Math.floor(ease * target);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(update);
  };

  const formatValue = (val) => {
    if (target >= 100) {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <span ref={elementRef}>
      {prefix}
      {formatValue(count+1)}
      {suffix}
    </span>
  );
}
