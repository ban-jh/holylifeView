<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">사용자 관리</div>
        <div class="page-desc">등록된 사용자 목록을 관리합니다.</div>
      </div>
      <button class="btn btn-primary" @click="showToast('사용자 등록 화면으로 이동합니다.')">
        <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 사용자 등록
      </button>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="filter-group">
          <select v-model="filterStatus" style="min-width: 120px;">
            <option value="">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
            <option value="PENDING">대기</option>
          </select>
          <select v-model="filterRole" style="min-width: 120px;">
            <option value="">전체 권한</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
        <div class="filter-group" style="flex: 1;">
          <input type="text" v-model="searchKeyword" placeholder="이름, 이메일 검색..." style="width: 100%;" />
        </div>
        <div class="filter-group">
          <button class="btn btn-secondary" @click="fetchUsers">검색</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">No.</th>
              <th>이름</th>
              <th>이메일</th>
              <th>닉네임</th>
              <th>전화번호</th>
              <th style="width: 100px;">권한</th>
              <th style="width: 90px; text-align: center;">상태</th>
              <th style="width: 100px;">최근 접속</th>
              <th style="width: 70px; text-align: center;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">등록된 사용자가 없습니다.</td>
            </tr>
            <tr v-for="(user, index) in users" :key="user.userId" @click="showToast('사용자 상세 화면으로 이동합니다.')">
              <td style="text-align: center; color: var(--text-muted);">{{ index + 1 }}</td>
              <td><strong style="color: var(--text-primary);">{{ user.name }}</strong></td>
              <td>{{ user.email }}</td>
              <td>{{ user.nickname }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.roleGroup }}</td>
              <td style="text-align: center;">
                <StatusBadge :status="user.accountStatus === 'ACTIVE' ? 'published' : 'draft'" :label="user.accountStatus" />
              </td>
              <td>{{ user.lastLogin || '-' }}</td>
              <td style="text-align: center;">
                <button class="btn-icon-only" title="수정" @click.stop="showToast('수정 페이지로 이동합니다.')">
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :current-page="currentPage"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @page-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/user-list.css'
import { ref, onMounted } from 'vue'
import { userApi } from '@/api'
import { useToast } from '@/composables/useToast'
import StatusBadge from '@/components/StatusBadge.vue'
import Pagination from '@/components/Pagination.vue'

const { showToast } = useToast()

const users = ref<any[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)

async function fetchUsers() {
  loading.value = true
  try {
    const res = await userApi.getAll()
    users.value = res.data
    totalItems.value = res.data.length
  } catch (e) {
    showToast('사용자 목록을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

function onPageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  fetchUsers()
})
</script>
