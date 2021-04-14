import { configInterface } from './configInterface';

export default {
  inputCsvPath: '/inputDir/inputCsv.csv' || 'C:\\inputDir\\inputCsv.csv', // unix and windows format
  hashesOfLeaksPath: '/inputDir/hashes.txt' || 'C:\\inputDir\\hashes.txt', // unix and windows format
  outputCsvPath: '/outputDir/outputCsv.csv' || 'C:\\outputDir\\outputCsv.csv', // unix and windows format
} as Readonly<configInterface>;
