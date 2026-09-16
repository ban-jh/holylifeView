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
import '@/assets/css/default-layout.css'
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
