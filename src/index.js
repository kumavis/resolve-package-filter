
module.exports = { packageFilter: packageExportsCjsFix }


function packageExportsCjsFix(pkg, _dir) {
    if (pkg.exports === undefined) {
      return pkg;
    }
    const newPkg = { ...pkg };
  
    // polyfill main
  
    if (newPkg.main === undefined) {
      const primaryExports = newPkg.exports['.'];
      if (primaryExports !== undefined) {
        newPkg.main = getValueForExportsEntry(primaryExports);
      }
    }
  
    // polyfill browser fields
  
    newPkg.browser = newPkg.browser || {};
    // migrate primary browser export to obj format
    if (typeof newPkg.browser === 'string') {
      if (newPkg.main === undefined) {
        newPkg.main = '__main_fix__.js';
      }
      newPkg.browser = { [newPkg.main]: newPkg.browser };
    }
    // populate browser fields with exports
    for (const key of Object.keys(newPkg.exports)) {
      if (key === '.') {
        continue;
      }
      if (key in newPkg.browser) {
        continue;
      }
      const exportsEntry = newPkg.exports[key];
      newPkg.browser[key] = getValueForExportsEntry(exportsEntry);
    }
  
    return newPkg;
  }
  
  // "exports": {
  //     ".": {
  //       "node": {
  //         "require": "./dist/cjs/index.node.cjs",
  //         "import": "./dist/esm/index.node.js",
  //         "module": "./dist/esm/index.node.js"
  //       },
  //       "default": "./dist/esm/index.browser.js"
  //     },
  //     "./esm-browser-bundle": "./dist/bundles/esm.min.js",
  //     "./iife-browser-bundle": "./dist/bundles/iife.js",
  //     "./umd-browser-bundle": "./dist/bundles/umd.js",
  //     "./types": "./types/index.d.ts"
  //   },
  
  function getValueForExportsEntry(exportsEntry) {
    if (typeof exportsEntry === 'string') {
      return exportsEntry;
    } else if (typeof exportsEntry === 'object') {
      const exportValue =
        exportsEntry.browser || exportsEntry.default || exportsEntry.import;
      if (typeof exportValue === 'string') {
        return exportValue;
      } else if (exportValue === 'object') {
        return exportValue.require || exportValue.import;
      }
    }
    return undefined;
  }
  