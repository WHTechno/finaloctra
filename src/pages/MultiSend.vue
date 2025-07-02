<template>
  <div class="multi-send">
    <h2>Multi-Send OCT</h2>
    
    <div class="recipients-list">
      <div v-for="(recipient, index) in recipients" :key="index" class="recipient-item">
        <input v-model="recipient.address" placeholder="oct1..." type="text">
        <input v-model="recipient.amount" type="number" step="0.000001" min="0" placeholder="Amount">
        <button @click="removeRecipient(index)" class="remove-btn">×</button>
      </div>
    </div>
    
    <button @click="addRecipient" class="add-btn">+ Add Recipient</button>
    
    <div class="summary">
      <div>Total Recipients: {{ recipients.length }}</div>
      <div>Total Amount: {{ totalAmount.toFixed(6) }} OCT</div>
      <div>Estimated Fee: {{ estimatedFee.toFixed(6) }} OCT</div>
      <div>Total Cost: {{ totalCost.toFixed(6) }} OCT</div>
      <div>Available Balance: {{ wallet.balance.toFixed(6) }} OCT</div>
    </div>
    
    <button @click="sendTransactions" :disabled="sending || !isValid" class="send-btn">
      {{ sending ? 'Sending...' : `Send to ${recipients.length} Recipients` }}
    </button>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="successCount > 0" class="success">
      Successfully sent {{ successCount }} transactions
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useWalletStore } from '../store/wallet'
import { sendTransaction } from '../services/api'

export default {
  setup() {
    const wallet = useWalletStore()
    const recipients = ref([{ address: '', amount: 0 }])
    const sending = ref(false)
    const error = ref(null)
    const successCount = ref(0)
    
    const totalAmount = computed(() => {
      return recipients.value.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
    })
    
    const estimatedFee = computed(() => {
      return recipients.value.length * 0.001 // Simplified fee calculation
    })
    
    const totalCost = computed(() => totalAmount.value + estimatedFee.value)
    
    const isValid = computed(() => {
      return recipients.value.length > 0 && 
             recipients.value.every(r => r.address && r.amount > 0) &&
             totalCost.value <= wallet.balance
    })
    
    const addRecipient = () => {
      recipients.value.push({ address: '', amount: 0 })
    }
    
    const removeRecipient = (index) => {
      if (recipients.value.length > 1) {
        recipients.value.splice(index, 1)
      }
    }
    
    const sendTransactions = async () => {
      if (!isValid.value) return
      
      sending.value = true
      error.value = null
      successCount.value = 0
      
      try {
        for (let i = 0; i < recipients.value.length; i++) {
          const recipient = recipients.value[i]
          const txData = {
            from: wallet.address,
            to: recipient.address,
            amount: (recipient.amount * 1_000_000).toString(), // Convert to μOCT
            nonce: wallet.nonce + 1 + i,
            timestamp: Date.now() / 1000
          }
          
          await api.sendTransaction(txData)
          successCount.value++
        }
        
        wallet.loadWalletData() // Refresh balance and transactions
      } catch (err) {
        error.value = err.message || 'Failed to send some transactions'
      } finally {
        sending.value = false
      }
    }
    
    return {
      wallet,
      recipients,
      sending,
      error,
      successCount,
      totalAmount,
      estimatedFee,
      totalCost,
      isValid,
      addRecipient,
      removeRecipient,
      sendTransactions
    }
  }
}
</script>

<style scoped>
.multi-send {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.recipients-list {
  margin-bottom: 20px;
}

.recipient-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.recipient-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn {
  background: #ff5252;
  color: white;
  border: none;
  width: 30px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.summary {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.summary div {
  margin-bottom: 5px;
}

.send-btn {
  background: #35495e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

.send-btn:disabled {
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
}
</style>
