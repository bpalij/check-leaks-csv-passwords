import { configInterface } from './configInterface';

export default {
  inputCsvPath: '/inputDir/inputCsv.csv' || 'C:\\inputDir\\inputCsv.csv', // unix or windows format
  hashesOfLeaksPath: '/inputDir/hashes.txt' || 'C:\\inputDir\\hashes.txt', // unix or windows format
  outputCsvPath: '/outputDir/outputCsv.csv' || 'C:\\outputDir\\outputCsv.csv', // unix or windows format
  sizeOfCache: 1000, // size of number of hashes in cache, if absent will fallback to default
} as Readonly<configInterface>;
