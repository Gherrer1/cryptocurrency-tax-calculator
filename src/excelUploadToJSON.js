const xlsx = require('xlsx');

export default function exportInputToJSON(file) {
  return new Promise(function(resolve, reject) {
    const rABS = true;
    const reader = new FileReader();
    reader.onload = function(e) {
      let data = e.target.result;
      if(!rABS) data = new Uint8Array(data);
      const workbook = xlsx.read(data, { type: rABS ? 'binary' : 'array' });
      const sheet = workbook.Sheets.sheet1;
      let sheetJSON = xlsx.utils.sheet_to_json(sheet);

      resolve(sheetJSON);
    }

    if(rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  });
}
