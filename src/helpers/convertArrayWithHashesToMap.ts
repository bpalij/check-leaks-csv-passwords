import { passwordObject, passwordObjectWithHash } from '../interfaces/passwordObject';
import deepCopy from './deepCopy';

// eslint-disable-next-line max-len
export default (arrayWithHashes:Array<Readonly<passwordObjectWithHash>>):Map<string, Array<Readonly<passwordObject>>> => {
  const map:Map<string, Array<Readonly<passwordObject>>> = new Map();
  arrayWithHashes.forEach((objWithHash) => {
    if (map.has(objWithHash.hash)) {
      const alreadyInMap = map.get(objWithHash.hash);
      if (alreadyInMap) {
        map.set(objWithHash.hash, [
          ...deepCopy(alreadyInMap),
          deepCopy(objWithHash.passwordObject),
        ]);
      } else {
        map.set(objWithHash.hash, [deepCopy(objWithHash.passwordObject)]);
      }
      // map.set(objWithHash.hash, [
      //   ...deepCopy(map.get(objWithHash.hash)) as Array<Readonly<passwordObject>>,
      //   deepCopy(objWithHash.passwordObject),
      // ]);
    } else {
      map.set(objWithHash.hash, [deepCopy(objWithHash.passwordObject)]);
    }
  });
  return map;
};
