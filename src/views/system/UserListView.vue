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

<style scoped>
.page-header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}
.page-title { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.page-desc { font-size: 13.5px; color: var(--text-muted); margin-top: 4px; }
.card {
  background: var(--warm-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--sand);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 20px;
}
.filter-bar { padding: 20px 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.filter-group { display: flex; align-items: center; gap: 8px; }
input, select {
  padding: 9px 14px;
  border: 1.5px solid var(--sand);
  border-radius: var(--radius-sm);
  background: var(--cream);
  font-size: 13.5px;
  color: var(--text-primary);
  outline: none;
}
input:focus, select:focus { border-color: var(--accent); }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
.data-table th { background: var(--cream-dark); color: var(--text-secondary); font-weight: 600; padding: 13px 18px; border-bottom: 1px solid var(--sand); white-space: nowrap; }
.data-table td { padding: 15px 18px; border-bottom: 1px solid var(--cream-dark); color: var(--text-primary); vertical-align: middle; }
.data-table tbody tr { transition: background var(--transition); cursor: pointer; }
.data-table tbody tr:hover { background: rgba(242,236,224,0.4); }
.data-table tbody tr:last-child td { border-bottom: none; }
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600;
  cursor: pointer; border: 1.5px solid transparent; transition: all var(--transition);
}
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary { background: var(--warm-white); color: var(--text-secondary); border-color: var(--sand); }
.btn-secondary:hover { background: var(--cream-dark); }
.btn-icon-only {
  width: 32px; height: 32px; padding: 0; border-radius: 6px;
  border: 1px solid var(--sand); background: var(--warm-white); color: var(--text-secondary);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.btn-icon-only:hover { background: var(--cream-dark); }
.btn-icon-only svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; }
@media (max-width: 768px) { .filter-bar { flex-direction: column; align-items: stretch; } .page-header-row { flex-direction: column; align-items: flex-start; } }
</style>