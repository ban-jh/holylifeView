<template>
  <header class="header">
    <button class="mobile-menu-btn" @click="emit('open-sidebar')">
      <svg viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <button class="sidebar-toggle-btn" @click="emit('toggle-collapse')" title="메뉴 접기/펼치기">
      <svg viewBox="0 0 24 24" :class="{ rotated: collapsed }">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="header-actions">
      <div class="user-menu-wrapper" ref="userMenuRef">
        <div class="header-user" @click="toggleUserMenu">
          <div class="header-avatar">박</div>
          <span class="header-username">박성민 관리자</span>
          <svg class="chevron" :class="{ open: showUserMenu }" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <Transition name="dropdown">
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-header">
              <div class="dropdown-avatar">박</div>
              <div>
                <div class="dropdown-name">박성민 관리자</div>
                <div class="dropdown-role">Super Admin</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" @click="handleLogout">
              <svg viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              로그아웃
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import '@/assets/css/app-header.css'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'open-sidebar'): void
  (e: 'toggle-collapse'): void
}>()

const router = useRouter()
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

function handleLogout() {
  showUserMenu.value = false
  // TODO: 실제 로그아웃 API 호출
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>