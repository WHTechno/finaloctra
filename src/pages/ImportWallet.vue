<template>
  <div class="import-wallet">
    <h2>Import Wallet</h2>
    
    <div class="tabs">
      <button @click="activeTab = 'private'" :class="{active: activeTab === 'private'}">Private Key</button>
      <button @click="activeTab = 'json'" :class="{active: activeTab === 'json'}">JSON File</button>
    </div>
    
    <div v-if="activeTab === 'private'" class="tab-content">
      <textarea v-model="privateKey" placeholder="Enter your private key (base64)"></textarea>
      <button @click="importFromPrivateKey" :disabled="!privateKey">Import</button>
    </div>
    
    <div v-else class="tab-content">
      <input type="file" @change="handleFileUpload" accept=".json">
      <button @click="importFromJson" :disabled="!jsonData">Import</button>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useWalletStore } from '../store'
import { generateWallet } from '../services/wallet'

export default {
  setup() {
    const wallet = useWalletStore()
    const activeTab = ref('private')
    const privateKey = ref('')
    const jsonData = ref(null)
    const error = ref(null)
    
    const importFromPrivateKey = () => {
      try {
        // In a real app, you would validate the private key
        // and derive the address from it
        const newWallet = generateWallet()
        wallet.setWallet(newWallet.address)
        // Normally you would store the private key securely
      } catch (err) {
        error.value = 'Invalid private key'
      }
    }
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          jsonData.value = JSON.parse(e.target.result)
        } catch (err) {
          error.value = 'Invalid JSON file'
        }
      }
      reader.readAsText(file)
    }
    
    const importFromJson = () => {
      if (!jsonData.value) return
      
      try {
        if (!jsonData.value.address || !jsonData.value.priv) {
          throw new Error('Invalid wallet format')
        }
        
        wallet.setWallet(jsonData.value.address)
        // Normally you would store the private key securely
      } catch (err) {
        error.value = err.message || 'Failed to import wallet'
      }
    }
    
    return {
      activeTab,
      privateKey,
      jsonData,
      error,
      importFromPrivateKey,
      handleFileUpload,
      importFromJson
    }
  }
}
</script>

<style scoped>
.import-wallet {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: #eee;
  cursor: pointer;
}

.tabs button.active {
  background: #42b983;
  color: white;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

textarea {
  min-height: 100px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px;
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
</style>
