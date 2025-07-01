import nacl from 'tweetnacl'

export function generateWallet() {
  const keyPair = nacl.sign.keyPair()
  return {
    privateKey: Buffer.from(keyPair.secretKey).toString('base64'),
    publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    address: `oct${Buffer.from(keyPair.publicKey).toString('hex').slice(0, 40)}`
  }
}

export function signTransaction(privateKey, txData) {
  const signingKey = nacl.sign.keyPair.fromSecretKey(Buffer.from(privateKey, 'base64'))
  const message = JSON.stringify(txData)
  const signature = nacl.sign.detached(Buffer.from(message), signingKey.secretKey)
  return Buffer.from(signature).toString('base64')
}
