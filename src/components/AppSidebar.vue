<template>
  <aside class="sidebar" :class="{ open, collapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
          <path d="M12 22V12" />
          <path d="M3 7l9 5 9-5" />
        </svg>
      </div>
      <div v-if="!collapsed">
        <div class="sidebar-logo-text">말씀 관리자</div>
        <div class="sidebar-logo-sub">Word Admin Console</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav" v-if="menus.length > 0">
      <template v-for="section in menuSections" :key="section.label">
        <div v-if="!collapsed" class="nav-section-label">{{ section.label }}</div>
        <template v-for="menu in section.items" :key="menu.menuId">
          <!-- 1Depth with children → collapsible -->
          <div v-if="menu.children && menu.children.length > 0" class="nav-item">
            <div
              class="nav-link"
              :class="{ 'parent-active': openMenus[menu.menuId] || isMenuActive(menu) }"
              @click="toggleMenuOpen(menu.menuId)"
              :data-tooltip="menu.menuName"
            >
              <img v-if="menu.icon" :src="menu.icon" alt="icon" class="nav-link-icon-img" />
              <svg v-else viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
              </svg>
              <span class="nav-link-label">{{ menu.menuName }}</span>
              <svg class="nav-chevron" :class="{ open: openMenus[menu.menuId] }" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div class="nav-sub" :class="{ open: openMenus[menu.menuId] || isMenuActive(menu) }">
              <RouterLink
                v-for="child in menu.children"
                :key="child.menuId"
                :to="child.menuUrl"
                class="nav-sub-item"
                :class="{ active: route.path === child.menuUrl }"
                @click="close"
              >{{ child.menuName }}</RouterLink>
            </div>
          </div>
          <!-- 1Depth without children → direct link -->
          <RouterLink
            v-else
            :to="menu.menuUrl"
            class="nav-link"
            :class="{ active: isRouteActive(menu.menuUrl) }"
            :data-tooltip="menu.menuName"
            @click="close"
          >
            <img v-if="menu.icon" :src="menu.icon" alt="icon" class="nav-link-icon-img" />
            <svg v-else viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span class="nav-link-label">{{ menu.menuName }}</span>
          </RouterLink>
        </template>
      </template>
    </nav>

    <!-- Loading / fallback -->
    <nav class="sidebar-nav" v-else-if="loading">
      <div class="nav-section-label">메뉴를 불러오는 중...</div>
    </nav>

    <!-- Fallback hardcoded menus if API fails -->
    <nav class="sidebar-nav" v-else>
      <div class="nav-section-label">메인 메뉴</div>
      <RouterLink to="/pbs" class="nav-link" :class="{ active: isRouteActive('/pbs') }" @click="close">
        <svg viewBox="0 0 24 24">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span class="nav-link-label">P.B.S (성경공부)</span>
      </RouterLink>
      <RouterLink to="/qts" class="nav-link" :class="{ active: isRouteActive('/qts') }" @click.prevent="handleQtClick(); close">
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
          :class="{ 'parent-active': fallbackOpen || route.path.startsWith('/system') }"
          @click="fallbackOpen = !fallbackOpen"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
          </svg>
          <span class="nav-link-label">시스템</span>
          <svg class="nav-chevron" :class="{ open: fallbackOpen || route.path.startsWith('/system') }" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div class="nav-sub" :class="{ open: fallbackOpen || route.path.startsWith('/system') }">
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { menuApi, qtApi } from '@/api'

defineProps<{
  open?: boolean
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-collapse'): void
}>()

const route = useRoute()
const router = useRouter()

interface MenuItem {
  menuId: number
  parentId: number | null
  parentName: string | null
  menuName: string
  menuCode: string
  menuUrl: string
  depth: number
  sortOrder: number
  icon: string | null
  useYn: boolean
  displayYn: boolean
  children?: MenuItem[]
}

const menus = ref<MenuItem[]>([])
const loading = ref(true)
const openMenus = reactive<Record<number, boolean>>({})
const fallbackOpen = ref(false)

function isRouteActive(prefix: string): boolean {
  return route.path === prefix || route.path.startsWith(prefix + '/')
}

function isMenuActive(menu: MenuItem): boolean {
  // Check if any child route matches
  if (menu.children && menu.children.length > 0) {
    return menu.children.some((c) => route.path === c.menuUrl || route.path.startsWith(c.menuUrl + '/'))
  }
  return isRouteActive(menu.menuUrl)
}

function toggleMenuOpen(menuId: number) {
  openMenus[menuId] = !openMenus[menuId]
}

function close() {
  emit('close')
}

// QT 메뉴 클릭 시 — 오늘 QT가 있으면 목록, 없으면 등록화면
async function handleQtClick() {
  try {
    const res = await qtApi.getAll()
    const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const hasTodayQt = (res.data || []).some((qt: any) => qt.qtDate === today)
    if (hasTodayQt) {
      router.push('/qts')
    } else {
      router.push('/qts/new')
    }
  } catch (e) {
    // API 실패 시 기본적으로 목록으로
    router.push('/qts')
  }
}

// Split menus into sections: non-system → '메인 메뉴', system → '관리'
const menuSections = computed(() => {
  const filtered = menus.value.filter((m) => m.useYn && m.displayYn)
  const mainItems = filtered.filter((m) => m.menuCode !== 'SYSTEM')
  const systemItems = filtered.filter((m) => m.menuCode === 'SYSTEM')
  const sections: { label: string; items: MenuItem[] }[] = []
  if (mainItems.length > 0) sections.push({ label: '메인 메뉴', items: mainItems })
  if (systemItems.length > 0) sections.push({ label: '관리', items: systemItems })
  return sections
})

async function fetchMenus() {
  loading.value = true
  try {
    const res = await menuApi.getTree()
    const tree = res.data || []
    // Filter: only useYn && displayYn, and filter children too
    menus.value = tree
      .filter((m: MenuItem) => m.useYn && m.displayYn)
      .map((m: MenuItem) => ({
        ...m,
        children: m.children?.filter((c: MenuItem) => c.useYn && c.displayYn),
      }))
  } catch (e) {
    // Fallback to empty (hardcoded fallback will render)
    menus.value = []
  } finally {
    loading.value = false
  }
}

// Auto-open parent when route matches a child
watch(
  () => route.path,
  (path) => {
    for (const m of menus.value) {
      if (m.children && m.children.length > 0) {
        if (m.children.some((c) => path === c.menuUrl || path.startsWith(c.menuUrl + '/'))) {
          openMenus[m.menuId] = true
        }
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  fetchMenus()
})
</script>