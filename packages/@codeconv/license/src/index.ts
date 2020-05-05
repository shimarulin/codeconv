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

export interface LicenseChoose {
  title: string;
  value: string;
}

export const licenseMap: LicenseMap = {
  ...spdxLicenses,
}

export const licenseChooseList: LicenseChoose[] = Object.keys(licenseMap).map((key) => ({
  title: `${key} - ${licenseMap[key].name}`,
  value: key,
}))
