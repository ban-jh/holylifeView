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
        <div class="form-group form-bible">
          <label>성경 구절</label>
          <div class="bible-select-row">
            <select v-model="form.bibleTestament" @change="onTestamentChange" class="bible-testament-select">
              <option value="">구분</option>
              <option value="old">구약</option>
              <option value="new">신약</option>
            </select>
            <select v-model="form.bibleBook" :disabled="!form.bibleTestament" @change="onBookChange" class="bible-book-select">
              <option value="">성경</option>
              <option v-for="b in filteredBooks" :key="b.code" :value="b.code">{{ b.nameKr }}</option>
            </select>
            <select v-model="form.chapterFrom" :disabled="!form.bibleBook" @change="onChapterFromChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterList" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseFrom" :disabled="!form.bibleBook" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseList" :key="v" :value="v">{{ v }}</option>
            </select>
            <span class="bible-range-sep">~</span>
            <select v-model="form.chapterTo" :disabled="!form.bibleBook" @change="onChapterToChange" class="bible-num-select">
              <option value="">장</option>
              <option v-for="c in chapterList" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.verseTo" :disabled="!form.bibleBook" @change="fetchBibleText" class="bible-num-select">
              <option value="">절</option>
              <option v-for="v in verseListTo" :key="v" :value="v">{{ v }}</option>
            </select>
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
          <button class="tab" :class="{ active: bibleTab === 'niv' }" @click="changeBibleTab('niv')">NIV</button>
        </div>
      </div>
      <div class="bible-content">
        <div v-if="bibleLoading" class="bible-loading">성경 불러오는 중...</div>
        <div v-else-if="bibleVerses.length > 0" v-html="bibleTextHtml"></div>
        <div v-else class="bible-empty">성경 구절을 선택하면 본문이 표시됩니다.</div>
      </div>
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
              <div><strong>참고자료.pdf</strong><div style="font-size:12px; color:var(--text-muted); margin-top:2px;">PDF 파일 선택</div></div>
            </div>
            <button class="btn btn-cancel" type="button">파일 선택</button>
          </div>
        </div>
        <div v-if="refTab === 'map'">
          <div class="map-search">
            <input type="text" v-model="mapQuery" placeholder="관련 장소를 검색하세요" @keyup.enter="searchMap" />
            <button class="btn btn-cancel" type="button" @click="searchMap">검색</button>
          </div>
          <div ref="mapContainer" class="map-area"></div>
          <div v-if="mapError" class="map-error">{{ mapError }}</div>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { pbsApi, bibleApi } from '@/api'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

// 성경 탭 — 설교와 동일 (개역개정/새번역/NIV)
const bibleTab = ref<'gae' | 'sae' | 'niv'>('gae')
const bibleLoading = ref(false)
const bibleCache = ref<{ gae: any[]; sae: any[]; niv: any[] }>({ gae: [], sae: [], niv: [] })

const refTab = ref<'url' | 'image' | 'document' | 'map'>('url')
const refUrl = ref('')
const refUrls = ref<string[]>([])
const mapQuery = ref('')
const mapContainer = ref<HTMLElement | null>(null)
const mapError = ref('')
const imageFile = ref<HTMLInputElement | null>(null)

// Google Maps 관련
let googleMap: any = null
let googleMarker: any = null
let googleGeocoder: any = null
const GOOGLE_MAPS_API_KEY = '' // TODO: API 키 설정 시 검색 기능 활성화

// Google Maps 스크립트 로드
function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('Google Maps API 키가 설정되지 않았습니다.'))
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google Maps 로드 실패'))
    document.head.appendChild(script)
  })
}

// 지도 초기화
async function initMap() {
  if (!mapContainer.value) return
  try {
    await loadGoogleMapsScript()
    googleMap = new google.maps.Map(mapContainer.value, {
      center: { lat: 37.5665, lng: 126.9780 }, // 서울
      zoom: 13,
    })
    googleGeocoder = new google.maps.Geocoder()
  } catch (e: any) {
    mapError.value = e.message || '지도를 불러올 수 없습니다.'
  }
}

// 장소 검색
async function searchMap() {
  if (!mapQuery.value.trim()) return
  if (!googleGeocoder) {
    mapError.value = '지도가 아직 로드되지 않았습니다.'
    return
  }
  mapError.value = ''
  googleGeocoder.geocode({ address: mapQuery.value }, (results: any[], status: any) => {
    if (status === 'OK' && results && results.length > 0) {
      const location = results[0].geometry.location
      googleMap.setCenter(location)
      if (googleMarker) googleMarker.setMap(null)
      googleMarker = new google.maps.Marker({
        map: googleMap,
        position: location,
        title: mapQuery.value,
      })
    } else {
      mapError.value = '검색 결과가 없습니다.'
    }
  })
}

const form = reactive({
  title: '', date: new Date().toISOString().slice(0, 10),
  bookFrom: '', bookTo: '',
  contentTitle: '', content: '',
  bibleTestament: '', bibleBook: '',
  chapterFrom: '', chapterTo: '',
  verseFrom: '', verseTo: '',
})

// 성경 책 목록 — DB에서 가져옴
interface BookInfo {
  code: string
  nameKr: string
  testament: string
  chapterCount: number
}

const allBooks = ref<BookInfo[]>([])

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

const filteredBooks = computed(() => {
  if (!form.bibleTestament) return allBooks.value
  return allBooks.value.filter(b => b.testament === form.bibleTestament)
})

const chapterList = computed(() => {
  if (!form.bibleBook) return []
  const max = bookMaxChapters[form.bibleBook] || 1
  return Array.from({ length: max }, (_, i) => i + 1)
})

const verseList = ref<number[]>([])
const verseListTo = ref<number[]>([])

function onTestamentChange() {
  form.bibleBook = ''
  form.chapterFrom = ''
  form.chapterTo = ''
  form.verseFrom = ''
  form.verseTo = ''
  bibleCache.value = { gae: [], sae: [], niv: [] }
}

function onBookChange() {
  form.chapterFrom = ''
  form.chapterTo = ''
  form.verseFrom = ''
  form.verseTo = ''
  verseList.value = []
  verseListTo.value = []
  bibleCache.value = { gae: [], sae: [], niv: [] }
}

async function onChapterFromChange() {
  form.verseFrom = ''
  form.verseTo = ''
  verseList.value = []
  verseListTo.value = []
  if (!form.bibleBook || !form.chapterFrom) return
  // 첫 절부터 마지막 절까지 조회하여 절 목록 생성
  try {
    const res = await bibleApi.getVerses(form.bibleBook, Number(form.chapterFrom), undefined, undefined, 2)
    verseList.value = (res.data || []).map((v: any) => v.verse)
    verseListTo.value = verseList.value
  } catch (e) {
    verseList.value = []
    verseListTo.value = []
  }
}

function onChapterToChange() {
  form.verseTo = ''
  verseListTo.value = verseList.value
  fetchBibleText()
}

const bibleVerses = computed(() => bibleCache.value[bibleTab.value] || [])

const bibleTextHtml = computed(() => {
  if (bibleVerses.value.length === 0) return ''
  return bibleVerses.value
    .map((v: any) => `<span class="verse-number">${v.verse}</span> ${v.content}`)
    .join('<br>\n')
})

async function fetchBibleText() {
  if (!form.bibleBook || !form.chapterFrom) {
    bibleCache.value = { gae: [], sae: [], niv: [] }
    return
  }

  const chapter = Number(form.chapterFrom)
  const verseFrom = form.verseFrom ? Number(form.verseFrom) : undefined
  const verseTo = form.verseTo ? Number(form.verseTo) : undefined

  bibleLoading.value = true
  try {
    // 세 버전을 병렬로 조회 (개역개정=2, 새번역=3, NIV=6)
    const [gaeRes, saeRes, nivRes] = await Promise.all([
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 2),
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 3),
      bibleApi.getVerses(form.bibleBook, chapter, verseFrom, verseTo, 6),
    ])
    bibleCache.value = {
      gae: gaeRes.data || [],
      sae: saeRes.data || [],
      niv: nivRes.data || [],
    }
  } catch (e: any) {
    console.error('성경 조회 실패:', e)
    bibleCache.value = { gae: [], sae: [], niv: [] }
  } finally {
    bibleLoading.value = false
  }
}

function changeBibleTab(tab: 'gae' | 'sae' | 'niv') {
  bibleTab.value = tab
}

async function handleSave() {
  try {
    // bibleBook을 bookFrom/bookTo에 설정 (기존 호환성)
    const bookName = allBooks.value.find(b => b.code === form.bibleBook)?.nameKr || form.bibleBook
    const payload = {
      title: form.title,
      date: form.date,
      bookFrom: bookName,
      bookTo: bookName,
      contentTitle: form.contentTitle,
      content: form.content,
    }
    const id = route.params.id
    if (id && id !== 'new') { await pbsApi.update(Number(id), payload) } else { await pbsApi.create(payload) }
    showToast('성경 공부 콘텐츠가 성공적으로 저장되었습니다.')
    setTimeout(() => router.push('/pbs'), 1000)
  } catch (e) { showToast('저장 중 오류가 발생했습니다.') }
}

function handleCancel() { if (confirm('작성 중인 내용이 초기화됩니다. 계속하시겠습니까?')) { router.push('/pbs') } }

onMounted(async () => {
  // 성경 책 목록 로드
  try {
    const res = await bibleApi.getBooks()
    allBooks.value = (res.data || []).map((b: any) => ({
      code: b.bookCode || b.book_code,
      nameKr: b.bookNameKr || b.book_name_kr,
      testament: b.testament,
      chapterCount: b.chapterCount || 0,
    }))
  } catch (e) {
    console.error('성경 책 목록 로드 실패:', e)
  }

  // 기존 데이터 로드 (수정 모드)
  const id = route.params.id
  if (id && id !== 'new') {
    try {
      const res = await pbsApi.getById(Number(id))
      Object.assign(form, res.data)
    } catch (e) {
      console.error('PBS 조회 실패:', e)
    }
  }
})

// 지도 탭 선택 시 Google Maps 초기화
watch(refTab, (val) => {
  if (val === 'map') {
    nextTick(() => {
      if (!googleMap) {
        initMap()
      }
    })
  }
})
</script>