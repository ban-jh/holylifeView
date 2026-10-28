<template>
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
      <div class="filter-group" style="flex: 1">
        <input type="text" v-model="searchText" placeholder="제목 또는 설교자 검색..." style="width: 100%" />
      </div>
      <div class="filter-group">
        <button class="btn btn-secondary" @click="fetchSermons">
          <svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          검색
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
            <th style="width: 150px">본문</th>
            <th style="width: 120px">설교자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sermon, index) in sermons" :key="sermon.sermonId" @click="goToDetail(sermon.sermonId)" style="cursor: pointer;">
            <td style="text-align: center; color: var(--text-muted)">{{ index + 1 }}</td>
            <td>{{ sermon.sermonDate }}</td>
            <td><strong style="color: var(--text-primary)">{{ sermon.title }}</strong></td>
            <td>{{ sermon.bibleRef || '-' }}</td>
            <td>{{ sermon.preacher }}</td>
          </tr>
          <tr v-if="sermons.length === 0">
            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px">
              {{ loading ? '불러오는 중...' : '등록된 설교가 없습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-items="sermons.length"
      :items-per-page="itemsPerPage"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/sermon-list.css'
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { sermonApi } from '@/api'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

interface Sermon {
  sermonId: number
  title: string
  sermonDate: string
  preacher: string
  bibleRef: string
  content: string
}

const sermons = ref<Sermon[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchText = ref('')

async function fetchSermons() {
  loading.value = true
  try {
    const res = await sermonApi.getAll()
    sermons.value = res.data || []
  } catch (e) {
    console.error('설교 목록 조회 실패:', e)
    sermons.value = []
  } finally {
    loading.value = false
  }
}

function goToDetail(id: number) {
  router.push(`/sermons/${id}`)
}

function onPageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  fetchSermons()
})
</script>