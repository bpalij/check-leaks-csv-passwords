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
  let outputArr: Array<hashWithLeaksAndPasswordObjects> = [];
  let cachedLines: Array<string> = [];
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
        outputArr = [...deepCopy(outputArr), objForAdd];
        leakedHashes += 1;
        totalLeaks += +leaks;
      }
    }
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
      // console.log(cachedLines);
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
      cachedLines.forEach(checkLineForLeakedHashAndAddIfNeeded);
      cachedLines = [];
    }
    // const [hash, leaks] = line.split(':');
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
    cachedLines.push(line);
    lines += 1;
  });
  rl.on('close', () => {
    clearInterval(interval);
    cachedLines.forEach(checkLineForLeakedHashAndAddIfNeeded);
    console.log(`Checked all ${beautifullyPrintNumber(lines)} lines. Found ${beautifullyPrintNumber(leakedHashes)} hashes with total ${beautifullyPrintNumber(totalLeaks)} leaks`);
    resolve(outputArr);
  });
});
