import { Link } from 'react-router-dom'
import credits from '../../public/photography/credits.json'
import { getCakeImage } from '../lib/images'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function PhotoCreditsPage() {
  useDocumentTitle('Photography credits | Let Them Eat')
  const kransekake = getCakeImage('cake_kransekake')
  return <main className="page">
    <h1>Photography credits</h1>
    <p>These photographs are bundled with the app and remain available offline. Original creators retain their rights.</p>
    {credits.map((photo) => <section key={photo.id} className="photo-credit-entry">
      <img src={photo.localUrl} alt={photo.name} width={160} height={110} loading="lazy" />
      <div><h2>{photo.name}</h2><p>{photo.author}</p><p><a href={photo.source} target="_blank" rel="noreferrer">Original photograph</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></p><p>{photo.changes}</p></div>
    </section>)}
    {kransekake?.licenseUrl && <section className="photo-credit-entry">
      <div><h2>Kransekake</h2><p>{kransekake.photographer}</p><p><a href={kransekake.sourceUrl} target="_blank" rel="noreferrer">Original photograph</a> · <a href={kransekake.licenseUrl} target="_blank" rel="noreferrer">{kransekake.license}</a></p><p>Loaded from Wikimedia Commons; displayed with a responsive crop. No content edits.</p></div>
    </section>}
    <Link to="/about">About Let Them Eat</Link>
  </main>
}
