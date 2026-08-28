import type { CookieImage } from '../../types/cookies/images'

/** A compact photographic header band for hub pages -- shares the bleed/scrim visual language
    with DiscoverFeatureCard and CookieHeroImage but at hub-header proportions (shorter, title
    left-aligned rather than card-style), so hub pages read as siblings without using an identical
    component. */
export function PageHeroBand({ image, eyebrow, title, description }: { image?: CookieImage; eyebrow: string; title: string; description: string }) {
  if (!image) {
    return (
      <header className="page-hero-band page-hero-band-plain">
        <p className="page-hero-band-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-band-description">{description}</p>
      </header>
    )
  }
  return (
    <header className="page-hero-band">
      <img src={image.url} alt="" className="page-hero-band-image" loading="lazy" />
      <div className="page-hero-band-scrim">
        <p className="page-hero-band-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-band-description">{description}</p>
      </div>
      <p className="page-hero-band-credit">Photo by {image.photographer}</p>
    </header>
  )
}
