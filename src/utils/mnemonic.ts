import bip39 from 'bip39'
import * as ed from '@noble/ed25519'
import { sha256 } from '@noble/hashes/sha256'
import { sha512 } from '@noble/hashes/sha512'
import { base58 } from '@scure/base'
import * as buffer from 'buffer'

// Inject SHA-512 ke noble
ed.etc.sha512Sync = sha512

/**
 * Generate a new BIP39 mnemonic phrase
 * @returns {string} mnemonic phrase
 */
export function generateMnemonic(): string {
  return bip39.generateMnemonic()
}

/**
 * Derive wallet from mnemonic phrase
 * Address = "oct" + Base58(SHA256(pubkey))
 *
 * @param {string} mnemonic - BIP39 mnemonic phrase
 * @param {string} passphrase - optional passphrase
 * @returns {Promise<{ privateKey: string, publicKey: string, address: string }>}
 */
export async function deriveWalletFromMnemonic(
  mnemonic: string,
  passphrase = ''
): Promise<{
  privateKey: string
  publicKey: string
  address: string
}> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }

  // BIP39 seed → Buffer → Uint8Array
  const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase)
  const seed32 = new Uint8Array(seed).slice(0, 32) // Ed25519 needs 32 bytes

  // Generate public key from private key seed
  const pubKey = await ed.getPublicKey(seed32)

  // Address = oct + Base58(SHA256(pubKey))
  const hash = sha256(pubKey)
  const address = `oct${base58.encode(hash)}`

  // Encode keys to base64
  const privBase64 = buffer.Buffer.from(seed32).toString('base64')
  const pubBase64 = buffer.Buffer.from(pubKey).toString('base64')

  return {
    privateKey: privBase64,
    publicKey: pubBase64,
    address
  }
}
