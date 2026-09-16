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
import '@/assets/css/permission-list.css'
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
