<template>
  <div class="home">
    <BalanceCard />
    <TxHistory />
    
    <div class="actions">
      <router-link to="/send" class="btn primary">Send OCT</router-link>
      <router-link to="/multisend" class="btn secondary">Multi-Send</router-link>
    </div>
  </div>
</template>

<script>
import BalanceCard from '../components/BalanceCard.vue'
import TxHistory from '../components/TxHistory.vue'
import { useWalletStore } from '../store'
import { onMounted } from 'vue'

export default {
  components: { BalanceCard, TxHistory },
  setup() {
    const wallet = useWalletStore()
    
    onMounted(() => {
      if (wallet.address) {
        wallet.loadWalletData()
      }
    })
  }
}
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.primary {
  background: #42b983;
  color: white;
}

.secondary {
  background: #35495e;
  color: white;
}
</style>
