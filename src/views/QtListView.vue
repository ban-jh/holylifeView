<template>
  <div class="page-header-row">
    <div>
      <div class="page-title">QT 목록</div>
      <div class="page-desc">등록된 QT(묵상) 콘텐츠 목록을 관리합니다.</div>
    </div>
    <RouterLink to="/qts/new" class="btn btn-primary">
      <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      새 QT 작성
    </RouterLink>
  </div>

  <div class="card">
    <div class="filter-bar">
      <div class="filter-group">
        <select v-model="filterVisibility" style="min-width: 110px">
          <option value="">전체 공개여부</option>
          <option value="public">공개</option>
          <option value="private">비공개</option>
        </select>
      </div>
      <div class="filter-group" style="flex: 1">
        <input type="text" v-model="searchText" placeholder="제목 또는 내용 검색..." style="width: 100%" />
      </div>
      <div class="filter-group">
        <button class="btn btn-secondary" @click="fetchQts">
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
            <th style="width: 110px">날짜</th>
            <th>제목</th>
            <th style="width: 100px; text-align: center">공개여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(qt, index) in qts" :key="qt.qtId" @click="goToDetail(qt.qtId)" style="cursor: pointer;">
            <td style="text-align: center; color: var(--text-muted)">{{ index + 1 }}</td>
            <td>{{ qt.qtDate }}</td>
            <td><strong style="color: var(--text-primary)">{{ qt.title }}</strong></td>
            <td style="text-align: center">
              <span class="visibility-badge" :class="(qt.visibility || 'PUBLIC').toLowerCase()">
                <svg v-if="(qt.visibility || 'PUBLIC').toLowerCase() === 'public'" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {{ (qt.visibility || 'PUBLIC').toLowerCase() === 'public' ? '공개' : '비공개' }}
              </span>
            </td>
          </tr>
          <tr v-if="qts.length === 0">
            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px">
              {{ loading ? '불러오는 중...' : '등록된 QT가 없습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-items="qts.length"
      :items-per-page="itemsPerPage"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/qt-list.css'
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { qtApi } from '@/api'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

interface Qt {
  qtId: number; qtDate: string; title: string; visibility: string
}

const qts = ref<Qt[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filterVisibility = ref('')
const searchText = ref('')

async function fetchQts() {
  loading.value = true
  try {
    const res = await qtApi.getAll()
    qts.value = res.data || []
  } catch (e) {
    console.error('QT 목록 조회 실패:', e)
    qts.value = []
  } finally {
    loading.value = false
  }
}

function resetFilter() {
  filterVisibility.value = ''; searchText.value = ''
  fetchQts()
}

function goToDetail(id: number) {
  router.push(`/qts/${id}`)
}

function onPageChange(page: number) {
  currentPage.value = page
}

onMounted(() => { fetchQts() })
</script>
