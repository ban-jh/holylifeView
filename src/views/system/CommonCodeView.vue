<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title">공통코드 관리</div>
      <div class="page-desc">그룹 코드를 선택하고 해당 그룹에 속한 공통 코드를 등록하고 관리합니다.</div>
    </div>

    <!-- Code Card -->
    <div class="code-card">
      <div class="code-card-head">
        <div>
          <div class="section-title">공통코드 관리</div>
          <div class="section-desc">왼쪽에서 그룹 코드를 선택하면 오른쪽에 해당 그룹의 코드 목록이 표시됩니다.</div>
        </div>
        <button class="warm-btn primary" @click="openGroupPopup">+ 그룹 코드 등록</button>
      </div>

      <div class="code-split">
        <!-- Left: Group Code Panel -->
        <section class="group-code-panel">
          <div class="panel-title-row">
            <div>
              <div class="section-title">그룹 코드 정보</div>
              <div class="section-desc">등록된 그룹 코드를 관리합니다.</div>
            </div>
            <span class="count-badge">{{ filteredGroupCodes.length }}</span>
          </div>

          <div class="list-toolbar">
            <div class="list-search">
              <input v-model="groupSearch" type="text" placeholder="그룹코드명 / 그룹코드 검색">
            </div>
          </div>

          <div class="code-table-wrap group-table-wrap">
            <table class="code-table group-table">
              <thead>
                <tr>
                  <th>그룹코드명</th>
                  <th>그룹코드</th>
                  <th>등록(최종수정일자)</th>
                  <th class="action-col">관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="4" class="code-empty">로딩 중...</td>
                </tr>
                <tr v-else-if="paginatedGroupCodes.length === 0">
                  <td colspan="4" class="code-empty">등록된 그룹 코드가 없습니다.</td>
                </tr>
                <tr
                  v-for="item in paginatedGroupCodes"
                  :key="item.groupCode"
                  :class="{ selected: selectedGroup?.groupCode === item.groupCode }"
                  @click="selectGroup(item)"
                >
                  <td>{{ item.groupName }}</td>
                  <td>{{ item.groupCode }}</td>
                  <td>{{ item.modifiedDate || '-' }}</td>
                  <td class="action-col">
                    <div class="code-action">
                      <button class="table-action" title="수정" @click.stop="editGroup(item)">수정</button>
                      <button class="table-action delete" title="삭제" @click.stop="deleteGroup(item)">삭제</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination
            v-if="filteredGroupCodes.length > 0"
            :current-page="groupCurrentPage"
            :total-items="filteredGroupCodes.length"
            :items-per-page="10"
            @page-change="groupPageChange"
          />
        </section>

        <!-- Right: Code List Panel -->
        <section class="code-list-panel">
          <div class="selected-group-head">
            <div>
              <div class="selected-group-label">선택 그룹 코드</div>
              <div class="selected-group-name" v-if="selectedGroup">{{ selectedGroup.groupName }} <span class="selected-group-code-inline">{{ selectedGroup.groupCode }}</span></div>
              <div class="selected-group-name" v-else>그룹 코드를 선택해주세요.</div>
            </div>
            <button class="warm-btn primary" :disabled="!selectedGroup" @click="openCodePopup">+ 코드 등록</button>
          </div>

          <div class="code-list-toolbar">
            <div class="list-search">
              <input v-model="codeSearch" type="text" placeholder="코드 / 코드명 검색" :disabled="!selectedGroup">
            </div>
            <div class="code-count">코드 <strong>{{ filteredCommonCodes.length }}</strong>건</div>
          </div>

          <div class="code-table-wrap code-table-scroll">
            <table class="code-table">
              <thead>
                <tr>
                  <th>코드</th>
                  <th>코드명</th>
                  <th>순서</th>
                  <th>사용</th>
                  <th>등록(최종수정일자)</th>
                  <th class="action-col">관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!selectedGroup">
                  <td colspan="6" class="code-empty">왼쪽에서 그룹 코드를 선택해주세요.</td>
                </tr>
                <tr v-else-if="filteredCommonCodes.length === 0">
                  <td colspan="6" class="code-empty">등록된 코드가 없습니다.</td>
                </tr>
                <tr v-for="item in filteredCommonCodes" :key="item.codeId">
                  <td>{{ item.code }}</td>
                  <td>{{ item.codeName }}</td>
                  <td>{{ item.sortOrder }}</td>
                  <td><span class="use-badge" :class="item.useYn ? 'on' : 'off'">{{ item.useYn ? '사용' : '미사용' }}</span></td>
                  <td>{{ item.modifiedDate || '-' }}</td>
                  <td class="action-col">
                    <div class="code-action">
                      <button class="table-action" title="수정" @click="editCode(item)">수정</button>
                      <button class="table-action delete" title="삭제" @click="deleteCode(item)">삭제</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="code-guide">
            <span class="guide-icon">i</span>
            <span>그룹 코드를 선택하면 해당 그룹의 코드 목록과 등록 버튼이 활성화됩니다.</span>
          </div>
        </section>
      </div>
    </div>

    <!-- Group Code Layer Popup -->
    <div class="layer-overlay" :class="{ open: showGroupPopup }" @click.self="closeGroupPopup">
      <div class="layer-popup">
        <div class="popup-head">
          <div>
            <div class="popup-title">{{ editingGroup ? '그룹 코드 수정' : '그룹 코드 등록' }}</div>
            <div class="popup-desc">그룹코드명과 그룹코드를 입력하세요.</div>
          </div>
          <button class="popup-close" @click="closeGroupPopup">×</button>
        </div>
        <div class="popup-body">
          <div class="popup-field">
            <label>그룹코드명 <span>*</span></label>
            <input v-model="groupForm.groupName" type="text" placeholder="그룹코드명을 입력하세요.">
          </div>
          <div class="popup-field">
            <label>그룹코드 <span>*</span></label>
            <input v-model="groupForm.groupCode" type="text" placeholder="그룹코드를 입력하세요." :disabled="!!editingGroup">
          </div>
        </div>
        <div class="popup-footer">
          <button class="warm-btn secondary" @click="closeGroupPopup">취소</button>
          <button class="warm-btn primary" @click="saveGroupPopup">{{ editingGroup ? '수정' : '등록' }}</button>
        </div>
      </div>
    </div>

    <!-- Code Layer Popup -->
    <div class="layer-overlay" :class="{ open: showCodePopup }" @click.self="closeCodePopup">
      <div class="layer-popup">
        <div class="popup-head">
          <div>
            <div class="popup-title">{{ editingCode ? '코드 수정' : '코드 등록' }}</div>
            <div class="popup-desc">선택된 그룹 코드에 코드를 등록합니다.</div>
          </div>
          <button class="popup-close" @click="closeCodePopup">×</button>
        </div>
        <div class="popup-body">
          <div class="popup-selected-group" v-if="selectedGroup">
            <span>그룹코드</span>
            <strong>{{ selectedGroup.groupName }}</strong>
            <em>{{ selectedGroup.groupCode }}</em>
          </div>
          <div class="popup-field">
            <label>코드 <span>*</span></label>
            <input v-model="codeForm.code" type="text" placeholder="코드를 입력하세요." :disabled="!!editingCode">
          </div>
          <div class="popup-field">
            <label>코드명 <span>*</span></label>
            <input v-model="codeForm.codeName" type="text" placeholder="코드명을 입력하세요.">
          </div>
          <div class="popup-field">
            <label>순서</label>
            <input v-model="codeForm.sortOrder" type="number" placeholder="0">
          </div>
          <div class="popup-field">
            <label>사용여부</label>
            <div class="warm-switch-row">
              <label class="warm-switch">
                <input v-model="codeForm.useYn" type="checkbox">
                <span></span>
              </label>
              <b>{{ codeForm.useYn ? '사용' : '미사용' }}</b>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="warm-btn secondary" @click="closeCodePopup">취소</button>
          <button class="warm-btn primary" @click="saveCodePopup">{{ editingCode ? '수정' : '등록' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/common-code.css'
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { groupCodeApi, commonCodeApi } from '@/api'
import Pagination from '@/components/Pagination.vue'

const { showToast } = useToast()

const loading = ref(false)
const groupCodes = ref<any[]>([])
const commonCodes = ref<any[]>([])
const selectedGroup = ref<any>(null)
const groupSearch = ref('')
const codeSearch = ref('')

// Pagination — 그룹코드
const groupCurrentPage = ref(1)
const GROUP_PAGE_SIZE = 10

// Popups
const showGroupPopup = ref(false)
const showCodePopup = ref(false)
const editingGroup = ref<any>(null)
const editingCode = ref<any>(null)

const groupForm = reactive({ groupCode: '', groupName: '' })
const codeForm = reactive({ code: '', codeName: '', sortOrder: 0, useYn: true })

const filteredGroupCodes = computed(() => {
  let list = groupCodes.value
  if (groupSearch.value) {
    const q = groupSearch.value.toLowerCase()
    list = list.filter(g =>
      g.groupName?.toLowerCase().includes(q) || g.groupCode?.toLowerCase().includes(q)
    )
  }
  // 그룹코드명 오름차순 정렬
  return [...list].sort((a, b) => (a.groupName || '').localeCompare(b.groupName || '', 'ko'))
})

// 페이징 적용된 그룹코드
const paginatedGroupCodes = computed(() => {
  const start = (groupCurrentPage.value - 1) * GROUP_PAGE_SIZE
  return filteredGroupCodes.value.slice(start, start + GROUP_PAGE_SIZE)
})

function groupPageChange(page: number) {
  groupCurrentPage.value = page
}

// 검색어 변경 시 1페이지로 리셋
watch(groupSearch, () => {
  groupCurrentPage.value = 1
})

const filteredCommonCodes = computed(() => {
  if (!selectedGroup.value) return []
  let list = commonCodes.value.filter(c => c.groupCode === selectedGroup.value.groupCode)
  if (codeSearch.value) {
    const q = codeSearch.value.toLowerCase()
    list = list.filter(c => c.code?.toLowerCase().includes(q) || c.codeName?.toLowerCase().includes(q))
  }
  // 순서(sortOrder) 오름차순 정렬
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
})

async function fetchGroupCodes() {
  loading.value = true
  try {
    const res = await groupCodeApi.getAll()
    groupCodes.value = res.data
  } catch (e: any) {
    showToast(e.response?.data?.message || '그룹 코드를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

async function fetchCommonCodes() {
  try {
    const res = await commonCodeApi.getAll()
    commonCodes.value = res.data
  } catch (e: any) {
    showToast(e.response?.data?.message || '공통 코드를 불러오지 못했습니다.')
  }
}

function selectGroup(group: any) {
  selectedGroup.value = group
}

function openGroupPopup() {
  editingGroup.value = null
  groupForm.groupCode = ''
  groupForm.groupName = ''
  showGroupPopup.value = true
}

function editGroup(group: any) {
  editingGroup.value = group
  groupForm.groupCode = group.groupCode
  groupForm.groupName = group.groupName
  showGroupPopup.value = true
}

function closeGroupPopup() {
  showGroupPopup.value = false
}

async function saveGroupPopup() {
  if (!groupForm.groupName || !groupForm.groupCode) {
    showToast('그룹코드명과 그룹코드를 입력해주세요.')
    return
  }
  try {
    if (editingGroup.value) {
      await groupCodeApi.update(editingGroup.value.groupCode, groupForm)
      showToast('그룹 코드가 수정되었습니다.')
    } else {
      await groupCodeApi.create(groupForm)
      showToast('그룹 코드가 등록되었습니다.')
    }
    closeGroupPopup()
    fetchGroupCodes()
  } catch (e: any) {
    showToast(e.response?.data?.message || '저장에 실패했습니다.')
  }
}

async function deleteGroup(group: any) {
  if (!confirm(`그룹 코드 "${group.groupName}"을(를) 삭제하시겠습니까?`)) return
  try {
    await groupCodeApi.delete(group.groupCode)
    showToast('그룹 코드가 삭제되었습니다.')
    if (selectedGroup.value?.groupCode === group.groupCode) selectedGroup.value = null
    fetchGroupCodes()
    fetchCommonCodes()
  } catch (e: any) {
    showToast(e.response?.data?.message || '삭제에 실패했습니다.')
  }
}

function openCodePopup() {
  if (!selectedGroup.value) return
  editingCode.value = null
  codeForm.code = ''
  codeForm.codeName = ''
  codeForm.sortOrder = 0
  codeForm.useYn = true
  showCodePopup.value = true
}

function editCode(code: any) {
  editingCode.value = code
  codeForm.code = code.code
  codeForm.codeName = code.codeName
  codeForm.sortOrder = code.sortOrder || 0
  codeForm.useYn = code.useYn !== false
  showCodePopup.value = true
}

function closeCodePopup() {
  showCodePopup.value = false
}

async function saveCodePopup() {
  if (!codeForm.code || !codeForm.codeName) {
    showToast('코드와 코드명을 입력해주세요.')
    return
  }
  try {
    const payload = { ...codeForm, groupCode: selectedGroup.value.groupCode }
    if (editingCode.value) {
      await commonCodeApi.update(editingCode.value.codeId, payload)
      showToast('코드가 수정되었습니다.')
    } else {
      await commonCodeApi.create(payload)
      showToast('코드가 등록되었습니다.')
    }
    closeCodePopup()
    fetchCommonCodes()
  } catch (e: any) {
    showToast(e.response?.data?.message || '저장에 실패했습니다.')
  }
}

async function deleteCode(code: any) {
  if (!confirm(`코드 "${code.codeName}"을(를) 삭제하시겠습니까?`)) return
  try {
    await commonCodeApi.delete(code.codeId)
    showToast('코드가 삭제되었습니다.')
    fetchCommonCodes()
  } catch (e: any) {
    showToast(e.response?.data?.message || '삭제에 실패했습니다.')
  }
}

onMounted(() => {
  fetchGroupCodes()
  fetchCommonCodes()
})
</script>