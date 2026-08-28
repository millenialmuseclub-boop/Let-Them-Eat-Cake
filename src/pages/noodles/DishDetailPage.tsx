import { Link, useParams } from 'react-router-dom';
import { getDish, getNoodleType, getRecipeForDish, getRelatedDishes, getPlaceLabel, getTechnique } from '../../lib/noodles/data';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { FlavorProfileBars } from '../../components/noodles/FlavorProfileBars';
import { SavedDishControls } from '../../components/noodles/SavedDishControls';
import { DishTile } from '../../components/noodles/DishTile';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function DishDetailPage() {
  const { id = '' } = useParams();
  const dish = getDish(id);
  useDocumentTitle(dish?.name ?? 'Dish');

  if (!dish) {
    return (
      <div className="page-container">
        <p>Dish not found.</p>
        <Link to="/noodles/encyclopedia">← Back to Encyclopedia</Link>
      </div>
    );
  }

  const noodleType = getNoodleType(dish.noodleTypeId);
  const recipe = getRecipeForDish(dish.id);
  const relatedDishes = getRelatedDishes(dish);

  return (
    <div className="page-container">
      <div className="hero-bleed">
        <PhotoFrame subjectId={dish.id} fallbackLabel={dish.name} variant="hero" />
        <div className="hero-bleed__scrim" />
        <div className="hero-bleed__content">
          <span className="eyebrow">{getPlaceLabel(dish.place)}</span>
          <h1>{dish.name}</h1>
          {dish.localName && <p style={{ opacity: 0.9, margin: 0 }}>{dish.localName}</p>}
        </div>
      </div>

      <SavedDishControls dishId={dish.id} />

      <div className="section-heading">
        <h2>About This Dish</h2>
      </div>
      <p className="prose">{dish.culturalContext}</p>
      <p className="prose">{dish.historicalContext}</p>

      {noodleType && (
        <p className="prose" style={{ opacity: 0.85 }}>
          Made with{' '}
          <Link to={`/noodles/encyclopedia/type/${noodleType.id}`}>
            <strong>{noodleType.name}</strong>
          </Link>
          , {noodleType.description.toLowerCase()}
        </p>
      )}

      <div className="section-heading">
        <h2>Flavor Profile</h2>
      </div>
      <FlavorProfileBars profile={dish.flavorProfile} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {dish.flavorTags.map((tag) => (
          <span key={tag} className="chip chip-lacquer">
            {tag}
          </span>
        ))}
      </div>

      <div className="section-heading">
        <h2>Broth / Sauce</h2>
      </div>
      <p className="prose">{dish.brothOrSauceRelationship}</p>

      <div className="section-heading">
        <h2>Technique</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {dish.primaryTechniqueIds.map((tid) => {
          const t = getTechnique(tid);
          return t ? (
            <span key={tid} className="chip chip-brass">
              {t.name}
            </span>
          ) : null;
        })}
      </div>

      {recipe && (
        <>
          <hr className="divider" />
          <div className="section-heading">
            <h2>Recipe: {recipe.title}</h2>
          </div>
          <div className="glance-strip">
            <div className="glance-strip__item"><span>Yield</span><span>{recipe.yield}</span></div>
            <div className="glance-strip__item"><span>Prep</span><span>{recipe.prepTime}</span></div>
            <div className="glance-strip__item"><span>Cook</span><span>{recipe.cookTime}</span></div>
            <div className="glance-strip__item"><span>Difficulty</span><span>{recipe.difficulty}</span></div>
          </div>

          {recipe.ingredientGroups.map((group) => (
            <div key={group.groupName} style={{ marginBottom: 16 }}>
              <h3>{group.groupName}</h3>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {group.items.map((item, i) => (
                  <li key={i}>
                    <strong>
                      {item.amount}
                      {item.unit ? ` ${item.unit}` : ''}
                    </strong>{' '}
                    {item.ingredient}
                    {item.note ? ` — ${item.note}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h3>Method</h3>
          <ol className="recipe-steps">
            {recipe.instructions.map((step) => (
              <li key={step.step}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>
                    {step.stage}
                  </span>
                  <p style={{ margin: '2px 0 0' }}>{step.instruction}</p>
                  {step.techniqueNote && (
                    <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.75 }}>
                      <em>{step.techniqueNote}</em>
                      {step.relatedLabSlug && (
                        <>
                          {' '}
                          <Link to={`/noodles/workshop/lab/${step.relatedLabSlug}`}>See the lab →</Link>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {(recipe.cooksNotes || recipe.substitutions || recipe.storage || recipe.makeAhead) && (
            <details className="disclosure">
              <summary>Notes, Substitutions & Storage</summary>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recipe.cooksNotes?.map((note, i) => <p key={i} className="prose">{note}</p>)}
                {recipe.substitutions && (
                  <p className="prose"><strong>Substitutions:</strong> {recipe.substitutions.join(' ')}</p>
                )}
                {recipe.storage && <p className="prose"><strong>Storage:</strong> {recipe.storage}</p>}
                {recipe.makeAhead && <p className="prose"><strong>Make Ahead:</strong> {recipe.makeAhead}</p>}
              </div>
            </details>
          )}

          <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 16 }}>{recipe.sourceNote}</p>
        </>
      )}

      {relatedDishes.length > 0 && (
        <>
          <hr className="divider" />
          <div className="section-heading">
            <h2>Related Dishes</h2>
          </div>
          <div className="grid">
            {relatedDishes.map((d) => (
              <DishTile key={d.id} dish={d} />
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: 11.5, opacity: 0.55, marginTop: 24 }}>Source note: {dish.sourceNote}</p>
    </div>
  );
}
