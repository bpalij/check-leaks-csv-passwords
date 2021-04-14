const validateSinglePasswordObject = (x: unknown):boolean => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (x && typeof x === 'object' && typeof (x as any).login_password === 'string') {
    const keys = Object.keys(x);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (typeof key !== 'string') {
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = (x as any)[key];
      if ((typeof val !== 'string' && typeof val !== 'number' && val !== undefined) || val === null) {
        return false;
      }
    }
    return true;
  }
  return false;
};

export default validateSinglePasswordObject;
