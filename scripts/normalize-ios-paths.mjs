import fs from 'node:fs'
import path from 'node:path'

// Capacitor sync on Windows generates backslashes in Swift strings. Regenerate each
// existing local package path relative to Package.swift, preserving package names/versions.
const file = 'ios/App/CapApp-SPM/Package.swift'
let source = fs.readFileSync(file, 'utf8')
source = source.replace(/path: "([^"]*node_modules[^"]*)"/g, (_, generated) => {
  const suffix = generated.replaceAll('\\', '/').split('node_modules/')[1]
  const dependency = path.resolve('node_modules', suffix)
  if (!fs.existsSync(path.join(dependency, 'Package.swift'))) throw new Error(`Missing Swift package: ${suffix}`)
  return `path: "${path.relative(path.dirname(file), dependency).split(path.sep).join('/')}"`
})
fs.writeFileSync(file, source)
console.log('Swift package paths resolve locally and use portable forward slashes.')
