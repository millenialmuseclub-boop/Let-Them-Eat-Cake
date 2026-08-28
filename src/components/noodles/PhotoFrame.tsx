import { getImageFor } from '../../data/noodles/images';

interface PhotoFrameProps {
  subjectId: string;
  fallbackEmoji?: string;
  fallbackLabel: string;
  variant?: 'tile' | 'hero';
}

const MEDIA_CLASS = { tile: 'tile__media', hero: 'hero-bleed__media' };
const FALLBACK_CLASS = { tile: 'tile__fallback', hero: 'hero-bleed__media' };

/** Renders real, attributed photography when available; otherwise an honest branded fallback
    rather than a substitute or AI-generated image, per the master spec. */
export function PhotoFrame({ subjectId, fallbackEmoji = '🍜', fallbackLabel, variant = 'tile' }: PhotoFrameProps) {
  const image = getImageFor(subjectId);

  if (image) {
    return <img src={image.src} alt={image.alt} className={MEDIA_CLASS[variant]} />;
  }

  return (
    <div className={FALLBACK_CLASS[variant]} role="img" aria-label={`${fallbackLabel} — photography pending`}>
      <span aria-hidden="true" style={{ fontSize: variant === 'hero' ? 56 : 34 }}>
        {fallbackEmoji}
      </span>
    </div>
  );
}
