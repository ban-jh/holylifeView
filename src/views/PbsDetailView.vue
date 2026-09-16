<template>
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
</template>

<script setup lang="ts">
import '@/assets/css/pbs-detail.css'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pbsApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

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
