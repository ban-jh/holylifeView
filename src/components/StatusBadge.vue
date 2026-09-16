<template>
  <span class="status-tag" :class="status">{{ label || defaultLabel }}</span>
</template>

<script setup lang="ts">
import '@/assets/css/status-badge.css'
import { computed } from 'vue'

const props = defineProps<{
  status: 'published' | 'draft' | 'archived'
  label?: string
}>()

const defaultLabel = computed(() => {
  const labels: Record<string, string> = {
    published: '게시됨',
    draft: '임시저장',
    archived: '보관됨',
  }
  return labels[props.status] || props.status
})
</script>
