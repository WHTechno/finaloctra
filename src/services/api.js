import axios from 'axios'

const API_URL = 'https://octra.network'

export default {
  async getBalance(address) {
    const { data } = await axios.get(`${API_URL}/balance/${address}`)
    return {
      balance: parseFloat(data.balance),
      nonce: data.nonce,
      raw: data.balance_raw
    }
  },

  async sendTransaction(txData) {
    const { data } = await axios.post(`${API_URL}/send-tx`, txData)
    return data.tx_hash || data
  },

  async getTxHistory(address) {
    try {
      const { data } = await axios.get(`${API_URL}/address/${address}?limit=20`)
      return data.recent_transactions || []
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  },

  async getStagedTransactions() {
    const { data } = await axios.get(`${API_URL}/staging`)
    return data.staged_transactions || []
  }
}
