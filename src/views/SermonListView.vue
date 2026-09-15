<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
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

      <nav class="sidebar-nav">
        <div class="nav-section-label">메인 메뉴</div>

        <RouterLink to="/pbs" class="nav-link">
          <svg viewBox="0 0 24 24">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span class="nav-link-label">P.B.S (성경공부)</span>
        </RouterLink>

        <RouterLink to="/qts" class="nav-link">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span class="nav-link-label">Q.T</span>
        </RouterLink>

        <RouterLink to="/sermons" class="nav-link active">
          <svg viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span class="nav-link-label">설교</span>
        </RouterLink>

        <RouterLink to="/readings" class="nav-link">
          <svg viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span class="nav-link-label">독서</span>
        </RouterLink>

        <div class="nav-section-label">관리</div>

        <div class="nav-item">
          <div class="nav-link" :class="{ 'parent-active': systemOpen }" @click="systemOpen = !systemOpen">
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
          <div class="nav-sub" :class="{ open: systemOpen }">
            <div class="nav-sub-item">사용자</div>
            <div class="nav-sub-item">메뉴</div>
            <div class="nav-sub-item">권한</div>
            <div class="nav-sub-item">공통코드</div>
          </div>
        </div>
      </nav>

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

    <!-- Overlay -->
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Main Area -->
    <div class="main">
      <header class="header">
        <button class="mobile-menu-btn" @click="sidebarOpen = true">
          <svg viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div class="breadcrumb">
          <span class="breadcrumb-item">설교</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-item current">설교 목록</span>
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

      <div class="content">
        <!-- Page Header -->
        <div class="page-header-row">
          <div>
            <div class="page-title">설교 목록</div>
            <div class="page-desc">등록된 설교 콘텐츠 목록을 관리합니다.</div>
          </div>
          <RouterLink to="/sermons/new" class="btn btn-primary">
            <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            새 설교 작성
          </RouterLink>
        </div>

        <!-- Search & Filter Card -->
        <div class="card">
          <div class="filter-bar">
            <div class="filter-group">
              <select v-model="filterTag" style="min-width: 120px">
                <option value="">전체 태그</option>
                <option value="은혜">은혜</option>
                <option value="회개">회개</option>
                <option value="믿음">믿음</option>
                <option value="소망">소망</option>
                <option value="사랑">사랑</option>
                <option value="구원">구원</option>
              </select>
              <select v-model="filterStatus" style="min-width: 110px">
                <option value="">전체 상태</option>
                <option value="published">게시됨</option>
                <option value="draft">임시저장</option>
              </select>
            </div>
            <div class="filter-group" style="flex: 1">
              <input type="text" v-model="searchText" placeholder="제목 또는 설교 내용 검색..." style="width: 100%" />
            </div>
            <div class="filter-group">
              <button class="btn btn-secondary" @click="fetchSermons">
                <svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                검색
              </button>
              <button class="btn btn-secondary" style="padding: 9px 12px" title="초기화" @click="resetFilter">
                <svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Data Table Card -->
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 60px; text-align: center">No.</th>
                  <th style="width: 120px">날짜</th>
                  <th>제목</th>
                  <th style="width: 120px">설교자</th>
                  <th style="width: 180px">태그</th>
                  <th style="width: 100px; text-align: center">상태</th>
                  <th style="width: 90px; text-align: center">관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sermon in sermons" :key="sermon.id" @click="goToDetail(sermon.id)">
                  <td style="text-align: center; color: var(--text-muted)">{{ sermon.no }}</td>
                  <td>{{ sermon.date }}</td>
                  <td><strong style="color: var(--text-primary)">{{ sermon.title }}</strong></td>
                  <td>{{ sermon.preacher }}</td>
                  <td>
                    <span class="sermon-tag" v-for="tag in sermon.tags" :key="tag">{{ tag }}</span>
                  </td>
                  <td style="text-align: center">
                    <span class="status-tag" :class="sermon.status">
                      {{ statusLabel(sermon.status) }}
                    </span>
                  </td>
                  <td style="text-align: center">
                    <button class="btn-icon-only" title="수정" @click.stop="goToDetail(sermon.id)">
                      <svg viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="sermons.length === 0">
                  <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px">
                    {{ loading ? '불러오는 중...' : '등록된 설교가 없습니다.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container">
            <div class="pagination-info">
              전체 <strong>{{ sermons.length }}</strong> 개 항목 중 1 - {{ sermons.length }} 표시
            </div>
            <div class="pagination">
              <button class="page-btn" disabled>
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button class="page-btn active">1</button>
              <button class="page-btn">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { sermonApi } from '@/api'

const router = useRouter()

interface Sermon {
  id: number
  no: number
  date: string
  title: string
  preacher: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
}

const sermons = ref<Sermon[]>([])
const loading = ref(false)
const sidebarOpen = ref(false)
const systemOpen = ref(false)

const filterTag = ref('')
const filterStatus = ref('')
const searchText = ref('')

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    published: '게시됨',
    draft: '임시저장',
    archived: '보관됨',
  }
  return labels[status] || status
}

async function fetchSermons() {
  loading.value = true
  try {
    const res = await sermonApi.getAll()
    sermons.value = res.data
  } catch (e) {
    console.error('설교 목록 조회 실패:', e)
    sermons.value = []
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  filterTag.value = ''
  filterStatus.value = ''
  searchText.value = ''
  fetchSermons()
}

function goToDetail(id: number) {
  router.push(`/sermons/${id}`)
}

onMounted(() => {
  fetchSermons()
})
</script>

<style scoped>
/* ── Warm Tone Variables (local fallback) ── */
.layout {
  --sidebar-width: 240px;
  --header-height: 64px;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: var(--sidebar-width);
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
  height: var(--header-height);
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

/* ── Main ── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--cream);
}

/* ── Header ── */
.header {
  height: var(--header-height);
  background: var(--warm-white);
  border-bottom: 1px solid var(--sand);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 14px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 10;
}

.mobile-menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background var(--transition);
}

.mobile-menu-btn:hover {
  background: var(--cream-dark);
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.breadcrumb-item {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 400;
}

.breadcrumb-item.current {
  color: var(--text-primary);
  font-weight: 600;
}

.breadcrumb-sep {
  color: var(--sand-dark);
  font-size: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cream);
  border: 1.5px solid var(--sand);
  border-radius: 22px;
  padding: 7px 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.header-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(201, 125, 78, 0.12);
}

.header-search svg {
  width: 15px;
  height: 15px;
  stroke: var(--text-muted);
  fill: none;
  stroke-width: 2;
  flex-shrink: 0;
}

.header-search input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--text-primary);
  width: 160px;
}

.header-search input::placeholder {
  color: var(--text-muted);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background var(--transition), color var(--transition);
  position: relative;
}

.icon-btn:hover {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.icon-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: var(--accent);
  border-radius: 50%;
  border: 1.5px solid var(--warm-white);
}

.header-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  margin-left: 4px;
  border: 2px solid var(--accent-light);
}

/* ── Content ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 36px;
}

.page-header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.page-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ── Card ── */
.card {
  background: var(--warm-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--sand);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 20px;
  transition: box-shadow var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

/* ── Filter Bar ── */
.filter-bar {
  padding: 20px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-control,
select,
input {
  padding: 9px 14px;
  border: 1.5px solid var(--sand);
  border-radius: var(--radius-sm);
  background: var(--cream);
  font-size: 13.5px;
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
}

select:focus,
input:focus {
  border-color: var(--accent);
  background: var(--warm-white);
  box-shadow: 0 0 0 3px rgba(201, 125, 78, 0.1);
}

/* ── Table ── */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

.data-table th {
  background: var(--cream-dark);
  color: var(--text-secondary);
  font-weight: 600;
  padding: 13px 18px;
  border-bottom: 1px solid var(--sand);
  white-space: nowrap;
}

.data-table td {
  padding: 15px 18px;
  border-bottom: 1px solid var(--cream-dark);
  color: var(--text-primary);
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background var(--transition);
  cursor: pointer;
}

.data-table tbody tr:hover {
  background: rgba(242, 236, 224, 0.4);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* ── Status Badges ── */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag.published {
  background: #e6f4ea;
  color: #1e7e34;
}

.status-tag.draft {
  background: #fef3d6;
  color: #b7791f;
}

.status-tag.archived {
  background: #f1f3f5;
  color: #707e94;
}

/* ── Tag Badges ── */
.sermon-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--cream);
  border: 1px solid var(--sand-dark);
  border-radius: 4px;
  font-size: 12px;
  color: var(--brown-dark);
  font-weight: 500;
  margin-right: 4px;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all var(--transition);
  text-decoration: none;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(201, 125, 78, 0.25);
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-secondary {
  background: var(--warm-white);
  color: var(--text-secondary);
  border-color: var(--sand);
}

.btn-secondary:hover {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid var(--sand);
  background: var(--warm-white);
  color: var(--text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-only:hover {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.btn-icon-only svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

/* ── Pagination ── */
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

.page-btn:hover {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.page-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  font-weight: 600;
}

.page-btn svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

/* ── Overlay & Mobile ── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(45, 33, 24, 0.45);
  z-index: 90;
  backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-group {
    width: 100%;
  }
  .filter-group input,
  .filter-group select {
    flex: 1;
  }
  .page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

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
  .overlay.active {
    display: block;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .content {
    padding: 20px 18px;
  }
  .header {
    padding: 0 16px;
  }
  .header-search {
    display: none;
  }
}
</style>