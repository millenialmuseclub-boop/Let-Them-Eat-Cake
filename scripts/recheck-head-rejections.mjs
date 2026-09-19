import fs from 'node:fs'
const file = 'reports/content-audit.json'
const report = JSON.parse(fs.readFileSync(file, 'utf8'))
for (const entry of report.network.filter(e => e.status === 405)) {
  try {
    const response = await fetch(entry.url, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    entry.getStatus = response.status
    entry.getDestination = response.url
    await response.body?.cancel()
  } catch (error) { entry.getError = error.message }
}
fs.writeFileSync(file, JSON.stringify(report, null, 2) + '\n')
console.log(report.network.filter(e => e.status === 405).map(e => ({ url: e.url, getStatus: e.getStatus, error: e.getError })))
