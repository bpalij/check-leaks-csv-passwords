import { parseFile } from 'fast-csv';
// import config from '../../config/config';
import { passwordObject } from '../interfaces/passwordObject';
import validateSinglePasswordObject from './validateSinglePasswordObject';

const readCsvInputFile = (path:string):Promise<Array<passwordObject>> => (
  new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve('foo');
    // }, 300);
    const result: Array<passwordObject> = [];
    parseFile(path, { headers: true })
      .on('error', (error) => { reject(error); })
      .on('data', (row) => {
        if (!validateSinglePasswordObject(row)) {
          reject(new Error('one of rows is not valid!'));
        }
        result.push(row as passwordObject);
      })
      .on('end', () => {
        resolve(result.filter((row) => row.login_password));
      });
  })
);

export default readCsvInputFile;
