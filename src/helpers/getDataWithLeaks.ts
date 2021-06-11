/* eslint-disable no-console */
import fs, { PathLike } from 'fs';
import readline from 'readline';
import {
  // passwordObjectWithHash,
  // passwordObjectsWithHashAndLeaks,
  passwordObject,
  hashWithLeaksAndPasswordObjects,
  // hashWithPasswordObjects,
} from '../interfaces/passwordObject';
import beautifullyPrintNumber from './beautifullyPrintNumber';
import deepCopy from './deepCopy';

export default (
  hashesWithPasswordObjects: Map<string, Array<passwordObject>>,
  path: PathLike,
  { encoding, sizeOfCache = 1000, numberOfLines }: {
    encoding?: BufferEncoding,
    sizeOfCache?: number,
    numberOfLines?: number,
  },
):Promise<Array<hashWithLeaksAndPasswordObjects>> => new Promise((resolve, reject) => {
  let lines = 0;
  let previousLines = 0;
  let leakedHashes = 0;
  let totalLeaks = 0;
  let outputArray: Array<hashWithLeaksAndPasswordObjects> = [];
  // let cachedLinesArr: Array<string> = [];
  let cachedLinesOfHashesAndLeaks: Map<string, string> = new Map();
  const fileStream = fs.createReadStream(path, { encoding });
  const rl = readline.createInterface(fileStream);

  const checkLineForLeakedHashAndAddIfNeeded = (line: string) => {
    const [hash, leaks] = line.split(':');
    if (hashesWithPasswordObjects.has(hash)) {
      const passwordObjects = hashesWithPasswordObjects.get(hash);
      if (passwordObjects) {
        const objForAdd: hashWithLeaksAndPasswordObjects = {
          hash,
          leaks: +leaks,
          readableLeaks: beautifullyPrintNumber(+leaks),
          passwordObjects: deepCopy(passwordObjects),
        };
        outputArray = [...deepCopy(outputArray), objForAdd];
        leakedHashes += 1;
        totalLeaks += +leaks;
      }
    }
  };

  const addOurLeakedHashesDataToOutputArrayAgainstHashesInPieceOfFile = (
    ourHashesData: Map<string, Array<passwordObject>>,
    hashesInPieceOfFileData: Map<string, string>,
  ): void => {
    [...ourHashesData.keys()].forEach((ourHash) => {
      if (hashesInPieceOfFileData.has(ourHash)) {
        const passwordObjects = ourHashesData.get(ourHash);
        const leaks = hashesInPieceOfFileData.get(ourHash);
        if (passwordObjects) {
          const objForAdd: hashWithLeaksAndPasswordObjects = {
            hash: ourHash,
            leaks: +(leaks || NaN),
            readableLeaks: beautifullyPrintNumber(+(leaks || NaN)),
            passwordObjects: deepCopy(passwordObjects),
          };
          outputArray = [...deepCopy(outputArray), objForAdd];
          leakedHashes += 1;
          totalLeaks += +(leaks || 0);
        }
      }
    });
  };

  let previousDate:Date = new Date();
  const interval = setInterval(() => {
    const currentDate = new Date();
    console.log(`Already checked ${beautifullyPrintNumber(lines)}${numberOfLines === undefined ? ' ' : ` from ${beautifullyPrintNumber(numberOfLines)} `}lines in file with hashes`);
    console.log(`Reading ${beautifullyPrintNumber(Math.round((lines - previousLines) / ((currentDate.getTime() - previousDate.getTime()) / 1000)))} lines in one second`);
    previousLines = lines;
    previousDate = currentDate;
  }, 1000);
  rl.on('line', (line) => {
    if (!/^[0-9A-F]{40,40}:[0-9]+$/.test(line)) {
      clearInterval(interval);
      reject(new Error(`Line ${lines} in hashes file is incorrect! It must be like "uppercase sha1 hash":"number of leaks"`));
    }
    if (lines && !(lines % sizeOfCache)) {
      // console.log(cachedLinesOfHashesAndLeaks);
      // eslint-disable-next-line max-len
      addOurLeakedHashesDataToOutputArrayAgainstHashesInPieceOfFile(hashesWithPasswordObjects, cachedLinesOfHashesAndLeaks);
      // cachedLines.forEach((cachedLine) => {
      //   const [hash, leaks] = cachedLine.split(':');
      //   if (hashesWithPasswordObjects.has(hash)) {
      //     const passwordObjects = hashesWithPasswordObjects.get(hash);
      //     if (passwordObjects) {
      //       const objForAdd: hashWithLeaksAndPasswordObjects = {
      //         hash,
      //         leaks: +leaks,
      //         readableLeaks: beautifullyPrintNumber(+leaks),
      //         passwordObjects: deepCopy(passwordObjects),
      //       };
      //       outputArr = [...deepCopy(outputArr), objForAdd];
      //       leakedHashes += 1;
      //       totalLeaks += +leaks;
      //     }
      //   }
      // });
      // cachedLinesArr.forEach(checkLineForLeakedHashAndAddIfNeeded);
      // cachedLinesArr = [];
      cachedLinesOfHashesAndLeaks = new Map();
    }
    const [hash, leaks] = line.split(':');
    // if (hashesWithPasswordObjects.has(hash)) {
    //   const passwordObjects = hashesWithPasswordObjects.get(hash);
    //   if (passwordObjects) {
    //     const objForAdd: hashWithLeaksAndPasswordObjects = {
    //       hash,
    //       leaks: +leaks,
    //       readableLeaks: beautifullyPrintNumber(+leaks),
    //       passwordObjects: deepCopy(passwordObjects),
    //     };
    //     outputArr = [...deepCopy(outputArr), objForAdd];
    //     leakedHashes += 1;
    //     totalLeaks += +leaks;
    //   }
    // }
    // cachedLinesArr.push(line);
    cachedLinesOfHashesAndLeaks.set(hash, leaks);
    lines += 1;
  });
  rl.on('close', () => {
    clearInterval(interval);
    // cachedLinesArr.forEach(checkLineForLeakedHashAndAddIfNeeded);
    // eslint-disable-next-line max-len
    addOurLeakedHashesDataToOutputArrayAgainstHashesInPieceOfFile(hashesWithPasswordObjects, cachedLinesOfHashesAndLeaks);
    console.log(`Checked all ${beautifullyPrintNumber(lines)} lines. Found ${beautifullyPrintNumber(leakedHashes)} hashes with total ${beautifullyPrintNumber(totalLeaks)} leaks`);
    resolve(outputArray);
  });
});
