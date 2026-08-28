import { getImageFor } from '../../data/noodles/images';

interface PhotoFrameProps {
  subjectId: string;
  fallbackLabel: string;
  variant?: 'tile' | 'hero';
}

const MEDIA_CLASS = { tile: 'tile__media', hero: 'hero-bleed__media' };
const FALLBACK_CLASS = { tile: 'tile__fallback', hero: 'hero-bleed__media' };

/** Renders real, attributed photography when available; otherwise an honest editorial fallback
    (a typographic name-card, not an emoji or a substitute photo) per the master spec. */
export function PhotoFrame({ subjectId, fallbackLabel, variant = 'tile' }: PhotoFrameProps) {
  const image = getImageFor(subjectId);

  if (image) {
    return <img src={image.src} alt={image.alt} className={MEDIA_CLASS[variant]} loading="lazy" />;
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
