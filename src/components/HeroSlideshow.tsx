import { useEffect, useState } from 'react';

const SLIDES = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

const SLIDE_DURATION = 6000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {SLIDES.map((src, i) => {
        const active = i === index;
        return (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: active ? 1 : 0,
              transform: active ? 'scale(1.08)' : 'scale(1)',
              transition:
                'opacity 1600ms ease-in-out, transform 6000ms ease-out',
            }}
            aria-hidden={!active}
          />
        );
      })}

    </div>
  );
}
