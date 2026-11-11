<template>
  <div class="pbs-page">

    <!-- Page Header (설교 목록 화면 참조) -->
    <div class="page-header-row">
      <div>
        <div class="page-title">P.B.S</div>
        <div class="page-desc">개인성경 공부를 합니다</div>
      </div>
    </div>

    <div class="pbs-split-area">

      <!-- ── Panel 1: Page Tree (card 형태) ── -->
      <div class="pbs-panel pbs-panel-tree">
        <div class="card pbs-tree-card">
          <div class="card-header pbs-tree-card-header">
            <div class="card-title pbs-tree-card-title">
              <svg viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>
              성경공부
              <button class="pbs-tree-folder-btn" @click="handleCreateFolder" title="폴더 생성">
                <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              </button>
              <button class="pbs-tree-register-btn" @click="handleCreatePage" title="페이지 등록">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/></svg>
              </button>
            </div>
          </div>
          <div class="card-body pbs-tree-card-body">
            <div class="pbs-tree-search">
              <div class="pbs-tree-search-box">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" v-model="treeSearch" placeholder="성경공부 검색...">
              </div>
            </div>
            <nav class="pbs-tree-nav">
              <div v-if="folders.length === 0" class="pbs-tree-empty">
                폴더가 없습니다.<br/>상단 + 버튼으로 폴더를 생성하세요.
              </div>
              <div
                v-for="folder in filteredFolders"
                :key="folder.folderId"
                class="pbs-tree-node"
              >
                <div
                  class="pbs-tree-row"
                  :class="{ 'parent-active': isFolderActive(folder), 'dragging': dragData?.type === 'folder' && dragData?.id === folder.folderId, 'drag-over': dragOverId === `folder-${folder.folderId}` }"
                  draggable="true"
                  @click="toggleFolder(folder.folderId)"
                  @dragstart="onDragStart($event, 'folder', folder.folderId)"
                  @dragover="onDragOver($event, 'folder', folder.folderId)"
                  @dragleave="onDragLeave"
                  @dragend="onDragEnd"
                  @drop="onDrop($event, 'folder', folder.folderId)"
                >
                  <svg class="pbs-tree-chevron" :class="{ open: expandedFolders.has(folder.folderId) }" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>
                  <svg class="pbs-tree-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <span v-if="editingFolderId !== folder.folderId" class="pbs-tree-label">{{ folder.folderName }}</span>
                  <input
                    v-else
                    class="pbs-tree-label-input"
                    type="text"
                    v-model="editingFolderName"
                    @click.stop
                    @keydown.enter.prevent="saveFolderName(folder)"
                    @keydown.esc.prevent="cancelFolderEdit"
                    @blur="saveFolderName(folder)"
                  >
                  <span class="pbs-tree-count">{{ folder.pages?.length || 0 }}</span>
                  <button
                    class="pbs-tree-folder-edit-btn"
                    @click.stop="startEditFolder(folder)"
                    title="폴더 이름 수정"
                  >
                    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  </button>
                  <button
                    class="pbs-tree-folder-delete-btn"
                    @click.stop="handleDeleteFolder(folder)"
                    title="폴더 삭제"
                  >
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>

                <!-- 인라인 폴더 생성 (포커싱된 폴더 바로 아래) -->
                <div
                  v-if="creatingFolder && createAfterFolderId === folder.folderId"
                  class="pbs-tree-row pbs-tree-create-row"
                >
                  <svg class="pbs-tree-chevron" viewBox="0 0 24 24" style="visibility:hidden"><polyline points="9 6 15 12 9 18"/></svg>
                  <svg class="pbs-tree-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  <input
                    class="pbs-tree-label-input"
                    type="text"
                    v-model="newFolderName"
                    placeholder="폴더 이름 입력 후 Enter"
                    @click.stop
                    @keydown.enter.prevent="commitCreateFolder"
                    @keydown.esc.prevent="cancelCreateFolder"
                    @blur="commitCreateFolder"
                  >
                </div>
                <div
                  class="pbs-tree-sub"
                  :class="{ open: expandedFolders.has(folder.folderId), 'drop-zone': dragOverId === `folderbody-${folder.folderId}` }"
                  @dragover="onDragOverEmptyFolder($event, folder.folderId)"
                  @dragleave="onDragLeave"
                  @drop="onDropEmptyFolder($event, folder.folderId)"
                >
                  <div
                    v-if="!folder.pages || folder.pages.length === 0"
                    class="pbs-tree-empty-hint"
                  >
                    페이지 없음 — 페이지를 여기로 끌어다 놓으세요
                  </div>
                  <div
                    v-for="page in folder.pages"
                    :key="page.pageId"
                    class="pbs-tree-sub-item-wrapper"
                    :class="{ 'dragging': dragData?.type === 'page' && dragData?.id === page.pageId, 'drag-over': dragOverId === `page-${page.pageId}` }"
                    draggable="true"
                    @dragstart="onDragStart($event, 'page', page.pageId, folder.folderId)"
                    @dragover="onDragOver($event, 'page', page.pageId, folder.folderId)"
                    @dragleave="onDragLeave"
                    @dragend="onDragEnd"
                    @drop="onDrop($event, 'page', page.pageId, folder.folderId)"
                  >
                    <div
                      class="pbs-tree-sub-item"
                      :class="{ active: selectedPageId === page.pageId }"
                      @click="selectPage(page.pageId, folder.folderId)"
                    >
                      <span>{{ page.title }}</span>
                    </div>
                    <button
                      class="pbs-tree-delete-btn"
                      @click.stop="handleDeletePage(page, folder)"
                      title="삭제"
                    >
                      <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 폴더가 없거나 포커스가 없을 때: 트리 맨 아래 인라인 생성 -->
              <div
                v-if="creatingFolder && createAfterFolderId === null"
                class="pbs-tree-row pbs-tree-create-row"
              >
                <svg class="pbs-tree-chevron" viewBox="0 0 24 24" style="visibility:hidden"><polyline points="9 6 15 12 9 18"/></svg>
                <svg class="pbs-tree-icon" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <input
                  class="pbs-tree-label-input"
                  type="text"
                  v-model="newFolderName"
                  placeholder="폴더 이름 입력 후 Enter"
                  @click.stop
                  @keydown.enter.prevent="commitCreateFolder"
                  @keydown.esc.prevent="cancelCreateFolder"
                  @blur="commitCreateFolder"
                >
              </div>
            </nav>
          </div>
        </div>
      </div>

      <!-- ── Panel 2: Bible (card 형태) ── -->
      <div class="pbs-panel pbs-panel-bible">
        <div class="card pbs-bible-card">
          <div class="card-header pbs-bible-card-header">
            <div class="card-title pbs-bible-card-title">
              <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              성경 말씀
            </div>
          </div>
          <div class="card-body pbs-bible-card-body">
            <div class="pbs-bible-select-row">
            <select class="pbs-bible-testament-select" v-model="bible.testament" @change="onTestamentChange">
              <option value="">신구약</option>
              <option value="OLD">구약</option>
              <option value="NEW">신약</option>
            </select>
            <select class="pbs-bible-book-select" v-model="bible.bookCode" @change="onBookChange" :disabled="!bible.bookCode && filteredBooks.length === 0">
              <option value="">성경</option>
              <option v-for="b in filteredBooks" :key="b.code" :value="b.code">{{ b.nameKr }}</option>
            </select>
            <select class="pbs-bible-num-select" v-model="bible.chapterFrom" @change="onChapterFromChange" :disabled="!bible.bookCode">
              <option value="">장</option>
              <option v-for="c in chapterList" :key="c" :value="c">{{ c }}</option>
            </select>
            <label class="pbs-bible-num-label">장</label>
            <select class="pbs-bible-num-select" v-model="bible.verseFrom" @change="fetchBibleText" :disabled="!bible.bookCode">
              <option value="">절</option>
              <option v-for="v in verseList" :key="v" :value="v">{{ v }}</option>
            </select>
            <label class="pbs-bible-num-label">절</label>
            <span class="pbs-bible-range-sep">~</span>
            <select class="pbs-bible-num-select" v-model="bible.chapterTo" @change="onChapterToChange" :disabled="!bible.bookCode">
              <option value="">장</option>
              <option v-for="c in chapterList" :key="c" :value="c">{{ c }}</option>
            </select>
            <label class="pbs-bible-num-label">장</label>
            <select class="pbs-bible-num-select" v-model="bible.verseTo" @change="fetchBibleText" :disabled="!bible.bookCode">
              <option value="">절</option>
              <option v-for="v in verseListTo" :key="v" :value="v">{{ v }}</option>
            </select>
            <label class="pbs-bible-num-label">절</label>
          </div>
          <div class="pbs-bible-tabs">
            <button class="pbs-bible-tab" :class="{ active: bibleTab === 'sae' }" @click="bibleTab = 'sae'">새번역</button>
            <button class="pbs-bible-tab" :class="{ active: bibleTab === 'gae' }" @click="bibleTab = 'gae'">개역개정</button>
            <button class="pbs-bible-tab" :class="{ active: bibleTab === 'niv' }" @click="bibleTab = 'niv'">NIV</button>
          </div>
          <div class="pbs-bible-content">
            <div v-if="bibleLoading" style="color: var(--text-muted)">성경 불러오는 중...</div>
            <div v-else-if="currentBibleVerses.length > 0" v-html="bibleTextHtml"></div>
            <div v-else style="color: var(--text-muted)">성경 구절을 선택하면 본문이 표시됩니다.</div>
          </div>
          </div>
        </div>
      </div>

      <!-- ── Panel 3: Title + Content (설교/QT 포맷: card + 섹션 탭 + RichTextEditor) ── -->
      <div class="pbs-panel pbs-panel-content">
        <div v-if="!currentPage" class="pbs-empty-state">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div>페이지를 선택하거나 새로 생성하세요.</div>
          <div style="font-size: 11px">트리에서 페이지를 클릭하거나 + 버튼으로 새 페이지를 만들 수 있습니다.</div>
        </div>
        <div v-else class="pbs-content-body">
          <!-- 제목 + 내용 통합 카드 -->
          <section class="card pbs-page-card">
            <!-- 카드 헤더: 메타 + 배포 -->
            <div class="card-header pbs-page-card-header">
              <div class="pbs-page-meta-row">
                <span class="pbs-page-meta-tag">성경공부</span>
                <span class="pbs-page-status-tag" :class="{ published: currentPage.status === 'PUBLISHED', saving: saveStatus === 'saving' }">
                  {{ statusLabel }}
                </span>
              </div>
              <button
                class="pbs-btn-publish"
                @click="handlePublish"
                :disabled="currentPage.status === 'PUBLISHED'"
              >
                {{ currentPage.status === 'PUBLISHED' ? '배포됨' : '배포' }}
              </button>
            </div>

            <!-- 제목 -->
            <div class="card-body pbs-title-body">
              <input
                class="pbs-page-title-edit"
                type="text"
                v-model="currentPage.title"
                placeholder="제목을 입력하세요"
                @input="onTitleInput"
              >
            </div>

            <!-- 내용 (바로 입력) -->
            <div class="pbs-page-editor-body">
              <RichTextEditor
                :model-value="currentPage.content || ''"
                @update:model-value="onContentInput"
              />
            </div>
          </section>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/pbs-list.css'
import '@/assets/css/rich-text-editor.css'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { pbsApi, bibleApi } from '@/api'
import { useToast } from '@/composables/useToast'
import RichTextEditor from '@/components/RichTextEditor.vue'

const { showToast } = useToast()

// ── Types ──
interface PbsSection {
  sectionId: number
  pageId: number
  sectionTitle: string
  content: string
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}
interface PbsPage {
  pageId: number
  folderId: number
  title: string
  content: string
  status: string
  testament?: string
  bookCode?: string
  chapterFrom?: number
  verseFrom?: number
  chapterTo?: number
  verseTo?: number
  sections?: PbsSection[]
}
interface PbsFolder {
  folderId: number
  folderName: string
  parentId?: number
  sortOrder?: number
  children?: PbsFolder[]
  pages?: PbsPage[]
}
interface BookInfo {
  code: string
  nameKr: string
  testament: string
  chapterCount: number
}

// ── State ──
const folders = ref<PbsFolder[]>([])
const expandedFolders = ref<Set<number>>(new Set())
const selectedPageId = ref<number | null>(null)
const currentPage = ref<PbsPage | null>(null)
const treeSearch = ref('')
const saveStatus = ref<'idle' | 'saving' | 'saved'>('idle')
const lastClickedFolderId = ref<number | null>(null)
const focusedFolderId = ref<number | null>(null)

// 폴더 이름 수정 / 인라인 생성
const editingFolderId = ref<number | null>(null)
const editingFolderName = ref('')
const creatingFolder = ref(false)
const newFolderName = ref('')
const createAfterFolderId = ref<number | null>(null)

// Section state
const sections = ref<PbsSection[]>([])
const activeSectionId = ref<number | null>(null)
const activeSection = computed(() => {
  if (!activeSectionId.value) return null
  return sections.value.find(s => s.sectionId === activeSectionId.value) || null
})

// Bible state
const bible = reactive({
  testament: '' as string,
  bookCode: '' as string,
  chapterFrom: '' as string | number,
  verseFrom: '' as string | number,
  chapterTo: '' as string | number,
  verseTo: '' as string | number,
})
const bibleTab = ref<'gae' | 'sae' | 'niv'>('sae')
const bibleLoading = ref(false)
const bibleCache = ref<{ gae: any[]; sae: any[]; niv: any[] }>({ gae: [], sae: [], niv: [] })
const allBooks = ref<BookInfo[]>([])
const verseList = ref<number[]>([])
const verseListTo = ref<number[]>([])

// ── Book max chapters (hardcoded fallback) ──
const bookMaxChapters: Record<string, number> = {
  'Gen': 50, 'Ex': 40, 'Lev': 27, 'Num': 36, 'Deut': 34,
  'Josh': 24, 'Judg': 21, 'Ruth': 4, '1Sam': 31, '2Sam': 24,
  '1Kgs': 22, '2Kgs': 25, '1Chr': 29, '2Chr': 36, 'Ezra': 10,
  'Neh': 13, 'Esth': 10, 'Job': 42, 'Ps': 150, 'Prov': 31,
  'Eccl': 12, 'Song': 8, 'Isa': 66, 'Jer': 52, 'Lam': 5,
  'Ezek': 48, 'Dan': 12, 'Hos': 14, 'Joel': 3, 'Amos': 9,
  'Obad': 1, 'Jonah': 4, 'Mic': 7, 'Nah': 3, 'Hab': 3,
  'Zeph': 3, 'Hag': 2, 'Zech': 14, 'Mal': 4,
  'Matt': 28, 'Mark': 16, 'Luke': 24, 'John': 21,
  'Acts': 28, 'Rom': 16, '1Cor': 16, '2Cor': 13,
  'Gal': 6, 'Eph': 6, 'Phil': 4, 'Col': 4,
  '1Thess': 5, '2Thess': 3, '1Tim': 6, '2Tim': 4,
  'Titus': 3, 'Phlm': 1, 'Heb': 13, 'Jas': 5,
  '1Pet': 5, '2Pet': 3, '1John': 5, '2John': 1,
  '3John': 1, 'Jude': 1, 'Rev': 22,
}

// Version IDs: 개역개정=2, 새번역=3, NIV=6
const versionIds: Record<string, number> = { gae: 2, sae: 3, niv: 6 }

// ── Computed ──
const filteredFolders = computed(() => {
  if (!treeSearch.value.trim()) return folders.value
  const q = treeSearch.value.trim().toLowerCase()
  return folders.value
    .map(f => {
      const pageMatch = (f.pages || []).filter(p => p.title.toLowerCase().includes(q))
      if (f.folderName.toLowerCase().includes(q) || pageMatch.length > 0) {
        return { ...f, pages: pageMatch.length > 0 ? pageMatch : f.pages }
      }
      return null
    })
    .filter(Boolean) as PbsFolder[]
})

const filteredBooks = computed(() => {
  if (!bible.testament) return allBooks.value
  const t = bible.testament.toUpperCase()
  return allBooks.value.filter(b => (b.testament || '').toUpperCase() === t)
})

const chapterList = computed(() => {
  if (!bible.bookCode) return []
  const book = allBooks.value.find(b => b.code === bible.bookCode)
  const max = book?.chapterCount || bookMaxChapters[bible.bookCode] || 1
  return Array.from({ length: max }, (_, i) => i + 1)
})

const currentBibleVerses = computed(() => bibleCache.value[bibleTab.value] || [])

const bibleTextHtml = computed(() => {
  if (currentBibleVerses.value.length === 0) return ''
  return currentBibleVerses.value
    .map((v: any) => `<span class="verse-number">${v.verse}</span> ${v.content}`)
    .join('<br>\n')
})

const statusLabel = computed(() => {
  if (saveStatus.value === 'saving') return '저장 중...'
  if (currentPage.value?.status === 'PUBLISHED') return '배포됨'
  return '임시저장'
})

// ── API: Folders ──
async function fetchFolders() {
  try {
    const res = await pbsApi.getFolders()
    folders.value = res.data || []
    // Auto-expand folders that have pages
    folders.value.forEach(f => {
      if (f.pages && f.pages.length > 0) {
        expandedFolders.value.add(f.folderId)
      }
    })
  } catch (e) {
    console.error('폴더 조회 실패:', e)
    showToast('폴더 목록을 불러오지 못했습니다.')
  }
}

// ── 폴더 인라인 생성 / 이름 수정 ──
function focusTreeInput() {
  nextTick(() => {
    const el = document.querySelector('.pbs-tree-label-input') as HTMLInputElement | null
    if (el) { el.focus(); el.select() }
  })
}

// 폴더 생성: 포커싱된 폴더 바로 아래에 인라인 입력창 표시
function handleCreateFolder() {
  if (creatingFolder.value) return
  editingFolderId.value = null
  createAfterFolderId.value = focusedFolderId.value   // null이면 트리 맨 아래
  newFolderName.value = ''
  creatingFolder.value = true
  focusTreeInput()
}

function cancelCreateFolder() {
  creatingFolder.value = false
  newFolderName.value = ''
  createAfterFolderId.value = null
}

let createCommitting = false
async function commitCreateFolder() {
  if (!creatingFolder.value || createCommitting) return
  const name = newFolderName.value.trim()
  const afterId = createAfterFolderId.value
  creatingFolder.value = false
  if (!name) { cancelCreateFolder(); return }
  createCommitting = true
  try {
    const res = await pbsApi.createFolder({ folderName: name })
    const newId: number | undefined = res.data?.folderId
    await fetchFolders()

    // 포커싱된 폴더 바로 아래로 위치 이동
    if (newId && afterId != null) {
      const ids = folders.value.map(f => f.folderId).filter(id => id !== newId)
      const idx = ids.indexOf(afterId)
      if (idx >= 0) {
        ids.splice(idx + 1, 0, newId)
        await pbsApi.reorderFolders(ids.map((id, i) => ({ folderId: id, sortOrder: i })))
        await fetchFolders()
      }
    }
    if (newId) {
      focusedFolderId.value = newId
      lastClickedFolderId.value = newId
      expandedFolders.value.add(newId)
    }
    showToast('폴더가 생성되었습니다.')
  } catch (e) {
    console.error('폴더 생성 실패:', e)
    showToast('폴더 생성 중 오류가 발생했습니다.')
  } finally {
    createCommitting = false
    newFolderName.value = ''
    createAfterFolderId.value = null
  }
}

// 폴더 이름 수정
function startEditFolder(folder: PbsFolder) {
  creatingFolder.value = false
  editingFolderId.value = folder.folderId
  editingFolderName.value = folder.folderName
  focusTreeInput()
}

function cancelFolderEdit() {
  editingFolderId.value = null
  editingFolderName.value = ''
}

let renameSaving = false
async function saveFolderName(folder: PbsFolder) {
  if (editingFolderId.value !== folder.folderId) return
  const name = editingFolderName.value.trim()
  const original = folder.folderName
  editingFolderId.value = null   // blur/Enter 중복 호출 방지
  editingFolderName.value = ''
  if (!name || name === original) return
  if (renameSaving) return
  renameSaving = true
  try {
    await pbsApi.updateFolder(folder.folderId, { folderName: name })
    folder.folderName = name
    showToast('폴더 이름이 변경되었습니다.')
  } catch (e) {
    console.error('폴더 이름 변경 실패:', e)
    showToast('폴더 이름 변경 중 오류가 발생했습니다.')
    await fetchFolders()
  } finally {
    renameSaving = false
  }
}

async function handleDeleteFolder(folder: PbsFolder) {
  if (!confirm(`'${folder.folderName}' 폴더와 하위 페이지를 모두 삭제하시겠습니까?`)) return
  try {
    await pbsApi.deleteFolder(folder.folderId)
    showToast('폴더가 삭제되었습니다.')
    if (selectedPageId.value && folder.pages?.some(p => p.pageId === selectedPageId.value)) {
      selectedPageId.value = null
      currentPage.value = null
    }
    await fetchFolders()
  } catch (e) {
    console.error('폴더 삭제 실패:', e)
    showToast('폴더 삭제 중 오류가 발생했습니다.')
  }
}

// ── API: Pages ──
async function selectPage(pageId: number, folderId?: number) {
  // 페이지 선택 시: 해당 페이지만 포커스 + 소속 폴더 포커스
  if (folderId !== undefined) {
    focusedFolderId.value = folderId
    lastClickedFolderId.value = folderId
  } else {
    const owner = folders.value.find(f => f.pages?.some(p => p.pageId === pageId))
    if (owner) {
      focusedFolderId.value = owner.folderId
      lastClickedFolderId.value = owner.folderId
    }
  }
  if (selectedPageId.value === pageId && currentPage.value) return
  selectedPageId.value = pageId
  try {
    const res = await pbsApi.getPage(pageId)
    currentPage.value = res.data
    // Load sections from page response (sections array included)
    sections.value = (res.data.sections || []).sort((a: PbsSection, b: PbsSection) => a.sortOrder - b.sortOrder)
    activeSectionId.value = sections.value.length > 0 ? sections.value[0].sectionId : null
    // Populate bible selectors from page data
    const p = res.data
    bible.testament = p.testament || ''
    bible.bookCode = p.bookCode || ''
    bible.chapterFrom = p.chapterFrom || ''
    bible.verseFrom = p.verseFrom || ''
    bible.chapterTo = p.chapterTo || ''
    bible.verseTo = p.verseTo || ''
    saveStatus.value = 'idle'
    // Fetch verse lists if book/chapter are set
    if (bible.bookCode && bible.chapterFrom) {
      await loadVerseLists()
      await fetchBibleText()
    }
  } catch (e) {
    console.error('페이지 조회 실패:', e)
    showToast('페이지를 불러오지 못했습니다.')
  }
}

async function handleCreatePage() {
  // Target folder priority: last clicked folder > first expanded folder > first folder
  let targetFolderId: number | null = null
  if (lastClickedFolderId.value !== null) {
    targetFolderId = lastClickedFolderId.value
  } else {
    for (const f of folders.value) {
      if (expandedFolders.value.has(f.folderId)) {
        targetFolderId = f.folderId
        break
      }
    }
  }
  if (targetFolderId === null && folders.value.length > 0) {
    targetFolderId = folders.value[0].folderId
  }
  if (targetFolderId === null) {
    showToast('먼저 폴더를 생성하세요.')
    return
  }
  try {
    const res = await pbsApi.createPage({ folderId: targetFolderId })
    showToast('새 페이지가 생성되었습니다.')
    await fetchFolders()
    // Expand the folder
    expandedFolders.value.add(targetFolderId)
    // Select the new page
    const newPageId = res.data.pageId || res.data.pageId
    if (newPageId) {
      await selectPage(newPageId)
    }
  } catch (e) {
    console.error('페이지 생성 실패:', e)
    showToast('페이지 생성 중 오류가 발생했습니다.')
  }
}

async function handleDeletePage(page: PbsPage, folder: PbsFolder) {
  if (!confirm(`'${page.title}' 페이지를 삭제하시겠습니까?`)) return
  try {
    await pbsApi.deletePage(page.pageId)
    showToast('페이지가 삭제되었습니다.')
    if (selectedPageId.value === page.pageId) {
      selectedPageId.value = null
      currentPage.value = null
    }
    await fetchFolders()
  } catch (e) {
    console.error('페이지 삭제 실패:', e)
    showToast('페이지 삭제 중 오류가 발생했습니다.')
  }
}

// ── Autosave: Title (debounced) ──
let titleSaveTimer: ReturnType<typeof setTimeout> | undefined
let pendingTitleUpdate = false

function onTitleInput() {
  if (!currentPage.value) return
  saveStatus.value = 'saving'
  pendingTitleUpdate = true
  if (titleSaveTimer) clearTimeout(titleSaveTimer)
  titleSaveTimer = setTimeout(doTitleSave, 800)
}

async function doTitleSave() {
  if (!currentPage.value || !pendingTitleUpdate) return
  pendingTitleUpdate = false
  try {
    await pbsApi.updatePage(currentPage.value.pageId, {
      title: currentPage.value.title,
      content: currentPage.value.content || '',
      testament: currentPage.value.testament || undefined,
      bookCode: currentPage.value.bookCode || undefined,
      chapterFrom: currentPage.value.chapterFrom,
      verseFrom: currentPage.value.verseFrom,
      chapterTo: currentPage.value.chapterTo,
      verseTo: currentPage.value.verseTo,
    })
    saveStatus.value = 'saved'
    updateTreePageTitle(currentPage.value.pageId, currentPage.value.title)
  } catch (e) {
    console.error('제목 자동저장 실패:', e)
    saveStatus.value = 'idle'
    showToast('자동저장 중 오류가 발생했습니다.')
  }
}

// ── Autosave: Content (debounced) ──
let contentSaveTimer: ReturnType<typeof setTimeout> | undefined
let pendingContentUpdate = false

function onContentInput(val: string) {
  if (!currentPage.value) return
  currentPage.value.content = val
  saveStatus.value = 'saving'
  pendingContentUpdate = true
  if (contentSaveTimer) clearTimeout(contentSaveTimer)
  contentSaveTimer = setTimeout(doContentSave, 800)
}

async function doContentSave() {
  if (!currentPage.value || !pendingContentUpdate) return
  pendingContentUpdate = false
  try {
    await pbsApi.updatePage(currentPage.value.pageId, {
      title: currentPage.value.title,
      content: currentPage.value.content || '',
      testament: currentPage.value.testament || undefined,
      bookCode: currentPage.value.bookCode || undefined,
      chapterFrom: currentPage.value.chapterFrom,
      verseFrom: currentPage.value.verseFrom,
      chapterTo: currentPage.value.chapterTo,
      verseTo: currentPage.value.verseTo,
    })
    saveStatus.value = 'saved'
  } catch (e) {
    console.error('내용 자동저장 실패:', e)
    saveStatus.value = 'idle'
    showToast('자동저장 중 오류가 발생했습니다.')
  }
}

// ── Autosave: Section content (debounced per-section) ──
const sectionContentTimers = new Map<number, ReturnType<typeof setTimeout>>()
const sectionContentPending = new Map<number, boolean>()

function onSectionContentInput(section: PbsSection, val: string) {
  section.content = val
  saveStatus.value = 'saving'
  sectionContentPending.set(section.sectionId, true)
  const existing = sectionContentTimers.get(section.sectionId)
  if (existing) clearTimeout(existing)
  sectionContentTimers.set(section.sectionId, setTimeout(() => doSectionContentSave(section.sectionId), 800))
}

async function doSectionContentSave(sectionId: number) {
  if (!sectionContentPending.get(sectionId)) return
  sectionContentPending.set(sectionId, false)
  const section = sections.value.find(s => s.sectionId === sectionId)
  if (!section) return
  try {
    await pbsApi.updateSectionContent(sectionId, { content: section.content })
    saveStatus.value = 'saved'
  } catch (e) {
    console.error('섹션 내용 자동저장 실패:', e)
    saveStatus.value = 'idle'
    showToast('영역 내용 자동저장 중 오류가 발생했습니다.')
  }
}

// ── Autosave: Section title (debounced per-section) ──
const sectionTitleTimers = new Map<number, ReturnType<typeof setTimeout>>()
const sectionTitlePending = new Map<number, boolean>()

function onSectionTitleInput(section: PbsSection) {
  saveStatus.value = 'saving'
  sectionTitlePending.set(section.sectionId, true)
  const existing = sectionTitleTimers.get(section.sectionId)
  if (existing) clearTimeout(existing)
  sectionTitleTimers.set(section.sectionId, setTimeout(() => doSectionTitleSave(section.sectionId), 800))
}

async function doSectionTitleSave(sectionId: number) {
  if (!sectionTitlePending.get(sectionId)) return
  sectionTitlePending.set(sectionId, false)
  const section = sections.value.find(s => s.sectionId === sectionId)
  if (!section) return
  try {
    await pbsApi.updateSection(sectionId, { sectionTitle: section.sectionTitle })
    saveStatus.value = 'saved'
  } catch (e) {
    console.error('섹션 제목 자동저장 실패:', e)
    saveStatus.value = 'idle'
  }
}

// ── Section CRUD ──
async function handleCreateSection() {
  if (!currentPage.value) return
  try {
    const sortOrder = sections.value.length
    const res = await pbsApi.createSection(currentPage.value.pageId, {
      sectionTitle: `영역 ${sortOrder + 1}`,
      content: '',
      sortOrder,
    })
    const newSection: PbsSection = res.data
    sections.value.push(newSection)
    activeSectionId.value = newSection.sectionId
    showToast('새 영역이 추가되었습니다.')
  } catch (e) {
    console.error('영역 생성 실패:', e)
    showToast('영역 생성 중 오류가 발생했습니다.')
  }
}

async function handleDeleteSection(section: PbsSection) {
  if (!confirm(`'${section.sectionTitle}' 영역을 삭제하시겠습니까?`)) return
  try {
    await pbsApi.deleteSection(section.sectionId)
    const idx = sections.value.findIndex(s => s.sectionId === section.sectionId)
    if (idx >= 0) sections.value.splice(idx, 1)
    // Reorder remaining sections
    if (sections.value.length > 0) {
      const orders = sections.value.map((s, i) => ({ sectionId: s.sectionId, sortOrder: i }))
      try { await pbsApi.reorderSections(currentPage.value!.pageId, orders) } catch {}
      sections.value.forEach((s, i) => { s.sortOrder = i })
    }
    // Update active section
    if (activeSectionId.value === section.sectionId) {
      activeSectionId.value = sections.value.length > 0 ? sections.value[0].sectionId : null
    }
    showToast('영역이 삭제되었습니다.')
  } catch (e) {
    console.error('영역 삭제 실패:', e)
    showToast('영역 삭제 중 오류가 발생했습니다.')
  }
}

function updateTreePageTitle(pageId: number, title: string) {
  for (const f of folders.value) {
    const p = f.pages?.find(pg => pg.pageId === pageId)
    if (p) { p.title = title; break }
  }
}

// ── Publish ──
async function handlePublish() {
  if (!currentPage.value) return
  if (currentPage.value.status === 'PUBLISHED') return
  // Save pending title changes first
  if (titleSaveTimer) clearTimeout(titleSaveTimer)
  if (pendingTitleUpdate) await doTitleSave()
  // Save pending section content changes
  for (const [sectionId, timer] of sectionContentTimers) {
    clearTimeout(timer)
    if (sectionContentPending.get(sectionId)) await doSectionContentSave(sectionId)
  }
  if (!confirm('페이지를 배포하시겠습니까?')) return
  try {
    await pbsApi.publishPage(currentPage.value.pageId)
    currentPage.value.status = 'PUBLISHED'
    showToast('페이지가 배포되었습니다.')
    await fetchFolders()
  } catch (e) {
    console.error('배포 실패:', e)
    showToast('배포 중 오류가 발생했습니다.')
  }
}

// ── Tree interactions ──
function toggleFolder(folderId: number) {
  // 폴더 선택 시: 해당 폴더만 포커스, 페이지 포커스 해제
  focusedFolderId.value = folderId
  lastClickedFolderId.value = folderId
  selectedPageId.value = null
  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId)
  } else {
    expandedFolders.value.add(folderId)
  }
}

function isFolderActive(folder: PbsFolder): boolean {
  return focusedFolderId.value === folder.folderId
}

// ── Drag and Drop ──
interface DragItem {
  type: 'folder' | 'page'
  id: number
  folderId?: number  // for pages: source folder
}
const dragData = ref<DragItem | null>(null)
const dragOverId = ref<string | null>(null)

function onDragStart(e: DragEvent, type: 'folder' | 'page', id: number, folderId?: number) {
  dragData.value = { type, id, folderId }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', `${type}:${id}`)
  }
}

function onDragOver(e: DragEvent, type: 'folder' | 'page', id: number, folderId?: number) {
  if (!dragData.value) return
  e.stopPropagation()   // 상위 폴더 영역(drop-zone)으로 이벤트 전파 방지
  // 같은 항목 위로는 드롭 금지
  if (dragData.value.id === id && dragData.value.type === type) return
  // 폴더 행: 페이지 이동(다른 폴더의 페이지 포함) 또는 폴더 순서 변경 허용
  if (type === 'folder') {
    if (dragData.value.type === 'page') {
      // 같은 폴더 내 페이지는 폴더 행 드롭 불필요 (순서 변경은 페이지 행에서)
      if (dragData.value.folderId === id) return
    }
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dragOverId.value = `folder-${id}`
    return
  }
  // 페이지 행: 페이지끼리만
  if (dragData.value.type !== 'page') return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverId.value = `page-${id}`
}

// 빈 폴더(또는 폴더 하위 영역)에 드롭 — 페이지를 폴더 끝으로 이동
function onDragOverEmptyFolder(e: DragEvent, folderId: number) {
  if (!dragData.value || dragData.value.type !== 'page') return
  if (dragData.value.folderId === folderId) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverId.value = `folderbody-${folderId}`
}

function onDropEmptyFolder(e: DragEvent, folderId: number) {
  e.preventDefault()
  e.stopPropagation()
  if (!dragData.value) return
  const item = dragData.value
  dragData.value = null
  dragOverId.value = null
  if (item.type !== 'page' || !item.folderId) return
  if (item.folderId === folderId) return
  movePageToFolder(item.id, item.folderId, folderId)
}

function onDragLeave() {
  dragOverId.value = null
}

function onDragEnd() {
  dragData.value = null
  dragOverId.value = null
}

async function onDrop(e: DragEvent, type: 'folder' | 'page', targetId: number, targetFolderId?: number) {
  e.preventDefault()
  e.stopPropagation()
  if (!dragData.value) return
  const item = dragData.value
  dragData.value = null
  dragOverId.value = null

  // 폴더 행에 드롭
  if (type === 'folder') {
    if (item.type === 'page') {
      // 페이지를 해당 폴더로 이동
      if (!item.folderId || item.folderId === targetId) return
      await movePageToFolder(item.id, item.folderId, targetId)
      return
    }
    if (item.type === 'folder') {
      if (item.id === targetId) return
      await reorderFolders(item.id, targetId)
    }
    return
  }

  // 페이지 행에 드롭 — 페이지끼리만
  if (item.type !== 'page') return
  if (item.id === targetId) return
  await reorderPages(item.id, item.folderId, targetId, targetFolderId)
}

// 페이지를 다른 폴더로 이동 (폴더 끝에 추가)
async function movePageToFolder(pageId: number, sourceFolderId: number, targetFolderId: number) {
  const srcFolder = folders.value.find(f => f.folderId === sourceFolderId)
  const tgtFolder = folders.value.find(f => f.folderId === targetFolderId)
  if (!srcFolder || !tgtFolder) return
  if (!srcFolder.pages) srcFolder.pages = []
  if (!tgtFolder.pages) tgtFolder.pages = []

  const fromIdx = srcFolder.pages.findIndex(p => p.pageId === pageId)
  if (fromIdx < 0) return
  const [moved] = srcFolder.pages.splice(fromIdx, 1)
  moved.folderId = targetFolderId
  tgtFolder.pages.push(moved)   // 폴더 끝에 추가 (빈 폴더도 가능)

  const srcReorder = srcFolder.pages.map((p, i) => ({ pageId: p.pageId, sortOrder: i, folderId: sourceFolderId }))
  const tgtReorder = tgtFolder.pages.map((p, i) => ({ pageId: p.pageId, sortOrder: i, folderId: targetFolderId }))

  // 대상 폴더 펼치고 포커스
  expandedFolders.value.add(targetFolderId)
  focusedFolderId.value = targetFolderId
  lastClickedFolderId.value = targetFolderId

  try {
    await pbsApi.reorderPages([...tgtReorder, ...srcReorder])
    showToast(`'${moved.title}' 페이지를 '${tgtFolder.folderName}' 폴더로 이동했습니다.`)
  } catch (err) {
    console.error('페이지 이동 실패:', err)
    showToast('페이지 이동 중 오류가 발생했습니다.')
    await fetchFolders()
  }
}

async function reorderFolders(draggedId: number, targetId: number) {
  const list = [...folders.value]
  const fromIdx = list.findIndex(f => f.folderId === draggedId)
  const toIdx = list.findIndex(f => f.folderId === targetId)
  if (fromIdx < 0 || toIdx < 0) return
  // Remove dragged item and insert before target
  const [moved] = list.splice(fromIdx, 1)
  list.splice(toIdx, 0, moved)
  // Update sortOrder and local array
  const reorderItems = list.map((f, i) => ({ folderId: f.folderId, sortOrder: i }))
  folders.value = list
  try {
    await pbsApi.reorderFolders(reorderItems)
  } catch (e) {
    console.error('폴더 순서 변경 실패:', e)
    showToast('폴더 순서 변경 중 오류가 발생했습니다.')
    await fetchFolders()
  }
}

async function reorderPages(draggedPageId: number, sourceFolderId: number | undefined, targetPageId: number, targetFolderId: number | undefined) {
  if (!sourceFolderId || !targetFolderId) return
  // Same folder reorder
  if (sourceFolderId === targetFolderId) {
    const folder = folders.value.find(f => f.folderId === sourceFolderId)
    if (!folder || !folder.pages) return
    const pages = [...folder.pages]
    const fromIdx = pages.findIndex(p => p.pageId === draggedPageId)
    const toIdx = pages.findIndex(p => p.pageId === targetPageId)
    if (fromIdx < 0 || toIdx < 0) return
    const [moved] = pages.splice(fromIdx, 1)
    pages.splice(toIdx, 0, moved)
    folder.pages = pages
    const reorderItems = pages.map((p, i) => ({ pageId: p.pageId, sortOrder: i }))
    try {
      await pbsApi.reorderPages(reorderItems)
    } catch (e) {
      console.error('페이지 순서 변경 실패:', e)
      showToast('페이지 순서 변경 중 오류가 발생했습니다.')
      await fetchFolders()
    }
  } else {
    // Cross-folder move
    const srcFolder = folders.value.find(f => f.folderId === sourceFolderId)
    const tgtFolder = folders.value.find(f => f.folderId === targetFolderId)
    if (!srcFolder || !tgtFolder || !srcFolder.pages || !tgtFolder.pages) return
    const fromIdx = srcFolder.pages.findIndex(p => p.pageId === draggedPageId)
    const toIdx = tgtFolder.pages.findIndex(p => p.pageId === targetPageId)
    if (fromIdx < 0 || toIdx < 0) return
    const [moved] = srcFolder.pages.splice(fromIdx, 1)
    moved.folderId = targetFolderId
    tgtFolder.pages.splice(toIdx, 0, moved)
    // Reorder source folder
    const srcReorder = srcFolder.pages.map((p, i) => ({ pageId: p.pageId, sortOrder: i, folderId: sourceFolderId }))
    // Reorder target folder (with moved page)
    const tgtReorder = tgtFolder.pages.map((p, i) => ({ pageId: p.pageId, sortOrder: i, folderId: targetFolderId }))
    // Expand target folder
    expandedFolders.value.add(targetFolderId)
    try {
      // Send all pages that need reordering
      await pbsApi.reorderPages([...tgtReorder, ...srcReorder])
    } catch (e) {
      console.error('페이지 이동 실패:', e)
      showToast('페이지 이동 중 오류가 발생했습니다.')
      await fetchFolders()
    }
  }
}

// ── Bible selectors ──
function onTestamentChange() {
  bible.bookCode = ''
  bible.chapterFrom = ''
  bible.chapterTo = ''
  bible.verseFrom = ''
  bible.verseTo = ''
  verseList.value = []
  verseListTo.value = []
  bibleCache.value = { gae: [], sae: [], niv: [] }
}

function onBookChange() {
  bible.chapterFrom = ''
  bible.chapterTo = ''
  bible.verseFrom = ''
  bible.verseTo = ''
  verseList.value = []
  verseListTo.value = []
  bibleCache.value = { gae: [], sae: [], niv: [] }
  // Save bookCode to page
  saveBibleMeta()
}

async function onChapterFromChange() {
  bible.verseFrom = ''
  bible.verseTo = ''
  verseList.value = []
  verseListTo.value = []
  if (!bible.bookCode || !bible.chapterFrom) return
  await loadVerseLists()
  await fetchBibleText()
  saveBibleMeta()
}

function onChapterToChange() {
  bible.verseTo = ''
  verseListTo.value = verseList.value
  fetchBibleText()
  saveBibleMeta()
}

async function loadVerseLists() {
  if (!bible.bookCode || !bible.chapterFrom) return
  try {
    const res = await bibleApi.getVerses(bible.bookCode, Number(bible.chapterFrom), undefined, undefined, undefined, 2)
    verseList.value = (res.data || []).map((v: any) => v.verse)
    verseListTo.value = verseList.value
  } catch {
    verseList.value = []
    verseListTo.value = []
  }
}

async function fetchBibleText() {
  if (!bible.bookCode || !bible.chapterFrom) {
    bibleCache.value = { gae: [], sae: [], niv: [] }
    return
  }
  const chapter = Number(bible.chapterFrom)
  const vFrom = bible.verseFrom ? Number(bible.verseFrom) : undefined
  const vTo = bible.verseTo ? Number(bible.verseTo) : undefined
  // If chapterTo is set and different, use range; otherwise use chapterFrom
  const chTo = bible.chapterTo ? Number(bible.chapterTo) : chapter

  bibleLoading.value = true
  try {
    const [gaeRes, saeRes, nivRes] = await Promise.all([
      bibleApi.getVerses(bible.bookCode, chapter, vFrom, chTo, vTo, versionIds.gae),
      bibleApi.getVerses(bible.bookCode, chapter, vFrom, chTo, vTo, versionIds.sae),
      bibleApi.getVerses(bible.bookCode, chapter, vFrom, chTo, vTo, versionIds.niv),
    ])
    bibleCache.value = {
      gae: gaeRes.data || [],
      sae: saeRes.data || [],
      niv: nivRes.data || [],
    }
  } catch (e) {
    console.error('성경 조회 실패:', e)
    bibleCache.value = { gae: [], sae: [], niv: [] }
  } finally {
    bibleLoading.value = false
  }
}

// Save bible metadata (testament, bookCode, chapters, verses) to page
let bibleMetaTimer: ReturnType<typeof setTimeout> | undefined
function saveBibleMeta() {
  if (!currentPage.value) return
  if (bibleMetaTimer) clearTimeout(bibleMetaTimer)
  bibleMetaTimer = setTimeout(async () => {
    if (!currentPage.value) return
    try {
      await pbsApi.updatePage(currentPage.value.pageId, {
        title: currentPage.value.title,
        content: currentPage.value.content || '',
        testament: bible.testament || undefined,
        bookCode: bible.bookCode || undefined,
        chapterFrom: bible.chapterFrom ? Number(bible.chapterFrom) : undefined,
        verseFrom: bible.verseFrom ? Number(bible.verseFrom) : undefined,
        chapterTo: bible.chapterTo ? Number(bible.chapterTo) : undefined,
        verseTo: bible.verseTo ? Number(bible.verseTo) : undefined,
      })
      // Update local page object
      currentPage.value.testament = bible.testament || undefined
      currentPage.value.bookCode = bible.bookCode || undefined
      currentPage.value.chapterFrom = bible.chapterFrom ? Number(bible.chapterFrom) : undefined
      currentPage.value.verseFrom = bible.verseFrom ? Number(bible.verseFrom) : undefined
      currentPage.value.chapterTo = bible.chapterTo ? Number(bible.chapterTo) : undefined
      currentPage.value.verseTo = bible.verseTo ? Number(bible.verseTo) : undefined
    } catch (e) {
      console.error('성경 메타 저장 실패:', e)
    }
  }, 1000)
}

// ── Init ──
onMounted(async () => {
  // Load bible books
  try {
    const res = await bibleApi.getBooks()
    allBooks.value = (res.data || []).map((b: any) => ({
      code: b.bookCode || b.book_code,
      nameKr: b.bookNameKr || b.book_name_kr,
      testament: b.testament,
      chapterCount: b.chapterCount || 0,
    }))
  } catch (e) {
    console.error('성경 책 목록 로드 실패:', e)
  }
  await fetchFolders()
})

// Re-fetch bible text when tab changes (cache is already populated, just switch)
watch(bibleTab, () => {
  // No API call needed — cache is already populated
})
</script>
