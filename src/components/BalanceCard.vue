<template>
  <div class="balance-card">
    <h3>Wallet Balance</h3>
    <p v-if="wallet.loading">Loading...</p>
    <p v-else>{{ wallet.balance.toFixed(6) }} OCT</p>
  </div>
</template>

<script>
import { useWalletStore } from '../store/wallet'

export default {
  setup() {
    const wallet = useWalletStore()
    return { wallet }
  }
}
</script>

<style scoped>
.balance-card {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.balance-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.balance-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
}
</style>
