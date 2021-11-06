export function downloadText(text: string) {
  const elem = document.createElement("a");
  elem.setAttribute("href", "data:text/plain;charset=utf-8," + text);
  elem.setAttribute("download", "secret_key.txt");
  elem.style.display = "none";
  document.body.append(elem);
  elem.click();
  document.body.removeChild(elem);
}

export function downloadBlob(filename: string, blob: Blob) {
  const elem = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  elem.setAttribute("href", url);
  elem.setAttribute("download", filename);
  elem.style.display = "none";
  document.body.append(elem);
  elem.click();
  document.body.removeChild(elem);
  window.URL.revokeObjectURL(url);
}
