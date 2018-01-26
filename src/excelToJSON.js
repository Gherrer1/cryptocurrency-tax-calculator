module.exports = function(engine) {
  return function(filename) {
    if(!filename.match(/\.xlsx$/))
      throw new Error('InvalidFileTypeError')
    const workbook = engine.readFile(filename);
    const sheet = workbook.Sheets.sheet1;
    return engine.utils.sheet_to_json(sheet);
  }
}
