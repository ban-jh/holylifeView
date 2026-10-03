<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">사용자 관리</div>
        <div class="page-desc">등록된 사용자 목록을 관리합니다.</div>
      </div>
      <button class="btn btn-primary" @click="openCreatePopup">
        <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 사용자 등록
      </button>
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="filter-group">
          <select v-model="filterStatus" style="min-width: 120px;">
            <option value="">전체 상태</option>
            <option v-for="code in statusCodes" :key="code.code" :value="code.code">{{ code.codeName }}</option>
          </select>
          <select v-model="filterRole" style="min-width: 120px;">
            <option value="">전체 권한</option>
            <option v-for="code in roleCodes" :key="code.code" :value="code.code">{{ code.codeName }}</option>
          </select>
        </div>
        <div class="filter-group filter-search-group" style="flex: 1;">
          <input type="text" v-model="searchKeyword" placeholder="이름, 이메일 검색..." style="width: 100%;" />
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
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">등록된 사용자가 없습니다.</td>
            </tr>
            <tr
              v-for="(user, index) in users"
              :key="user.userId"
              class="user-row"
              @click="openDetailPopup(user)"
            >
              <td style="text-align: center; color: var(--text-muted);">{{ index + 1 }}</td>
              <td><strong style="color: var(--text-primary);">{{ user.name }}</strong></td>
              <td>{{ user.email }}</td>
              <td>{{ user.nickname }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ getRoleName(user.roleGroup) }}</td>
              <td style="text-align: center;">
                <StatusBadge :status="user.accountStatus === 'A' ? 'published' : 'draft'" :label="getStatusName(user.accountStatus)" />
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

    <!-- 사용자 상세/등록 팝업 -->
    <div class="layer-overlay" :class="{ open: showUserPopup }" @click.self="closeUserPopup">
      <div class="layer-popup user-popup">
        <div class="popup-head">
          <div>
            <div class="popup-title">{{ popupMode === 'create' ? '사용자 등록' : '사용자 상세' }}</div>
            <div class="popup-desc">{{ popupMode === 'create' ? '새로운 사용자를 등록합니다.' : '사용자 정보를 조회하고 수정합니다.' }}</div>
          </div>
          <button class="popup-close" @click="closeUserPopup">×</button>
        </div>
        <div class="popup-body">
          <div class="popup-field">
            <label>이름 <span>*</span></label>
            <input v-model="userForm.name" type="text" placeholder="이름을 입력하세요." :readonly="popupMode === 'detail' && !editMode">
          </div>
          <div class="popup-field">
            <label>이메일 <span>*</span></label>
            <input v-model="userForm.email" type="text" placeholder="이메일을 입력하세요." :readonly="popupMode === 'detail' && !editMode">
          </div>
          <div class="popup-field">
            <label>비밀번호 <span v-if="popupMode === 'create'">*</span></label>
            <input
              v-model="userForm.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="popupMode === 'create' ? '비밀번호를 입력하세요.' : '변경할 비밀번호를 입력하세요. (미입력 시 유지)'"
              :readonly="popupMode === 'detail' && !editMode"
            />
          </div>
          <div class="popup-field" v-if="popupMode === 'create' || (popupMode === 'detail' && editMode)">
            <label>비밀번호 확인 <span v-if="popupMode === 'create'">*</span></label>
            <input
              v-model="userForm.passwordCheck"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력하세요."
              :readonly="popupMode === 'detail' && !editMode"
            />
            <span v-if="userForm.password && userForm.passwordCheck && userForm.password !== userForm.passwordCheck" class="pw-mismatch">비밀번호가 일치하지 않습니다.</span>
          </div>
          <div class="popup-field">
            <label>닉네임 <span>*</span></label>
            <input v-model="userForm.nickname" type="text" placeholder="닉네임을 입력하세요." :readonly="popupMode === 'detail' && !editMode">
          </div>
          <div class="popup-field">
            <label>전화번호</label>
            <input v-model="userForm.phone" type="text" placeholder="전화번호를 입력하세요." :readonly="popupMode === 'detail' && !editMode">
          </div>
          <div class="popup-field">
            <label>권한 그룹 <span>*</span></label>
            <select v-model="userForm.roleGroup" :disabled="popupMode === 'detail' && !editMode">
              <option value="" disabled>선택하세요</option>
              <option v-for="code in roleCodes" :key="code.code" :value="code.code">{{ code.codeName }}</option>
            </select>
          </div>
          <div class="popup-field">
            <label>계정 상태</label>
            <select v-model="userForm.accountStatus" :disabled="popupMode === 'detail' && !editMode">
              <option v-for="code in statusCodes" :key="code.code" :value="code.code">{{ code.codeName }}</option>
            </select>
          </div>
        </div>
        <div class="popup-footer">
          <button v-if="popupMode === 'detail'" class="warm-btn secondary" @click="deleteUser" style="margin-right: auto;">삭제</button>
          <button class="warm-btn secondary" @click="closeUserPopup">취소</button>
          <button v-if="popupMode === 'detail'" class="warm-btn primary" @click="toggleEditMode">{{ editMode ? '저장' : '수정' }}</button>
          <button v-if="popupMode === 'create'" class="warm-btn primary" @click="createUser">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/user-list.css'
import '@/assets/css/menu-list.css'
import { ref, reactive, onMounted } from 'vue'
import { userApi, commonCodeApi } from '@/api'
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

// 공통코드 (권한 그룹, 계정 상태)
const roleCodes = ref<any[]>([])
const statusCodes = ref<any[]>([])

function getRoleName(code: string): string {
  const found = roleCodes.value.find((c) => c.code === code)
  return found ? found.codeName : code || '-'
}

function getStatusName(code: string): string {
  const found = statusCodes.value.find((c) => c.code === code)
  return found ? found.codeName : code || '-'
}

// 팝업 상태
const showUserPopup = ref(false)
const popupMode = ref<'create' | 'detail'>('create')
const editMode = ref(false)
const selectedUser = ref<any>(null)

const userForm = reactive({
  name: '',
  email: '',
  nickname: '',
  phone: '',
  roleGroup: '',
  accountStatus: '',
  password: '',
  passwordCheck: '',
})
const showPassword = ref(false)

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

// ── 팝업 ──
function openDetailPopup(user: any) {
  selectedUser.value = user
  popupMode.value = 'detail'
  editMode.value = false
  userForm.name = user.name || ''
  userForm.email = user.email || ''
  userForm.nickname = user.nickname || ''
  userForm.phone = user.phone || ''
  userForm.roleGroup = user.roleGroup || (roleCodes.value.length > 0 ? roleCodes.value[0].code : '')
  userForm.accountStatus = user.accountStatus || (statusCodes.value.length > 0 ? statusCodes.value[0].code : '')
  userForm.password = ''
  userForm.passwordCheck = ''
  showUserPopup.value = true
}

function openCreatePopup() {
  popupMode.value = 'create'
  editMode.value = false
  selectedUser.value = null
  userForm.name = ''
  userForm.email = ''
  userForm.nickname = ''
  userForm.phone = ''
  userForm.roleGroup = ''
  userForm.accountStatus = 'A'
  userForm.password = ''
  userForm.passwordCheck = ''
  showUserPopup.value = true
}

function closeUserPopup() {
  showUserPopup.value = false
  editMode.value = false
}

function toggleEditMode() {
  if (editMode.value) {
    // 저장
    saveUser()
  } else {
    // 수정 모드 진입
    editMode.value = true
  }
}

async function saveUser() {
  if (!selectedUser.value) return
  if (!userForm.name || !userForm.email) {
    showToast('이름과 이메일을 입력해주세요.')
    return
  }
  // 비밀번호 입력 시 확인 필드 일치 검증
  if (userForm.password) {
    if (userForm.password !== userForm.passwordCheck) {
      showToast('비밀번호가 일치하지 않습니다.')
      return
    }
    if (userForm.password.length < 8) {
      showToast('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
  }
  try {
    const payload: any = {
      name: userForm.name,
      email: userForm.email,
      nickname: userForm.nickname,
      phone: userForm.phone,
      roleGroup: userForm.roleGroup,
      accountStatus: userForm.accountStatus,
    }
    // 비밀번호 입력한 경우에만 payload에 포함
    if (userForm.password) {
      payload.password = userForm.password
    }
    await userApi.update(selectedUser.value.userId, payload)
    showToast('사용자 정보가 저장되었습니다.')
    editMode.value = false
    await fetchUsers()
  } catch (e: any) {
    showToast(e.response?.data?.message || '저장에 실패했습니다.')
  }
}

async function createUser() {
  if (!userForm.name || !userForm.email || !userForm.password || !userForm.nickname || !userForm.roleGroup) {
    showToast('이름, 이메일, 비밀번호, 닉네임, 권한 그룹을 입력해주세요.')
    return
  }
  if (userForm.password !== userForm.passwordCheck) {
    showToast('비밀번호가 일치하지 않습니다.')
    return
  }
  if (userForm.password.length < 8) {
    showToast('비밀번호는 최소 8자 이상이어야 합니다.')
    return
  }
  try {
    const payload = {
      name: userForm.name,
      email: userForm.email,
      nickname: userForm.nickname,
      phone: userForm.phone,
      roleGroup: userForm.roleGroup,
      accountStatus: userForm.accountStatus,
      password: userForm.password,
    }
    await userApi.create(payload)
    showToast('사용자가 등록되었습니다.')
    closeUserPopup()
    await fetchUsers()
  } catch (e: any) {
    showToast(e.response?.data?.message || '등록에 실패했습니다.')
  }
}

async function deleteUser() {
  if (!selectedUser.value) return
  if (!confirm(`"${selectedUser.value.name}" 사용자를 삭제하시겠습니까?`)) return
  try {
    await userApi.delete(selectedUser.value.userId)
    showToast('사용자가 삭제되었습니다.')
    closeUserPopup()
    await fetchUsers()
  } catch (e: any) {
    showToast(e.response?.data?.message || '삭제에 실패했습니다.')
  }
}

onMounted(async () => {
  // 공통코드 먼저 로드
  try {
    const [roleRes, statusRes] = await Promise.all([
      commonCodeApi.getAll('user_role'),
      commonCodeApi.getAll('user_status'),
    ])
    roleCodes.value = roleRes.data || []
    statusCodes.value = statusRes.data || []
  } catch (e) {
    console.error('공통코드 로드 실패', e)
  }
  // 사용자 목록 로드
  fetchUsers()
})
</script>