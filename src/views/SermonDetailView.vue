<template>
  <div class="page-header">
    <div class="page-title">설교 작성</div>
    <div class="page-desc">설교 말씀과 내용을 작성하고 등록합니다.</div>
  </div>

  <!-- 기본 정보 -->
  <section class="card">
    <div class="card-header"><div class="card-title">기본 정보</div></div>
    <div class="card-body">
      <!-- 첫 줄: 제목, 날짜, 설교자 -->
      <div class="basic-info-first">
        <div class="form-group">
          <label>제목</label>
          <input type="text" v-model="form.title" placeholder="설교 제목을 입력하세요" />
        </div>
        <div class="form-group form-date">
          <label>날짜</label>
          <input type="date" v-model="form.date" />
        </div>
        <div class="form-group">
          <label>설교자</label>
          <div class="preacher-select-container">
            <select v-model="form.preacherCode" @change="onPreacherChange" :disabled="directInput" class="preacher-select">
              <option value="">선택하세요</option>
              <option v-for="p in preacherOptions" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
            <label class="direct-input-check">
              <input type="checkbox" v-model="directInput" @change="onDirectInputChange" />
              직접 입력
            </label>
            <input v-if="directInput" type="text" v-model="form.preacher" placeholder="설교자를 입력하세요" class="preacher-direct-input" />
          </div>
        </div>
      </div>
      <!-- 아래 줄: 성경 구절, 태그 -->
      <div class="basic-info-second">
        <div class="form-group form-bible">
          <label>성경 구절</label>
          <div class="bible-select-row">
            <select v-model="form.bibleTestament" @change="onTestamentChange" class="bible-testament-select">
              <option value="">신구약</option>
              <option value="old">구약</option>
              <option value="new">신약</option>
            </select>
            <select v-model="form.bibleBook" :disabled="!form.bibleTestament" @change="onBookChange" class="bible-book-select">
              <option value="">성경</option>
              <option v-for="book in filteredBooks" :key="book.code" :value="book.code">{{ book.nameKr }}</option>
            </select>
            <select v-model="form.chapterFrom" :disabled="!form.bibleBook" @change="onChapterFromChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseFrom" :disabled="!form.bibleBook" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseFromOptions" :key="v" :value="v">{{ v }}</option>
            </select>
            <span class="bible-range-sep">~</span>
            <select v-model="form.chapterTo" :disabled="!form.bibleBook" @change="onChapterToChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseTo" :disabled="!form.bibleBook" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseToOptions" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
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
          <button class="tab" :class="{ active: bibleTab === 'gae' }" @click="changeBibleTab('gae')">개역개정</button>
          <button class="tab" :class="{ active: bibleTab === 'sae' }" @click="changeBibleTab('sae')">새번역</button>
        </div>
      </div>
      <div class="bible-content">
        <div v-if="bibleLoading" class="bible-loading">성경 불러오는 중...</div>
        <div v-else-if="bibleVerses.length > 0" v-html="bibleTextHtml"></div>
        <div v-else class="bible-empty">성경 구절을 선택하면 본문이 표시됩니다.</div>
      </div>
    </section>

    <section class="middle-card">
      <div class="middle-header"><div class="middle-title">설교 내용</div></div>
      <div class="content-editor">
        <RichTextEditor v-model="form.content" />
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
import '@/assets/css/sermon-detail.css'
import '@/assets/css/rich-text-editor.css'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sermonApi, bibleApi, commonCodeApi } from '@/api'
import { useToast } from '@/composables/useToast'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const bibleTab = ref<'gae' | 'sae'>('gae')
const tagInput = ref('')
const bibleLoading = ref(false)

// 설교자 관련
const preacherOptions = ref<{ code: string; name: string }[]>([])
const directInput = ref(false)

// 두 버전의 성경 구절을 모두 캐싱 — 탭 전환 시 즉시 표시
const bibleCache = ref<{ gae: any[]; sae: any[] }>({ gae: [], sae: [] })

// 성경 책 목록 — DB에서 가져옴 (book_code + book_name_kr)
interface BookInfo {
  code: string
  nameKr: string
  testament: string
  chapterCount: number
}

const allBooks = ref<BookInfo[]>([])

// 책별 최대 장 수
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

// 한글 책 이름 → book_code 매핑
const bookNameToCode: Record<string, string> = {
  '창세기': 'Gen', '출애굽기': 'Ex', '레위기': 'Lev', '민수기': 'Num', '신명기': 'Deut',
  '여호수아': 'Josh', '사사기': 'Judg', '룻기': 'Ruth', '사무엘상': '1Sam', '사무엘하': '2Sam',
  '열왕기상': '1Kgs', '열왕기하': '2Kgs', '역대상': '1Chr', '역대하': '2Chr', '에스라': 'Ezra',
  '느헤미야': 'Neh', '에스더': 'Esth', '욥기': 'Job', '시편': 'Ps', '잠언': 'Prov',
  '전도서': 'Eccl', '아가': 'Song', '이사야': 'Isa', '예레미야': 'Jer', '예레미야 애가': 'Lam',
  '에스겔': 'Ezek', '다니엘': 'Dan', '호세아': 'Hos', '요엘': 'Joel', '아모스': 'Amos',
  '오바댜': 'Obad', '요나': 'Jonah', '미가': 'Mic', '나훔': 'Nah', '하박국': 'Hab',
  '스바냐': 'Zeph', '학개': 'Hag', '스가랴': 'Zech', '말라기': 'Mal',
  '마태복음': 'Matt', '마가복음': 'Mark', '누가복음': 'Luke', '요한복음': 'John',
  '사도행전': 'Acts', '로마서': 'Rom', '고린도전서': '1Cor', '고린도후서': '2Cor',
  '갈라디아서': 'Gal', '에베소서': 'Eph', '빌립보서': 'Phil', '골로새서': 'Col',
  '데살로니가전서': '1Thess', '데살로니가후서': '2Thess', '디모데전서': '1Tim', '디모데후서': '2Tim',
  '디도서': 'Titus', '빌레몬서': 'Phlm', '히브리서': 'Heb', '야고보서': 'Jas',
  '베드로전서': '1Pet', '베드로후서': '2Pet', '요한1서': '1John', '요한2서': '2John',
  '요한3서': '3John', '유다서': 'Jude', '요한계시록': 'Rev',
}

const filteredBooks = computed(() => {
  if (form.bibleTestament === 'old') return allBooks.value.filter(b => b.testament === 'old')
  if (form.bibleTestament === 'new') return allBooks.value.filter(b => b.testament === 'new')
  return allBooks.value
})

function onTestamentChange() {
  form.bibleBook = ''
  form.chapterFrom = ''
  form.verseFrom = ''
  form.chapterTo = ''
  form.verseTo = ''
  bibleCache.value = { gae: [], sae: [] }
}

const chapterOptions = computed(() => {
  if (!form.bibleBook) return []
  const max = bookMaxChapters[form.bibleBook] || 50
  return Array.from({ length: max }, (_, i) => i + 1)
})

const verseFromOptions = computed(() => {
  if (!form.bibleBook || !form.chapterFrom) return []
  // DB에서 해당 장의 최대 절 수를 아직 알 수 없으므로 176절까지 노출 (시편 119편이 최장)
  return Array.from({ length: 176 }, (_, i) => i + 1)
})

const verseToOptions = computed(() => {
  if (!form.bibleBook || !form.chapterTo) return []
  return Array.from({ length: 176 }, (_, i) => i + 1)
})

function onBookChange() {
  form.chapterFrom = ''
  form.verseFrom = ''
  form.chapterTo = ''
  form.verseTo = ''
  bibleCache.value = { gae: [], sae: [] }
}

function onChapterFromChange() {
  form.verseFrom = ''
  fetchBibleText()
}

function onChapterToChange() {
  form.verseTo = ''
  fetchBibleText()
}

// 오늘 날짜 (한국 시간 기준)
function getTodayKST(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

const form = reactive({
  title: '',
  date: getTodayKST(),
  preacher: '',
  preacherCode: '',
  bibleTestament: '',
  bibleBook: '',
  chapterFrom: '' as string | number,
  verseFrom: '' as string | number,
  chapterTo: '' as string | number,
  verseTo: '' as string | number,
  bibleRef: '',
  tags: [] as string[],
  content: '',
})

// 현재 탭에 표시할 구절
const bibleVerses = computed(() => bibleCache.value[bibleTab.value] || [])
const bibleTextHtml = computed(() => {
  if (bibleVerses.value.length === 0) return ''
  return bibleVerses.value
    .map(v => `<span class="verse-number">${v.verse}</span> ${v.content}`)
    .join('<br>\n')
})

// 성경 구절 조회 — 두 버전을 동시에 조회하여 캐싱
async function fetchBibleText() {
  if (!form.bibleBook || !form.chapterFrom) {
    bibleCache.value = { gae: [], sae: [] }
    return
  }

  const chapter = Number(form.chapterFrom)
  const verseFrom = form.verseFrom ? Number(form.verseFrom) : undefined
  const verseTo = form.verseTo ? Number(form.verseTo) : undefined

  bibleLoading.value = true
  try {
    // 두 버전을 병렬로 조회
    const [gaeRes, saeRes] = await Promise.all([
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 2),
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 3),
    ])
    bibleCache.value = {
      gae: gaeRes.data || [],
      sae: saeRes.data || [],
    }
  } catch (e: any) {
    console.error('성경 조회 실패:', e)
    bibleCache.value = { gae: [], sae: [] }
  } finally {
    bibleLoading.value = false
  }
}

// 탭 전환 — 캐시에서 즉시 표시 (재조회 없음)
function changeBibleTab(tab: 'gae' | 'sae') {
  bibleTab.value = tab
}

// 설교자 선택 시
function onPreacherChange() {
  const selected = preacherOptions.value.find(p => p.code === form.preacherCode)
  form.preacher = selected ? selected.name : ''
}

// 직접 입력 체크박스 변경 시
function onDirectInputChange() {
  if (directInput.value) {
    form.preacherCode = ''
    form.preacher = ''
  } else {
    form.preacher = ''
  }
}

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

// 성경 구절을 하나의 문자열로 조합
function getBibleRefString(): string {
  if (!form.bibleBook) return form.bibleRef || ''
  const bookName = allBooks.value.find(b => b.code === form.bibleBook)?.nameKr || form.bibleBook
  const from = `${form.chapterFrom || ''}${form.verseFrom ? ':' + form.verseFrom : ''}`
  const toPart = form.chapterTo || form.verseTo
  if (toPart) {
    const to = `${form.chapterTo || ''}${form.verseTo ? ':' + form.verseTo : ''}`
    return `${bookName} ${from} ~ ${to}`
  }
  return `${bookName} ${from}`.trim()
}

async function handleSave() {
  try {
    const payload = {
      title: form.title,
      sermonDate: form.date,
      preacher: form.preacher,
      bibleRef: getBibleRefString(),
      content: form.content,
    }
    const id = route.params.id
    if (id && id !== 'new') {
      await sermonApi.update(Number(id), payload)
    } else {
      await sermonApi.create(payload)
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
  // 설교자 공통코드 로드
  try {
    const res = await commonCodeApi.getAll('preacher')
    preacherOptions.value = (res.data || []).map((c: any) => ({
      code: c.code,
      name: c.codeName,
    }))
  } catch (e) {
    console.error('설교자 공통코드 로드 실패:', e)
  }

  // 성경 책 목록 로드
  try {
    const res = await bibleApi.getBooks(2)
    allBooks.value = (res.data || []).map((b: any) => ({
      code: b.bookCode,
      nameKr: b.bookNameKr,
      testament: b.testament,
      chapterCount: bookMaxChapters[b.bookCode] || 50,
    }))
  } catch (e) {
    console.error('성경 책 목록 로드 실패:', e)
  }

  const id = route.params.id
  if (id && id !== 'new') {
    try {
      const res = await sermonApi.getById(Number(id))
      const data = res.data
      form.title = data.title || ''
      form.date = data.sermonDate || data.date || ''
      form.preacher = data.preacher || ''
      // 기존 설교자가 공통코드에 있으면 select 매핑, 없으면 직접 입력 모드
      const matched = preacherOptions.value.find(p => p.name === data.preacher)
      if (matched) {
        form.preacherCode = matched.code
        directInput.value = false
      } else if (data.preacher) {
        directInput.value = true
      }
      form.content = data.content || ''
      // bibleRef 파싱 — 다양한 형식 지원
      if (data.bibleRef) {
        parseBibleRef(data.bibleRef)
      }
    } catch (e) {
      console.error('설교 조회 실패:', e)
    }
  }
})

// bibleRef 문자열을 파싱하여 select 박스에 설정
async function parseBibleRef(bibleRef: string) {
  // 형식1: "고린도전서 1:18 ~ 1:25" (장:절 ~ 장:절)
  let match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)\s*~\s*(\d+):(\d+)$/)
  if (match) {
    const bookCode = bookNameToCode[match[1].trim()]
    if (bookCode) {
      setBibleSelection(bookCode, match[2], match[3], match[4], match[5])
      return
    }
  }
  // 형식2: "고린도전서 1:18~25" (장:절~절)
  match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)~(\d+)$/)
  if (match) {
    const bookCode = bookNameToCode[match[1].trim()]
    if (bookCode) {
      setBibleSelection(bookCode, match[2], match[3], match[2], match[4])
      return
    }
  }
  // 형식3: "마태복음 5:1 ~ 5:6"
  match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)\s*~\s*(\d+):(\d+)$/)
  if (match) {
    const bookCode = bookNameToCode[match[1].trim()]
    if (bookCode) {
      setBibleSelection(bookCode, match[2], match[3], match[4], match[5])
      return
    }
  }
  // 형식4: "요한복음 3:16" (단일 장:절)
  match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)$/)
  if (match) {
    const bookCode = bookNameToCode[match[1].trim()]
    if (bookCode) {
      setBibleSelection(bookCode, match[2], match[3], '', '')
      return
    }
  }
  // 형식5: "창세기 1" (장만)
  match = bibleRef.match(/^(.+?)\s+(\d+)$/)
  if (match) {
    const bookCode = bookNameToCode[match[1].trim()]
    if (bookCode) {
      setBibleSelection(bookCode, match[2], '', '', '')
      return
    }
  }
  // 파싱 실패 — 원본 그대로 저장
  form.bibleRef = bibleRef
}

// 성경 선택 설정 후 본문 조회
async function setBibleSelection(bookCode: string, chFrom: string, vFrom: string, chTo: string, vTo: string) {
  const book = allBooks.value.find(b => b.code === bookCode)
  if (book) {
    form.bibleTestament = book.testament
  }
  form.bibleBook = bookCode
  form.chapterFrom = chFrom
  form.verseFrom = vFrom
  form.chapterTo = chTo
  form.verseTo = vTo
  // 성경 본문 조회
  await fetchBibleText()
}
</script>