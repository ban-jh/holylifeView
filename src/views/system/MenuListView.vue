<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">메뉴 관리</div>
        <div class="page-desc">시스템 메뉴 구조를 관리합니다.</div>
      </div>
      <button class="btn btn-primary" @click="showToast('메뉴 등록 화면으로 이동합니다.')">
        <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 메뉴 등록
      </button>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">No.</th>
              <th>메뉴명</th>
              <th>메뉴 코드</th>
              <th>URL</th>
              <th style="width: 60px; text-align: center;">깊이</th>
              <th style="width: 70px; text-align: center;">순서</th>
              <th style="width: 80px; text-align: center;">사용</th>
              <th style="width: 80px; text-align: center;">노출</th>
              <th style="width: 70px; text-align: center;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">로딩 중...</td>
            </tr>
            <tr v-else-if="menus.length === 0">
              <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">등록된 메뉴가 없습니다.</td>
            </tr>
            <tr v-for="(menu, index) in menus" :key="menu.menuId" @click="showToast('메뉴 수정 화면으로 이동합니다.')">
              <td style="text-align: center; color: var(--text-muted);">{{ index + 1 }}</td>
              <td><strong style="color: var(--text-primary);">{{ menu.menuName }}</strong></td>
              <td>{{ menu.menuCode }}</td>
              <td>{{ menu.menuUrl }}</td>
              <td style="text-align: center;">{{ menu.depth }}</td>
              <td style="text-align: center;">{{ menu.sortOrder }}</td>
              <td style="text-align: center;">{{ menu.useYn ? 'O' : 'X' }}</td>
              <td style="text-align: center;">{{ menu.displayYn ? 'O' : 'X' }}</td>
              <td style="text-align: center;">
                <button class="btn-icon-only" title="수정" @click.stop="showToast('수정 페이지로 이동합니다.')">
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const menus = ref<any[]>([])
const loading = ref(false)

async function fetchMenus() {
  loading.value = true
  try {
    const res = await fetch('/api/menus')
    menus.value = await res.json()
  } catch (e) {
    showToast('메뉴 목록을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMenus()
})
</script>

<style scoped>
.page-header-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
.page-title { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.page-desc { font-size: 13.5px; color: var(--text-muted); margin-top: 4px; }
.card { background: var(--warm-white); border-radius: var(--radius-lg); border: 1px solid var(--sand); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: 20px; }
.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
.data-table th { background: var(--cream-dark); color: var(--text-secondary); font-weight: 600; padding: 13px 18px; border-bottom: 1px solid var(--sand); white-space: nowrap; }
.data-table td { padding: 15px 18px; border-bottom: 1px solid var(--cream-dark); color: var(--text-primary); vertical-align: middle; }
.data-table tbody tr { transition: background var(--transition); cursor: pointer; }
.data-table tbody tr:hover { background: rgba(242,236,224,0.4); }
.data-table tbody tr:last-child td { border-bottom: none; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; transition: all var(--transition); }
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-icon-only { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px solid var(--sand); background: var(--warm-white); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-icon-only:hover { background: var(--cream-dark); }
.btn-icon-only svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; }
@media (max-width: 768px) { .page-header-row { flex-direction: column; align-items: flex-start; } }
</style>