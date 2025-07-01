<template>
  <div class="spinner"></div>
</template>

<style scoped>
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
