import fs, { PathLike } from 'fs';
import readline from 'readline';
import beautifullyPrintNumber from './beautifullyPrintNumber';

// eslint-disable-next-line max-len
export default (path: PathLike, encoding: BufferEncoding): Promise<number> => new Promise((resolve, reject) => {
  let lines = 0;
  const fileStream = fs.createReadStream(path, { encoding });
  const rl = readline.createInterface(fileStream);

  const interval = setInterval(() => { console.log(`Already found and validated ${beautifullyPrintNumber(lines)} lines in file with hashes`); }, 1000);
  rl.on('line', (line) => {
    if (!/^[0-9A-F]{40,40}:[0-9]+$/.test(line)) {
      clearInterval(interval);
      reject(new Error(`Line ${lines} in hashes file is incorrect! It must be like "uppercase sha1 hash":"number of leaks"`));
    }
    lines += 1;
  });
  rl.on('close', () => {
    clearInterval(interval);
    resolve(lines);
  });
});
