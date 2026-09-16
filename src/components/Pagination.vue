<template>
  <div class="pagination-container">
    <div class="pagination-info">
      전체 <strong>{{ totalItems }}</strong> 개 항목 중 {{ rangeStart }} - {{ rangeEnd }} 표시
    </div>
    <div class="pagination">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button
        v-for="p in pages"
        :key="p"
        class="page-btn"
        :class="{ active: p === currentPage }"
        @click="goPage(p)"
      >
        {{ p }}
      </button>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="goPage(currentPage + 1)"
      >
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalItems: number
    itemsPerPage?: number
    maxVisible?: number
  }>(),
  {
    itemsPerPage: 10,
    maxVisible: 7,
  },
)

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage)),
)

const rangeStart = computed(() =>
  props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1,
)

const rangeEnd = computed(() =>
  Math.min(props.currentPage * props.itemsPerPage, props.totalItems),
)

const pages = computed(() => {
  const total = totalPages.value
  const max = props.maxVisible
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  let start = Math.max(1, props.currentPage - Math.floor(max / 2))
  const end = Math.min(total, start + max - 1)
  start = Math.max(1, end - max + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function goPage(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('page-change', page)
}
</script>

<style scoped>
.pagination-container {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--cream-dark);
}

.pagination-info {
  font-size: 13px;
  color: var(--text-muted);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--sand);
  background: var(--warm-white);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition);
}

.page-btn:hover:not(:disabled):not(.active) {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.page-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}
</style>