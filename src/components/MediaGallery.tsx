import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Play,
  X,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Types & helpers
───────────────────────────────────────────── */
export type MediaItem = {
  url: string;
  type: 'image' | 'video';
  poster?: string;
};

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

export function classifyMedia(urls: string[]): MediaItem[] {
  return (urls ?? [])
    .filter(Boolean)
    .map((url) => ({
      url,
      type: VIDEO_EXT.test(url) ? 'video' : 'image',
    }));
}

/* ─────────────────────────────────────────────
   Shared media cell renderer
───────────────────────────────────────────── */
function MediaCell({
  item,
  alt,
  className = '',
}: {
  item: MediaItem;
  alt: string;
  className?: string;
}) {
  if (item.type === 'video') {
    return (
      <>
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          className={`h-full w-full object-cover ${className}`}
        />
        {/* Subtle centered play indicator — no white card, matches image aesthetic */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur-[2px] transition-transform duration-300">
            <Play className="h-4 w-4 translate-x-px fill-white text-white" />
          </span>
        </span>
      </>
    );
  }
  return (
    <img
      src={item.url}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/* ─────────────────────────────────────────────
   Lightbox
───────────────────────────────────────────── */
function Lightbox({
  items,
  startIndex,
  title,
  onClose,
}: {
  items: MediaItem[];
  startIndex: number;
  title: string;
  onClose: () => void;
}) {
  const [active, setActive] = useState(startIndex);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const count = items.length;
  const current = items[active];
  const isVideo = current?.type === 'video';

  const go = useCallback(
    (dir: number) => {
      setActive((p) => ((p + dir + count) % count));
    },
    [count],
  );

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go, onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // auto-play video when active
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [active, isVideo]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold text-white/80">
          <span className="text-white">{active + 1}</span>
          <span className="mx-1 text-white/40">/</span>
          {count}
          {title && (
            <span className="ml-3 hidden text-white/50 sm:inline">{title}</span>
          )}
        </p>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main viewer */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        {count > 1 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-2 sm:left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="relative flex h-full w-full max-h-[calc(100vh-160px)] items-center justify-center">
          {isVideo ? (
            <video
              ref={videoRef}
              key={current.url}
              src={current.url}
              controls
              muted
              playsInline
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          ) : (
            <img
              key={current.url}
              src={current.url}
              alt={title}
              className="max-h-full max-w-full rounded-lg object-contain animate-fade-in"
            />
          )}
        </div>

        {/* Next */}
        {count > 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-2 sm:right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 z-10"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div
          className="shrink-0 px-4 pb-4 pt-3 sm:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all duration-200 sm:h-16 sm:w-24 ${
                  i === active
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <MediaCell item={item} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main MediaGallery component
───────────────────────────────────────────── */
export function MediaGallery({
  items,
  title,
}: {
  items: MediaItem[];
  title: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const count = items.length;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  /* ── Empty state ── */
  if (count === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-line bg-canvas">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Building2 className="h-12 w-12 opacity-40" />
          <p className="text-sm font-medium">No media available</p>
        </div>
      </div>
    );
  }

  /* ── Single image/video ── */
  if (count === 1) {
    return (
      <>
        <div
          className="group relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl shadow-card"
          onClick={() => openLightbox(0)}
        >
          <MediaCell item={items[0]} alt={title} className="transition-transform duration-500 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {lightboxIndex !== null && (
          <Lightbox items={items} startIndex={lightboxIndex} title={title} onClose={closeLightbox} />
        )}
      </>
    );
  }

  /* ── 2 images: side-by-side 60/40 split ── */
  if (count === 2) {
    return (
      <>
        <div className="grid h-[340px] grid-cols-[3fr_2fr] gap-2 overflow-hidden rounded-xl shadow-card sm:h-[380px]">
          <GalleryCell item={items[0]} alt={title} index={0} onClick={openLightbox} />
          <GalleryCell item={items[1]} alt={title} index={1} onClick={openLightbox} />
        </div>
        {lightboxIndex !== null && (
          <Lightbox items={items} startIndex={lightboxIndex} title={title} onClose={closeLightbox} />
        )}
      </>
    );
  }

  /* ── 3 or 4 images: 1 hero left + 2 stacked right (with +N overlay if 4+) ── */
  if (count === 3 || count === 4) {
    const extraCount = count - 3;
    return (
      <>
        {/*
          Outer grid: h-[340px] gives an explicit height.
          Right column is a nested grid with grid-rows-2.
          CSS Grid computes each row = (340px - gap) / 2 = explicit px height.
          absolute inset-0 children then resolve to that computed px height.
        */}
        <div className="grid h-[340px] grid-cols-[3fr_2fr] gap-2 overflow-hidden rounded-xl shadow-card sm:h-[380px]">
          <GalleryCell item={items[0]} alt={title} index={0} onClick={openLightbox} />

          {/* Right panel: nested grid so each cell gets explicit pixel height from grid track */}
          <div className="grid grid-rows-2 gap-2">
            {/* Top cell */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <GalleryCell item={items[1]} alt={title} index={1} onClick={openLightbox} />
              </div>
            </div>

            {/* Bottom cell — overlay if count > 3 */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <GalleryCell item={items[2]} alt={title} index={2} onClick={openLightbox} />
                {extraCount > 0 && (
                  <button
                    onClick={() => openLightbox(2)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink-heading/55 backdrop-blur-[2px] transition hover:bg-ink-heading/65"
                  >
                    <Grid2x2 className="h-5 w-5 text-white" />
                    <span className="text-sm font-bold text-white">
                      +{extraCount} more
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {lightboxIndex !== null && (
          <Lightbox items={items} startIndex={lightboxIndex} title={title} onClose={closeLightbox} />
        )}
      </>
    );
  }


  /* ── 5+ images: 1 hero left + 2x2 grid right (with "see all" overlay) ── */
  const extraCount = count - 5;
  return (
    <>
      <div className="grid h-[340px] grid-cols-[3fr_2fr] gap-2 overflow-hidden rounded-xl shadow-card sm:h-[380px]">
        {/* Hero */}
        <GalleryCell item={items[0]} alt={title} index={0} onClick={openLightbox} />

        {/* 2x2 right panel — grid item stretches to row height, nested grid distributes */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden">
              <div className="absolute inset-0">
                <GalleryCell item={items[i]} alt={title} index={i} onClick={openLightbox} />
              </div>
            </div>
          ))}

          {/* Last cell — "See all" overlay if more than 5 */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <GalleryCell item={items[4]} alt={title} index={4} onClick={openLightbox} />
              {extraCount > 0 && (
                <button
                  onClick={() => openLightbox(4)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink-heading/55 backdrop-blur-[2px] transition hover:bg-ink-heading/65"
                >
                  <Grid2x2 className="h-5 w-5 text-white" />
                  <span className="text-sm font-bold text-white">
                    +{extraCount} more
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "Show all photos" pill button below */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => openLightbox(0)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-heading shadow-soft transition hover:border-primary hover:text-primary hover:shadow-card"
        >
          <Grid2x2 className="h-4 w-4" />
          Show all {count} photos
        </button>
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={items} startIndex={lightboxIndex} title={title} onClose={closeLightbox} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Individual gallery cell with hover effect
───────────────────────────────────────────── */
function GalleryCell({
  item,
  alt,
  index,
  onClick,
}: {
  item: MediaItem;
  alt: string;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <button
      className="group relative h-full w-full overflow-hidden bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onClick={() => onClick(index)}
      aria-label={`View photo ${index + 1}`}
    >
      <MediaCell
        item={item}
        alt={alt}
        className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      {/* Subtle darkening on hover */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </button>
  );
}