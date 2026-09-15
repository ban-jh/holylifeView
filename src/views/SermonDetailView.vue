<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/><path d="M12 22V12"/><path d="M3 7l9 5 9-5"/></svg>
        </div>
        <div>
          <div class="sidebar-logo-text">말씀 관리자</div>
          <div class="sidebar-logo-sub">Word Admin Console</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">메인 메뉴</div>
        <RouterLink to="/pbs" class="nav-link"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span class="nav-link-label">P.B.S (성경공부)</span></RouterLink>
        <RouterLink to="/qts" class="nav-link"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span class="nav-link-label">Q.T</span></RouterLink>
        <RouterLink to="/sermons" class="nav-link active"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="nav-link-label">설교</span></RouterLink>
        <RouterLink to="/readings" class="nav-link"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span class="nav-link-label">독서</span></RouterLink>
        <div class="nav-section-label">관리</div>
        <div class="nav-item">
          <div class="nav-link" :class="{ 'parent-active': systemOpen }" @click="systemOpen = !systemOpen">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/></svg>
            <span class="nav-link-label">시스템</span>
            <svg class="nav-chevron" :class="{ open: systemOpen }" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="nav-sub" :class="{ open: systemOpen }">
            <div class="nav-sub-item">사용자</div><div class="nav-sub-item">메뉴</div><div class="nav-sub-item">권한</div><div class="nav-sub-item">공통코드</div>
          </div>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">박</div>
          <div class="sidebar-user-info"><div class="sidebar-user-name">박성민 관리자</div><div class="sidebar-user-role">Super Admin</div></div>
        </div>
      </div>
    </aside>
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <div class="main">
      <header class="header">
        <button class="mobile-menu-btn" @click="sidebarOpen = true"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <div class="breadcrumb">
          <span class="breadcrumb-item">설교</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-item current">설교 작성</span>
        </div>
        <div class="header-actions">
          <div class="header-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="검색어를 입력하세요" /></div>
          <button class="icon-btn" title="알림"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="badge"></span></button>
          <div class="header-avatar">박</div>
        </div>
      </header>

      <div class="content">
        <div class="page-header">
          <div class="page-title">설교 작성</div>
          <div class="page-desc">설교 말씀과 내용을 작성하고 등록합니다.</div>
        </div>

        <!-- 기본 정보 -->
        <section class="card">
          <div class="card-header"><div class="card-title">기본 정보</div></div>
          <div class="card-body">
            <div class="basic-info">
              <div class="form-group">
                <label>제목</label>
                <input type="text" v-model="form.title" placeholder="설교 제목을 입력하세요" />
              </div>
              <div class="form-group">
                <label>날짜</label>
                <input type="date" v-model="form.date" />
              </div>
              <div class="form-group">
                <label>설교자</label>
                <input type="text" v-model="form.preacher" placeholder="설교자를 입력하세요" />
              </div>
              <div class="form-group">
                <label>태그</label>
                <div class="tag-input-container">
                  <span class="tag-chip" v-for="(tag, i) in form.tags" :key="i">
                    {{ tag }}<span class="tag-chip-remove" @click="removeTag(i)">×</span>
                  </span>
                  <input type="text" v-model="tagInput" placeholder="태그 입력 후 Enter" @keydown.enter.prevent="addTag" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 중앙 영역 -->
        <div class="middle">
          <section class="middle-card">
            <div class="middle-header">
              <div class="middle-title">성경 말씀</div>
              <div class="tabs">
                <button class="tab" :class="{ active: bibleTab === 'new' }" @click="bibleTab = 'new'">새번역</button>
                <button class="tab" :class="{ active: bibleTab === 'english' }" @click="bibleTab = 'english'">영어 (NIV)</button>
                <button class="tab" :class="{ active: bibleTab === 'modern' }" @click="bibleTab = 'modern'">현대인</button>
              </div>
            </div>
            <div class="bible-content" v-html="bibleText"></div>
          </section>

          <section class="middle-card">
            <div class="middle-header"><div class="middle-title">설교 내용</div></div>
            <div class="content-editor">
              <textarea v-model="form.content" placeholder="설교 내용을 입력하세요."></textarea>
            </div>
          </section>
        </div>

        <!-- 하단 버튼 -->
        <div class="bottom-buttons">
          <button class="btn btn-cancel" @click="handleCancel">취소</button>
          <button class="btn btn-save" @click="handleSave">저장하기</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toastVisible" class="toast">
      <svg style="width:16px;height:16px;stroke:#a8d8bc;fill:none;stroke-width:2.5;flex-shrink:0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      <span>{{ toastMsg }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { sermonApi } from '@/api'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const systemOpen = ref(false)
const bibleTab = ref<'new' | 'english' | 'modern'>('new')
const tagInput = ref('')

const form = reactive({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  preacher: '',
  tags: [] as string[],
  content: '',
})

const toastVisible = ref(false)
const toastMsg = ref('')

const bibleTexts = {
  new: `<span class="verse-number">1</span> 십자가의 말씀은 멸망하는 자들에게는 어리석음이지만, 구원을 얻는 우리에게는 하나님의 능력입니다.<br>
    <span class="verse-number">2</span> 유대인은 표적을 구하고 헬라인은 지혜를 찾으나,<br>
    <span class="verse-number">3</span> 우리는 십자가에 못 박히신 그리스도를 전합니다. 이는 유대인에게는 거리낌이요, 이방인에게는 어리석음이지만,<br>
    <span class="verse-number">4</span> 부르심을 입은 자들에게는 유대인이나 헬라인이나 그리스도는 하나님의 능력이요 하나님의 지혜입니다.`,
  english: `<span class="verse-number">1</span> For the message of the cross is foolishness to those who are perishing, but to us who are being saved it is the power of God.<br>
    <span class="verse-number">2</span> Jews demand signs and Greeks look for wisdom,<br>
    <span class="verse-number">3</span> but we preach Christ crucified: a stumbling block to Jews and foolishness to Gentiles,<br>
    <span class="verse-number">4</span> but to those whom God has called, both Jews and Greeks, Christ the power of God and the wisdom of God.`,
  modern: `<span class="verse-number">1</span> 십자가의 말씀은 멸망해 가는 사람들에게는 어리석어 보이지만, 구원을 얻는 우리에게는 하나님의 능력입니다.<br>
    <span class="verse-number">2</span> 유대인은 기적을 구하고, 헬라인은 지혜를 찾습니다.<br>
    <span class="verse-number">3</span> 그러나 우리는 십자가에 못 박히신 그리스도를 전합니다. 이것은 유대인에게는 걸려 넘어지게 하는 것이요, 이방인에게는 어리석어 보이는 것이지만,<br>
    <span class="verse-number">4</span> 하나님께서 부르신 사람들에게는, 유대인이나 헬라인이나 다 같이 그리스도가 하나님의 능력이요, 하나님의 지혜가 됩니다.`,
}

const bibleText = computed(() => bibleTexts[bibleTab.value])

function addTag() {
  const value = tagInput.value.trim()
  if (value) {
    form.tags.push(value)
    tagInput.value = ''
  }
}

function removeTag(index: number) {
  form.tags.splice(index, 1)
}

function showToast(msg: string) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2800)
}

async function handleSave() {
  try {
    const id = route.params.id
    if (id && id !== 'new') {
      await sermonApi.update(Number(id), form)
    } else {
      await sermonApi.create(form)
    }
    showToast('설교가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/sermons'), 1000)
  } catch (e) {
    showToast('저장 중 오류가 발생했습니다.')
  }
}

function handleCancel() {
  if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) {
    router.push('/sermons')
  }
}

onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'new') {
    try {
      const res = await sermonApi.getById(Number(id))
      Object.assign(form, res.data)
    } catch (e) {
      console.error('설교 조회 실패:', e)
    }
  }
})
</script>

<style scoped>
@import './_shared-layout.css';
</style>