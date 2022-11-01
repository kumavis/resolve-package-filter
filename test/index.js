const path = require('path')
const test = require('tape')
const browserResolve = require('browser-resolve')

const { packageFilter } = require('../src/index.js')
const testPackage1 = require('./01-test-package.json')

test('test lodestar config', t => {
    t.plan(5)

    const result = packageFilter(testPackage1, 'test')
    t.equal(result.main, './lib/index.js')
    t.equal(result.browser['./default'], './lib/default.js')
    t.equal(result.browser['./networks'], './lib/networks.js')
    t.equal(result.browser['./presets'], './lib/presets.js')

    const resolved = browserResolve.sync('@lodestar/config/networks', { packageFilter })
    t.equal(resolved, path.resolve(__dirname, '../node_modules/@lodestar/config/lib/networks.js'))
})
