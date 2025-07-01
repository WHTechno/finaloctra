<template>
  <div class="settings-page">
    <div class="card">
      <h2 class="card-title">Wallet Settings</h2>
      
      <div v-if="wallet.address" class="wallet-info">
        <div class="info-item">
          <label>Wallet Address</label>
          <div class="info-value">{{ wallet.address }}</div>
        </div>
        
        <div class="info-item">
          <label>Public Key</label>
          <div class="info-value">{{ shortenString(wallet.publicKey) }}</div>
        </div>
        
        <div class="info-item">
          <label>Network</label>
          <select v-model="network" @change="updateNetwork">
            <option value="https://octra.network">Mainnet</option>
            <option value="https://testnet.octra.network">Testnet</option>
            <option value="http://localhost:8080">Localhost</option>
          </select>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>No wallet loaded</p>
        <router-link to="/import" class="btn btn-primary">Import Wallet</router-link>
      </div>
    </div>
    
    <div class="card danger-zone">
      <h2 class="card-title">Danger Zone</h2>
      
      <div class="danger-item">
        <h3>Export Private Key</h3>
        <p>Be extremely careful with this. Anyone with your private key can access your funds.</p>
        <button @click="showPrivateKey = !showPrivateKey" class="btn btn-outline">
          {{ showPrivateKey ? 'Hide Private Key' : 'Show Private Key' }}
        </button>
        
        <div v-if="showPrivateKey" class="private-key-display">
          <textarea v-model="wallet.privateKey" readonly></textarea>
          <button @click="copyToClipboard(wallet.privateKey)" class="btn btn-secondary mt-2">
            Copy to Clipboard
          </button>
        </div>
      </div>
      
      <div class="danger-item">
        <h3>Export Wallet File</h3>
        <p>Export your complete wallet data as a JSON file.</p>
        <button @click="exportWallet" class="btn btn-outline">Export Wallet</button>
      </div>
      
      <div class="danger-item">
        <h3>Delete Wallet</h3>
        <p>This will remove all wallet data from this browser. Make sure you have backups.</p>
        <button @click="confirmDelete" class="btn btn-danger">Delete Wallet</button>
      </div>
    </div>
    
    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="confirmation-dialog">
      <div class="dialog-content">
        <h3>Are you sure?</h3>
        <p>This action cannot be undone. Make sure you have backed up your private key.</p>
        <div class="dialog-actions">
          <button @click="showConfirmDialog = false" class="btn btn-outline">Cancel</button>
          <button @click="deleteWallet" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useWalletStore } from '../store'
import { generateWallet } from '../services/wallet'

export default {
  setup() {
    const wallet = useWalletStore()
    const showPrivateKey = ref(false)
    const showConfirmDialog = ref(false)
    const network = ref(localStorage.getItem('octra_network') || 'https://octra.network')
    
    const shortenString = (str) => {
      if (!str) return ''
      return `${str.substring(0, 10)}...${str.substring(str.length - 5)}`
    }
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
    
    const exportWallet = () => {
      if (!wallet.address) return
      
      const walletData = {
        priv: wallet.privateKey,
        addr: wallet.address,
        pub: wallet.publicKey,
        rpc: network.value
      }
      
      const dataStr = JSON.stringify(walletData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `octra_wallet_${wallet.address.substring(0, 8)}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
    
    const confirmDelete = () => {
      showConfirmDialog.value = true
    }
    
    const deleteWallet = () => {
      wallet.clearWallet()
      showConfirmDialog.value = false
      // Redirect to home after deletion
      window.location.href = '/'
    }
    
    const updateNetwork = () => {
      localStorage.setItem('octra_network', network.value)
      // In a real app, you would update the API base URL
      alert('Network updated. Please refresh the page.')
    }
    
    return {
      wallet,
      showPrivateKey,
      showConfirmDialog,
      network,
      shortenString,
      copyToClipboard,
      exportWallet,
      confirmDelete,
      deleteWallet,
      updateNetwork
    }
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.wallet-info {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-value {
  padding: 0.75rem;
  background-color: var(--light-gray);
  border-radius: 4px;
  word-break: break-all;
  font-family: monospace;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state p {
  margin-bottom: 1rem;
  color: var(--dark-gray);
}

.danger-zone {
  border-left: 4px solid var(--danger);
}

.danger-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--light-gray);
}

.danger-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.danger-item h3 {
  color: var(--danger);
  margin-bottom: 0.5rem;
}

.danger-item p {
  color: var(--dark-gray);
  margin-bottom: 1rem;
}

.private-key-display textarea {
  font-family: monospace;
  min-height: 100px;
  margin-top: 1rem;
}

.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.dialog-content h3 {
  margin-bottom: 1rem;
  color: var(--secondary);
}

.dialog-content p {
  margin-bottom: 2rem;
  color: var(--dark-gray);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .wallet-info {
    grid-template-columns: 1fr;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .dialog-actions button {
    width: 100%;
  }
}
</style>
