<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">메뉴 권한 관리</div>
        <div class="page-desc">권한 그룹별 메뉴 접근 권한을 관리합니다.</div>
      </div>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="filter-group">
          <label style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">권한 그룹</label>
          <select v-model="selectedRoleId" @change="fetchPermissions" style="min-width: 200px;">
            <option value="">권한 그룹 선택</option>
            <option v-for="role in roles" :key="role.roleId" :value="role.roleId">{{ role.groupName }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card" v-if="selectedRoleId">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>메뉴명</th>
              <th>메뉴 코드</th>
              <th style="width: 80px; text-align: center;">조회</th>
              <th style="width: 80px; text-align: center;">작성</th>
              <th style="width: 80px; text-align: center;">삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
            </tr>
            <tr v-for="item in permissionList" :key="item.menuId">
              <td><strong style="color: var(--text-primary);">{{ item.menuName }}</strong></td>
              <td>{{ item.menuCode }}</td>
              <td style="text-align: center;">
                <input type="checkbox" v-model="item.canRead" />
              </td>
              <td style="text-align: center;">
                <input type="checkbox" v-model="item.canWrite" />
              </td>
              <td style="text-align: center;">
                <input type="checkbox" v-model="item.canDelete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="padding: 16px 24px; display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" @click="savePermissions">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const roles = ref<any[]>([])
const selectedRoleId = ref('')
const permissionList = ref<any[]>([])
const loading = ref(false)

async function fetchRoles() {
  try {
    const res = await fetch('/api/roles')
    roles.value = await res.json()
  } catch (e) {
    showToast('권한 그룹을 불러오지 못했습니다.')
  }
}

async function fetchPermissions() {
  if (!selectedRoleId.value) return
  loading.value = true
  try {
    const res = await fetch(`/api/permissions/role/${selectedRoleId.value}/menus`)
    permissionList.value = await res.json()
  } catch (e) {
    showToast('권한 정보를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

async function savePermissions() {
  try {
    await fetch(`/api/permissions/role/${selectedRoleId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permissionList.value),
    })
    showToast('권한이 저장되었습니다.')
  } catch (e) {
    showToast('권한 저장에 실패했습니다.')
  }
}

onMounted(() => {
  fetchRoles()
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
.data-table tbody tr:last-child td { border-bottom: none; }
input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 20px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; transition: all var(--transition); }
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { background: var(--accent-hover); }
</style>