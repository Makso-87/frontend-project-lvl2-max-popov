import { isObject, trimPlusAndMinus } from '../auxiliaryFunctions';

const getOldValues = (obj, acc = {}, keyNum = 0) => {
  const keys = Object.keys(obj);
  const key = keys[keyNum];

  if (keyNum > keys.length - 1) {
    return acc;
  }

  if (isObject(obj[key]) && key[0] !== '+') {
    acc[trimPlusAndMinus(key)] = getOldValues(obj[key]);

    return getOldValues(obj, acc, keyNum + 1);
  }

  if (key[0] === '-') {
    acc[trimPlusAndMinus(key)] = obj[key];
    return getOldValues(obj, acc, keyNum + 1);
  }

  if (key[0] !== '+') {
    acc[trimPlusAndMinus(key)] = obj[key];
    return getOldValues(obj, acc, keyNum + 1);
  }

  return getOldValues(obj, acc, keyNum + 1);
};

const getNewValues = (obj, acc = {}, keyNum = 0) => {
  const keys = Object.keys(obj);
  const key = keys[keyNum];

  if (keyNum > keys.length - 1) {
    return acc;
  }

  if (isObject(obj[key]) && key[0] !== '-') {
    acc[trimPlusAndMinus(key)] = getNewValues(obj[key]);

    return getNewValues(obj, acc, keyNum + 1);
  }

  if (key[0] === '+') {
    acc[trimPlusAndMinus(key)] = obj[key];
    return getNewValues(obj, acc, keyNum + 1);
  }

  if (key[0] !== '-') {
    acc[trimPlusAndMinus(key)] = obj[key];
    return getNewValues(obj, acc, keyNum + 1);
  }

  return getNewValues(obj, acc, keyNum + 1);
};

const isChanged = (obj, keyNum = 0) => {
  const keys = Object.keys(obj);
  const key = keys[keyNum];

  if (keyNum > keys.length - 1) {
    return false;
  }

  if (key[0] === '+' || key[0] === '-') {
    return true;
  }

  if (isObject(obj[key])) {
    isChanged(obj);
  }

  return isChanged(obj, keyNum + 1);
};

const toJsonStyle = (object, acc = [], keyNum = 0) => {
  const keys = Object.keys(object);
  const key = keys[keyNum];
  const nextKey = keys[keyNum + 1];

  if (keyNum > keys.length - 1) {
    const newAcc = acc;
    return newAcc;
  }

  const newObject = {
    name: trimPlusAndMinus(key),
    currentValue: object[key],
    oldValue: object[key],
    wasChanged: false,
    wasAdded: false,
    wasDeleted: false,
    children: false,
  };

  if (nextKey !== undefined) {
    if (key[0] === '+' && nextKey[0] === '-') {
      newObject.oldValue = object[nextKey];
      newObject.wasChanged = true;
      acc.push(newObject);

      return toJsonStyle(object, acc, keyNum + 2);
    }
  }

  if (key[0] === '+' && isObject(object[key])) {
    newObject.wasAdded = true;
    acc.push(newObject);

    return toJsonStyle(object, acc, keyNum + 1);
  }

  if (key[0] === '-' && isObject(object[key])) {
    newObject.wasDeleted = true;
    acc.push(newObject);

    return toJsonStyle(object, acc, keyNum + 1);
  }

  if (key[0] === '+') {
    newObject.wasAdded = true;
    acc.push(newObject);

    return toJsonStyle(object, acc, keyNum + 1);
  }

  if (key[0] === '-') {
    newObject.wasDeleted = true;
    acc.push(newObject);

    return toJsonStyle(object, acc, keyNum + 1);
  }

  if (isObject(object[key])) {
    newObject.currentValue = getNewValues(object[key]);
    newObject.oldValue = getOldValues(object[key]);
    newObject.wasChanged = isChanged(object[key]);
    newObject.children = toJsonStyle(object[key]);

    acc.push(newObject);
    return toJsonStyle(object, acc, keyNum + 1);
  }

  acc.push(newObject);

  return toJsonStyle(object, acc, keyNum + 1);
};

export default toJsonStyle;
