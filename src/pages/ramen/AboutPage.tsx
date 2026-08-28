import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './AboutPage.css'

// Ported from Cake's AboutPage.tsx structure (accordion of <details> sections, one route, one
// text link in from Main) rather than inventing a new legal architecture (Phase 7 instruction).
// Copy is rewritten for Ramen's actual features -- no claims about systems this app doesn't have
// (e.g. no analytics library is wired up here, so that bullet says so honestly rather than
// copying Cake's Plausible mention).
export function AboutPage() {
  useDocumentTitle('About & Legal | Let Them Eat Ramen')

  return (
    <main className="page about-page">
      <h1>About &amp; Legal</h1>
      <p>
        Let Them Eat Ramen is a ramen encyclopedia, world atlas, pairing sommelier, and culinary education app. This page covers how
        the app works, what it does (and doesn't do) with your information, and the disclaimers worth knowing before you rely on
        anything here.
      </p>

      <details className="about-section">
        <summary>Privacy Policy</summary>
        <div className="about-section-body">
          <p>Let Them Eat Ramen doesn't require an account, login, or any personal information to use. Here's what actually happens:</p>
          <ul>
            <li>
              <strong>My Ramen / Favorites:</strong> saving a ramen or a personal note is designed to store that choice only in your
              device's local app storage. It's never sent to us or anyone else -- clearing your browser data or reinstalling the app
              removes it.
            </li>
            <li>
              <strong>Analytics:</strong> this app does not currently use any analytics or tracking service. If that changes, this
              section will be updated first.
            </li>
            <li>
              <strong>Affiliate links:</strong> Curated Kitchen includes some verified product links to third-party retailers via ShopMy
              and LTK. Tapping one means you've left this app, and that retailer's own privacy policy applies from there. See the
              Affiliate Disclosure section below for which products are currently live versus pending.
            </li>
            <li>
              <strong>Photography:</strong> images throughout the app, once sourced, load directly from Pexels' servers (see
              PHOTOGRAPHY.md). Loading any image shares standard technical details (like general network information) with Pexels, the
              same as viewing any embedded photo on the web.
            </li>
          </ul>
          <p>
            We don't sell your data, run ads, or share information with data brokers -- we don't collect information that could be sold
            or shared in the first place. This app is intended for a general audience and isn't directed at children under 13; we don't
            knowingly collect personal information from children.
          </p>
          <p>This policy may be updated as the app changes -- check back here for the current version.</p>
        </div>
      </details>

      <details className="about-section">
        <summary>Terms of Use</summary>
        <div className="about-section-body">
          <p>By using Let Them Eat Ramen, you agree to the following:</p>
          <ul>
            <li>
              <strong>Educational &amp; editorial content:</strong> ramen history, cultural notes, technique guidance, and pairing
              suggestions are provided for informational and entertainment purposes.
            </li>
            <li>
              <strong>No warranty:</strong> the app is provided "as is," without guarantees that content is complete, current, or
              error-free.
            </li>
            <li>
              <strong>Your responsibility:</strong> you're responsible for how you use any technique, guidance, or recommendation from
              this app, including your own judgment about food safety, allergens, and what's appropriate for you and your guests.
            </li>
            <li>
              <strong>Third-party links:</strong> links to retailers, sources, or other websites are provided for convenience; we don't
              control and aren't responsible for third-party content or practices.
            </li>
            <li>
              <strong>Intellectual property:</strong> app design, curation, and original written content belong to Let Them Eat Ramen.
              Photography, once sourced, is used under license/attribution from Pexels and its contributing photographers.
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
            Let Them Eat Ramen participates in affiliate programs, including ShopMy and LTK (LiketoKnow.it). Some product
            recommendations in Curated Kitchen are affiliate links -- if you make a purchase through one, we may earn a commission at no
            additional cost to you. Products without a verified affiliate link are shown for editorial context only, clearly marked
            "Coming Soon," and will only become clickable once a real, verified link exists for that specific product. We only recommend
            products we believe are genuinely useful for the technique or bowl they're paired with; our editorial opinions are our own.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Preparation &amp; Technique Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Workshop guidance -- Ramen Anatomy, Build a Bowl, and future Labs -- is informational. Actual results can vary based on your
            ingredients, equipment, and technique. You're responsible for using safe food-handling practices, including proper
            ingredient storage and cooking temperatures, and for using your own judgment about whether a technique is appropriate for
            your situation.
          </p>
          <p>Compatibility guidance in Build a Bowl (Traditional / Compatible / Experimental / Discouraged) reflects editorial judgment about how components are traditionally combined, not a food-safety rating.</p>
        </div>
      </details>

      <details className="about-section">
        <summary>Allergy &amp; Dietary Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Ramen frequently contains common allergens -- wheat (noodles, kansui-based dough), soy (tare, aroma oils), egg (ajitama,
            some noodle styles), and shellfish or fish (seafood-based dashi). Ingredient and topping descriptions in this app are a
            general guide only and may not account for every allergen or cross-contamination risk. Always check with the shop or your
            own kitchen directly, and consult a medical professional if you or your guests have food allergies or dietary restrictions.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Alcohol Disclaimer</summary>
        <div className="about-section-body">
          <p>
            Some pairing recommendations in Sommelier PAIR include alcoholic beverages such as sake, beer, and whisky. These are
            intended only for people of legal drinking age in their location. Let Them Eat Ramen does not make any health claims about
            alcohol consumption, and nothing in this app is medical advice about drinking.
          </p>
        </div>
      </details>

      <details className="about-section">
        <summary>Sources &amp; Editorial Standards</summary>
        <div className="about-section-body">
          <p>
            The Ramen Encyclopedia, Atlas, Workshop, Sommelier, and Slurp content in this app are editorial and educational content,
            researched and curated by the Let Them Eat Ramen team. Regional ramen traditions, variations, and historical details can
            differ by shop, family, and source -- where we label a bowl "traditional" or attribute it to a region, we mean a
            representative version, not the only correct one. Sommelier FIND/PAIR scores are a flavor-heuristic based on structured
            attributes, not a professional sommelier certification. We aim for accuracy and welcome corrections.
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
