/* eslint-env node */
'use strict';

let browsers = [
  'ie 11',
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions'
];
if (process.env.EMBER_ENV === 'development') {
  browsers = [
    'last 1 Chrome versions',
    'last 1 Firefox versions'
  ];
}
module.exports = {
  browsers
};
