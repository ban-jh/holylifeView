import { ref, computed } from 'vue'
import api from '@/api'

// localStorage 사용 — 탭 간 세션 공유 + 브라우저 재시작 시에도 유지
// 세션 만료 조건: 날짜가 변경되고, 마지막 활동 시간으로부터 1시간 초과 시
const SESSION_TIMEOUT_MS = 60 * 60 * 1000 // 1시간

// 오늘 날짜 문자열 (YYYY-MM-DD)
function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function checkSessionExpired(): boolean {
  const lastActivity = localStorage.getItem('holylife_last_activity')
  const lastDate = localStorage.getItem('holylife_last_date')
  if (!lastActivity) return true

  const today = getTodayStr()
  // 같은 날짜면 무제한 유지
  if (lastDate === today) return false

  // 날짜가 변경된 경우 — 1시간 초과 시 만료
  const elapsed = Date.now() - parseInt(lastActivity)
  return elapsed > SESSION_TIMEOUT_MS
}

function initSession() {
  const savedToken = localStorage.getItem('holylife_token')
  if (savedToken && checkSessionExpired()) {
    // 세션 만료 — 저장된 데이터 삭제
    localStorage.removeItem('holylife_token')
    localStorage.removeItem('holylife_user')
    localStorage.removeItem('holylife_menus')
    localStorage.removeItem('holylife_last_activity')
    localStorage.removeItem('holylife_last_date')
    return { token: null, user: null, menus: [] }
  }
  return {
    token: savedToken,
    user: JSON.parse(localStorage.getItem('holylife_user') || 'null'),
    menus: JSON.parse(localStorage.getItem('holylife_menus') || '[]'),
  }
}

const initialized = initSession()
const token = ref<string | null>(initialized.token)
const user = ref<any>(initialized.user)
const allowedMenus = ref<any[]>(initialized.menus)

// 마지막 활동 시간 + 날짜 업데이트
function updateActivity() {
  if (token.value) {
    localStorage.setItem('holylife_last_activity', String(Date.now()))
    localStorage.setItem('holylife_last_date', getTodayStr())
  }
}

// 페이지 로드 시 활동 시간 업데이트
if (token.value) {
  updateActivity()
}

// 주기적 세션 만료 체크 (1분마다) — 날짜 변경 + 1시간 초과 시에만 만료
let sessionChecker: ReturnType<typeof setInterval> | null = null

function startSessionChecker() {
  if (sessionChecker) clearInterval(sessionChecker)
  sessionChecker = setInterval(() => {
    if (token.value && checkSessionExpired()) {
      // 세션 만료 — 직접 정리
      token.value = null
      user.value = null
      allowedMenus.value = []
      localStorage.removeItem('holylife_token')
      localStorage.removeItem('holylife_user')
      localStorage.removeItem('holylife_menus')
      localStorage.removeItem('holylife_last_activity')
      localStorage.removeItem('holylife_last_date')
      if (sessionChecker) {
        clearInterval(sessionChecker)
        sessionChecker = null
      }
      window.location.href = '/login'
    }
  }, 60000) // 1분마다 체크
}

if (token.value) {
  startSessionChecker()
}

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => user.value?.roleGroup || null)

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('holylife_token', res.data.token)
    localStorage.setItem('holylife_user', JSON.stringify(res.data.user))
    localStorage.setItem('holylife_last_activity', String(Date.now()))
    localStorage.setItem('holylife_last_date', getTodayStr())
    // 권한 메뉴 조회 실패해도 로그인은 성공으로 처리
    try {
      await fetchAllowedMenus()
    } catch (e) {
      console.error('Failed to fetch allowed menus during login', e)
    }
    startSessionChecker()
    return res.data
  }

  async function fetchAllowedMenus() {
    if (!user.value) return
    try {
      const rolesRes = await api.get('/roles')
      const role = rolesRes.data.find((r: any) => r.groupCode === user.value.roleGroup)
      if (role) {
        const permRes = await api.get(`/permissions/role/${role.roleId}/menus`)
        const menus = filterAllowedMenus(permRes.data)
        allowedMenus.value = menus
        localStorage.setItem('holylife_menus', JSON.stringify(menus))
      }
    } catch (e) {
      console.error('Failed to fetch allowed menus', e)
      allowedMenus.value = []
    }
  }

  function filterAllowedMenus(menus: any[]): any[] {
    return menus
      .filter((m: any) => m.canRead)
      .map((m: any) => ({
        ...m,
        children: m.children?.filter((c: any) => c.canRead)
      }))
      .filter((m: any) => m.depth === 1 || m.parentId === null)
  }

  function logout() {
    token.value = null
    user.value = null
    allowedMenus.value = []
    localStorage.removeItem('holylife_token')
    localStorage.removeItem('holylife_user')
    localStorage.removeItem('holylife_menus')
    localStorage.removeItem('holylife_last_activity')
    localStorage.removeItem('holylife_last_date')
    if (sessionChecker) {
      clearInterval(sessionChecker)
      sessionChecker = null
    }
  }

  function isMenuAllowed(menuUrl: string): boolean {
    function checkMenu(menus: any[]): boolean {
      for (const m of menus) {
        // 정확히 일치하거나, 메뉴 URL 하위 경로면 허용 (예: /sermons → /sermons/1)
        if (m.menuUrl === menuUrl || menuUrl.startsWith(m.menuUrl + '/')) return true
        if (m.children) {
          if (checkMenu(m.children)) return true
        }
      }
      return false
    }
    // 대시보드, 마이페이지, 공지사항은 항상 허용
    if (menuUrl === '/dashboard' || menuUrl === '/mypage' || menuUrl === '/notice') return true
    // /system/users/new 은 /system/users 의 하위 경로로 처리
    return checkMenu(allowedMenus.value)
  }

  // 세션 활성화 확인 (라우터 가드에서 사용)
  function isSessionValid(): boolean {
    if (!token.value) return false
    if (checkSessionExpired()) {
      logout()
      return false
    }
    updateActivity()
    return true
  }

  return { token, user, isLoggedIn, userRole, allowedMenus, login, logout, fetchAllowedMenus, isMenuAllowed, isSessionValid, updateActivity }
}