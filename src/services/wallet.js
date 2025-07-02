import * as buffer from 'buffer'
import nacl from 'tweetnacl'

export function generateWallet() {
  const keyPair = nacl.sign.keyPair()
  return {
    privateKey: buffer.Buffer.from(keyPair.secretKey).toString('base64'),
    publicKey: buffer.Buffer.from(keyPair.publicKey).toString('base64'),
    address: `oct${buffer.Buffer.from(keyPair.publicKey).toString('hex').slice(0, 40)}`
  }
}

export function signTransaction(privateKey, txData) {
  const signingKey = nacl.sign.keyPair.fromSecretKey(buffer.Buffer.from(privateKey, 'base64'))
  const message = JSON.stringify(txData)
  const signature = nacl.sign.detached(buffer.Buffer.from(message), signingKey.secretKey)
  return buffer.Buffer.from(signature).toString('base64')
}
