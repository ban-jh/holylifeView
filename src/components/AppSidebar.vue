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

<style scoped>
.sidebar {
  width: 240px;
  background: var(--brown-dark);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  transition: transform var(--transition), width var(--transition);
  overflow: hidden;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-logo-icon {
  width: 34px;
  height: 34px;
  background: var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-logo-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
}

.sidebar-logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.sidebar-logo-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
  letter-spacing: 0.3px;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 16px 10px 6px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: background var(--transition), color var(--transition);
  user-select: none;
  text-decoration: none;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
}

.nav-link.active {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.nav-link.parent-active {
  background: rgba(201, 125, 78, 0.18);
  color: rgba(255, 255, 255, 0.92);
}

.nav-link svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-link-label {
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
}

.nav-chevron {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  transition: transform var(--transition);
  flex-shrink: 0;
}

.nav-chevron.open {
  transform: rotate(180deg);
}

.nav-sub {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s;
  opacity: 0;
}

.nav-sub.open {
  max-height: 300px;
  opacity: 1;
}

.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px 7px 40px;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  transition: background var(--transition), color var(--transition);
  user-select: none;
  text-decoration: none;
}

.nav-sub-item::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
  transition: background var(--transition);
}

.nav-sub-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
}

.nav-sub-item:hover::before {
  background: var(--accent);
}

.nav-sub-item.active {
  color: var(--accent-light);
  font-weight: 600;
}

.nav-sub-item.active::before {
  background: var(--accent);
}

.sidebar-footer {
  padding: 14px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition);
}

.sidebar-user:hover {
  background: rgba(255, 255, 255, 0.07);
}

.sidebar-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.sidebar-user-info {
  flex: 1;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
}

/* Mobile */
@media (max-width: 680px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    z-index: 200;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>