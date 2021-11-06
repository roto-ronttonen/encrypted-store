export function fileToBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onerror = (e) => {
      reject(e);
    };
    reader.onloadend = (e) => {
      if (e.target?.readyState === FileReader.DONE) {
        resolve(new Uint8Array(e.target.result as any));
      }
    };
  });
}

export function bytesToString(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}
