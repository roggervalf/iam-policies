import {bool} from './boolean/bool';
import {numericEquals} from './numeric/numericEquals';
import {numericGreaterThan} from './numeric/numericGreaterThan';
import {numericGreaterThanEquals} from './numeric/numericGreaterThanEquals';
import {numericLessThan} from './numeric/numericLessThan';
import {numericLessThanEquals} from './numeric/numericLessThanEquals';
import {numericNotEquals} from './numeric/numericNotEquals';
import {stringEquals} from './string/stringEquals';
import {stringEqualsIgnoreCase} from './string/stringEqualsIgnoreCase';
import {stringLike} from './string/stringLike';
import {stringNotEquals} from './string/stringNotEquals';
import {stringNotEqualsIgnoreCase} from './string/stringNotEqualsIgnoreCase';

export const operators: Record<string, unknown>={
  bool,
  numericEquals,
  numericGreaterThan,
  numericGreaterThanEquals,
  numericLessThan,
  numericLessThanEquals,
  numericNotEquals,
  stringEquals,
  stringEqualsIgnoreCase,
  stringLike,
  stringNotEquals,
  stringNotEqualsIgnoreCase
};
