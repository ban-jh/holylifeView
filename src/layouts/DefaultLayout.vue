<template>
  <div class="layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <AppSidebar :open="sidebarOpen" :collapsed="sidebarCollapsed" @close="sidebarOpen = false" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>
    <div class="main">
      <AppHeader :collapsed="sidebarCollapsed" @open-sidebar="sidebarOpen = true" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed">
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
import '@/assets/css/default-layout.css'
import { ref, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppToast from '@/components/AppToast.vue'

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const route = useRoute()

// 라우트 변경 시 모바일 사이드바 자동 닫기
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)
</script>
