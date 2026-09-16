<template>
  <span class="status-tag" :class="status">{{ label || defaultLabel }}</span>
</template>

<script setup lang="ts">
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

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag.published {
  background: #e6f4ea;
  color: #1e7e34;
}

.status-tag.draft {
  background: #fef3d6;
  color: #b7791f;
}

.status-tag.archived {
  background: #f1f3f5;
  color: #707e94;
}
</style>