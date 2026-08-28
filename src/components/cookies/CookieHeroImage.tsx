import { getCookieImage } from '../../lib/cookies/images'

export function CookieHeroImage({ cookieId, name }: { cookieId: string; name: string }) {
  const image = getCookieImage(cookieId)
  if (!image) {
    return (
      <div className="cookie-hero-image-placeholder" role="img" aria-label={`${name} (photo not yet available)`}>
        <span aria-hidden="true" style={{ fontFamily: 'var(--heading)', fontSize: 15, fontWeight: 600, opacity: 0.6, textAlign: 'center', padding: '0 12px' }}>
          {name}
        </span>
      </div>
    )
  }
  return (
    <figure className="cookie-hero-image-figure">
      <img className="cookie-hero-image" src={image.url} alt={name} loading="lazy" />
      <figcaption className="cookie-hero-image-credit">
        Photo by {image.photographerUrl ? <a href={image.photographerUrl} target="_blank" rel="noreferrer">{image.photographer}</a> : image.photographer} on{' '}
        {image.sourceUrl ? <a href={image.sourceUrl} target="_blank" rel="noreferrer">{image.source}</a> : image.source}
      </figcaption>
    </figure>
  )
}

export function CookieThumbnail({ cookieId, name }: { cookieId: string; name: string }) {
  const image = getCookieImage(cookieId)
  if (!image) {
    return (
      <div className="cookie-hero-image-placeholder cookie-hero-image-placeholder-thumb" role="img" aria-label={`${name} (photo not yet available)`}>
        <span aria-hidden="true" style={{ fontFamily: 'var(--heading)', fontSize: 11, fontWeight: 600, opacity: 0.6, textAlign: 'center', padding: '0 8px' }}>
          {name}
        </span>
      </div>
    )
  }
  return <img className="cookie-hero-image-thumb" src={image.url} alt={name} loading="lazy" />
}
