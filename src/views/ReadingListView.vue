<template>
  <div class="page-header-row">
    <div>
      <div class="page-title">독서 노트 목록</div>
      <div class="page-desc">읽은 책에 대한 독서 노트를 관리합니다.</div>
    </div>
    <RouterLink to="/readings/new" class="btn btn-primary">
      <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      새 독서 노트 작성
    </RouterLink>
  </div>

  <div class="card">
    <div class="filter-bar">
      <div class="filter-group">
        <select v-model="filterYear" style="min-width: 110px">
          <option value="">전체 연도</option>
          <option value="2026">2026년</option>
          <option value="2025">2025년</option>
        </select>
      </div>
      <div class="filter-group" style="flex: 1">
        <input type="text" v-model="searchText" placeholder="책 제목, 저자 검색..." style="width: 100%" />
      </div>
      <div class="filter-group">
        <button class="btn btn-secondary" @click="fetchReadings">
          <svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>검색
        </button>
        <button class="btn btn-secondary" style="padding: 9px 12px" title="초기화" @click="resetFilter">
          <svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
            <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
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
              <div v-else class="book-cover-placeholder">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
            </td>
            <td>{{ reading.date }}</td>
            <td><strong style="color: var(--text-primary)">{{ reading.bookTitle }}</strong></td>
            <td style="color: var(--text-secondary)">{{ reading.author }}</td>
            <td style="color: var(--text-secondary)">{{ reading.translator }}</td>
            <td style="text-align: center">
              <button class="btn-icon-only" title="수정" @click.stop="goToDetail(reading.id)">
                <svg viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="readings.length === 0">
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px">
              {{ loading ? '불러오는 중...' : '등록된 독서 노트가 없습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-items="readings.length"
      :items-per-page="itemsPerPage"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/reading-list.css'
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { readingApi } from '@/api'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

interface Reading {
  id: number; no: number; date: string; bookTitle: string; author: string; translator: string; coverUrl?: string
}

const readings = ref<Reading[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filterYear = ref('')
const searchText = ref('')

async function fetchReadings() {
  loading.value = true
  try { const res = await readingApi.getAll(); readings.value = res.data } catch (e) { console.error('독서 노트 목록 조회 실패:', e); readings.value = [] } finally { loading.value = false }
}

function resetFilter() { filterYear.value = ''; searchText.value = ''; fetchReadings() }
function goToDetail(id: number) { router.push(`/readings/${id}`) }
function onPageChange(page: number) { currentPage.value = page }

onMounted(() => { fetchReadings() })
</script>
