import { bool } from './boolean/bool';
import { dateEquals } from './date/dateEquals';
import { dateGreaterThan } from './date/dateGreaterThan';
import { dateGreaterThanEquals } from './date/dateGreaterThanEquals';
import { dateLessThan } from './date/dateLessThan';
import { dateLessThanEquals } from './date/dateLessThanEquals';
import { dateNotEquals } from './date/dateNotEquals';
import { numericEquals } from './numeric/numericEquals';
import { numericGreaterThan } from './numeric/numericGreaterThan';
import { numericGreaterThanEquals } from './numeric/numericGreaterThanEquals';
import { numericLessThan } from './numeric/numericLessThan';
import { numericLessThanEquals } from './numeric/numericLessThanEquals';
import { numericNotEquals } from './numeric/numericNotEquals';
import { stringEquals } from './string/stringEquals';
import { stringEqualsIgnoreCase } from './string/stringEqualsIgnoreCase';
import { stringLike } from './string/stringLike';
import { stringLikeIfExists } from './string/stringLikeIfExists';
import { stringNotEquals } from './string/stringNotEquals';
import { stringNotEqualsIgnoreCase } from './string/stringNotEqualsIgnoreCase';

export const operators: Record<string, unknown> = {
  bool,
  dateEquals,
  dateGreaterThan,
  dateGreaterThanEquals,
  dateLessThan,
  dateLessThanEquals,
  dateNotEquals,
  numericEquals,
  numericGreaterThan,
  numericGreaterThanEquals,
  numericLessThan,
  numericLessThanEquals,
  numericNotEquals,
  stringEquals,
  stringEqualsIgnoreCase,
  stringLike,
  stringLikeIfExists,
  stringNotEquals,
  stringNotEqualsIgnoreCase
};
