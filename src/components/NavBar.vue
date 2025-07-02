<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/send">Send</router-link>
    <router-link to="/multisend">Multi-Send</router-link>
    <router-link to="/settings">Settings</router-link>
    <span v-if="wallet.address" class="wallet-info">
      {{ shortenAddress(wallet.address) }}
    </span>
  </nav>
</template>

<script>
import { useWalletStore } from '../store/wallet'

export default {
  setup() {
    const wallet = useWalletStore()
    
    const shortenAddress = (addr) => {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return { wallet, shortenAddress }
  }
}
</script>

<style scoped>
nav {
  background: #2c3e50;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}

.wallet-info {
  margin-left: auto;
  color: #42b983;
  font-weight: bold;
}
</style>
