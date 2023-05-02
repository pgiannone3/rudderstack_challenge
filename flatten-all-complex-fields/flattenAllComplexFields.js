const flattenObject = (obj, prefix = '') => {
    prefix = prefix ? prefix + '.' : '';
    return Object.keys(obj).reduce((accumulator, currentValue) => {
  
      if (currentValue === 'length') {
        return accumulator;
    }
  
      const key = prefix + currentValue;
      if (typeof obj[currentValue] === 'object') {
        return {...accumulator, ...flattenObject(obj[currentValue], key)};
      } else {
        return {...accumulator, [key]: obj[currentValue]};
      }
    }, {});
  };
  