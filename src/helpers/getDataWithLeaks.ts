import fs, { PathLike } from 'fs';
import readline from 'readline';
import { passwordObjectWithHash, passwordObjectsWithHashAndLeaks, passwordObject } from '../interfaces/passwordObject';
import beautifullyPrintNumber from './beautifullyPrintNumber';
import deepCopy from './deepCopy';

export default (
  hashesWithPasswordObjects: Map<string, Array<Readonly<passwordObject>>>,
  path: PathLike,
  encoding: BufferEncoding,
  numberOfLines?: number,
):Promise<Array<passwordObjectsWithHashAndLeaks>> => new Promise((resolve, reject) => {
  let lines = 0;
  let leakedHashes = 0;
  let totalLeaks = 0;
  let outputArr: Array<passwordObjectsWithHashAndLeaks> = [];
  const fileStream = fs.createReadStream(path, { encoding });
  const rl = readline.createInterface(fileStream);

  const interval = setInterval(() => {
    console.log(`Already checked ${beautifullyPrintNumber(lines)}${numberOfLines === undefined ? ' ' : ` from ${beautifullyPrintNumber(numberOfLines)} `}in file with hashes`);
  }, 1000);
  rl.on('line', (line) => {
    if (!/^[0-9A-F]{40,40}:[0-9]+$/.test(line)) {
      clearInterval(interval);
      reject(new Error(`Line ${lines} in hashes file is incorrect! It must be like "uppercase sha1 hash":"number of leaks"`));
    }
    const [hash, leaks] = line.split(':');
    if (hashesWithPasswordObjects.has(hash)) {
      const passwordObjects = hashesWithPasswordObjects.get(hash);
      if (passwordObjects) {
        const objForAdd = {
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
    lines += 1;
  });
  rl.on('close', () => {
    clearInterval(interval);
    console.log(`Checked all ${beautifullyPrintNumber(lines)} lines. Found ${beautifullyPrintNumber(leakedHashes)} hashes with total ${beautifullyPrintNumber(totalLeaks)} leaks`);
    resolve(outputArr);
  });
});
