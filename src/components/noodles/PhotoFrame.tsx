import { useState } from 'react';
import { getImageFor } from '../../data/noodles/images';

interface PhotoFrameProps {
  subjectId: string;
  fallbackLabel: string;
  variant?: 'tile' | 'hero';
}

const MEDIA_CLASS = { tile: 'tile__media', hero: 'hero-bleed__media' };
const FALLBACK_CLASS = { tile: 'tile__fallback', hero: 'hero-bleed__media' };

/** Renders real, attributed photography when available; otherwise an honest editorial fallback
    (a typographic name-card, not an emoji or a substitute photo) per the master spec.

    Unlike every other world's photography (pre-fetched at build time and bundled with the app),
    Noodles' images are live Wikimedia Commons hotlinks fetched at runtime -- a genuinely more
    fragile dependency (slow/blocked/rate-limited on a real device's network). Falls back to the
    same honest editorial card on a load failure instead of leaving a broken-image icon on screen. */
export function PhotoFrame({ subjectId, fallbackLabel, variant = 'tile' }: PhotoFrameProps) {
  const image = getImageFor(subjectId);
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return <img src={image.src} alt={image.alt} className={MEDIA_CLASS[variant]} loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <div className={FALLBACK_CLASS[variant]} role="img" aria-label={`${fallbackLabel} — photography pending`}>
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--heading)',
          fontSize: variant === 'hero' ? 22 : 13,
          fontWeight: 600,
          textAlign: 'center',
          padding: '0 14px',
          opacity: 0.65,
          lineHeight: 1.25,
        }}
      >
        {fallbackLabel}
      </span>
    </div>
  );
}
