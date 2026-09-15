<template>
  <div class="layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon"><svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z"/><path d="M12 22V12"/><path d="M3 7l9 5 9-5"/></svg></div>
        <div><div class="sidebar-logo-text">말씀 관리자</div><div class="sidebar-logo-sub">Word Admin Console</div></div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">메인 메뉴</div>
        <RouterLink to="/pbs" class="nav-link active"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span class="nav-link-label">P.B.S (성경공부)</span></RouterLink>
        <RouterLink to="/qts" class="nav-link"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span class="nav-link-label">Q.T</span></RouterLink>
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
        <div class="breadcrumb"><span class="breadcrumb-item">P.B.S</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-item current">성경 콘텐츠 작성</span></div>
        <div class="header-actions">
          <div class="header-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="검색어를 입력하세요" /></div>
          <button class="icon-btn" title="알림"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="badge"></span></button>
          <div class="header-avatar">박</div>
        </div>
      </header>

      <div class="content">
        <div class="page-header">
          <div class="page-title">성경 콘텐츠 작성</div>
          <div class="page-desc">성경 말씀과 관련된 묵상 및 공부 콘텐츠를 작성하고 등록합니다.</div>
        </div>

        <!-- 기본 정보 -->
        <section class="card">
          <div class="card-header"><div class="card-title">기본 정보</div></div>
          <div class="card-body">
            <div class="basic-info">
              <div class="form-group"><label>제목</label><input type="text" v-model="form.title" placeholder="콘텐츠 제목을 입력하세요" /></div>
              <div class="form-group"><label>날짜</label><input type="date" v-model="form.date" /></div>
              <div class="form-group">
                <label>성경 구절</label>
                <div class="bible-reference">
                  <select v-model="form.bookFrom"><option>창세기</option><option>출애굽기</option><option>레위기</option><option>민수기</option><option>신명기</option><option>마태복음</option><option>요한복음</option></select>
                  <div class="arrow">~</div>
                  <select v-model="form.bookTo"><option>창세기</option><option>출애굽기</option><option>레위기</option><option>민수기</option><option>신명기</option><option>마태복음</option><option>요한복음</option></select>
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
            <div class="middle-header"><div class="middle-title">묵상 및 설명</div></div>
            <div class="content-editor">
              <input type="text" v-model="form.contentTitle" placeholder="내용 제목" />
              <textarea v-model="form.content" placeholder="성경 말씀에 대한 설명이나 묵상 내용을 입력하세요."></textarea>
            </div>
          </section>
        </div>

        <!-- 참고자료 -->
        <section class="card">
          <div class="card-header"><div class="card-title">참고자료</div></div>
          <div class="card-body" style="padding-top: 10px;">
            <div class="reference-tabs">
              <button class="reference-tab" :class="{ active: refTab === 'url' }" @click="refTab = 'url'">🔗 URL</button>
              <button class="reference-tab" :class="{ active: refTab === 'image' }" @click="refTab = 'image'">🖼 이미지</button>
              <button class="reference-tab" :class="{ active: refTab === 'document' }" @click="refTab = 'document'">📄 문서</button>
              <button class="reference-tab" :class="{ active: refTab === 'map' }" @click="refTab = 'map'">🗺 지도</button>
            </div>
            <div class="reference-content">
              <div v-if="refTab === 'url'">
                <div class="form-group">
                  <label style="margin-bottom:6px;">URL 링크</label>
                  <div class="url-row">
                    <input type="url" v-model="refUrl" placeholder="https://example.com" />
                    <button class="btn btn-cancel" type="button" @click="refUrls.push(refUrl); refUrl = ''">+ URL 추가</button>
                  </div>
                </div>
              </div>
              <div v-if="refTab === 'image'">
                <div class="upload-area" @click="($refs.imageFile as HTMLInputElement).click()">
                  <div class="upload-icon">🖼</div>
                  <div>이미지를 클릭하여 등록하세요</div>
                  <small style="color:var(--text-muted);">JPG, PNG, WEBP</small>
                </div>
                <input type="file" ref="imageFile" accept="image/*" style="display:none" />
              </div>
              <div v-if="refTab === 'document'">
                <div class="document-row">
                  <div class="document-info">
                    <div class="document-icon">📄</div>
                    <div><strong>창세기_연구자료.pdf</strong><div style="font-size:12px; color:var(--text-muted); margin-top:2px;">PDF · 2.4 MB</div></div>
                  </div>
                  <button class="btn btn-cancel" type="button">파일 선택</button>
                </div>
              </div>
              <div v-if="refTab === 'map'">
                <div class="map-search">
                  <input type="text" v-model="mapQuery" placeholder="관련 장소를 검색하세요" />
                  <button class="btn btn-cancel" type="button">검색</button>
                </div>
                <div class="map-area">🗺 지도 영역</div>
              </div>
            </div>
          </div>
        </section>

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
import { pbsApi } from '@/api'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const systemOpen = ref(false)
const bibleTab = ref<'new' | 'english' | 'modern'>('new')
const refTab = ref<'url' | 'image' | 'document' | 'map'>('url')
const refUrl = ref('')
const refUrls = ref<string[]>([])
const mapQuery = ref('')
const imageFile = ref<HTMLInputElement | null>(null)

const form = reactive({
  title: '', date: new Date().toISOString().slice(0, 10),
  bookFrom: '창세기', bookTo: '창세기',
  contentTitle: '', content: '',
})

const toastVisible = ref(false)
const toastMsg = ref('')

const bibleTexts = {
  new: `<span class="verse-number">1</span> 태초에 하나님이 천지를 창조하셨다.<br>
    <span class="verse-number">2</span> 땅이 혼돈하고 공허하며, 어둠이 깊음 위에 있고 하나님의 영은 물 위에 움직이고 계셨다.<br>
    <span class="verse-number">3</span> 하나님이 말씀하시기를 "빛이 생겨라" 하시니, 빛이 생겼다.`,
  english: `<span class="verse-number">1</span> In the beginning God created the heavens and the earth.<br>
    <span class="verse-number">2</span> Now the earth was formless and empty, darkness was over the surface of the deep.<br>
    <span class="verse-number">3</span> And God said, "Let there be light," and there was light.`,
  modern: `<span class="verse-number">1</span> 태초에 하나님께서 하늘과 땅을 만드셨습니다.<br>
    <span class="verse-number">2</span> 땅은 아직 형태가 없고 아무것도 없었으며 어둠이 깊은 물 위에 덮여 있었습니다.<br>
    <span class="verse-number">3</span> 하나님께서 "빛이 생겨라"라고 말씀하시자 빛이 생겼습니다.`,
}

const bibleText = computed(() => bibleTexts[bibleTab.value])

function showToast(msg: string) { toastMsg.value = msg; toastVisible.value = true; setTimeout(() => { toastVisible.value = false }, 2800) }

async function handleSave() {
  try {
    const id = route.params.id
    if (id && id !== 'new') { await pbsApi.update(Number(id), form) } else { await pbsApi.create(form) }
    showToast('성경 공부 콘텐츠가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/pbs'), 1000)
  } catch (e) { showToast('저장 중 오류가 발생했습니다.') }
}

function handleCancel() { if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) { router.push('/pbs') } }

onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'new') {
    try { const res = await pbsApi.getById(Number(id)); Object.assign(form, res.data) } catch (e) { console.error('PBS 조회 실패:', e) }
  }
})
</script>

<style scoped>
@import './_shared-layout.css';
</style>