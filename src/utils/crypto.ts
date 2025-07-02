// src/utils/crypto.ts
import * as buffer from 'buffer'
import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha512'
import { base58 } from '@scure/base'

ed.etc.sha512Sync = sha512

/**
 * Derive OCTRA address from a base64-encoded private key
 * Address format: "oct" + Base58(SHA256(pubkey))
 * 
 * @param {string} privKeyBase64 - Base64-encoded private key
 * @returns {Promise<string>} Address with 'oct' prefix and Base58(pubkey hash)
 */
export async function deriveAddressFromPrivateKey(privKeyBase64: string): Promise<string> {
  const privKeyBytes = Uint8Array.from(buffer.Buffer.from(privKeyBase64, 'base64'))

  // Derive public key from private key
  const pubKey = await ed.getPublicKey(privKeyBytes)

  // SHA-256 hash of public key
  const sha256 = await crypto.subtle.digest('SHA-256', pubKey)
  const sha256Bytes = new Uint8Array(sha256)

  // Encode to Base58 using scure base
  const base58Encoded = base58.encode(sha256Bytes)

  return `oct${base58Encoded}`
}
