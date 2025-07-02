import { defineStore } from 'pinia'
import { getBalance, getTxHistory } from '../services/api'

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
        const { balance, nonce } = await getBalance(this.address) // ✅ perbaikan di sini
        this.balance = balance
        this.nonce = nonce

        this.transactions = await getTxHistory(this.address) // ✅ perbaikan di sini

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

    setWallet({ address, privateKey, publicKey = '', rpc }) {
      this.address = address
      this.privateKey = privateKey
      this.publicKey = publicKey
      this.network = rpc

      localStorage.setItem('octra_address', address)
      localStorage.setItem('octra_private_key', privateKey)
      localStorage.setItem('octra_public_key', publicKey)
      localStorage.setItem('octra_network', rpc)

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
      localStorage.removeItem('octra_network')
    },

    setNetwork(networkUrl) {
      this.network = networkUrl
      localStorage.setItem('octra_network', networkUrl)
    }
  }
})
