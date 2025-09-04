// utils.js
const crypto = require('crypto-js');

function createSuccess(data) {
  return { status: 'success', data };
}
function createError(error) {
  return { status: 'error', error };
}
function createResult(error, data) {
  return error ? createError(error) : createSuccess(data);
}
function encryptPassword(password) {
  return String(crypto.SHA256(password));
}

module.exports = { createResult, createError, createSuccess, encryptPassword };
