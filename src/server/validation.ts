/// <reference path="../../typings/tsd.d.ts"/>

const _ = require('lodash');

export const isAscii =
  x => /^[\x00-\x7F]*$/.test(x);

/**
 * Names must be non-empty ASCII strings that are less than 64 bytes.
 */
export const isValidName = _.overEvery(_.isString,
  _.negate(_.isEmpty),
  isAscii,
  x => x.length <= 64);

export const isValidPassword = isValidName;
