<template>
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
        <div class="tabs" v-if="form.bibleText">
          <button class="tab" :class="{ active: bibleTab === 'gae' }" @click="bibleTab = 'gae'">개역개정</button>
          <button class="tab" :class="{ active: bibleTab === 'sae' }" @click="bibleTab = 'sae'">새번역</button>
          <button class="tab" :class="{ active: bibleTab === 'niv' }" @click="bibleTab = 'niv'">NIV</button>
        </div>
      </div>
      <div class="bible-content">
        <div v-if="bibleLoading" class="bible-loading">말씀을 불러오는 중...</div>
        <div v-else-if="form.bibleText" v-html="form.bibleText"></div>
        <div v-else class="bible-empty">말씀이 없습니다. 큐티 설정을 확인해주세요.</div>
      </div>
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
</template>

<script setup lang="ts">
import '@/assets/css/qt-detail.css'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { qtApi, qtDailyApi, userApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const tagInput = ref('')
const bibleTab = ref<'gae' | 'sae' | 'niv'>('gae')
const bibleLoading = ref(false)
const userId = 1 // admin (임시 — 로그인 연동 후 변경)

// 마이페이지 설정에서 가져온 값
const userSettings = reactive({
  bibleVersion: 'gae',
  qtSource: 'duranno',
})

// 크롤링된 QT 데이터 (qt_daily에서 가져온 원본)
const crawledQt = ref<any>(null)

const form = reactive({
  title: '',
  date: getTodayKST(),
  tags: [] as string[],
  visibility: 'public' as 'public' | 'private',
  bibleRef: '',
  bibleText: '',
  content: '',
})

// 오늘 날짜 (한국 시간)
function getTodayKST(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

function addTag() { const v = tagInput.value.trim(); if (v) { form.tags.push(v); tagInput.value = '' } }
function removeTag(i: number) { form.tags.splice(i, 1) }

async function loadUserSettings() {
  try {
    const res = await userApi.getById(userId)
    userSettings.bibleVersion = res.data.bibleVersion || 'gae'
    userSettings.qtSource = res.data.qtSource || 'duranno'
  } catch (e) {
    console.error('사용자 설정 조회 실패:', e)
  }
}

async function loadTodayQt() {
  if (userSettings.qtSource === 'manual') {
    // 직접 입력 — 크롤링 데이터 없이 현재 페이지대로
    return
  }

  bibleLoading.value = true
  try {
    const res = await qtDailyApi.getToday(userSettings.qtSource)
    const data = res.data
    if (data) {
      crawledQt.value = data
      form.title = data.title || ''
      form.bibleRef = data.bibleRef || ''
      form.bibleText = data.bibleText || ''
      form.content = data.prayer || ''
      // 디폴트 탭을 사용자 설정에 맞게
      bibleTab.value = userSettings.bibleVersion as 'gae' | 'sae' | 'niv'
    }
  } catch (e) {
    console.error('오늘 QT 조회 실패:', e)
  } finally {
    bibleLoading.value = false
  }
}

async function handleSave() {
  try {
    const payload = {
      title: form.title,
      qtDate: form.date,
      bibleRef: form.bibleRef,
      bibleText: form.bibleText,
      content: form.content,
      visibility: form.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
      userId: userId,
    }
    const id = route.params.id
    if (id && id !== 'new') {
      await qtApi.update(Number(id), payload)
    } else {
      await qtApi.create(payload)
    }
    showToast('QT가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/qts'), 1000)
  } catch (e) {
    showToast('저장 중 오류가 발생했습니다.')
  }
}

function handleCancel() {
  if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) {
    router.push('/qts')
  }
}

onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'new') {
    // 수정 모드 — 기존 QT 데이터 로드
    try {
      const res = await qtApi.getById(Number(id))
      const data = res.data
      form.title = data.title || ''
      form.date = data.qtDate || data.date || ''
      form.bibleRef = data.bibleRef || ''
      form.bibleText = data.bibleText || ''
      form.content = data.content || ''
      form.visibility = (data.visibility || 'PUBLIC').toLowerCase() === 'public' ? 'public' : 'private'
    } catch (e) {
      console.error('QT 조회 실패:', e)
    }
  } else {
    // 등록 모드 — 마이페이지 설정 로드 후 오늘 QT 가져오기
    await loadUserSettings()
    await loadTodayQt()
  }
})
</script>