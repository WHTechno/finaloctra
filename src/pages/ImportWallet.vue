<template>
  <div class="import-wallet">
    <h2>Import Wallet</h2>

    <div class="tabs">
      <button @click="activeTab = 'private'" :class="{ active: activeTab === 'private' }">Private Key</button>
      <button @click="activeTab = 'json'" :class="{ active: activeTab === 'json' }">JSON File</button>
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
import { useWalletStore } from '../store/wallet'
import { useRouter } from 'vue-router'
import { deriveAddressFromPrivateKey } from '../utils/crypto' // ✅ Import fungsi baru

export default {
  setup() {
    const router = useRouter()
    const wallet = useWalletStore()
    const activeTab = ref('private')
    const privateKey = ref('')
    const jsonData = ref(null)
    const error = ref(null)

    const importFromPrivateKey = async () => {
      try {
        if (!privateKey.value.trim()) throw new Error('Private key is empty')

        const address = await deriveAddressFromPrivateKey(privateKey.value.trim()) // ✅ Generate address

        wallet.setWallet({
          address,
          privateKey: privateKey.value.trim(),
          publicKey: '', // Optional
          rpc: 'https://octra.network'
        })

        error.value = null
        router.push('/')
      } catch (err) {
        error.value = err.message || 'Invalid private key'
      }
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          jsonData.value = json
          error.value = null
        } catch (err) {
          error.value = 'Invalid JSON file'
        }
      }
      reader.readAsText(file)
    }

    const importFromJson = () => {
      try {
        const data = jsonData.value
        if (!data.priv || !data.addr || !data.rpc) {
          throw new Error('Missing required fields in JSON')
        }

        wallet.setWallet({
          address: data.addr,
          privateKey: data.priv,
          publicKey: data.pub || '',
          rpc: data.rpc
        })

        error.value = null
        router.push('/')
      } catch (err) {
        error.value = err.message || 'Failed to import wallet from JSON'
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
