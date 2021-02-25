import {numericEquals} from './numeric/numericEquals';
import {numericNotEquals} from './numeric/numericNotEquals';
import {stringEquals} from './string/stringEquals';
import {stringEqualsIgnoreCase} from './string/stringEqualsIgnoreCase';
import {stringLike} from './string/stringLike';
import {stringNotEquals} from './string/stringNotEquals';
import {stringNotEqualsIgnoreCase} from './string/stringNotEqualsIgnoreCase';

export const operators: Record<string, unknown>={
  numericEquals,
  numericNotEquals,
  stringEquals,
  stringEqualsIgnoreCase,
  stringLike,
  stringNotEquals,
  stringNotEqualsIgnoreCase
};
