/**
 * https://docs.npmjs.com/files/package.json#license
 * https://spdx.org/licenses/
 * https://opensource.org/licenses/alphabetical
 */

const path = require('path')

/**
 * @typedef LicenseSpec
 * @type {object}
 * @property {string} name - License fill name.
 * @property {string} value - License property value (Identifier).
 * @property {string} template - License template filename.
 */

/**
 * @type {LicenseSpec[]}
 */
const licenseSpecs = [
  {
    name: 'MIT License',
    value: 'MIT',
    template: 'templates/MIT.ejs',
  },
  {
    name: 'Internet Systems Consortium (ISC) License',
    value: 'ISC',
    template: 'templates/ISC.ejs',
  },
  {
    name: 'Apache License 2.0',
    value: 'Apache-2.0',
    template: 'templates/Apache-2.0.ejs',
  },
  {
    name: 'Mozilla Public License 2.0',
    value: 'MPL-2.0',
    template: 'templates/MPL-2.0.ejs',
  },
  {
    name: 'BSD 2-Clause FreeBSD License',
    value: 'BSD-2-Clause-FreeBSD',
    template: 'templates/BSD-2-Clause-FreeBSD.ejs',
  },
  {
    name: 'BSD 3-Clause "New" or "Revised" License',
    value: 'BSD-3-Clause',
    template: 'templates/BSD-3-Clause.ejs',
  },
  {
    name: 'GNU Affero General Public License v3.0 or later',
    value: 'AGPL-3.0-or-later',
    template: 'templates/AGPL-3.0.ejs',
  },
  {
    name: 'GNU General Public License v3.0 or later',
    value: 'GPL-3.0-or-later',
    template: 'templates/GPL-3.0.ejs',
  },
  {
    name: 'GNU Lesser General Public License v3.0 or later',
    value: 'LGPL-3.0-or-later',
    template: 'templates/LGPL-3.0.ejs',
  },
  {
    name: 'The Unlicense',
    value: 'Unlicense',
    template: 'templates/unlicense.ejs',
  },
  {
    name: 'No License (Copyrighted)',
    value: 'SEE LICENSE IN LICENSE',
    template: 'templates/UNLICENSED.ejs',
  },
]

const resolveLicenseFile = (value) => {
  const licensePath = licenseSpecs.find((l) => l.value === value).template
  return path.resolve(__dirname, licensePath)
}

module.exports = {
  licenses: licenseSpecs.map(({ name, value }) => ({
    name,
    value,
  })),
  defaultLicense: licenseSpecs[0].value,
  resolveLicenseFile,
}
