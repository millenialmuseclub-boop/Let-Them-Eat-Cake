import { Link } from 'react-router-dom'
import credits from '../../public/photography/credits.json'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function PhotoCreditsPage() {
  useDocumentTitle('Photography credits | Let Them Eat')
  return <main className="page">
    <h1>Photography credits</h1>
    <p>These photographs are bundled with the app and remain available offline. Original creators retain their rights.</p>
    {credits.map((photo) => <section key={photo.id} className="photo-credit-entry">
      <img src={photo.localUrl} alt={photo.name} width={160} height={110} loading="lazy" />
      <div><h2>{photo.name}</h2><p>{photo.author}</p><p><a href={photo.source} target="_blank" rel="noreferrer">Original photograph</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></p><p>{photo.changes}</p></div>
    </section>)}
    <Link to="/about">About Let Them Eat</Link>
  </main>
}
