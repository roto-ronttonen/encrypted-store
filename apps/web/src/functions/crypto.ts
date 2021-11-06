export async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export async function rawToCryptoKey(raw: string) {
  const jwk = JSON.parse(raw);
  const key = await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

export async function cryptoKeyToRaw(key: CryptoKey) {
  const raw = await window.crypto.subtle.exportKey("jwk", key);
  return raw;
}

export async function encryptData(
  data: Uint8Array,
  secretKey: CryptoKey
): Promise<Uint8Array> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    secretKey,
    data
  );
  return new Uint8Array(encryptedBuffer);
}
