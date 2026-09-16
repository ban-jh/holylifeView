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
              <StatusBadge :status="sermon.status" />
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
import StatusBadge from '@/components/StatusBadge.vue'
import Pagination from '@/components/Pagination.vue'

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
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filterTag = ref('')
const filterStatus = ref('')
const searchText = ref('')

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

function onPageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  fetchSermons()
})
</script>
