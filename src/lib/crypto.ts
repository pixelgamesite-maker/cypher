/**
 * Cloud iCrypter — AES-256-GCM file encryption
 *
 * Output format: [salt 16B][iv 12B][GCM ciphertext + 16B auth tag]
 *
 * Key derivation: PBKDF2-SHA-256, 310 000 iterations (OWASP 2024).
 * Encryption:     AES-256-GCM — authenticated, tamper-evident.
 * Each encrypt call generates a fresh random salt + IV, so encrypting
 * the same file twice yields different output every time.
 */

const ITERATIONS  = 310_000;
const SALT_BYTES  = 16;
const IV_BYTES    = 12;
const HEADER_SIZE = SALT_BYTES + IV_BYTES; // 28 bytes

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const raw = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    raw,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(
  file: File,
  password: string,
  onProgress?: (pct: number) => void
): Promise<{ blob: Blob; filename: string }> {
  onProgress?.(10);
  const buffer = await file.arrayBuffer();
  onProgress?.(30);

  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv   = window.crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key  = await deriveKey(password, salt);
  onProgress?.(60);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    buffer
  );
  onProgress?.(90);

  // Pack: salt | iv | ciphertext
  const output = new Uint8Array(HEADER_SIZE + ciphertext.byteLength);
  output.set(salt, 0);
  output.set(iv, SALT_BYTES);
  output.set(new Uint8Array(ciphertext), HEADER_SIZE);
  onProgress?.(100);

  return {
    blob: new Blob([output], { type: "application/octet-stream" }),
    filename: file.name + ".enc",
  };
}

export async function decryptFile(
  file: File,
  password: string,
  onProgress?: (pct: number) => void
): Promise<{ blob: Blob; filename: string }> {
  onProgress?.(10);
  const buffer = await file.arrayBuffer();
  const data   = new Uint8Array(buffer);
  onProgress?.(30);

  if (data.byteLength < HEADER_SIZE + 16) {
    throw new Error("File is too small or not a valid .enc file.");
  }

  const salt       = data.slice(0, SALT_BYTES);
  const iv         = data.slice(SALT_BYTES, HEADER_SIZE);
  const ciphertext = data.slice(HEADER_SIZE);

  const key = await deriveKey(password, salt);
  onProgress?.(60);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
  } catch {
    throw new Error("Wrong password or corrupted file.");
  }
  onProgress?.(100);

  const filename = file.name.endsWith(".enc")
    ? file.name.slice(0, -4)
    : `${file.name}.decrypted`;

  return {
    blob: new Blob([plaintext], { type: "application/octet-stream" }),
    filename,
  };
}
