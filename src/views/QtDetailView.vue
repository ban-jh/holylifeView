<template>
  <div class="layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/><path d="M12 22V12"/><path d="M3 7l9 5 9-5"/></svg></div>
        <div><div class="sidebar-logo-text">말씀 관리자</div><div class="sidebar-logo-sub">Word Admin Console</div></div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">메인 메뉴</div>
        <RouterLink to="/pbs" class="nav-link"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span class="nav-link-label">P.B.S (성경공부)</span></RouterLink>
        <RouterLink to="/qts" class="nav-link active"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span class="nav-link-label">Q.T</span></RouterLink>
        <RouterLink to="/sermons" class="nav-link"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="nav-link-label">설교</span></RouterLink>
        <RouterLink to="/readings" class="nav-link"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><span class="nav-link-label">독서</span></RouterLink>
        <div class="nav-section-label">관리</div>
        <div class="nav-item">
          <div class="nav-link" :class="{ 'parent-active': systemOpen }" @click="systemOpen = !systemOpen">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2"/></svg>
            <span class="nav-link-label">시스템</span><svg class="nav-chevron" :class="{ open: systemOpen }" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="nav-sub" :class="{ open: systemOpen }"><div class="nav-sub-item">사용자</div><div class="nav-sub-item">메뉴</div><div class="nav-sub-item">권한</div><div class="nav-sub-item">공통코드</div></div>
        </div>
      </nav>
      <div class="sidebar-footer"><div class="sidebar-user"><div class="sidebar-user-avatar">박</div><div class="sidebar-user-info"><div class="sidebar-user-name">박성민 관리자</div><div class="sidebar-user-role">Super Admin</div></div></div></div>
    </aside>
    <div class="overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

    <div class="main">
      <header class="header">
        <button class="mobile-menu-btn" @click="sidebarOpen = true"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <div class="breadcrumb"><span class="breadcrumb-item">Q.T</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-item current">QT 작성</span></div>
        <div class="header-actions">
          <div class="header-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="검색어를 입력하세요" /></div>
          <button class="icon-btn" title="알림"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="badge"></span></button>
          <div class="header-avatar">박</div>
        </div>
      </header>

      <div class="content">
        <div class="page-header">
          <div class="page-title">QT 작성</div>
          <div class="page-desc">오늘의 말씀과 묵상 내용을 작성하고 등록합니다.</div>
        </div>

        <section class="card">
          <div class="card-header"><div class="card-title">기본 정보</div></div>
          <div class="card-body">
            <div class="basic-info">
              <div class="form-group"><label>제목</label><input type="text" v-model="form.title" placeholder="QT 제목을 입력하세요" /></div>
              <div class="form-group"><label>날짜</label><input type="date" v-model="form.date" /></div>
              <div class="form-group"><label>작성자</label><input type="text" v-model="form.author" placeholder="작성자를 입력하세요" /></div>
              <div class="form-group">
                <label>태그</label>
                <div class="tag-input-container">
                  <span class="tag-chip" v-for="(tag, i) in form.tags" :key="i">{{ tag }}<span class="tag-chip-remove" @click="removeTag(i)">×</span></span>
                  <input type="text" v-model="tagInput" placeholder="태그 입력 후 Enter" @keydown.enter.prevent="addTag" />
                </div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div class="form-group">
                <label style="margin-bottom: 8px;">공개여부</label>
                <div class="visibility-toggle">
                  <div class="visibility-option" :class="{ selected: form.visibility === 'public' }" @click="form.visibility = 'public'">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    공개
                  </div>
                  <div class="visibility-option" :class="{ selected: form.visibility === 'private' }" @click="form.visibility = 'private'">
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    비공개
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="middle">
          <section class="middle-card">
            <div class="middle-header">
              <div class="middle-title">말씀</div>
              <div class="tabs">
                <button class="tab" :class="{ active: bibleTab === 'new' }" @click="bibleTab = 'new'">새번역</button>
                <button class="tab" :class="{ active: bibleTab === 'english' }" @click="bibleTab = 'english'">영어 (NIV)</button>
                <button class="tab" :class="{ active: bibleTab === 'modern' }" @click="bibleTab = 'modern'">현대인</button>
              </div>
            </div>
            <div class="bible-content" v-html="bibleText"></div>
          </section>
          <section class="middle-card">
            <div class="middle-header"><div class="middle-title">내용</div></div>
            <div class="content-editor"><textarea v-model="form.content" placeholder="묵상 내용을 입력하세요."></textarea></div>
          </section>
        </div>

        <div class="bottom-buttons">
          <button class="btn btn-cancel" @click="handleCancel">취소</button>
          <button class="btn btn-save" @click="handleSave">저장하기</button>
        </div>
      </div>
    </div>
  </div>

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
import { qtApi } from '@/api'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const systemOpen = ref(false)
const bibleTab = ref<'new' | 'english' | 'modern'>('new')
const tagInput = ref('')

const form = reactive({
  title: '', date: new Date().toISOString().slice(0, 10), author: '',
  tags: [] as string[], visibility: 'public' as 'public' | 'private', content: '',
})

const toastVisible = ref(false)
const toastMsg = ref('')

const bibleTexts = {
  new: `<span class="verse-number">1</span> 여호와께서 나의 목자이시므로, 내게 부족한 것이 없으리로다.<br>
    <span class="verse-number">2</span> 그가 나를 푸른 초장에 누이시며, 잔잔한 물가로 인도하시는도다.<br>
    <span class="verse-number">3</span> 내 영혼을 소생시키시며, 자기 이름을 위하여 의의 길로 인도하시는도다.<br>
    <span class="verse-number">4</span> 내가 비록 사망의 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께하심이라 주의 지팡이와 주의 막대기가 나를 안위하시나이다.<br>
    <span class="verse-number">5</span> 주께서 내 원수의 목전에서 내게 상을 베푸시고, 기름으로 내 머리에 바르셨으니 내 잔이 넘치나이다.<br>
    <span class="verse-number">6</span> 나의 평생에 선하심과 인자하심이 정녕 나를 따르리니, 내가 여호와의 집에 영원히 거하리로다.`,
  english: `<span class="verse-number">1</span> The LORD is my shepherd, I lack nothing.<br>
    <span class="verse-number">2</span> He makes me lie down in green pastures, he leads me beside quiet waters.<br>
    <span class="verse-number">3</span> He refreshes my soul. He guides me along the right paths for his name's sake.<br>
    <span class="verse-number">4</span> Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.<br>
    <span class="verse-number">5</span> You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.<br>
    <span class="verse-number">6</span> Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.`,
  modern: `<span class="verse-number">1</span> 주님께서 나의 목자이시니, 내가 아쉬울 것이 없습니다.<br>
    <span class="verse-number">2</span> 주님께서 나를 푸른 풀밭에 누이시며, 잔잔한 시냇가로 인도하십니다.<br>
    <span class="verse-number">3</span> 나의 생명을 새롭게 하시며, 주님의 이름을 위하여 바른길로 인도하십니다.<br>
    <span class="verse-number">4</span> 내가 비록 어둠의 골짜기로 다닐지라도, 재앙을 두려워하지 않을 것은 주님께서 나와 함께 하시기 때문입니다. 주님의 지팡이와 막대기가 나를 안심시킵니다.<br>
    <span class="verse-number">5</span> 주님께서 나의 원수가 보는 앞에서 잔치를 베푸시고, 나의 머리에 기름을 부으셔서, 나의 잔이 넘치게 하십니다.<br>
    <span class="verse-number">6</span> 주님의 인자하심과 선하심이 내가 사는 모든 날에 나를 따를 것이니, 내가 주님의 집에 영원히 살겠습니다.`,
}

const bibleText = computed(() => bibleTexts[bibleTab.value])

function addTag() { const v = tagInput.value.trim(); if (v) { form.tags.push(v); tagInput.value = '' } }
function removeTag(i: number) { form.tags.splice(i, 1) }
function showToast(msg: string) { toastMsg.value = msg; toastVisible.value = true; setTimeout(() => { toastVisible.value = false }, 2800) }

async function handleSave() {
  try {
    const id = route.params.id
    if (id && id !== 'new') { await qtApi.update(Number(id), form) } else { await qtApi.create(form) }
    showToast('QT가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/qts'), 1000)
  } catch (e) { showToast('저장 중 오류가 발생했습니다.') }
}

function handleCancel() { if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) { router.push('/qts') } }

onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'new') {
    try { const res = await qtApi.getById(Number(id)); Object.assign(form, res.data) } catch (e) { console.error('QT 조회 실패:', e) }
  }
})
</script>

<style scoped>
@import './_shared-layout.css';
</style>