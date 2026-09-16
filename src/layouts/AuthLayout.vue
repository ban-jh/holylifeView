<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cream);
  background-image: radial-gradient(var(--sand-dark) 0.75px, transparent 0.75px),
    radial-gradient(var(--sand-dark) 0.75px, var(--cream) 0.75px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  padding: 40px 20px;
  color: var(--text-primary);
}
</style>