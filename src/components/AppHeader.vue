<template>
  <header class="header">
    <button class="mobile-menu-btn" @click="emit('open-sidebar')">
      <svg viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <div class="breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="header-actions">
      <div class="header-search">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="검색어를 입력하세요" />
      </div>
      <button class="icon-btn" title="알림">
        <svg viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span class="badge"></span>
      </button>
      <div class="header-avatar">박</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import '@/assets/css/app-header.css'
const emit = defineEmits<{
  (e: 'open-sidebar'): void
}>()
</script>
