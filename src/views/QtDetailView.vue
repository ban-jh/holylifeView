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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { qtApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const bibleTab = ref<'new' | 'english' | 'modern'>('new')
const tagInput = ref('')

const form = reactive({
  title: '', date: new Date().toISOString().slice(0, 10), author: '',
  tags: [] as string[], visibility: 'public' as 'public' | 'private', content: '',
})

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
@import './_shared-content.css';
</style>