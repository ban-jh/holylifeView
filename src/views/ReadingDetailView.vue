<template>
  <div class="page-header">
    <div class="page-title">독서 노트 작성</div>
    <div class="page-desc">읽은 책의 정보와 요약, 느낀점을 기록합니다.</div>
  </div>

  <!-- 중앙 영역: 책 정보 / 요약·느낀점 -->
  <div class="middle reading-middle">
    <!-- 왼쪽: 책 정보 -->
    <section class="middle-card">
      <div class="middle-header"><div class="middle-title">책 정보</div></div>
      <div class="book-info-body">
        <!-- 책 표지 -->
        <div class="book-cover-upload">
          <div class="book-cover-preview" :style="coverStyle">
            <svg v-if="!form.coverUrl" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div class="book-cover-actions">
            <button class="btn btn-upload" type="button" @click="($refs.coverFile as HTMLInputElement).click()">
              <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              이미지 업로드
            </button>
            <button class="btn btn-upload" type="button" @click="removeCover">
              <svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              이미지 삭제
            </button>
            <input type="file" ref="coverFile" accept="image/*" style="display:none" @change="previewCover" />
          </div>
        </div>

        <!-- 책 정보 입력 -->
        <div class="form-group"><label>책제목</label><input type="text" v-model="form.bookTitle" placeholder="책 제목을 입력하세요" /></div>
        <div class="form-group"><label>날짜</label><input type="date" v-model="form.date" /></div>
        <div class="form-group"><label>목차</label><textarea v-model="form.toc" placeholder="읽은 목차를 입력하세요 (여러 줄 입력 가능)" rows="4"></textarea></div>
        <div class="info-grid">
          <div class="form-group"><label>저자</label><input type="text" v-model="form.author" placeholder="저자를 입력하세요" /></div>
          <div class="form-group"><label>옮긴이</label><input type="text" v-model="form.translator" placeholder="옮긴이를 입력하세요" /></div>
        </div>
      </div>
    </section>

    <!-- 오른쪽: 요약 & 느낀점 -->
    <section class="middle-card">
      <div class="middle-header"><div class="middle-title">독서 내용</div></div>
      <div class="content-editor">
        <div class="editor-section summary">
          <label>요약</label>
          <textarea v-model="form.summary" placeholder="책의 내용을 요약하여 입력하세요."></textarea>
        </div>
        <div class="editor-section impression">
          <label>느낀점</label>
          <textarea v-model="form.impression" placeholder="책을 읽고 느낀 점을 입력하세요."></textarea>
        </div>
      </div>
    </section>
  </div>

  <div class="bottom-buttons">
    <button class="btn btn-cancel" @click="handleCancel">취소</button>
    <button class="btn btn-save" @click="handleSave">저장하기</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { readingApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()
const coverFile = ref<HTMLInputElement | null>(null)

const form = reactive({
  bookTitle: '', date: new Date().toISOString().slice(0, 10),
  author: '', translator: '', toc: '',
  summary: '', impression: '', coverUrl: '',
})

const coverStyle = computed(() => {
  if (form.coverUrl) {
    return { background: `url(${form.coverUrl}) center/cover` }
  }
  return {}
})

function previewCover(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.coverUrl = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

function removeCover() {
  form.coverUrl = ''
  if (coverFile.value) coverFile.value.value = ''
}

async function handleSave() {
  try {
    const id = route.params.id
    if (id && id !== 'new') { await readingApi.update(Number(id), form) } else { await readingApi.create(form) }
    showToast('독서 노트가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/readings'), 1000)
  } catch (e) { showToast('저장 중 오류가 발생했습니다.') }
}

function handleCancel() { if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) { router.push('/readings') } }

onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'new') {
    try { const res = await readingApi.getById(Number(id)); Object.assign(form, res.data) } catch (e) { console.error('독서 노트 조회 실패:', e) }
  }
})
</script>

<style scoped>
@import './_shared-content.css';

.reading-middle {
  grid-template-columns: 380px 1fr;
}
</style>