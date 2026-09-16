<template>
  <Transition name="toast">
    <div v-if="visible" class="toast">
      <svg
        style="width: 16px; height: 16px; stroke: #a8d8bc; fill: none; stroke-width: 2.5; flex-shrink: 0"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: var(--brown-dark);
  color: #fff;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 13.5px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(80px);
  opacity: 0;
}
</style>