export interface passwordObject {
  // eslint-disable-next-line camelcase
  login_password: string,
  [key: string]: string | undefined,
}

export interface passwordObjectWithHash {
  hash: string,
  passwordObject: passwordObject,
}

export interface passwordObjectWithInjectedHash extends passwordObject {
  // eslint-disable-next-line camelcase
  login_password_hash: string,
}

export interface hashWithPasswordObjects {
  hash: string,
  passwordObjects: Array<passwordObject>
}

// export interface passwordObjectsWithHashAndLeaks {
//   leaks: number,
//   readableLeaks: string,
//   hash: string,
//   passwordObjects: Array<Readonly<passwordObject>>,
// }

export interface hashWithLeaksAndPasswordObjects extends hashWithPasswordObjects {
  leaks: number | string,
  readableLeaks: string,
}

export interface passwordObjectWithInjectedHashAndLeaks extends passwordObjectWithInjectedHash {
  // eslint-disable-next-line camelcase
  login_password_leaks: string,
  // eslint-disable-next-line camelcase
  login_password_readable_leaks: string,
}
