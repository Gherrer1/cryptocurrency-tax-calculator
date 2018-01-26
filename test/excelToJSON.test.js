const assert = require('chai').assert;
const xlsx = require('xlsx');
const excelToJSON = require('../src/excelToJSON');

describe('excelToJSON', function() {
  describe('config', function() {
    it('should return a function when passed in a csv-reader-engine (ex: xlsx module)', function() {
      let excel2JSON = excelToJSON(xlsx);
      assert.isFunction(excel2JSON, 'Expected excelToJSON to return a function');
    });
  });
  describe('use', function() {
    let excel2JSON;
    beforeEach(function() {
      excel2JSON = excelToJSON(xlsx);
    });
    it('should throw InvalidFileTypeError if file passed in doesnt end with .xlsx', function() {
      const invalidFileName = 'haha'
      assert.throws(excel2JSON.bind(null, invalidFileName), /InvalidFileTypeError/);
    });
    it('should not throw InvalidFileError if file passed in ends with .xlsx', function() {
      const validFileName = 'OrderHistory.xlsx';
      assert.doesNotThrow(excel2JSON.bind(null, validFileName), /InvalidFileTypeError/);
    });
    it('should throw an error if file doesnt exist', function() {
      const nonExistingFileName = 'doesnt_exist.xlsx';
      assert.throws(excel2JSON.bind(null, nonExistingFileName), /no such file or directory/);
    });
    it('should not throw an error if file exists', function() {
      const existingFileName = 'OrderHistory.xlsx';
      assert.doesNotThrow(excel2JSON.bind(null, existingFileName), /no such file or directory/);
    });
    it('should return an array', function() {
      const existingFileName = 'OrderHistory.xlsx';
      const json = excel2JSON(existingFileName);
      assert.isArray(json);
    });
  });
});
