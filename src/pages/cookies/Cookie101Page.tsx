import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { getSceneImage } from '../../lib/cookies/images'

export function Cookie101Page() {
  useDocumentTitle('Cookie 101')
  return (
    <main className="page-container guide-article">
      <PageHeroBand
        image={getSceneImage('scene_baking_tray')}
        eyebrow="The Essential Primer"
        title="Cookie 101"
        description="The handful of components and techniques nearly every cookie in the world is built from."
      />
      <p>
        Nearly every cookie in the world is built from the same handful of components: a flour base,
        a fat, a sweetener, sometimes a binder or leavening agent, and whatever flavor or mix-ins
        define the tradition. What varies is the ratio and the technique -- how the fat is
        incorporated, how much the dough rests, how it's portioned, and how it's baked.
      </p>
      <h2>Two mixing philosophies</h2>
      <p>
        Most cookie doughs fall into one of two mixing camps. Creamed doughs beat softened fat and
        sugar together first, incorporating air for a lighter, often chewier result -- this is the
        American drop-cookie approach behind chocolate chip and peanut butter cookies. Rubbed-in
        doughs work cold fat directly into flour without creaming, producing a short, sandy,
        crumbly texture -- the approach behind shortbread, sablé, and many South Asian and Middle
        Eastern shaped cookies.
      </p>
      <h2>Why chilling matters</h2>
      <p>
        A rested, chilled dough spreads less and bakes with a deeper flavor than one baked
        immediately, because the fat firms back up and the flour has time to hydrate. That's why
        so many recipes -- across very different traditions -- call for a chill before baking.
      </p>
      <h2>Where to go next</h2>
      <p>
        Visit the Workshop to explore Cookie Anatomy in full, or open Dough Lab and Chocolate Lab
        to see how specific technique choices change texture and flavor.
      </p>
    </main>
  )
}
