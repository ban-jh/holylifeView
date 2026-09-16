<template>
  <div class="layout">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>
    <div class="main">
      <AppHeader @open-sidebar="sidebarOpen = true">
        <template #breadcrumb>
          <slot name="breadcrumb" />
        </template>
      </AppHeader>
      <div class="content">
        <RouterView />
      </div>
    </div>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppToast from '@/components/AppToast.vue'

const sidebarOpen = ref(false)
const route = useRoute()

// 라우트 변경 시 모바일 사이드바 자동 닫기
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<style scoped>
.layout {
  --sidebar-width: 240px;
  --header-height: 64px;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(45, 33, 24, 0.45);
  z-index: 90;
  backdrop-filter: blur(2px);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--cream);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 36px;
  scrollbar-width: thin;
  scrollbar-color: var(--sand) transparent;
}

.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-thumb {
  background: var(--sand);
  border-radius: 4px;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content > :deep(*) {
  animation: fadeSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@media (max-width: 680px) {
  .overlay.active {
    display: block;
  }

  .content {
    padding: 20px 18px;
  }
}
</style>