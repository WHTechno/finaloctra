<template>
  <div class="tx-history">
    <h2>Transaction History</h2>
    <div v-if="loading" class="loading">
      <Spinner />
    </div>
    <div v-else-if="transactions.length === 0" class="empty">
      No transactions found
    </div>
    <div v-else class="tx-list">
      <div v-for="tx in transactions" :key="tx.hash" class="tx-item">
        <div class="tx-header">
          <span class="tx-hash">{{ shortenHash(tx.hash) }}</span>
          <span class="tx-amount" :class="{in: isIncoming(tx), out: !isIncoming(tx)}">
            {{ isIncoming(tx) ? '+' : '-' }} {{ formatAmount(tx.amount) }} OCT
          </span>
        </div>
        <div class="tx-details">
          <span>To: {{ shortenAddress(tx.to) }}</span>
          <span>{{ formatDate(tx.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useWalletStore } from '../store/wallet'
import Spinner from './Spinner.vue'

export default {
  components: { Spinner },
  setup() {
    const wallet = useWalletStore()
    
    const shortenAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
    const shortenHash = (hash) => hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : ''
    
    const isIncoming = (tx) => tx.to === wallet.address
    const formatAmount = (amt) => parseFloat(amt).toFixed(6)
    const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleString()

    return {
      transactions: computed(() => wallet.transactions),
      loading: computed(() => wallet.loading),
      shortenAddress,
      shortenHash,
      isIncoming,
      formatAmount,
      formatDate
    }
  }
}
</script>

<style scoped>
.tx-history {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tx-list {
  margin-top: 15px;
}

.tx-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.tx-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.tx-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.in {
  color: #42b983;
}

.out {
  color: #ff5252;
}

.empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
