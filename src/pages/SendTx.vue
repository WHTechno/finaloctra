<template>
  <div class="send-tx">
    <h2>Send OCT</h2>
    
    <form @submit.prevent="sendTransaction">
      <div class="form-group">
        <label>Recipient Address</label>
        <input v-model="recipient" type="text" placeholder="oct1..." required>
      </div>
      
      <div class="form-group">
        <label>Amount (OCT)</label>
        <input v-model="amount" type="number" step="0.000001" min="0" :max="wallet.balance" required>
        <div class="balance-available">Available: {{ wallet.balance.toFixed(6) }} OCT</div>
      </div>
      
      <div class="form-group">
        <label>Message (Optional)</label>
        <textarea v-model="message" placeholder="Add a message..."></textarea>
      </div>
      
      <div class="form-group">
        <label>Transaction Fee</label>
        <div class="fee">{{ fee.toFixed(6) }} OCT</div>
      </div>
      
      <button type="submit" :disabled="sending">
        {{ sending ? 'Sending...' : 'Send Transaction' }}
      </button>
      
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="txHash" class="success">
        Transaction sent! Hash: {{ shortenHash(txHash) }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useWalletStore } from '../store/wallet'
import * as api from '../services/api'
import { signTransaction } from '../services/wallet'

export default {
  setup() {
    const wallet = useWalletStore()
    const recipient = ref('')
    const amount = ref(0)
    const message = ref('')
    const sending = ref(false)
    const error = ref(null)
    const txHash = ref(null)
    
    const fee = computed(() => amount.value < 1000 ? 0.001 : 0.003)
    
    const shortenHash = (hash) => hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : ''
    
    const sendTransaction = async () => {
      if (!wallet.address) {
        error.value = 'No wallet loaded'
        return
      }
      
      if (amount.value > wallet.balance) {
        error.value = 'Insufficient balance'
        return
      }
      
      sending.value = true
      error.value = null
      txHash.value = null
      
      try {
        const txData = {
          from: wallet.address,
          to_: recipient.value,
          amount: (amount.value * 1_000_000).toString(), // Convert to μOCT
          nonce: wallet.nonce + 1,
          timestamp: Math.floor(Date.now() / 1000),
          ou: amount.value < 1000 ? "1" : "3"
        }
        if (message.value) {
          txData.message = message.value
        }
        
        // Debug privateKey length and value
        console.log('PrivateKey length:', wallet.privateKey ? wallet.privateKey.length : 'null')
        console.log('PrivateKey value:', wallet.privateKey)
        // Validate privateKey size before signing
        if (!wallet.privateKey || wallet.privateKey.length !== 88) { // base64 64 bytes = 88 chars
          throw new Error('Invalid private key size')
        }
        // Sign transaction excluding message field
        const signData = { ...txData }
        delete signData.message
        const signature = signTransaction(wallet.privateKey, signData)
        txData.signature = signature
        txData.public_key = wallet.publicKey
        
        const hash = await api.sendTransaction(txData)
        txHash.value = hash
        wallet.loadWalletData() // Refresh balance and transactions
      } catch (err) {
        error.value = err.message || 'Failed to send transaction'
      } finally {
        sending.value = false
      }
    }
    
    return {
      wallet,
      recipient,
      amount,
      message,
      fee,
      sending,
      error,
      txHash,
      sendTransaction,
      shortenHash
    }
  }
}
</script>

<style scoped>
.send-tx {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 80px;
}

.balance-available {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

.fee {
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #ff5252;
  margin-top: 15px;
}

.success {
  color: #42b983;
  margin-top: 15px;
  word-break: break-all;
}
</style>
