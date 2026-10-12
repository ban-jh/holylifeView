<template>
  <div class="page-header">
    <div class="page-title">QT 작성</div>
    <div class="page-desc">오늘의 말씀과 묵상 내용을 작성하고 등록합니다.</div>
  </div>

  <!-- 기본 정보 -->
  <section class="card">
    <div class="card-header"><div class="card-title">기본 정보</div></div>
    <div class="card-body">
      <div class="basic-info">
        <div class="form-group"><label>제목</label><input type="text" v-model="form.title" placeholder="QT 제목을 입력하세요" /></div>
        <div class="form-group"><label>날짜</label><input type="date" v-model="form.date" /></div>
      </div>

      <!-- 성경 구절 선택 — 항상 표시, 직접 입력 모드만 수정 가능 -->
      <div class="basic-info" style="margin-top: 20px;">
        <div class="form-group form-bible">
          <label>성경 구절</label>
          <div class="bible-select-row">
            <select v-model="form.bibleTestament" :disabled="!isManualMode" @change="onTestamentChange" class="bible-testament-select">
              <option value="">신구약</option>
              <option value="old">구약</option>
              <option value="new">신약</option>
            </select>
            <select v-model="form.bibleBook" :disabled="!isManualMode" @change="onBookChange" class="bible-book-select">
              <option value="">성경</option>
              <option v-for="book in filteredBooks" :key="book.code" :value="book.code">{{ book.nameKr }}</option>
            </select>
            <select v-model="form.chapterFrom" :disabled="!isManualMode" @change="onChapterFromChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseFrom" :disabled="!isManualMode" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseFromOptions" :key="v" :value="v">{{ v }}</option>
            </select>
            <span class="bible-range-sep">~</span>
            <select v-model="form.chapterTo" :disabled="!isManualMode" @change="onChapterToChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterOptions" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseTo" :disabled="!isManualMode" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseToOptions" :key="v" :value="v">{{ v }}</option>
            </select>
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

  <!-- 중앙 영역 -->
  <div class="middle">
    <!-- 말씀 영역 -->
    <section class="middle-card">
      <div class="middle-header">
        <div class="middle-title">말씀</div>
        <!-- 항상 3개 탭 표시 -->
        <div class="tabs">
          <button class="tab" :class="{ active: bibleTab === 'gae' }" @click="changeBibleTab('gae')">개역개정</button>
          <button class="tab" :class="{ active: bibleTab === 'sae' }" @click="changeBibleTab('sae')">새번역</button>
          <button class="tab" :class="{ active: bibleTab === 'niv' }" @click="changeBibleTab('niv')">NIV</button>
        </div>
      </div>
      <div class="bible-content">
        <div v-if="bibleLoading" class="bible-loading">성경 불러오는 중...</div>
        <div v-else-if="bibleVerses.length > 0" v-html="bibleTextHtml"></div>
        <div v-else class="bible-empty">
          <template v-if="isManualMode">성경 구절을 선택하면 본문이 표시됩니다.</template>
          <template v-else>해당 날짜의 큐티 말씀이 없습니다.</template>
        </div>
      </div>
    </section>

    <!-- 묵상 내용 -->
    <section class="middle-card">
      <div class="middle-header"><div class="middle-title">내용</div></div>
      <div class="content-editor"><RichTextEditor v-model="form.content" /></div>
    </section>
  </div>

  <!-- 하단 버튼 -->
  <div class="bottom-buttons">
    <button class="btn btn-cancel" @click="handleCancel">취소</button>
    <button class="btn btn-save" @click="handleSave">저장하기</button>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/qt-detail.css'
import '@/assets/css/sermon-detail.css'
import '@/assets/css/rich-text-editor.css'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { qtApi, qtDailyApi, userApi, bibleApi } from '@/api'
import { useToast } from '@/composables/useToast'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const tagInput = ref('')
const bibleLoading = ref(false)
const userId = 1

const bibleTab = ref<'gae' | 'sae' | 'niv'>('gae')
const bibleCache = ref<{ gae: any[]; sae: any[]; niv: any[] }>({ gae: [], sae: [], niv: [] })

const userSettings = reactive({ bibleVersion: 'gae', qtSource: 'duranno' })
const crawledQt = ref<any>(null)
const allBooks = ref<{ code: string; nameKr: string; testament: string; chapterCount: number }[]>([])

const isManualMode = computed(() => userSettings.qtSource === 'manual')

// 책 이름 → 코드 매핑 (bibleRef 파싱용)
const bookNameToCode: Record<string, string> = {
  '창세기':'Gen','출애굽기':'Ex','레위기':'Lev','민수기':'Num','신명기':'Deut',
  '여호수아':'Josh','사사기':'Judg','룻기':'Ruth','사무엘상':'1Sam','사무엘하':'2Sam',
  '열왕기상':'1Kgs','열왕기하':'2Kgs','역대상':'1Chr','역대하':'2Chr',
  '에스라':'Ezra','느헤미야':'Neh','에스더':'Esth','욥기':'Job','시편':'Ps',
  '잠언':'Prov','전도서':'Eccl','아가':'Song','이사야':'Isa','예레미야':'Jer',
  '예레미야애가':'Lam','에스겔':'Ezek','다니엘':'Dan','호세아':'Hos','요엘':'Joel',
  '아모스':'Amos','오바댜':'Obad','요나':'Jonah','미가':'Mic','나훔':'Nah',
  '하박국':'Hab','스바냐':'Zeph','학개':'Hag','스가랴':'Zech','말라기':'Mal',
  '마태복음':'Matt','마가복음':'Mk','누가복음':'Lk','요한복음':'Jn','사도행전':'Acts',
  '로마서':'Rom','고린도전서':'1Cor','고린도후서':'2Cor','갈라디아서':'Gal',
  '에베소서':'Eph','빌립보서':'Phil','골로새서':'Col','데살로니가전서':'1Thess',
  '데살로니가후서':'2Thess','디모데전서':'1Tim','디모데후서':'2Tim','디도서':'Titus',
  '빌레몬서':'Phlm','히브리서':'Heb','야고보서':'Jas','베드로전서':'1Pet',
  '베드로후서':'2Pet','요한1서':'1Jn','요한2서':'2Jn','요한3서':'3Jn',
  '유다서':'Jude','요한계시록':'Rev',
}

const bookMaxChapters: Record<string, number> = {
  Gen:50, Ex:40, Lev:27, Num:36, Deut:34, Josh:24, Judg:21, Ruth:4,
  '1Sam':31, '2Sam':24, '1Kgs':22, '2Kgs':25, '1Chr':29, '2Chr':36,
  Ezra:10, Neh:13, Esth:10, Job:42, Ps:150, Prov:31, Eccl:12, Song:8,
  Isa:66, Jer:52, Lam:5, Ezek:48, Dan:12, Hos:14, Joel:3, Amos:9,
  Obad:1, Jonah:4, Mic:7, Nah:3, Hab:3, Zeph:3, Hag:2, Zech:14, Mal:4,
  Matt:28, Mk:16, Lk:24, Jn:21, Acts:28, Rom:16, '1Cor':16, '2Cor':13,
  Gal:6, Eph:6, Phil:4, Col:4, '1Thess':5, '2Thess':3, '1Tim':6, '2Tim':4,
  Titus:3, Phlm:1, Heb:13, Jas:5, '1Pet':5, '2Pet':3, '1Jn':5, '2Jn':1,
  '3Jn':1, Jude:1, Rev:22,
}

function getTodayKST(): string {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

const form = reactive({
  title: '', date: getTodayKST(),
  visibility: 'public' as 'public' | 'private',
  bibleRef: '', content: '',
  bibleTestament: '', bibleBook: '',
  chapterFrom: '' as string | number, verseFrom: '' as string | number,
  chapterTo: '' as string | number, verseTo: '' as string | number,
})

const qtSourceLabel = computed(() => {
  if (userSettings.qtSource === 'duranno') return '두란노'
  if (userSettings.qtSource === 'sum') return '생명의삶'
  return '직접 입력'
})

const filteredBooks = computed(() => {
  if (!form.bibleTestament) return allBooks.value
  return allBooks.value.filter(b => b.testament === form.bibleTestament)
})

const chapterOptions = computed(() => {
  if (!form.bibleBook) return []
  const book = allBooks.value.find(b => b.code === form.bibleBook)
  const max = book?.chapterCount || bookMaxChapters[form.bibleBook] || 50
  return Array.from({ length: max }, (_, i) => i + 1)
})

const verseFromOptions = computed(() => {
  if (!form.bibleBook || !form.chapterFrom) return []
  return Array.from({ length: 200 }, (_, i) => i + 1)
})

const verseToOptions = computed(() => {
  if (!form.bibleBook || !form.chapterTo) return []
  return Array.from({ length: 200 }, (_, i) => i + 1)
})

const bibleVerses = computed(() => bibleCache.value[bibleTab.value] || [])

const bibleTextHtml = computed(() => {
  if (bibleVerses.value.length === 0) return ''
  return bibleVerses.value.map(v => `<span class="verse-number">${v.verse}</span> ${v.content}`).join('<br>\n')
})

function formatCrawledBible(text: string): string {
  return text.split('\n').map(line => {
    const match = line.match(/^(\d+)\s+(.+)/)
    if (match) return `<span class="verse-number">${match[1]}</span> ${match[2]}`
    return line
  }).join('<br>\n')
}

function formatCrawledText(text: string): string {
  if (!text) return ''
  return text.split('\n').map(l => l.trim()).filter(l => l).join('<br>\n')
}

function addTag() { const v = tagInput.value.trim(); if (v) { } }
function removeTag(i: number) { }

function onTestamentChange() { form.bibleBook=''; form.chapterFrom=''; form.verseFrom=''; form.chapterTo=''; form.verseTo=''; bibleCache.value={gae:[],sae:[],niv:[]} }
function onBookChange() { form.chapterFrom=''; form.verseFrom=''; form.chapterTo=''; form.verseTo=''; bibleCache.value={gae:[],sae:[],niv:[]} }
function onChapterFromChange() { form.chapterTo=form.chapterFrom; bibleCache.value={gae:[],sae:[],niv:[]} }
function onChapterToChange() { bibleCache.value={gae:[],sae:[],niv:[]} }

async function fetchBibleText() {
  if (!form.bibleBook || !form.chapterFrom) { bibleCache.value={gae:[],sae:[],niv:[]}; return }
  const chapter = Number(form.chapterFrom)
  const verseFrom = form.verseFrom ? Number(form.verseFrom) : undefined
  const verseTo = form.verseTo ? Number(form.verseTo) : undefined
  bibleLoading.value = true
  try {
    const [gaeRes, saeRes, nivRes] = await Promise.all([
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 2),
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 3),
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 6),
    ])
    bibleCache.value = { gae: gaeRes.data||[], sae: saeRes.data||[], niv: nivRes.data||[] }
  } catch (e) { console.error('성경 조회 실패:', e); bibleCache.value={gae:[],sae:[],niv:[]} }
  finally { bibleLoading.value = false }
}

function changeBibleTab(tab: 'gae'|'sae'|'niv') { bibleTab.value = tab }

function getBibleRefString(): string {
  if (!form.bibleBook) return form.bibleRef || ''
  const bookName = allBooks.value.find(b => b.code === form.bibleBook)?.nameKr || form.bibleBook
  const from = `${form.chapterFrom||''}${form.verseFrom?':'+form.verseFrom:''}`
  const toPart = form.chapterTo || form.verseTo
  if (toPart) { const to = `${form.chapterTo||''}${form.verseTo?':'+form.verseTo:''}`; return `${bookName} ${from} ~ ${to}` }
  return `${bookName} ${from}`.trim()
}

async function loadUserSettings() {
  try {
    const res = await userApi.getById(userId)
    userSettings.bibleVersion = res.data.bibleVersion || 'gae'
    userSettings.qtSource = res.data.qtSource || 'duranno'
    bibleTab.value = userSettings.bibleVersion as 'gae'|'sae'|'niv'
  } catch (e) { console.error('사용자 설정 조회 실패:', e) }
}

async function loadQtByDate(dateStr: string) {
  if (isManualMode.value) return
  bibleLoading.value = true
  crawledQt.value = null
  form.title = ''; form.bibleRef = ''; form.content = ''
  bibleCache.value = { gae: [], sae: [], niv: [] }
  try {
    const res = await qtDailyApi.getByDate(dateStr, userSettings.qtSource)
    const data = Array.isArray(res.data) ? res.data[0] : res.data
    if (data) {
      crawledQt.value = data
      form.title = data.title || ''
      form.bibleRef = data.bibleRef || ''
      form.content = data.prayer || ''
      // bibleRef 파싱하여 DB에서 3개 버전 조회
      if (data.bibleRef) {
        await parseBibleRefAndFetch(data.bibleRef)
      }
    }
  } catch (e) { console.error('QT 조회 실패:', e) }
  finally { bibleLoading.value = false }
}

// bibleRef 파싱 후 DB에서 3개 버전 조회
async function parseBibleRefAndFetch(bibleRef: string) {
  // "사사기(Judges) 16:15 - 16:31" 형태
  let match = bibleRef.match(/^(.+?)\s*\(.+?\)\s+(\d+):(\d+)\s*-\s*(\d+):(\d+)/)
  if (match) {
    const code = bookNameToCode[match[1].trim()]
    if (code) { await setBibleSelection(code, match[2], match[3], match[4], match[5]); return }
  }
  // "사사기 16:15-31" 형태
  match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)\s*-\s*(\d+)/)
  if (match) {
    const code = bookNameToCode[match[1].trim()]
    if (code) { await setBibleSelection(code, match[2], match[3], match[2], match[4]); return }
  }
  // "역대상 17 : 1~15" 형태
  match = bibleRef.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)~(\d+)/)
  if (match) {
    const code = bookNameToCode[match[1].trim()]
    if (code) { await setBibleSelection(code, match[2], match[3], match[2], match[4]); return }
  }
  // "역대상 18 : 9~17" 형태 (공백 변형)
  match = bibleRef.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)\s*~\s*(\d+)/)
  if (match) {
    const code = bookNameToCode[match[1].trim()]
    if (code) { await setBibleSelection(code, match[2], match[3], match[2], match[4]); return }
  }
  // "요한복음 3:16" 형태
  match = bibleRef.match(/^(.+?)\s+(\d+):(\d+)$/)
  if (match) {
    const code = bookNameToCode[match[1].trim()]
    if (code) { await setBibleSelection(code, match[2], match[3], '', ''); return }
  }
}

async function setBibleSelection(bookCode: string, chFrom: string, vFrom: string, chTo: string, vTo: string) {
  const book = allBooks.value.find(b => b.code === bookCode)
  if (book) form.bibleTestament = book.testament
  form.bibleBook = bookCode
  form.chapterFrom = chFrom
  form.verseFrom = vFrom
  form.chapterTo = chTo
  form.verseTo = vTo
  await fetchBibleText()
}

async function handleSave() {
  try {
    // bibleText: 현재 탭의 성경 본문 HTML, 없으면 크롤링된 원본
    let bibleTextValue = ''
    if (bibleTextHtml.value) {
      bibleTextValue = bibleTextHtml.value
    } else if (crawledQt.value && crawledQt.value.bibleText) {
      bibleTextValue = formatCrawledBible(crawledQt.value.bibleText)
    }
    
    // bibleRef: 항상 getBibleRefString() 사용 (select 박스 기반)
    const bibleRefValue = getBibleRefString() || form.bibleRef || ''
    
    const payload = {
      title: form.title, qtDate: form.date,
      bibleRef: bibleRefValue,
      bibleText: bibleTextValue, content: form.content,
      visibility: form.visibility==='public'?'PUBLIC':'PRIVATE', userId: userId,
    }
    const id = route.params.id
    if (id && id !== 'new') await qtApi.update(Number(id), payload)
    else await qtApi.create(payload)
    showToast('QT가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/qts'), 1000)
  } catch (e) { showToast('저장 중 오류가 발생했습니다.') }
}

function handleCancel() { if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) router.push('/qts') }

onMounted(async () => {
  try {
    const res = await bibleApi.getBooks(2)
    allBooks.value = (res.data||[]).map((b:any) => ({ code:b.bookCode, nameKr:b.bookNameKr, testament:b.testament, chapterCount:bookMaxChapters[b.bookCode]||50 }))
  } catch (e) { console.error('성경 책 목록 로드 실패:', e) }

  const id = route.params.id
  if (id && id !== 'new') {
    try {
      const res = await qtApi.getById(Number(id))
      const data = res.data
      form.title = data.title||''; form.date = data.qtDate||data.date||''
      form.content = data.content||''
      form.visibility = (data.visibility||'PUBLIC').toLowerCase()==='public'?'public':'private'
      form.bibleRef = data.bibleRef||''
      // 수정 모드에서도 성경 구절 파싱하여 select 박스 설정 + 본문 조회
      if (data.bibleRef) {
        await parseBibleRefAndFetch(data.bibleRef)
      }
      // 수정 모드는 직접 입력으로 처리 (select 수정 가능)
      userSettings.qtSource = 'manual'
    } catch (e) { console.error('QT 조회 실패:', e) }
  } else {
    await loadUserSettings()
    await loadQtByDate(form.date)
  }
})

watch(() => form.date, async (newDate) => {
  if (newDate && route.params.id === 'new' && !isManualMode.value) {
    await loadQtByDate(newDate)
  }
})
</script>