<template>
  <div v-if="loading" class="dash-loading">불러오는 중...</div>
  <div v-else>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title">대시보드</div>
      <div class="page-desc">말씀 관리 현황을 한눈에 확인합니다.</div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card" @click="router.push('/sermons')">
        <div class="stat-icon orange">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <div class="stat-value">{{ sermons.length }}</div>
          <div class="stat-label">설교</div>
          <div class="stat-change" :class="{ zero: sermonMonthCount === 0 }">
            {{ sermonMonthCount === 0 ? '이번 달 0건' : `+${sermonMonthCount} 이번 달` }}
          </div>
        </div>
      </div>

      <div class="stat-card" @click="router.push('/qts')">
        <div class="stat-icon green">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div>
          <div class="stat-value">{{ qts.length }}</div>
          <div class="stat-label">QT</div>
          <div class="stat-change" :class="{ zero: qtMonthCount === 0 }">
            {{ qtMonthCount === 0 ? '이번 달 0건' : `+${qtMonthCount} 이번 달` }}
          </div>
        </div>
      </div>

      <div class="stat-card" @click="router.push('/pbs')">
        <div class="stat-icon brown">
          <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div>
          <div class="stat-value">{{ pbsList.length }}</div>
          <div class="stat-label">P.B.S</div>
          <div class="stat-change" :class="{ zero: pbsMonthCount === 0 }">
            {{ pbsMonthCount === 0 ? '이번 달 0건' : `+${pbsMonthCount} 이번 달` }}
          </div>
        </div>
      </div>

      <div class="stat-card" @click="router.push('/readings')">
        <div class="stat-icon blue">
          <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <div>
          <div class="stat-value">{{ readings.length }}</div>
          <div class="stat-label">독서</div>
          <div class="stat-change" :class="{ zero: readingMonthCount === 0 }">
            {{ readingMonthCount === 0 ? '이번 달 0건' : `+${readingMonthCount} 이번 달` }}
          </div>
        </div>
      </div>
    </div>

    <!-- Two Column: Today QT + Monthly Stats -->
    <div class="dash-split">
      <!-- Today QT Card -->
      <div class="dash-card">
        <div class="dash-card-head">
          <div>
            <div class="section-title">오늘의 QT</div>
            <div class="section-desc">크롤링된 오늘의 큐티 데이터</div>
          </div>
          <span class="qt-source-badge">duranno</span>
        </div>
        <div class="today-qt-content" v-if="todayQt">
          <div class="qt-date-row">
            <span class="qt-date">{{ formattedToday }}</span>
          </div>
          <div class="qt-title">{{ todayQt.title || todayQt.qtTitle || '오늘의 큐티' }}</div>
          <div class="qt-bible-ref">{{ todayQt.bibleRef || todayQt.bibleReference || '-' }}</div>
          <div class="qt-preview">{{ qtPreviewText }}</div>
          <div class="qt-action-row">
            <span style="font-size:12px;color:var(--text-muted);">오늘의 QT를 묵상하고 기록해 보세요</span>
            <button class="warm-btn primary" @click="router.push('/qts/new')">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              QT 작성하기
            </button>
          </div>
        </div>
        <div class="today-qt-content" v-else>
          <div class="qt-empty">오늘의 QT가 아직 등록되지 않았습니다.</div>
          <div class="qt-action-row">
            <span style="font-size:12px;color:var(--text-muted);">오늘의 QT를 묵상하고 기록해 보세요</span>
            <button class="warm-btn primary" @click="router.push('/qts/new')">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              QT 작성하기
            </button>
          </div>
        </div>
      </div>

      <!-- Monthly Stats Card -->
      <div class="dash-card">
        <div class="dash-card-head">
          <div>
            <div class="section-title">월간 작성 통계</div>
            <div class="section-desc">{{ monthlyLabel }}</div>
          </div>
        </div>
        <div class="dash-card-body">
          <div class="monthly-stat-row">
            <span class="monthly-stat-label">설교</span>
            <div class="monthly-bar-container">
              <div class="monthly-bar orange" :style="{ width: barWidth(sermonMonthCount) }"></div>
            </div>
            <span class="monthly-stat-count">{{ sermonMonthCount }}건</span>
          </div>
          <div class="monthly-stat-row">
            <span class="monthly-stat-label">QT</span>
            <div class="monthly-bar-container">
              <div class="monthly-bar green" :style="{ width: barWidth(qtMonthCount) }"></div>
            </div>
            <span class="monthly-stat-count">{{ qtMonthCount }}건</span>
          </div>
          <div class="monthly-stat-row">
            <span class="monthly-stat-label">P.B.S</span>
            <div class="monthly-bar-container">
              <div class="monthly-bar" :class="pbsMonthCount === 0 ? 'empty' : 'brown'" :style="{ width: pbsMonthCount === 0 ? '100%' : barWidth(pbsMonthCount) }"></div>
            </div>
            <span class="monthly-stat-count">{{ pbsMonthCount }}건</span>
          </div>
          <div class="monthly-stat-row">
            <span class="monthly-stat-label">독서</span>
            <div class="monthly-bar-container">
              <div class="monthly-bar blue" :style="{ width: barWidth(readingMonthCount) }"></div>
            </div>
            <span class="monthly-stat-count">{{ readingMonthCount }}건</span>
          </div>
          <div class="monthly-total">
            총 <strong>{{ totalMonthCount }}</strong>건 작성
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Content Card -->
    <div class="dash-card">
      <div class="dash-card-head">
        <div>
          <div class="section-title">최근 등록 콘텐츠</div>
          <div class="section-desc">각 콘텐츠별 최근 5건</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="dash-tabs">
        <button class="dash-tab" :class="{ active: activeTab === 'sermon' }" @click="activeTab = 'sermon'">
          설교 <span class="tab-count">{{ recentSermons.length }}</span>
        </button>
        <button class="dash-tab" :class="{ active: activeTab === 'qt' }" @click="activeTab = 'qt'">
          QT <span class="tab-count">{{ recentQts.length }}</span>
        </button>
        <button class="dash-tab" :class="{ active: activeTab === 'pbs' }" @click="activeTab = 'pbs'">
          P.B.S <span class="tab-count">{{ recentPbs.length }}</span>
        </button>
        <button class="dash-tab" :class="{ active: activeTab === 'reading' }" @click="activeTab = 'reading'">
          독서 <span class="tab-count">{{ recentReadings.length }}</span>
        </button>
      </div>

      <!-- Tab Panels -->
      <div class="recent-table-wrap">
        <!-- Sermon Tab -->
        <table class="recent-table" v-show="activeTab === 'sermon'">
          <thead>
            <tr>
              <th>제목</th>
              <th>설교자</th>
              <th>설교 날짜</th>
              <th>상태</th>
              <th style="width:120px;text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentSermons" :key="item.sermonId" @click="router.push(`/sermons/${item.sermonId}`)">
              <td class="recent-title">{{ item.title }}</td>
              <td>{{ item.preacher }}</td>
              <td class="recent-date">{{ item.sermonDate }}</td>
              <td><span class="status-badge" :class="statusClass(item.status)">{{ item.status || '-' }}</span></td>
              <td>
                <div class="row-actions">
                  <button class="table-action" @click.stop="router.push(`/sermons/${item.sermonId}`)">보기</button>
                  <button class="table-action" @click.stop="router.push(`/sermons/${item.sermonId}`)">수정</button>
                </div>
              </td>
            </tr>
            <tr v-if="recentSermons.length === 0">
              <td colspan="5" class="table-empty">등록된 설교가 없습니다.</td>
            </tr>
          </tbody>
        </table>

        <!-- QT Tab -->
        <table class="recent-table" v-show="activeTab === 'qt'">
          <thead>
            <tr>
              <th>제목</th>
              <th>성경 구절</th>
              <th>QT 날짜</th>
              <th>공개 범위</th>
              <th style="width:120px;text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentQts" :key="item.qtId" @click="router.push(`/qts/${item.qtId}`)">
              <td class="recent-title">{{ item.title }}</td>
              <td>{{ item.bibleRef || '-' }}</td>
              <td class="recent-date">{{ item.qtDate }}</td>
              <td><span class="status-badge" :class="statusClass(item.visibility)">{{ item.visibility || '-' }}</span></td>
              <td>
                <div class="row-actions">
                  <button class="table-action" @click.stop="router.push(`/qts/${item.qtId}`)">보기</button>
                  <button class="table-action" @click.stop="router.push(`/qts/${item.qtId}`)">수정</button>
                </div>
              </td>
            </tr>
            <tr v-if="recentQts.length === 0">
              <td colspan="5" class="table-empty">등록된 QT가 없습니다.</td>
            </tr>
          </tbody>
        </table>

        <!-- PBS Tab -->
        <table class="recent-table" v-show="activeTab === 'pbs'">
          <thead>
            <tr>
              <th>제목</th>
              <th>성경 구절</th>
              <th>PBS 날짜</th>
              <th>상태</th>
              <th style="width:120px;text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentPbs" :key="item.pbsId" @click="router.push(`/pbs/${item.pbsId}`)">
              <td class="recent-title">{{ item.title }}</td>
              <td>{{ pbsRefText(item) }}</td>
              <td class="recent-date">{{ item.pbsDate }}</td>
              <td><span class="status-badge" :class="statusClass(item.status)">{{ item.status || '-' }}</span></td>
              <td>
                <div class="row-actions">
                  <button class="table-action" @click.stop="router.push(`/pbs/${item.pbsId}`)">보기</button>
                  <button class="table-action" @click.stop="router.push(`/pbs/${item.pbsId}`)">수정</button>
                </div>
              </td>
            </tr>
            <tr v-if="recentPbs.length === 0">
              <td colspan="5" class="table-empty">등록된 P.B.S가 없습니다.</td>
            </tr>
          </tbody>
        </table>

        <!-- Reading Tab -->
        <table class="recent-table" v-show="activeTab === 'reading'">
          <thead>
            <tr>
              <th>도서 제목</th>
              <th>저자</th>
              <th>독서 날짜</th>
              <th style="width:120px;text-align:right;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recentReadings" :key="item.readingId" @click="router.push(`/readings/${item.readingId}`)">
              <td class="recent-title">{{ item.bookTitle }}</td>
              <td>{{ item.author || '-' }}</td>
              <td class="recent-date">{{ item.readDate }}</td>
              <td>
                <div class="row-actions">
                  <button class="table-action" @click.stop="router.push(`/readings/${item.readingId}`)">보기</button>
                  <button class="table-action" @click.stop="router.push(`/readings/${item.readingId}`)">수정</button>
                </div>
              </td>
            </tr>
            <tr v-if="recentReadings.length === 0">
              <td colspan="4" class="table-empty">등록된 독서 노트가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="recent-footer">
        <button class="warm-btn primary" @click="goToNewContent">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 콘텐츠 등록
        </button>
        <span class="recent-footer-link" @click="goToAllContent">전체 보기 →</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/dashboard.css'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { sermonApi, qtApi, pbsApi, readingApi, qtDailyApi } from '@/api'

const router = useRouter()
const { showToast } = useToast()

const loading = ref(true)
const sermons = ref<any[]>([])
const qts = ref<any[]>([])
const pbsList = ref<any[]>([])
const readings = ref<any[]>([])
const todayQt = ref<any>(null)
const activeTab = ref('sermon')

const now = new Date()
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()

const countThisMonth = (items: any[], dateField: string) =>
  items.filter(item => {
    const d = new Date(item[dateField])
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).length

const sermonMonthCount = computed(() => countThisMonth(sermons.value, 'sermonDate'))
const qtMonthCount = computed(() => countThisMonth(qts.value, 'qtDate'))
const pbsMonthCount = computed(() => countThisMonth(pbsList.value, 'pbsDate'))
const readingMonthCount = computed(() => countThisMonth(readings.value, 'readDate'))

const totalMonthCount = computed(() =>
  sermonMonthCount.value + qtMonthCount.value + pbsMonthCount.value + readingMonthCount.value
)

const maxMonthCount = computed(() =>
  Math.max(sermonMonthCount.value, qtMonthCount.value, pbsMonthCount.value, readingMonthCount.value, 1)
)

function barWidth(count: number) {
  if (count === 0) return '0%'
  return `${Math.round((count / maxMonthCount.value) * 100)}%`
}

const dayNames = ['일', '월', '화', '수', '목', '금', '토']
const formattedToday = computed(() => {
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${dayNames[now.getDay()]})`
})

const monthlyLabel = computed(() => {
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월`
})

const qtPreviewText = computed(() => {
  if (!todayQt.value) return ''
  const text = todayQt.value.bibleText || todayQt.value.content || todayQt.value.preview || ''
  return text.length > 100 ? text.substring(0, 100) + '...' : text
})

const recentSermons = computed(() =>
  [...sermons.value].sort((a, b) => new Date(b.sermonDate).getTime() - new Date(a.sermonDate).getTime()).slice(0, 5)
)
const recentQts = computed(() =>
  [...qts.value].sort((a, b) => new Date(b.qtDate).getTime() - new Date(a.qtDate).getTime()).slice(0, 5)
)
const recentPbs = computed(() =>
  [...pbsList.value].sort((a, b) => new Date(b.pbsDate).getTime() - new Date(a.pbsDate).getTime()).slice(0, 5)
)
const recentReadings = computed(() =>
  [...readings.value].sort((a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()).slice(0, 5)
)

function statusClass(status: string) {
  const s = (status || '').toUpperCase()
  if (s === 'PUBLISHED') return 'status-published'
  if (s === 'DRAFT') return 'status-draft'
  if (s === 'PUBLIC') return 'status-public'
  if (s === 'PRIVATE') return 'status-private'
  return 'status-draft'
}

function pbsRefText(item: any) {
  if (item.bibleRef) return item.bibleRef
  const from = item.bookFrom || ''
  const to = item.bookTo || ''
  if (from && to) return `${from} ~ ${to}`
  return from || to || '-'
}

function goToNewContent() {
  const map: Record<string, string> = {
    sermon: '/sermons/new',
    qt: '/qts/new',
    pbs: '/pbs/new',
    reading: '/readings/new',
  }
  router.push(map[activeTab.value] || '/sermons/new')
}

function goToAllContent() {
  const map: Record<string, string> = {
    sermon: '/sermons',
    qt: '/qts',
    pbs: '/pbs',
    reading: '/readings',
  }
  router.push(map[activeTab.value] || '/sermons')
}

onMounted(async () => {
  loading.value = true
  try {
    const [sermonsRes, qtsRes, pbsRes, readingsRes, todayQtRes] = await Promise.all([
      sermonApi.getAll(),
      qtApi.getAll(),
      pbsApi.getAll(),
      readingApi.getAll(),
      qtDailyApi.getToday('duranno').catch(() => null),
    ])
    sermons.value = sermonsRes.data || []
    qts.value = qtsRes.data || []
    pbsList.value = pbsRes.data || []
    readings.value = readingsRes.data || []
    todayQt.value = todayQtRes?.data || null
  } catch (e: any) {
    showToast('대시보드 데이터를 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
})
</script>