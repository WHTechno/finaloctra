// src/utils/crypto.ts
import * as ed from '@noble/ed25519'
import { bech32 } from 'bech32'

/**
 * Derive address from a base64-encoded private key
 * @param {string} privKeyBase64 - Base64-encoded private key
 * @returns {Promise<string>} Bech32-encoded address with 'oct' prefix
 */
export async function deriveAddressFromPrivateKey(privKeyBase64: string): Promise<string> {
  const privKeyBytes = Uint8Array.from(Buffer.from(privKeyBase64, 'base64'))

  // Get public key
  const pubKey = await ed.getPublicKey(privKeyBytes)

  // SHA-256
  const sha256 = await crypto.subtle.digest('SHA-256', pubKey)

  // RIPEMD-160
  const ripemd160 = await crypto.subtle.digest('RIPEMD-160', sha256)
  const addressBytes = new Uint8Array(ripemd160)

  // Bech32 encode
  const words = bech32.toWords(addressBytes)
  return bech32.encode('oct', words)
}
