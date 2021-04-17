/* eslint-disable no-console */
// import fs from 'fs';
import hasha from 'hasha';
import config from '../config/config';
import beautifullyPrintNumber from './helpers/beautifullyPrintNumber';
// import validateInputJson from './helpers/validateInputJson';
// import countLinesAndValidateFileWithHashes from './helpers/countLinesAndValidateFileWithHashes';
import convertArrayWithHashesToMap from './helpers/convertArrayWithHashesToMap';
import getDataWithLeaks from './helpers/getDataWithLeaks';
import deepCopy from './helpers/deepCopy';
import readCsvInputFile from './helpers/readCsvInputFile';
import writePreparedDataToCsv from './helpers/writePreparedDataToCsv';
import timeDurationBetweenDatesInWords from './helpers/timeDurationBetweenDatesInWords';
import { passwordObject, passwordObjectWithInjectedHashAndLeaks } from './interfaces/passwordObject';

export default async (): Promise<void> => {
  // console.log(beautifullyPrintNumber(123456789.123456789));

  // eslint-disable-next-line max-len
  // const jsonData = JSON.parse(await fs.promises.readFile(config.inputJsonPath, { encoding: 'utf-8' }));
  // console.log(jsonData);
  // const input = validateInputJson(jsonData);
  const startDate = new Date();
  console.log('Reading input csv');
  const input:Array<passwordObject> = await readCsvInputFile(config.inputCsvPath);
  // console.log(input);
  if (!input.length) {
    throw new Error('Not found correct not-empty passwords');
  }
  console.log(`Found ${beautifullyPrintNumber(input.length)} correct not-empty passwords`);
  // return;

  console.log('Counting hashes for passwords');
  const inputWithHashes = await Promise.all(input.map(async (obj) => {
    const hash = (await hasha.async(obj.login_password, { algorithm: 'sha1' })).toUpperCase();
    return { hash, passwordObject: obj };
  }));
  console.log('Hashes for passwords ready');
  // console.log(inputWithHashes);
  // return;

  console.log('Converting array to map');
  const hashesMap = convertArrayWithHashesToMap(inputWithHashes);
  // console.log(hashesMap);
  // console.log('Converted array to map');
  // return;

  // console.log('Counting lines and validating file with hashes');
  // const lines = await countLinesAndValidateFileWithHashes(config.hashesOfLeaksPath, 'utf-8');
  // console.log(`Found ${beautifullyPrintNumber(lines)} lines in correct file with hashes`);
  // if (!lines) {
  //   throw new Error('Not found lines in file with hashes!');
  // }

  console.log('Checking hashes for leaks');
  const dataWithLeaks = await getDataWithLeaks(hashesMap, config.hashesOfLeaksPath, 'utf-8'/* , lines */);
  console.log('Checked hashes for leaks');
  // console.log(dataWithLeaks);
  // console.log(JSON.stringify(dataWithLeaks, undefined, 2));
  // return;

  console.log('Sorting output by leaks DESC');
  const sortedDataWithLeaks = deepCopy(dataWithLeaks).sort((a, b) => {
    if (a.leaks > b.leaks) return -1;
    if (a.leaks < b.leaks) return 1;
    return 0;
  });
  console.log('Sorted output');
  // console.log(sortedDataWithLeaks);
  // return;

  console.log('Flattening data to prepare it for writing in CSV file');
  // eslint-disable-next-line max-len
  const flattenedData:Array<passwordObjectWithInjectedHashAndLeaks> = sortedDataWithLeaks.map((val) => {
    const {
      hash, leaks, readableLeaks, passwordObjects,
    } = val;
    return passwordObjects.map((obj) => ({
      ...obj,
      login_password_hash: hash,
      login_password_leaks: `${leaks}`,
      login_password_readable_leaks: readableLeaks,
    }));
  }).reduce((acc, val) => [...acc, ...val], []);
  console.log('Flattened data to prepare it for writing in CSV file');
  // console.log(flattenedData);

  console.log('Writing data to CSV');
  await writePreparedDataToCsv(config.outputCsvPath, flattenedData);
  console.log('Written data to CSV');

  const endDate = new Date();
  console.log(`Finished in ${timeDurationBetweenDatesInWords(startDate, endDate)}`);

  // console.log('Writing output to readable JSON file');
  // await fs.promises.writeFile(
  //   config.outputJsonPath,
  //   JSON.stringify(sortedDataWithLeaks, undefined, 2),
  // );
  // console.log('Wrote readable JSON file');
};
