import { defineStore } from 'pinia'
import api from '../services/api'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    address: localStorage.getItem('octra_address') || null,
    privateKey: localStorage.getItem('octra_private_key') || null,
    publicKey: localStorage.getItem('octra_public_key') || null,
    balance: parseFloat(localStorage.getItem('octra_balance')) || 0,
    nonce: parseInt(localStorage.getItem('octra_nonce')) || 0,
    transactions: JSON.parse(localStorage.getItem('octra_transactions')) || [],
    loading: false,
    error: null,
    network: localStorage.getItem('octra_network') || 'https://octra.network'
  }),

  getters: {
    isAuthenticated: (state) => !!state.address,
    shortAddress: (state) => {
      if (!state.address) return ''
      return `${state.address.substring(0, 6)}...${state.address.substring(state.address.length - 4)}`
    }
  },

  actions: {
    async loadWalletData() {
      if (!this.address) return
      
      this.loading = true
      this.error = null
      
      try {
        // Fetch balance and nonce
        const { balance, nonce } = await api.getBalance(this.address)
        this.balance = balance
        this.nonce = nonce
        
        // Fetch transaction history
        this.transactions = await api.getTxHistory(this.address)
        
        // Persist data to localStorage
        localStorage.setItem('octra_balance', balance.toString())
        localStorage.setItem('octra_nonce', nonce.toString())
        localStorage.setItem('octra_transactions', JSON.stringify(this.transactions))
      } catch (err) {
        this.error = err.message || 'Failed to load wallet data'
        console.error('Error loading wallet data:', err)
      } finally {
        this.loading = false
      }
    },

    setWallet(walletData) {
      this.address = walletData.address
      this.privateKey = walletData.privateKey
      this.publicKey = walletData.publicKey
      
      localStorage.setItem('octra_address', walletData.address)
      localStorage.setItem('octra_private_key', walletData.privateKey)
      localStorage.setItem('octra_public_key', walletData.publicKey)
      
      this.loadWalletData()
    },

    clearWallet() {
      this.address = null
      this.privateKey = null
      this.publicKey = null
      this.balance = 0
      this.nonce = 0
      this.transactions = []
      
      localStorage.removeItem('octra_address')
      localStorage.removeItem('octra_private_key')
      localStorage.removeItem('octra_public_key')
      localStorage.removeItem('octra_balance')
      localStorage.removeItem('octra_nonce')
      localStorage.removeItem('octra_transactions')
    },

    setNetwork(networkUrl) {
      this.network = networkUrl
      localStorage.setItem('octra_network', networkUrl)
      // You might want to update API base URL here
    }
  }
})