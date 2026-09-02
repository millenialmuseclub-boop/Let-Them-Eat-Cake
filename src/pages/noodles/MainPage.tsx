import { Link } from 'react-router-dom';
import { dishes, noodleTypes, regions } from '../../lib/noodles/data';
import { DishTile } from '../../components/noodles/DishTile';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const noodleOfTheDay = dishes[new Date().getDate() % dishes.length];

export function MainPage() {
  useDocumentTitle('Discover');

  return (
    <div className="page-container">
      <div className="hero-bleed">
        <PhotoFrame subjectId={noodleOfTheDay.id} fallbackLabel={noodleOfTheDay.name} variant="hero" />
        <div className="hero-bleed__scrim" />
        <div className="hero-bleed__content">
          <span className="eyebrow">Noodle of the Day</span>
          <h1>{noodleOfTheDay.name}</h1>
          <Link to={`/noodles/encyclopedia/${noodleOfTheDay.id}`} className="btn btn-primary" style={{ marginTop: 8 }}>
            Explore this dish
          </Link>
        </div>
      </div>

      <p className="prose" style={{ maxWidth: 560 }}>
        A world of noodles — pulled, cut, rolled, stretched, and slurped across cultures. Explore
        how a single idea takes a different shape in every kitchen it passes through.
      </p>

      <div className="section-heading">
        <h2>Explore the Encyclopedia</h2>
        <Link to="/noodles/encyclopedia">Browse all →</Link>
      </div>
      <div className="grid">
        {dishes.slice(0, 8).map((dish) => (
          <DishTile key={dish.id} dish={dish} />
        ))}
      </div>

      <div className="section-heading">
        <h2>Explore the Atlas</h2>
        <Link to="/noodles/atlas">Browse by origin →</Link>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {regions.map((region) => (
          <Link key={region.id} to="/noodles/atlas" className="chip chip-brass">
            {region.name}
          </Link>
        ))}
      </div>

      <div className="section-heading">
        <h2>Featured Traditions</h2>
        <Link to="/noodles/encyclopedia/noodle-types">Browse all →</Link>
      </div>
      <div className="rail-list">
        {noodleTypes.slice(0, 6).map((type) => (
          <Link key={type.id} to={`/noodles/encyclopedia/type/${type.id}`} className="rail-item">
            <span className="rail-item__name">{type.name}</span>
            <span className="rail-item__meta">{type.base.replace('-', ' ')} · {type.form.replace('-', ' ')}</span>
          </Link>
        ))}
      </div>

      <hr className="divider" />

      <div className="section-heading">
        <h2>What Kind of Noodle Are You Craving?</h2>
      </div>
      <Link to="/noodles/sommelier" className="card" style={{ display: 'block', textDecoration: 'none' }}>
        <span className="eyebrow" style={{ marginBottom: 4 }}>Sommelier</span>
        <p style={{ margin: 0 }}>
          Brothy or dry, delicate or bold, mild or spicy — tell us what you're after and we'll point you to a real dish, with the reasons why it fits.
        </p>
      </Link>

      <div className="section-heading">
        <h2>From Twirl</h2>
        <Link to="/noodles/twirl">Read the magazine →</Link>
      </div>
      <p className="prose">Vocabulary, technique stories, and the culture behind the bowl — why some noodles get slurped, why soba is served cold, and more.</p>

      <hr className="divider" />

      <div className="section-heading">
        <h2>Curated Kitchen</h2>
        <Link to="/noodles/curated-kitchen">Shop the essentials →</Link>
      </div>
      <p className="prose">Bowls, hand-noodle tools, and broth essentials, reused from the family's verified affiliate catalog.</p>

      <Link to="/about" className="discover-about-link">
        About &amp; Legal
      </Link>
    </div>
  );
}
