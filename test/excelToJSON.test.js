const assert = require('chai').assert;
const excelToJSON = require('../src/excelToJSON');

describe('excelToJSON', function() {
  describe('config', function() {
    it('should return a function when passed in a csv-reader-engine (ex: excel module)', function() {
      const excel = require('excel');
      let excel2JSON = excelToJSON(excel);
      assert.isFunction(excel2JSON, 'Expected excelToJSON to return a function');
    });
  });
  describe('use', function() {
    it('should throw error if file passed in doesnt end with .xlsx', function() {
      throw new Error('red-green refactor');
    });
    it('should not throw error if file passed in ends with .xlsx', function() {
      throw new Error('red-green refactor');
    });
    it('should return an object(?)', function() {
      throw new Error('red-green refactor');
    });
  });
});
