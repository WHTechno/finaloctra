import axios from 'axios'

const API_URL = 'https://octra.network'

/**
 * Fetch balance, nonce, and raw balance of a given address
 * @param {string} address - Wallet address (octx...)
 * @returns { balance: number, nonce: number, raw: string }
 */
export async function getBalance(address) {
  try {
    const { data } = await axios.get(`${API_URL}/balance/${address}`)

    if (!data || !data.balance) throw new Error('Invalid balance response')

    return {
      balance: parseFloat(data.balance),
      nonce: parseInt(data.nonce),
      raw: data.balance_raw
    }
  } catch (err) {
    console.error('[API] getBalance error:', err.message)
    return {
      balance: 0,
      nonce: 0,
      raw: '0'
    }
  }
}

/**
 * Broadcast transaction to the blockchain
 * @param {Object} txData - Transaction payload
 * @returns {string} tx_hash
 */
export async function sendTransaction(txData) {
  try {
    const { data } = await axios.post(`${API_URL}/send-tx`, txData)
    return data.tx_hash || data
  } catch (err) {
    console.error('[API] sendTransaction error:', err.message)
    throw err
  }
}

/**
 * Get recent transactions for a wallet address
 * @param {string} address
 * @returns {Array} recent_transactions
 */
export async function getTxHistory(address) {
  try {
    const { data } = await axios.get(`${API_URL}/address/${address}?limit=20`)
    return data.recent_transactions || []
  } catch (error) {
    console.error('[API] getTxHistory error:', error.message)
    return []
  }
}

/**
 * Get list of staged (unconfirmed) transactions
 * @returns {Array}
 */
export async function getStagedTransactions() {
  try {
    const { data } = await axios.get(`${API_URL}/staging`)
    return data.staged_transactions || []
  } catch (err) {
    console.error('[API] getStagedTransactions error:', err.message)
    return []
  }
}
