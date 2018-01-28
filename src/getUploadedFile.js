export default function getUploadedFile(selector) {
  let inputEl = document.querySelector(selector);
  let inputFiles = inputEl.files;
  return inputFiles[0] || null;
}
