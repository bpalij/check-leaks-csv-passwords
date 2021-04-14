import { writeToPath } from 'fast-csv';
import { passwordObjectWithInjectedHashAndLeaks } from '../interfaces/passwordObject';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line max-len
const writePreparedDataToCsv = (path:string, data:Array<passwordObjectWithInjectedHashAndLeaks>):Promise<void> => (
  new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve('foo');
    // }, 300);
    writeToPath(path, data, { headers: true })
      .on('error', (err) => { reject(err); })
      .on('finish', () => { resolve(); });
  })
);

export default writePreparedDataToCsv;
