<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">공통코드 관리</div>
        <div class="page-desc">그룹 코드와 상세 코드를 관리합니다.</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary" @click="activeTab = 'group'; showToast('그룹 코드 탭')">그룹 코드</button>
        <button class="btn btn-primary" @click="activeTab = 'common'; showToast('공통 코드 탭')">공통 코드</button>
      </div>
    </div>

    <!-- 그룹 코드 -->
    <div v-if="activeTab === 'group'">
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">No.</th>
                <th>그룹 코드</th>
                <th>그룹명</th>
                <th>수정일</th>
                <th style="width: 70px; text-align: center;">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
              </tr>
              <tr v-for="(item, index) in groupCodes" :key="item.groupCode">
                <td style="text-align: center; color: var(--text-muted);">{{ index + 1 }}</td>
                <td><strong style="color: var(--text-primary);">{{ item.groupCode }}</strong></td>
                <td>{{ item.groupName }}</td>
                <td>{{ item.modifiedDate }}</td>
                <td style="text-align: center;">
                  <button class="btn-icon-only" title="수정"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 공통 코드 -->
    <div v-if="activeTab === 'common'">
      <div class="card">
        <div class="filter-bar">
          <div class="filter-group">
            <select v-model="filterGroup" style="min-width: 180px;">
              <option value="">전체 그룹</option>
              <option v-for="g in groupCodes" :key="g.groupCode" :value="g.groupCode">{{ g.groupName }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">No.</th>
                <th>그룹</th>
                <th>코드</th>
                <th>코드명</th>
                <th style="width: 60px; text-align: center;">순서</th>
                <th style="width: 60px; text-align: center;">사용</th>
                <th style="width: 70px; text-align: center;">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
              </tr>
              <tr v-for="(item, index) in filteredCommonCodes" :key="item.codeId">
                <td style="text-align: center; color: var(--text-muted);">{{ index + 1 }}</td>
                <td>{{ item.groupCode }}</td>
                <td><strong style="color: var(--text-primary);">{{ item.code }}</strong></td>
                <td>{{ item.codeName }}</td>
                <td style="text-align: center;">{{ item.sortOrder }}</td>
                <td style="text-align: center;">{{ item.useYn ? 'O' : 'X' }}</td>
                <td style="text-align: center;">
                  <button class="btn-icon-only" title="수정"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const activeTab = ref<'group' | 'common'>('group')
const loading = ref(false)
const groupCodes = ref<any[]>([])
const commonCodes = ref<any[]>([])
const filterGroup = ref('')

const filteredCommonCodes = computed(() => {
  if (!filterGroup.value) return commonCodes.value
  return commonCodes.value.filter(c => c.groupCode === filterGroup.value)
})

async function fetchGroupCodes() {
  loading.value = true
  try {
    const res = await fetch('/api/group-codes')
    groupCodes.value = await res.json()
  } catch (e) {
    showToast('그룹 코드를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

async function fetchCommonCodes() {
  try {
    const res = await fetch('/api/common-codes')
    commonCodes.value = await res.json()
  } catch (e) {
    showToast('공통 코드를 불러오지 못했습니다.')
  }
}

onMounted(() => {
  fetchGroupCodes()
  fetchCommonCodes()
})
</script>

<style scoped>
.page-header-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
.page-title { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.page-desc { font-size: 13.5px; color: var(--text-muted); margin-top: 4px; }
.card { background: var(--warm-white); border-radius: var(--radius-lg); border: 1px solid var(--sand); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
.filter-bar { padding: 20px 24px; display: flex; align-items: center; gap: 12px; }
.filter-group { display: flex; align-items: center; gap: 8px; }
select { padding: 9px 14px; border: 1.5px solid var(--sand); border-radius: var(--radius-sm); background: var(--cream); font-size: 13.5px; color: var(--text-primary); outline: none; }
select:focus { border-color: var(--accent); }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
.data-table th { background: var(--cream-dark); color: var(--text-secondary); font-weight: 600; padding: 13px 18px; border-bottom: 1px solid var(--sand); white-space: nowrap; }
.data-table td { padding: 15px 18px; border-bottom: 1px solid var(--cream-dark); color: var(--text-primary); vertical-align: middle; }
.data-table tbody tr:hover { background: rgba(242,236,224,0.4); }
.data-table tbody tr:last-child td { border-bottom: none; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; transition: all var(--transition); }
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary { background: var(--warm-white); color: var(--text-secondary); border-color: var(--sand); }
.btn-secondary:hover { background: var(--cream-dark); }
.btn-icon-only { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid var(--sand); background: var(--warm-white); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-icon-only:hover { background: var(--cream-dark); }
.btn-icon-only svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; }
@media (max-width: 768px) { .page-header-row { flex-direction: column; align-items: flex-start; } }
</style>