import * as spdxLicenses from 'spdx-license-list/spdx-full.json'

export interface License {
  name: string;
  url: string;
  osiApproved: boolean;
  licenseText: string;
}

export interface LicenseMap {
  [key: string]: License;
}

export const licenseMap: LicenseMap = {
  ...spdxLicenses,
}
