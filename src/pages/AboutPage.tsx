import './AboutPage.css'

export function AboutPage() {
  return (
    <main className="page about-page">
      <h1>About &amp; Legal</h1>
      <p>
        Let Them Eat Cake is a cake encyclopedia, world atlas, pairing sommelier, and recipe app. This page covers how the app works,
        what it does (and doesn't do) with your information, and the disclaimers worth knowing before you bake or plan around anything
        here.
      </p>

      <details className="about-section">
        <summary>Privacy Policy</summary>
        <div className="about-section-body">
          <p>Let Them Eat Cake doesn't require an account, login, or any personal information to use. Here's what actually happens:</p>
          <ul>
            <li>
              <strong>Favorites / Saved Cakes:</strong> tapping the heart icon to save a cake or personality stores that choice only in
              your device's local app storage. It's never sent to us or anyone else — clearing your browser data or reinstalling the
              app removes it.
            </li>
            <li>
              <strong>Analytics:</strong> we use Plausible Analytics, a privacy-focused service that doesn't use cookies and doesn't
              track you individually. It shows us anonymous, aggregate information like which pages are popular and when affiliate
              recommendations are viewed or tapped.
            </li>
            <li>
              <strong>Affiliate links:</strong> product recommendations link out to third-party retailers via ShopMy and LTK. Once you
              tap one, you've left this app, and that retailer's own privacy policy applies from there.
            </li>
            <li>
              <strong>Photography:</strong> images throughout the app load directly from Unsplash's servers. Loading any image shares
              standard technical details (like general network information) with Unsplash, the same as viewing any embedded photo on
              the web.
            </li>
          </ul>
          <p>
            We don't sell your data, run ads, or share information with data brokers — we don't collect information that could be sold
            or shared in the first place. This app is intended for a general audience and isn't directed at children under 13; we don't
            knowingly collect personal information from children.
          </p>
          <p>This policy may be updated as the app changes — check back here for the current version.</p>
        </div>
      </details>

      <details className="about-section">
        <summary>Terms of Use</summary>
        <div className="about-section-body">
          <p>By using Let Them Eat Cake, you agree to the following:</p>
          <ul>
            <li>
              <strong>Educational &amp; editorial content:</strong> recipes, history, cultural notes, and pairing suggestions are
              provided for informational and entertainment purposes.
            </li>
            <li>
              <strong>No warranty:</strong> the app is provided "as is," without guarantees that content is complete, current, or
              error-free.
            </li>
            <li>
              <strong>Your responsibility:</strong> you're responsible for how you use any recipe, technique, or recommendation from
              this app, including your own judgment about food safety, allergens, and what's appropriate for you and your guests.
            </li>
            <li>
              <strong>Third-party links:</strong> links to retailers, sources, or other websites are provided for convenience; we don't
              control and aren't responsible for third-party content or practices.
            </li>
            <li>
              <strong>Intellectual property:</strong> app design, curation, and original written content belong to Let Them Eat Cake.
              Photography is used under license/attribution from Unsplash and its contributing photographers.
            </li>
            <li>
              <strong>Changes:</strong> these terms may be updated from time to time; continued use of the app means you accept the
              current version.
            </li>
          </ul>
          <p>This is general information, not a substitute for professional legal advice.</p>
        </div>
      </details>

      <details className="about-section">
        <summary>Affiliate Disclosure</summary>
        <div className="about-section-body">
          <p>
            Let Them Eat Cake participates in affiliate programs, including ShopMy and LTK (LiketoKnow.it). Some product
            recommendations throughout the app — like tools in the Curator's Tool Drawer — are affiliate links. If you make a purchase
            through one of these links, we may earn a commission at no additional cost to you. We only recommend products we believe
            are genuinely useful for the baking or the cake they're paired with; our editorial opinions are our own.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Recipe &amp; Food Safety Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Recipes and baking guidance in this app are informational. Actual results can vary based on your ingredients, equipment,
            altitude, and technique. You're responsible for using safe food-handling practices — including proper ingredient storage,
            cooking and cooling temperatures, and cleanliness — and for using your own judgment about whether a recipe or technique is
            appropriate for your situation.
          </p>
          <p>
            Serving quantities, structural/assembly guidance, Pantry Raid suggestions, and Celebration (Wedding, Birthday, Other
            Celebrations) plans are generated estimates based on general baking guidelines, not a professional consultation. Always
            double-check quantities, structural support, and timing yourself for anything important — like a wedding cake — well before
            the event.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Allergy &amp; Dietary Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Ingredient lists, substitution suggestions, and dietary tags (such as gluten-free or dairy-free notes) are provided as a
            general guide only and may not account for every allergen, cross-contamination risk, or individual dietary need. Always
            check ingredient labels yourself and consult a medical professional if you or your guests have food allergies or dietary
            restrictions. We do not guarantee that any recipe or substitution is safe for a specific allergy or condition.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Alcohol Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Some drink pairings, cocktails, wines, and other alcoholic beverages appear in the Sommelier and Celebrate sections. These
            are intended only for people of legal drinking age in their location. Let Them Eat Cake does not make any health claims
            about alcohol consumption, and nothing in this app is medical advice about drinking.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Sources &amp; Editorial Standards</summary>
        <div className="about-section-body">
          <p>
            The Cake Encyclopedia, World Cake Atlas, recipes, cultural notes, and pairing scores in this app are editorial and
            educational content, researched and curated by the Let Them Eat Cake team. Culinary traditions, recipe variations, and
            historical details can differ by region, family, and source — where we note a cake as "traditional" or attribute it to a
            country, we mean a representative version, not the only correct one. Pairing scores are a flavor-science-based heuristic,
            not a professional sommelier certification. We aim for accuracy and welcome corrections.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Contact / Support</summary>
        <div className="about-section-body">
          <p>
            Questions, corrections, or feedback? Reach us at{' '}
            <a href="mailto:millenialmuseclub@gmail.com">millenialmuseclub@gmail.com</a>.
          </p>
        </div>
      </details>
    </main>
  )
}
