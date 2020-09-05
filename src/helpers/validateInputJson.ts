/* eslint-disable @typescript-eslint/no-explicit-any */
import { passwordObject } from '../interfaces/passwordObject';

export default (jsonData: any):Array<Readonly<passwordObject>> => {
  if (jsonData && jsonData.items && typeof jsonData.items === 'object' && Array.isArray(jsonData.items)) {
    // eslint-disable-next-line max-len
    return jsonData.items.filter((x: any) => x && x.login && x.login.password && typeof x.login.password === 'string');
    // console.log('here');
    // return jsonData.items;
  }
  return [];
};
