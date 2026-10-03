<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title">메뉴 관리</div>
      <div class="page-desc">서비스 메뉴를 조회하고 1Depth 및 2Depth 메뉴를 관리합니다.</div>
    </div>

    <!-- Menu Card -->
    <div class="menu-card">
      <div class="menu-card-head">
        <div>
          <div class="section-title">메뉴 관리</div>
          <div class="section-desc">왼쪽 메뉴 트리에서 메뉴를 선택하면 오른쪽에서 상세 정보를 수정할 수 있습니다.</div>
        </div>
        <div class="head-actions">
          <button class="warm-btn secondary" @click="expandAll">전체 펼치기</button>
          <button class="warm-btn secondary" @click="collapseAll">전체 접기</button>
          <button class="warm-btn primary" @click="openRootMenuPopup">+ 1Depth 등록</button>
        </div>
      </div>

      <div class="menu-split">
        <!-- Left: Menu Tree Panel -->
        <aside class="menu-tree-panel">
          <div class="panel-title-row">
            <div>
              <div class="section-title">메뉴 트리</div>
              <div class="section-desc">등록된 메뉴를 트리에서 관리합니다.</div>
            </div>
            <span class="count-badge">{{ menuTree.length }}</span>
          </div>

          <div class="tree-drag-hint">💡 1Depth 및 2Depth 메뉴를 드래그하여 순서를 변경하거나 다른 상위 메뉴로 이동할 수 있습니다.</div>

          <div class="tree-toolbar">
            <button class="warm-btn secondary small" @click="openChildMenuPopup">+ 하위 메뉴</button>
            <button class="warm-btn secondary small" @click="deleteSelectedMenu">삭제</button>
          </div>

          <div v-if="loading" class="menu-loading">로딩 중...</div>
          <div v-else-if="menuTree.length === 0" class="menu-tree-empty">등록된 메뉴가 없습니다.</div>
          <ul v-else class="warm-tree">
            <template v-for="(menu, index) in menuTree" :key="menu.menuId">
              <li
                :class="{
                  'drop-before': draggedDepth === 1 && dropTargetId === menu.menuId && dropPosition === 'before',
                  'drop-after': draggedDepth === 1 && dropTargetId === menu.menuId && dropPosition === 'after',
                }"
              >
                <div
                  class="warm-tree-row"
                  :class="{
                    selected: selectedMenu?.menuId === menu.menuId,
                    dragging: draggedId === menu.menuId,
                    'drop-parent': draggedDepth === 2 && dropTargetId === menu.menuId,
                  }"
                  draggable="true"
                  @click="selectMenu(menu)"
                  @dragstart="onDragStart($event, menu, 1)"
                  @dragover.prevent="onDragOver($event, menu, 1)"
                  @dragleave="onDragLeave($event, menu.menuId)"
                  @drop="onDrop($event, menu, 1)"
                  @dragend="onDragEnd"
                >
                  <span
                    v-if="menu.children && menu.children.length > 0"
                    class="tree-toggle"
                    @click.stop="toggleExpand(menu.menuId)"
                  >{{ expanded[menu.menuId] ? '▼' : '▶' }}</span>
                  <span v-else class="tree-toggle"></span>
                  <span class="tree-icon">{{ menu.children && menu.children.length > 0 ? '📁' : '📁' }}</span>
                  <span class="tree-name">{{ menu.menuName }}</span>
                  <span class="depth">1D</span>
                </div>
                <ul v-if="menu.children && menu.children.length > 0" v-show="expanded[menu.menuId]">
                  <li
                    v-for="child in menu.children"
                    :key="child.menuId"
                    :class="{
                      'drop-before': draggedDepth === 2 && dropTargetId === child.menuId && dropPosition === 'before',
                      'drop-after': draggedDepth === 2 && dropTargetId === child.menuId && dropPosition === 'after',
                    }"
                  >
                    <div
                      class="warm-tree-row"
                      :class="{
                        selected: selectedMenu?.menuId === child.menuId,
                        dragging: draggedId === child.menuId,
                      }"
                      draggable="true"
                      @click="selectMenu(child)"
                      @dragstart="onDragStart($event, child, 2)"
                      @dragover.prevent="onDragOver($event, child, 2)"
                      @dragleave="onDragLeave($event, child.menuId)"
                      @drop="onDrop($event, child, 2)"
                      @dragend="onDragEnd"
                    >
                      <span class="tree-toggle"></span>
                      <span class="tree-icon">📄</span>
                      <span class="tree-name">{{ child.menuName }}</span>
                      <span class="depth">2D</span>
                    </div>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </aside>

        <!-- Right: Menu Detail Panel -->
        <section class="menu-detail-panel">
            <div class="detail-top">
              <div>
                <div class="section-title">메뉴 정보</div>
                <div class="section-desc">선택한 메뉴의 기본 정보와 하위 메뉴를 관리합니다.</div>
              </div>
              <span v-if="selectedMenu" class="depth-chip">{{ selectedMenu.depth === 1 ? '1Depth' : '2Depth' }}</span>
            </div>

            <div class="menu-form">
              <div class="menu-field">
                <label>상위메뉴명</label>
                <input v-model="formData.parentName" type="text" readonly>
              </div>
              <div class="menu-field">
                <label>메뉴명</label>
                <input v-model="formData.menuName" type="text" placeholder="메뉴명을 입력하세요.">
              </div>
              <div class="menu-field">
                <label>메뉴 코드</label>
                <input v-model="formData.menuCode" type="text" placeholder="메뉴 코드를 입력하세요.">
              </div>
              <div class="menu-field">
                <label>URL</label>
                <input v-model="formData.menuUrl" type="text" placeholder="URL을 입력하세요.">
              </div>
              <div class="menu-field" v-if="selectedMenu && selectedMenu.depth === 1">
                <label>아이콘 이미지</label>
                <div class="icon-upload-area">
                  <div class="icon-preview" v-if="formData.icon">
                    <img :src="formData.icon" alt="menu icon" class="icon-img" />
                    <button class="icon-remove-btn" @click="removeIcon">×</button>
                  </div>
                  <label class="icon-upload-btn" v-else>
                    <span>+ 아이콘 등록</span>
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/gif" @change="handleIconUpload" hidden />
                  </label>
                  <span v-if="iconUploading" class="icon-uploading-text">업로드 중...</span>
                </div>
              </div>
              <div class="menu-field">
                <label>사용여부</label>
                <div class="warm-switch-row">
                  <label class="warm-switch">
                    <input v-model="formData.useYn" type="checkbox">
                    <span></span>
                  </label>
                  <b>{{ formData.useYn ? '사용' : '미사용' }}</b>
                </div>
              </div>
              <div class="menu-field">
                <label>노출여부</label>
                <div class="warm-switch-row">
                  <label class="warm-switch">
                    <input v-model="formData.displayYn" type="checkbox">
                    <span></span>
                  </label>
                  <b>{{ formData.displayYn ? '노출' : '미노출' }}</b>
                </div>
              </div>
            </div>

            <!-- Sub Menu Block -->
            <div class="sub-menu-block">
              <div class="sub-menu-head">
                <div>
                  <div class="section-title">하위 메뉴 목록</div>
                  <div class="section-desc">선택한 1Depth 메뉴의 2Depth 목록입니다. 드래그하여 순서를 변경할 수 있습니다.</div>
                </div>
                <button
                  v-if="selectedMenu && selectedMenu.depth === 1"
                  class="warm-btn primary"
                  @click="openChildMenuPopup"
                >+ 하위 메뉴 등록</button>
              </div>
              <div class="warm-table-wrap">
                <table class="warm-table">
                  <thead>
                    <tr>
                      <th>순서</th>
                      <th>메뉴명</th>
                      <th>메뉴 코드</th>
                      <th>URL</th>
                      <th>사용여부</th>
                      <th>노출여부</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!selectedMenu">
                      <td colspan="7" class="menu-empty">왼쪽 메뉴 트리에서 메뉴를 선택해주세요.</td>
                    </tr>
                    <tr v-else-if="selectedMenu.depth === 2">
                      <td colspan="7" class="menu-empty">2Depth 메뉴에는 하위 메뉴를 등록할 수 없습니다.</td>
                    </tr>
                    <tr v-else-if="subMenus.length === 0">
                      <td colspan="7" class="menu-empty">등록된 하위 메뉴가 없습니다.</td>
                    </tr>
                    <tr
                      v-for="(child, index) in subMenus"
                      :key="child.menuId"
                      :class="{
                        dragging: tableDraggedId === child.menuId,
                        'drop-before': tableDropTargetId === child.menuId && tableDropPosition === 'before',
                        'drop-after': tableDropTargetId === child.menuId && tableDropPosition === 'after',
                      }"
                      draggable="true"
                      @click="selectMenuFromTree(child)"
                      @dragstart="onTableDragStart($event, child.menuId)"
                      @dragover.prevent="onTableDragOver($event, child.menuId)"
                      @dragleave="onTableDragLeave($event, child.menuId)"
                      @drop="onTableDrop($event, child.menuId)"
                      @dragend="onTableDragEnd"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ child.menuName }}</td>
                      <td>{{ child.menuCode }}</td>
                      <td>{{ child.menuUrl }}</td>
                      <td><span class="menu-status" :class="child.useYn ? 'on' : 'off'">{{ child.useYn ? '사용' : '미사용' }}</span></td>
                      <td><span class="menu-status" :class="child.displayYn ? 'on' : 'off'">{{ child.displayYn ? '노출' : '미노출' }}</span></td>
                      <td>
                        <button class="warm-btn secondary small" @click.stop="selectMenuFromTree(child)">수정</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Actions -->
            <div class="menu-actions">
              <button class="warm-btn secondary" @click="resetForm">취소</button>
              <button class="warm-btn primary" @click="saveMenu" :disabled="!selectedMenu">저장</button>
            </div>
        </section>
      </div>
    </div>

    <!-- Menu Layer Popup -->
    <div class="layer-overlay" :class="{ open: showMenuPopup }" @click.self="closeMenuPopup">
      <div class="layer-popup">
        <div class="popup-head">
          <div>
            <div class="popup-title">{{ popupMode === 'edit' ? '메뉴 수정' : '메뉴 등록' }}</div>
            <div class="popup-desc">{{ popupDepth === 1 ? '1Depth 메뉴를 등록합니다.' : '선택된 상위 메뉴에 하위 메뉴를 등록합니다.' }}</div>
          </div>
          <button class="popup-close" @click="closeMenuPopup">×</button>
        </div>
        <div class="popup-body">
          <div v-if="popupDepth === 2 && popupParentName" class="popup-selected-parent">
            <span>상위 메뉴</span>
            <strong>{{ popupParentName }}</strong>
          </div>
          <div class="popup-field">
            <label>메뉴명 <span>*</span></label>
            <input v-model="popupForm.menuName" type="text" placeholder="메뉴명을 입력하세요.">
          </div>
          <div class="popup-field">
            <label>메뉴 코드 <span>*</span></label>
            <input v-model="popupForm.menuCode" type="text" placeholder="메뉴 코드를 입력하세요.">
          </div>
          <div class="popup-field">
            <label>URL <span>*</span></label>
            <input v-model="popupForm.menuUrl" type="text" placeholder="URL을 입력하세요.">
          </div>
          <div class="popup-field" v-if="popupDepth === 1">
            <label>아이콘 이미지</label>
            <div class="icon-upload-area">
              <div class="icon-preview" v-if="popupForm.icon">
                <img :src="popupForm.icon" alt="menu icon" class="icon-img" />
                <button class="icon-remove-btn" @click="popupForm.icon = ''">×</button>
              </div>
              <label class="icon-upload-btn" v-else>
                <span>+ 아이콘 등록</span>
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/gif" @change="handlePopupIconUpload" hidden />
              </label>
              <span v-if="iconUploading" class="icon-uploading-text">업로드 중...</span>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="warm-btn secondary" @click="closeMenuPopup">취소</button>
          <button class="warm-btn primary" @click="saveMenuPopup">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/menu-list.css'
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useFileUpload } from '@/composables/useFileUpload'
import { menuApi } from '@/api'

const { showToast } = useToast()
const { upload: uploadFile, uploading: iconUploading } = useFileUpload()

interface MenuItem {
  menuId: number
  parentId: number | null
  parentName: string | null
  menuName: string
  menuCode: string
  menuUrl: string
  depth: number
  sortOrder: number
  icon: string | null
  useYn: boolean
  displayYn: boolean
  children?: MenuItem[]
}

const loading = ref(false)
const menuTree = ref<MenuItem[]>([])
const selectedMenu = ref<MenuItem | null>(null)
const subMenus = ref<MenuItem[]>([])
const expanded = ref<Record<number, boolean>>({})

const formData = reactive({
  parentName: '-',
  menuName: '',
  menuCode: '',
  menuUrl: '',
  icon: '' as string,
  useYn: true,
  displayYn: true,
})

// Popup state
const showMenuPopup = ref(false)
const popupMode = ref<'create' | 'edit'>('create')
const popupDepth = ref(1)
const popupParentName = ref('')
const popupParentId = ref<number | null>(null)

const popupForm = reactive({
  menuName: '',
  menuCode: '',
  menuUrl: '',
  icon: '',
})

// ── Tree loading ──
async function fetchMenuTree() {
  loading.value = true
  try {
    const res = await menuApi.getTree()
    menuTree.value = res.data || []
    // 기본적으로 모든 1Depth 펼치기
    menuTree.value.forEach((m: MenuItem) => {
      if (m.children && m.children.length > 0) {
        expanded.value[m.menuId] = true
      }
    })
  } catch (e: any) {
    showToast(e.response?.data?.message || '메뉴 트리를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

// ── Tree selection ──
function selectMenu(menu: MenuItem) {
  selectedMenu.value = menu

  // 폼 데이터 채우기
  formData.parentName = menu.parentName || '-'
  formData.menuName = menu.menuName
  formData.menuCode = menu.menuCode
  formData.menuUrl = menu.menuUrl
  formData.icon = menu.icon || ''
  formData.useYn = menu.useYn
  formData.displayYn = menu.displayYn

  // 하위 메뉴 설정
  if (menu.depth === 1) {
    // 트리에서 children 사용, 또는 API 호출
    if (menu.children && menu.children.length > 0) {
      subMenus.value = menu.children
    } else {
      fetchChildMenus(menu.menuId)
    }
    // 1Depth 선택 시 트리 펼치기
    expanded.value[menu.menuId] = true
  } else {
    subMenus.value = []
  }
}

async function fetchChildMenus(parentId: number) {
  try {
    const res = await menuApi.getChildMenus(parentId)
    subMenus.value = res.data || []
  } catch (e: any) {
    // 트리 children 폴백
    const parent = menuTree.value.find((m: MenuItem) => m.menuId === parentId)
    subMenus.value = parent?.children || []
  }
}

// 하위 메뉴 테이블에서 클릭 시 — 트리에서 메뉴 찾기
function selectMenuFromTree(child: MenuItem) {
  // 부모 메뉴 찾기
  const parent = menuTree.value.find((m: MenuItem) =>
    m.children?.some((c: MenuItem) => c.menuId === child.menuId)
  )
  if (parent) {
    // 부모의 children 업데이트
    child.parentName = parent.menuName
  }
  selectMenu(child)
}

// ── Tree expand/collapse ──
function toggleExpand(menuId: number) {
  expanded.value[menuId] = !expanded.value[menuId]
}

function expandAll() {
  menuTree.value.forEach((m: MenuItem) => {
    if (m.children && m.children.length > 0) {
      expanded.value[m.menuId] = true
    }
  })
}

function collapseAll() {
  menuTree.value.forEach((m: MenuItem) => {
    expanded.value[m.menuId] = false
  })
}

// ── Save (update) ──
async function saveMenu() {
  if (!selectedMenu.value) return
  if (!formData.menuName || !formData.menuCode || !formData.menuUrl) {
    showToast('메뉴명, 메뉴 코드, URL을 입력해주세요.')
    return
  }
  try {
    const payload = {
      parentId: selectedMenu.value.parentId,
      menuName: formData.menuName,
      menuCode: formData.menuCode,
      menuUrl: formData.menuUrl,
      depth: selectedMenu.value.depth,
      sortOrder: selectedMenu.value.sortOrder,
      icon: formData.icon || null,
      useYn: formData.useYn,
      displayYn: formData.displayYn,
    }
    await menuApi.update(selectedMenu.value.menuId, payload)
    showToast('메뉴 정보가 저장되었습니다.')
    await fetchMenuTree()
    // 선택된 메뉴 다시 찾기
    const updated = findMenuById(menuTree.value, selectedMenu.value.menuId)
    if (updated) selectMenu(updated)
  } catch (e: any) {
    showToast(e.response?.data?.message || '저장에 실패했습니다.')
  }
}

// ── Icon Upload ──
async function handleIconUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const data = await uploadFile(file, 'menu-icons')
    formData.icon = data.url
    showToast('아이콘이 업로드되었습니다.')
  } catch (err: any) {
    showToast(err.response?.data?.message || '아이콘 업로드에 실패했습니다.')
  }
  target.value = ''
}

async function handlePopupIconUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const data = await uploadFile(file, 'menu-icons')
    popupForm.icon = data.url
    showToast('아이콘이 업로드되었습니다.')
  } catch (err: any) {
    showToast(err.response?.data?.message || '아이콘 업로드에 실패했습니다.')
  }
  target.value = ''
}

function removeIcon() {
  formData.icon = ''
}

// ── Reset ──
function resetForm() {
  if (selectedMenu.value) {
    selectMenu(selectedMenu.value)
  }
}

// ── Delete ──
async function deleteSelectedMenu() {
  if (!selectedMenu.value) {
    showToast('삭제할 메뉴를 선택해주세요.')
    return
  }
  if (!confirm(`"${selectedMenu.value.menuName}" 메뉴를 삭제하시겠습니까?`)) return
  try {
    await menuApi.delete(selectedMenu.value.menuId)
    showToast('메뉴가 삭제되었습니다.')
    selectedMenu.value = null
    subMenus.value = []
    await fetchMenuTree()
  } catch (e: any) {
    showToast(e.response?.data?.message || '삭제에 실패했습니다.')
  }
}

// ── 1Depth 등록 팝업 ──
function openRootMenuPopup() {
  popupMode.value = 'create'
  popupDepth.value = 1
  popupParentName.value = ''
  popupParentId.value = null
  popupForm.menuName = ''
  popupForm.menuCode = ''
  popupForm.menuUrl = ''
  popupForm.icon = ''
  showMenuPopup.value = true
}

// ── 하위 메뉴 등록 팝업 ──
function openChildMenuPopup() {
  if (!selectedMenu.value) {
    showToast('상위 메뉴를 선택해주세요.')
    return
  }
  if (selectedMenu.value.depth === 2) {
    showToast('2Depth 메뉴에는 하위 메뉴를 등록할 수 없습니다.')
    return
  }
  popupMode.value = 'create'
  popupDepth.value = 2
  popupParentName.value = selectedMenu.value.menuName
  popupParentId.value = selectedMenu.value.menuId
  popupForm.menuName = ''
  popupForm.menuCode = ''
  popupForm.menuUrl = ''
  popupForm.icon = ''
  showMenuPopup.value = true
}

function closeMenuPopup() {
  showMenuPopup.value = false
}

// ── 팝업에서 등록 저장 ──
async function saveMenuPopup() {
  if (!popupForm.menuName || !popupForm.menuCode || !popupForm.menuUrl) {
    showToast('메뉴명, 메뉴 코드, URL을 입력해주세요.')
    return
  }
  try {
    const payload = {
      parentId: popupParentId.value,
      menuName: popupForm.menuName,
      menuCode: popupForm.menuCode,
      menuUrl: popupForm.menuUrl,
      depth: popupDepth.value,
      sortOrder: 0,
      icon: popupForm.icon || null,
      useYn: true,
      displayYn: true,
    }
    await menuApi.create(payload)
    showToast(popupDepth.value === 1 ? '1Depth 메뉴가 등록되었습니다.' : '하위 메뉴가 등록되었습니다.')
    closeMenuPopup()
    await fetchMenuTree()
  } catch (e: any) {
    showToast(e.response?.data?.message || '등록에 실패했습니다.')
  }
}

// ── Utility ──
function findMenuById(tree: MenuItem[], id: number): MenuItem | null {
  for (const menu of tree) {
    if (menu.menuId === id) return menu
    if (menu.children) {
      const found = findMenuById(menu.children, id)
      if (found) return found
    }
  }
  return null
}

// ── Drag & Drop (tree — 1Depth and 2Depth) ──
const draggedId = ref<number | null>(null)
const draggedDepth = ref<1 | 2 | null>(null)
const draggedParentId = ref<number | null>(null)
const dropTargetId = ref<number | null>(null)
const dropPosition = ref<'before' | 'after'>('before')

function onDragStart(e: DragEvent, menu: MenuItem, depth: 1 | 2) {
  draggedId.value = menu.menuId
  draggedDepth.value = depth
  draggedParentId.value = menu.parentId ?? null
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(menu.menuId))
  }
}

function onDragOver(e: DragEvent, menu: MenuItem, depth: 1 | 2) {
  if (draggedId.value === null) return
  if (draggedId.value === menu.menuId) return
  if (draggedDepth.value === 1 && depth === 2) return

  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const midpoint = rect.top + rect.height / 2
  dropPosition.value = e.clientY < midpoint ? 'before' : 'after'
  dropTargetId.value = menu.menuId
}

function onDragLeave(e: DragEvent, menuId: number) {
  // Only clear if leaving the row entirely (not entering a child element)
  const related = e.relatedTarget as Node | null
  const target = e.currentTarget as HTMLElement
  if (related && target.contains(related)) return
  if (dropTargetId.value === menuId) {
    dropTargetId.value = null
  }
}

async function onDrop(e: DragEvent, menu: MenuItem, depth: 1 | 2) {
  e.preventDefault()
  if (draggedId.value === null || draggedId.value === menu.menuId) {
    resetDragState()
    return
  }
  if (draggedDepth.value === 1 && depth === 2) {
    resetDragState()
    showToast('1Depth 메뉴는 2Depth 메뉴 하위로 이동할 수 없습니다.')
    return
  }

  const fromId = draggedId.value
  const fromDepth = draggedDepth.value
  const fromParentId = draggedParentId.value
  const toId = menu.menuId
  const toDepth = depth
  const pos = dropPosition.value

  try {
    if (fromDepth === 1 && toDepth === 1) {
      // 1Depth reorder
      const tree = menuTree.value
      const fromIdx = tree.findIndex((m) => m.menuId === fromId)
      const toIdx = tree.findIndex((m) => m.menuId === toId)
      if (fromIdx === -1 || toIdx === -1) {
        resetDragState()
        return
      }
      const [moved] = tree.splice(fromIdx, 1)
      let insertIdx = tree.findIndex((m) => m.menuId === toId)
      if (pos === 'after') insertIdx += 1
      tree.splice(insertIdx, 0, moved)

      const orders = tree.map((m, idx) => ({ menuId: m.menuId, sortOrder: idx + 1 }))
      await menuApi.updateOrder(orders)
      showToast('메뉴 순서가 변경되었습니다.')
      tree.forEach((m, idx) => { m.sortOrder = idx + 1 })
    } else if (fromDepth === 2 && toDepth === 1) {
      // 2Depth dropped on 1Depth → move to new parent
      await menuApi.moveMenu(fromId, toId)
      showToast('하위 메뉴가 이동되었습니다.')
      await fetchMenuTree()
    } else if (fromDepth === 2 && toDepth === 2) {
      // 2Depth dropped on 2Depth → reorder (and possibly move to different parent)
      if (fromParentId !== menu.parentId) {
        // Different parent: move first, then reorder
        await menuApi.moveMenu(fromId, menu.parentId!)
        // Reload tree to get the moved item in the new parent's children
        await fetchMenuTree()
        // Now reorder within the new parent
        const parent = menuTree.value.find((m) => m.menuId === menu.parentId)
        if (parent && parent.children) {
          const children = parent.children
          const fromIdx = children.findIndex((c) => c.menuId === fromId)
          const toIdx = children.findIndex((c) => c.menuId === toId)
          if (fromIdx !== -1 && toIdx !== -1) {
            const [moved] = children.splice(fromIdx, 1)
            let insertIdx = children.findIndex((c) => c.menuId === toId)
            if (pos === 'after') insertIdx += 1
            children.splice(insertIdx, 0, moved)
            parent.children = [...children]
            const orders = parent.children.map((c, idx) => ({ menuId: c.menuId, sortOrder: idx + 1 }))
            await menuApi.updateOrder(orders)
            showToast('하위 메뉴가 이동 및 정렬되었습니다.')
          }
        }
      } else {
        // Same parent: reorder
        const parent = menuTree.value.find((m) => m.menuId === fromParentId)
        if (parent && parent.children) {
          const children = parent.children
          const fromIdx = children.findIndex((c) => c.menuId === fromId)
          const toIdx = children.findIndex((c) => c.menuId === toId)
          if (fromIdx !== -1 && toIdx !== -1) {
            const [moved] = children.splice(fromIdx, 1)
            let insertIdx = children.findIndex((c) => c.menuId === toId)
            if (pos === 'after') insertIdx += 1
            children.splice(insertIdx, 0, moved)
            parent.children = [...children]
            // Sync subMenus if this is the currently selected parent
            if (selectedMenu.value?.menuId === parent.menuId) {
              subMenus.value = [...children]
            }
            const orders = parent.children.map((c, idx) => ({ menuId: c.menuId, sortOrder: idx + 1 }))
            await menuApi.updateOrder(orders)
            showToast('하위 메뉴 순서가 변경되었습니다.')
          }
        }
      }
    }
  } catch (e: any) {
    showToast(e.response?.data?.message || '메뉴 순서 변경에 실패했습니다.')
    await fetchMenuTree()
  } finally {
    resetDragState()
  }
}

function onDragEnd() {
  resetDragState()
}

function resetDragState() {
  draggedId.value = null
  draggedDepth.value = null
  draggedParentId.value = null
  dropTargetId.value = null
  dropPosition.value = 'before'
}

// ── Drag & Drop (sub-menu table) ──
const tableDraggedId = ref<number | null>(null)
const tableDropTargetId = ref<number | null>(null)
const tableDropPosition = ref<'before' | 'after'>('before')

function onTableDragStart(e: DragEvent, menuId: number) {
  tableDraggedId.value = menuId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(menuId))
  }
}

function onTableDragOver(e: DragEvent, menuId: number) {
  if (tableDraggedId.value === null || tableDraggedId.value === menuId) return
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const midpoint = rect.top + rect.height / 2
  tableDropPosition.value = e.clientY < midpoint ? 'before' : 'after'
  tableDropTargetId.value = menuId
}

function onTableDragLeave(e: DragEvent, menuId: number) {
  const related = e.relatedTarget as Node | null
  const target = e.currentTarget as HTMLElement
  if (related && target.contains(related)) return
  if (tableDropTargetId.value === menuId) {
    tableDropTargetId.value = null
  }
}

async function onTableDrop(e: DragEvent, menuId: number) {
  e.preventDefault()
  if (tableDraggedId.value === null || tableDraggedId.value === menuId) {
    resetTableDragState()
    return
  }

  const fromId = tableDraggedId.value
  const toId = menuId
  const pos = tableDropPosition.value

  const fromIdx = subMenus.value.findIndex((c) => c.menuId === fromId)
  const toIdx = subMenus.value.findIndex((c) => c.menuId === toId)
  if (fromIdx === -1 || toIdx === -1) {
    resetTableDragState()
    return
  }

  const [moved] = subMenus.value.splice(fromIdx, 1)
  let insertIdx = subMenus.value.findIndex((c) => c.menuId === toId)
  if (pos === 'after') insertIdx += 1
  subMenus.value.splice(insertIdx, 0, moved)
  subMenus.value = [...subMenus.value]

  // Update sortOrders and call API
  const orders = subMenus.value.map((c, idx) => ({ menuId: c.menuId, sortOrder: idx + 1 }))
  // Also sync with tree
  const parent = menuTree.value.find((m) => m.menuId === selectedMenu.value?.menuId)
  if (parent) parent.children = [...subMenus.value]

  try {
    await menuApi.updateOrder(orders)
    showToast('하위 메뉴 순서가 변경되었습니다.')
  } catch (e: any) {
    showToast(e.response?.data?.message || '하위 메뉴 순서 변경에 실패했습니다.')
    await fetchMenuTree()
  } finally {
    resetTableDragState()
  }
}

function onTableDragEnd() {
  resetTableDragState()
}

function resetTableDragState() {
  tableDraggedId.value = null
  tableDropTargetId.value = null
  tableDropPosition.value = 'before'
}

onMounted(() => {
  fetchMenuTree()
})
</script>