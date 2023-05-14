import { Decimal } from 'decimal.js';

export const checkDecimalPrecision = (value: string, precision: number = 0) => {
  let regex;
  if (precision) {
    regex = new RegExp(`^(\\d+\\.\\d{${precision}})?$`);
  } else {
    regex = new RegExp('/^d+(.d+)?$/');
  }

  return regex.test(value);
};

export const isFirstGreater = (first: string, second: string) => {
  const firstDec = new Decimal(first);
  const secondDec = new Decimal(second);
  return firstDec.greaterThanOrEqualTo(secondDec);
};

export const generateDecimalHintString = (decimals: number): string => {
  let decimalString = '0';
  let zeros = '';

  Array.from({ length: decimals }).forEach(() => {
    zeros += '0';
  });

  decimalString += '.' + zeros;

  return decimalString;
};
