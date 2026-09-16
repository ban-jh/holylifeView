<template>
  <div class="page-header-row">
    <div>
      <div class="page-title">성경 콘텐츠 목록</div>
      <div class="page-desc">등록된 성경 공부 및 묵상 콘텐츠 목록을 관리합니다.</div>
    </div>
    <RouterLink to="/pbs/new" class="btn btn-primary">
      <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      새 콘텐츠 작성
    </RouterLink>
  </div>

  <div class="card">
    <div class="filter-bar">
      <div class="filter-group">
        <select v-model="filterBook" style="min-width: 120px">
          <option value="">전체 성경</option>
          <option value="창세기">창세기</option>
          <option value="출애굽기">출애굽기</option>
          <option value="마태복음">마태복음</option>
          <option value="요한복음">요한복음</option>
        </select>
        <select v-model="filterStatus" style="min-width: 110px">
          <option value="">전체 상태</option>
          <option value="published">게시됨</option>
          <option value="draft">임시저장</option>
        </select>
      </div>
      <div class="filter-group" style="flex: 1">
        <input type="text" v-model="searchText" placeholder="제목 또는 묵상 내용 검색..." style="width: 100%" />
      </div>
      <div class="filter-group">
        <button class="btn btn-secondary" @click="fetchPbs">
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
            <th style="width: 60px; text-align: center">No.</th>
            <th style="width: 260px">제목</th>
            <th>성경 구절</th>
            <th style="width: 110px">작성자</th>
            <th style="width: 120px">작성일</th>
            <th style="width: 100px; text-align: center">상태</th>
            <th style="width: 90px; text-align: center">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pb in pbs" :key="pb.id" @click="goToDetail(pb.id)">
            <td style="text-align: center; color: var(--text-muted)">{{ pb.no }}</td>
            <td><strong style="color: var(--text-primary)">{{ pb.title }}</strong></td>
            <td><span class="bible-badge">{{ pb.bibleRef }}</span></td>
            <td>{{ pb.author }}</td>
            <td>{{ pb.date }}</td>
            <td style="text-align: center"><StatusBadge :status="pb.status" /></td>
            <td style="text-align: center">
              <button class="btn-icon-only" title="수정" @click.stop="goToDetail(pb.id)">
                <svg viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="pbs.length === 0">
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px">
              {{ loading ? '불러오는 중...' : '등록된 콘텐츠가 없습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="currentPage"
      :total-items="pbs.length"
      :items-per-page="itemsPerPage"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { pbsApi } from '@/api'
import StatusBadge from '@/components/StatusBadge.vue'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()

interface Pb {
  id: number; no: number; title: string; bibleRef: string; author: string; date: string; status: 'published' | 'draft' | 'archived'
}

const pbs = ref<Pb[]>([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filterBook = ref('')
const filterStatus = ref('')
const searchText = ref('')

async function fetchPbs() {
  loading.value = true
  try { const res = await pbsApi.getAll(); pbs.value = res.data } catch (e) { console.error('PBS 목록 조회 실패:', e); pbs.value = [] } finally { loading.value = false }
}

function resetFilter() { filterBook.value = ''; filterStatus.value = ''; searchText.value = ''; fetchPbs() }
function goToDetail(id: number) { router.push(`/pbs/${id}`) }
function onPageChange(page: number) { currentPage.value = page }

onMounted(() => { fetchPbs() })
</script>

<style scoped>
@import './_shared-content.css';
</style>