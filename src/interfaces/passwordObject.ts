export interface passwordObject {
  login: {
    password: string
  }
}

export interface passwordObjectWithHash {
  hash: string,
  passwordObject: Readonly<passwordObject>,
}

export interface passwordObjectsWithHashAndLeaks {
  leaks: number,
  readableLeaks: string,
  hash: string,
  passwordObjects: Array<Readonly<passwordObject>>,
}
