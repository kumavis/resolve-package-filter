
module.exports = { packageFilter }


function packageFilter (pkg, dir) {
    if (pkg.exports === undefined) return pkg
    const newPkg = { ...pkg }
    // polyfill main
    if (newPkg.main === undefined) {
        const primaryExports = newPkg.exports['.']
        if (primaryExports !== undefined) {
            newPkg.main = primaryExports.browser || primaryExports.import
        }
    }
    // polyfill browser fields
    newPkg.browser = newPkg.browser || {}
    for (const key of Object.keys(newPkg.exports)) {
        if (key === '.') continue
        const exportEntry = newPkg.exports[key]
        if (typeof exportEntry === 'string') {
            newPkg.browser[key] = exportEntry
        } else if (typeof exportEntry === 'object') {
            newPkg.browser[key] = exportEntry.browser || exportEntry.import
        }
    }
    return newPkg
}