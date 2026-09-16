<template>
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sermonApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const bibleTab = ref<'new' | 'english' | 'modern'>('new')
const tagInput = ref('')

const form = reactive({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  preacher: '',
  tags: [] as string[],
  content: '',
})

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
@import './_shared-content.css';
</style>