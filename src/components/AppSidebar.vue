<template>
  <aside class="sidebar" :class="{ open }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
          <path d="M12 22V12" />
          <path d="M3 7l9 5 9-5" />
        </svg>
      </div>
      <div>
        <div class="sidebar-logo-text">말씀 관리자</div>
        <div class="sidebar-logo-sub">Word Admin Console</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section-label">메인 메뉴</div>

      <RouterLink to="/pbs" class="nav-link" :class="{ active: isRouteActive('/pbs') }" @click="close">
        <svg viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span class="nav-link-label">P.B.S (성경공부)</span>
      </RouterLink>

      <RouterLink to="/qts" class="nav-link" :class="{ active: isRouteActive('/qts') }" @click="close">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span class="nav-link-label">Q.T</span>
      </RouterLink>

      <RouterLink to="/sermons" class="nav-link" :class="{ active: isRouteActive('/sermons') }" @click="close">
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span class="nav-link-label">설교</span>
      </RouterLink>

      <RouterLink to="/readings" class="nav-link" :class="{ active: isRouteActive('/readings') }" @click="close">
        <svg viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span class="nav-link-label">독서</span>
      </RouterLink>

      <div class="nav-section-label">관리</div>

      <div class="nav-item">
        <div
          class="nav-link"
          :class="{ 'parent-active': systemOpen || isSystemRoute }"
          @click="systemOpen = !systemOpen"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
          </svg>
          <span class="nav-link-label">시스템</span>
          <svg class="nav-chevron" :class="{ open: systemOpen }" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div class="nav-sub" :class="{ open: systemOpen || isSystemRoute }">
          <RouterLink to="/system/users" class="nav-sub-item" :class="{ active: route.path === '/system/users' }" @click="close">사용자</RouterLink>
          <RouterLink to="/system/menus" class="nav-sub-item" :class="{ active: route.path === '/system/menus' }" @click="close">메뉴</RouterLink>
          <RouterLink to="/system/permissions" class="nav-sub-item" :class="{ active: route.path === '/system/permissions' }" @click="close">권한</RouterLink>
          <RouterLink to="/system/common-codes" class="nav-sub-item" :class="{ active: route.path === '/system/common-codes' }" @click="close">공통코드</RouterLink>
        </div>
      </div>
    </nav>

    <!-- User Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-user-avatar">박</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">박성민 관리자</div>
          <div class="sidebar-user-role">Super Admin</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import '@/assets/css/app-sidebar.css'
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const systemOpen = ref(false)

const isSystemRoute = computed(() => route.path.startsWith('/system'))

function isRouteActive(prefix: string): boolean {
  return route.path === prefix || route.path.startsWith(prefix + '/')
}

function close() {
  emit('close')
}

// 시스템 페이지일 경우 서브메뉴 자동 펼침
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/system')) {
      systemOpen.value = true
    }
  },
  { immediate: true },
)
</script>
