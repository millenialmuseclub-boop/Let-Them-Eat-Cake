import { useDocumentTitle } from '../../lib/useDocumentTitle'

export function AboutPage() {
  useDocumentTitle('About & Legal')
  return (
    <main className="page-container guide-article">
      <h1>About &amp; Legal</h1>
      <p>
        Let Them Eat is an editorial guide to cookies from around the world -- part of the
        Let Them Eat family of apps, alongside Let Them Eat Cake and Let Them Eat.
      </p>
      <p>
        Some links in this app are affiliate links; we may earn a commission on qualifying
        purchases at no extra cost to you.
      </p>
      <h2>Policies</h2>
      <ul>
        <li><a href="https://jordypop.vercel.app/policies/let-them-eat-cookies/privacy" target="_blank" rel="noreferrer">Privacy Policy</a></li>
        <li><a href="https://jordypop.vercel.app/policies/let-them-eat-cookies/terms" target="_blank" rel="noreferrer">Terms of Use</a></li>
        <li><a href="https://jordypop.vercel.app/support/let-them-eat-cookies" target="_blank" rel="noreferrer">Support</a></li>
        <li><a href="https://jordypop.vercel.app/work/let-them-eat/cookies" target="_blank" rel="noreferrer">About this project</a></li>
      </ul>
      <p className="about-legal-note">
        Note: these URLs follow the established jordypop.vercel.app family pattern but have not
        been independently verified as live for this app in this pass.
      </p>
    </main>
  )
}
