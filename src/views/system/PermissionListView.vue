<template>
  <div>
    <div class="page-header">
      <div class="page-title">권한별 메뉴 관리</div>
      <div class="page-desc">권한 그룹을 선택하고 해당 그룹에서 사용할 수 있는 메뉴를 설정합니다.</div>
    </div>

    <div class="permission-card">
      <div class="permission-head">
        <div>
          <div class="section-title">권한별 메뉴 설정</div>
          <div class="section-desc">왼쪽 권한 그룹을 선택한 후 오른쪽 메뉴에서 접근 권한을 선택하세요.</div>
        </div>
        <div class="head-actions">
          <button class="warm-btn secondary" @click="checkAll">전체 선택</button>
          <button class="warm-btn secondary" @click="uncheckAll">전체 해제</button>
        </div>
      </div>

      <div class="permission-split">
        <!-- LEFT: 권한 그룹 패널 -->
        <aside class="permission-group-panel">
          <div class="panel-title-row">
            <div>
              <div class="section-title">권한 그룹</div>
              <div class="section-desc">메뉴 권한을 설정할 그룹을 선택합니다.</div>
            </div>
            <span class="count-badge">{{ roles.length }}</span>
          </div>

          <div class="group-search">
            <input v-model="groupSearch" type="text" placeholder="권한 그룹 검색">
          </div>

          <div class="group-list">
            <div
              v-for="role in filteredRoles"
              :key="role.roleId"
              class="permission-group"
              :class="{ selected: selectedRoleId === role.roleId }"
              @click="selectRole(role)"
            >
              <div class="group-icon">{{ role.groupName.charAt(0) }}</div>
              <div class="group-info">
                <strong>{{ role.groupName }}</strong>
                <span>{{ role.groupDesc || role.groupCode }}</span>
              </div>
            </div>
            <div v-if="filteredRoles.length === 0" class="group-empty">검색 결과가 없습니다.</div>
          </div>
        </aside>

        <!-- RIGHT: 메뉴 권한 패널 -->
        <section class="permission-menu-panel">
          <div v-if="!selectedRoleId" class="no-selection">
            왼쪽에서 권한 그룹을 선택해주세요.
          </div>
          <template v-else>
            <div class="selected-group-head">
              <div>
                <div class="selected-group-name">{{ selectedRoleName }}</div>
                <div class="selected-group-desc">메뉴 접근 권한을 설정합니다.</div>
              </div>
              <div class="permission-summary">
                선택 메뉴 <strong>{{ checkedCount }}</strong> / {{ totalCount }}
              </div>
            </div>

            <div class="menu-search-row">
              <div class="menu-search">
                <input v-model="menuSearch" type="text" placeholder="메뉴명 검색">
              </div>
              <label class="only-checked">
                <input type="checkbox" v-model="onlyChecked">
                선택된 메뉴만 보기
              </label>
            </div>

            <div class="permission-table-wrap">
              <table class="permission-table">
                <thead>
                  <tr>
                    <th class="check-col">
                      <input type="checkbox" :checked="allVisibleChecked" @change="toggleVisibleMenus($event)">
                    </th>
                    <th>메뉴</th>
                    <th>메뉴 코드</th>
                    <th>URL</th>
                    <th>Depth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="5" class="perm-empty">로딩 중...</td>
                  </tr>
                  <tr v-else-if="flatMenuList.length === 0">
                    <td colspan="5" class="perm-empty">표시할 메뉴가 없습니다.</td>
                  </tr>
                  <tr
                    v-for="item in flatMenuList"
                    :key="item.menuId"
                    :class="{ 'depth-1': item.depth === 1, 'depth-2': item.depth === 2, 'hidden-menu': !item._visible }"
                  >
                    <td class="check-col">
                      <input type="checkbox" v-model="item.checked">
                    </td>
                    <td>{{ item.menuName }}</td>
                    <td>{{ item.menuCode }}</td>
                    <td>{{ item.menuUrl }}</td>
                    <td><span class="menu-depth-badge" :class="{ d2: item.depth === 2 }">{{ item.depth }}D</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="permission-guide">
              <span class="guide-icon">i</span>
              <span>1Depth 메뉴를 선택하면 해당 메뉴의 하위 2Depth 메뉴도 함께 표시됩니다.</span>
            </div>

            <div class="permission-actions">
              <button class="warm-btn secondary" @click="resetPermissions">취소</button>
              <button class="warm-btn primary" @click="savePermissions">저장</button>
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/permission-list.css'
import { ref, computed, onMounted } from 'vue'
import { permissionApi, roleApi } from '@/api'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

interface MenuPerm {
  menuId: number
  parentId: number | null
  menuName: string
  menuCode: string
  menuUrl: string
  depth: number
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  checked: boolean
  children: MenuPerm[]
  _visible?: boolean
}

const roles = ref<any[]>([])
const selectedRoleId = ref<number | null>(null)
const selectedRoleName = ref('')
const menuTree = ref<MenuPerm[]>([])
const loading = ref(false)
const groupSearch = ref('')
const menuSearch = ref('')
const onlyChecked = ref(false)

const filteredRoles = computed(() => {
  const q = groupSearch.value.toLowerCase().trim()
  if (!q) return roles.value
  return roles.value.filter((r) =>
    r.groupName.toLowerCase().includes(q) || r.groupCode.toLowerCase().includes(q)
  )
})

// 트리를 평면화 + 검색 필터 적용
const flatMenuList = computed(() => {
  const result: MenuPerm[] = []
  function flatten(items: MenuPerm[]) {
    for (const item of items) {
      const matchSearch = !menuSearch.value ||
        item.menuName.toLowerCase().includes(menuSearch.value.toLowerCase()) ||
        item.menuCode.toLowerCase().includes(menuSearch.value.toLowerCase())
      const matchChecked = !onlyChecked.value || item.checked
      item._visible = matchSearch && matchChecked
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    }
  }
  flatten(menuTree.value)
  return result
})

const checkedCount = computed(() => {
  let count = 0
  function countChecked(items: MenuPerm[]) {
    for (const item of items) {
      if (item.checked) count++
      if (item.children) countChecked(item.children)
    }
  }
  countChecked(menuTree.value)
  return count
})

const totalCount = computed(() => {
  let count = 0
  function countAll(items: MenuPerm[]) {
    for (const item of items) {
      count++
      if (item.children) countAll(item.children)
    }
  }
  countAll(menuTree.value)
  return count
})

const allVisibleChecked = computed(() => {
  const visible = flatMenuList.value.filter((m) => m._visible)
  return visible.length > 0 && visible.every((m) => m.checked)
})

function selectRole(role: any) {
  selectedRoleId.value = role.roleId
  selectedRoleName.value = role.groupName
  fetchPermissions(role.roleId)
}

async function fetchPermissions(roleId: number) {
  loading.value = true
  try {
    const res = await permissionApi.getByRole(roleId)
    menuTree.value = res.data || []
  } catch (e: any) {
    showToast('권한 정보를 불러오지 못했습니다.')
    menuTree.value = []
  } finally {
    loading.value = false
  }
}

function checkAll() {
  function check(items: MenuPerm[]) {
    for (const item of items) {
      item.checked = true
      if (item.children) check(item.children)
    }
  }
  check(menuTree.value)
}

function uncheckAll() {
  function uncheck(items: MenuPerm[]) {
    for (const item of items) {
      item.checked = false
      if (item.children) uncheck(item.children)
    }
  }
  uncheck(menuTree.value)
}

function toggleVisibleMenus(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  flatMenuList.value.forEach((item) => {
    if (item._visible) item.checked = checked
  })
}

function resetPermissions() {
  if (selectedRoleId.value) {
    fetchPermissions(selectedRoleId.value)
  }
}

async function savePermissions() {
  if (!selectedRoleId.value) {
    showToast('권한 그룹을 선택해주세요.')
    return
  }
  // 체크된 메뉴만 payload에 포함
  const payload: any[] = []
  function collect(items: MenuPerm[]) {
    for (const item of items) {
      if (item.checked) {
        payload.push({
          menuId: item.menuId,
          canRead: true,
          canWrite: true,
          canDelete: true,
        })
      }
      if (item.children) collect(item.children)
    }
  }
  collect(menuTree.value)
  try {
    await permissionApi.updateByRole(selectedRoleId.value, payload)
    showToast('권한이 저장되었습니다.')
  } catch (e: any) {
    showToast(e.response?.data?.message || '권한 저장에 실패했습니다.')
  }
}

onMounted(async () => {
  try {
    const res = await roleApi.getAll()
    roles.value = (res.data || []).filter((r: any) => r.useYn)
  } catch (e) {
    showToast('권한 그룹을 불러오지 못했습니다.')
  }
})
</script>