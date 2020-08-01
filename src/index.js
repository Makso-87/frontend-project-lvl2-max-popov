import fs from 'fs';
import path from 'path';
import buildDiff from './buildDiff';
import parseFile from './parsers';
import convertToFormat from './formaters';

const genDiff = (filepath1, filepath2, format) => {
  const data1 = fs.readFileSync(filepath1, 'utf-8');
  const data2 = fs.readFileSync(filepath2, 'utf-8');
  const extension1 = path.extname(filepath1).replace('.', '');
  const extension2 = path.extname(filepath1).replace('.', '');
  const file1 = parseFile(data1, extension1);
  const file2 = parseFile(data2, extension2);

  return convertToFormat(buildDiff(file1, file2), format);
};

export default genDiff;
