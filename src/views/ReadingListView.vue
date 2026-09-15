<template>
  <div class="layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/><path d="M12 22V12"/><path d="M3 7l9 5 9-5"/></svg></div>
        <div><div class="sidebar-logo-text">말씀 관리자</div><div class="sidebar-logo-sub">Word Admin Console</div></div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">메인 메뉴</div>
        <RouterLink to="/pbs" class="nav-link"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span class="nav-link-label">P.B.S (성경공부)</span></RouterLink>
        <RouterLink to="/qts" class="nav-link"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span class="nav-link-label">Q.T</span></RouterLink>
        <RouterLink to="/sermons" class="nav-link"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="nav-link-label">설교</span></RouterLink>
        <RouterLink to="/readings" class="nav-link active"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span class="nav-link-label">독서</span></RouterLink>
        <div class="nav-section-label">관리</div>
        <div class="nav-item">
          <div class="nav-link" :class="{ 'parent-active': systemOpen }" @click="systemOpen = !systemOpen">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/></svg>
            <span class="nav-link-label">시스템</span><svg class="nav-chevron" :class="{ open: systemOpen }" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="nav-sub" :class="{ open: systemOpen }"><div class="nav-sub-item">사용자</div><div class="nav-sub-item">메뉴</div><div class="nav-sub-item">권한</div><div class="nav-sub-item">공통코드</div></div>
        </div>
      </nav>
      <div class="sidebar-footer"><div class="sidebar-user"><div class="sidebar-user-avatar">박</div><div class="sidebar-user-info"><div class="sidebar-user-name">박성민 관리자</div><div class="sidebar-user-role">Super Admin</div></div></div></div>
    </aside>
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <div class="main">
      <header class="header">
        <button class="mobile-menu-btn" @click="sidebarOpen = true"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <div class="breadcrumb"><span class="breadcrumb-item">독서</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-item current">독서 노트 목록</span></div>
        <div class="header-actions">
          <div class="header-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="검색어를 입력하세요" /></div>
          <button class="icon-btn" title="알림"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="badge"></span></button>
          <div class="header-avatar">박</div>
        </div>
      </header>

      <div class="content">
        <div class="page-header-row">
          <div><div class="page-title">독서 노트 목록</div><div class="page-desc">읽은 책에 대한 독서 노트를 관리합니다.</div></div>
          <RouterLink to="/readings/new" class="btn btn-primary">
            <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            새 독서 노트 작성
          </RouterLink>
        </div>

        <div class="card">
          <div class="filter-bar">
            <div class="filter-group">
              <select v-model="filterYear" style="min-width: 110px"><option value="">전체 연도</option><option value="2026">2026년</option><option value="2025">2025년</option></select>
            </div>
            <div class="filter-group" style="flex: 1"><input type="text" v-model="searchText" placeholder="책 제목, 저자 검색..." style="width: 100%" /></div>
            <div class="filter-group">
              <button class="btn btn-secondary" @click="fetchReadings"><svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>검색</button>
              <button class="btn btn-secondary" style="padding: 9px 12px" title="초기화" @click="resetFilter"><svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 50px; text-align: center">No.</th>
                  <th style="width: 70px; text-align: center">표지</th>
                  <th style="width: 110px">날짜</th>
                  <th>책제목</th>
                  <th style="width: 120px">저자</th>
                  <th style="width: 120px">옮긴이</th>
                  <th style="width: 70px; text-align: center">관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reading in readings" :key="reading.id" @click="goToDetail(reading.id)">
                  <td style="text-align: center; color: var(--text-muted)">{{ reading.no }}</td>
                  <td style="text-align: center">
                    <img v-if="reading.coverUrl" :src="reading.coverUrl" class="book-cover" alt="표지" />
                    <div v-else class="book-cover-placeholder"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
                  </td>
                  <td>{{ reading.date }}</td>
                  <td><strong style="color: var(--text-primary)">{{ reading.bookTitle }}</strong></td>
                  <td style="color: var(--text-secondary)">{{ reading.author }}</td>
                  <td style="color: var(--text-secondary)">{{ reading.translator }}</td>
                  <td style="text-align: center"><button class="btn-icon-only" title="수정" @click.stop="goToDetail(reading.id)"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button></td>
                </tr>
                <tr v-if="readings.length === 0"><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px">{{ loading ? '불러오는 중...' : '등록된 독서 노트가 없습니다.' }}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="pagination-container">
            <div class="pagination-info">전체 <strong>{{ readings.length }}</strong> 개 항목 중 1 - {{ readings.length }} 표시</div>
            <div class="pagination">
              <button class="page-btn" disabled><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
              <button class="page-btn active">1</button>
              <button class="page-btn"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
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
import { readingApi } from '@/api'

const router = useRouter()

interface Reading {
  id: number; no: number; date: string; bookTitle: string; author: string; translator: string; coverUrl?: string
}

const readings = ref<Reading[]>([])
const loading = ref(false)
const sidebarOpen = ref(false)
const systemOpen = ref(false)
const filterYear = ref('')
const searchText = ref('')

async function fetchReadings() {
  loading.value = true
  try { const res = await readingApi.getAll(); readings.value = res.data } catch (e) { console.error('독서 노트 목록 조회 실패:', e); readings.value = [] } finally { loading.value = false }
}

function resetFilter() { filterYear.value = ''; searchText.value = ''; fetchReadings() }
function goToDetail(id: number) { router.push(`/readings/${id}`) }

onMounted(() => { fetchReadings() })
</script>

<style scoped>
@import './_shared-layout.css';
</style>