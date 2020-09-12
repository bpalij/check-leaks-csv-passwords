export interface passwordObject {
  login: {
    password: string
  }
}

export interface passwordObjectWithHash {
  hash: string,
  passwordObject: passwordObject,
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
  leaks: number,
  readableLeaks: string,
}
