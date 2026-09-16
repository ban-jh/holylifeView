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
import '@/assets/css/app-toast.css'
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>
