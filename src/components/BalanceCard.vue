<template>
  <div class="balance-card">
    <h2>Wallet Balance</h2>
    <div v-if="loading" class="loading">
      <Spinner />
    </div>
    <template v-else>
      <div class="balance">{{ balance.toFixed(6) }} OCT</div>
      <div class="nonce">Nonce: {{ nonce }}</div>
      <div class="address">{{ shortenAddress(address) }}</div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useWalletStore } from '../store'
import Spinner from './Spinner.vue'

export default {
  components: { Spinner },
  setup() {
    const wallet = useWalletStore()
    
    const shortenAddress = (addr) => {
      return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'No wallet loaded'
    }

    return {
      balance: computed(() => wallet.balance),
      nonce: computed(() => wallet.nonce),
      address: computed(() => wallet.address),
      loading: computed(() => wallet.loading),
      shortenAddress
    }
  }
}
</script>

<style scoped>
.balance-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.balance {
  font-size: 2rem;
  font-weight: bold;
  color: #42b983;
}

.nonce, .address {
  color: #666;
  margin-top: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>
