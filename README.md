# Cloud iCrypter

Browser-based file encryption tool. Encrypt and decrypt any file (zip, rar, 7z, etc.) using AES-256-GCM. Everything runs in your browser — no server, no uploads, nothing leaves your machine.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Web Crypto API (AES-256-GCM)

## Crypto details

| Property | Value |
|---|---|
| Cipher | AES-256-GCM |
| Key derivation | PBKDF2-SHA-256 |
| Iterations | 310,000 |
| Salt | 16 bytes (random per file) |
| IV | 12 bytes (random per file) |

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
