import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import xcode from 'xcode'
import plist from 'plist'
import sharp from 'sharp'

const projectFile = 'ios/App/App.xcodeproj/project.pbxproj'
const project = xcode.project(projectFile)
project.parseSync()
const source = fs.readFileSync(projectFile, 'utf8')
const manifest = plist.parse(fs.readFileSync('ios/App/App/PrivacyInfo.xcprivacy', 'utf8'))
const categories = manifest.NSPrivacyAccessedAPITypes
assert.ok(categories.some((entry) => entry.NSPrivacyAccessedAPIType === 'NSPrivacyAccessedAPICategoryFileTimestamp' && entry.NSPrivacyAccessedAPITypeReasons.includes('C617.1')))
assert.ok(categories.some((entry) => entry.NSPrivacyAccessedAPIType === 'NSPrivacyAccessedAPICategoryUserDefaults' && entry.NSPrivacyAccessedAPITypeReasons.includes('CA92.1')))
assert.ok(source.includes('PrivacyInfo.xcprivacy in Resources'))
assert.equal([...source.matchAll(/CURRENT_PROJECT_VERSION = (\d+);/g)].every((match) => match[1] === '5'), true)
assert.equal([...source.matchAll(/MARKETING_VERSION = ([\d.]+);/g)].every((match) => match[1] === '2.0'), true)
assert.ok(source.includes('IPHONEOS_DEPLOYMENT_TARGET = 15.0;'))
const config = JSON.parse(fs.readFileSync('ios/App/App/capacitor.config.json', 'utf8'))
assert.equal(config.appId, 'com.letthemeatcake.app')
assert.equal(config.plugins.CapacitorUpdater.autoUpdate, false)
assert.ok(config.plugins.CapacitorUpdater.publicKey.includes('BEGIN RSA PUBLIC KEY'))
assert.ok(!config.server?.url, 'Native launch must use the bundled app, not a remote server URL')
const packageFile = 'ios/App/CapApp-SPM/Package.swift'
for (const [, local] of fs.readFileSync(packageFile, 'utf8').matchAll(/path: "([^"]+)"/g)) {
  assert.ok(!local.includes('\\'), 'Swift package paths must be portable')
  assert.ok(fs.existsSync(path.resolve(path.dirname(packageFile), local, 'Package.swift')))
}
const resources = project.pbxResourcesBuildPhaseObj(project.getFirstTarget().uuid).files
assert.ok(resources.some((file) => file.comment === 'PrivacyInfo.xcprivacy in Resources'))
const icon = await sharp('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png').metadata()
assert.equal(icon.width, 1024); assert.equal(icon.height, 1024)
const bundled = 'ios/App/App/public'
const compareTree = (relative = '') => {
  for (const name of fs.readdirSync(path.join('dist', relative))) {
    const entry = path.join(relative, name)
    if (fs.statSync(path.join('dist', entry)).isDirectory()) compareTree(entry)
    else assert.ok(fs.readFileSync(path.join('dist', entry)).equals(fs.readFileSync(path.join(bundled, entry))), `Bundled asset differs: ${entry}`)
  }
}
compareTree()
if (process.argv.includes('--release')) {
  assert.ok(Number(config.plugins.CapacitorUpdater.version) > 0, 'Missing APP_BUILD_VERSION')
  assert.ok(process.env.VITE_R2_PUBLIC_BASE_URL?.startsWith('https://'), 'Missing production OTA base URL')
  const js = fs.readdirSync('dist/assets').filter((file) => file.endsWith('.js')).map((file) => fs.readFileSync(path.join('dist/assets', file), 'utf8')).join('')
  assert.ok(js.includes(process.env.VITE_R2_PUBLIC_BASE_URL), 'Production OTA URL was not baked into this build')
}
console.log('iOS static checks passed: project parses; privacy resource included; identity/version/build/plugins/paths/icon verified; bundled assets match dist. No Xcode archive or device execution performed.')
