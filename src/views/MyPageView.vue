<template>
  <div class="page-header">
    <div class="page-title">마이페이지</div>
    <div class="page-desc">개인 정보 및 성경/큐티 설정을 관리합니다.</div>
  </div>

  <!-- 계정 정보 -->
  <section class="card">
    <div class="card-header"><div class="card-title">계정 정보</div></div>
    <div class="card-body">
      <div class="mypage-form-grid">
        <div class="form-group">
          <label>이름</label>
          <input type="text" v-model="userInfo.name" readonly class="readonly-input" />
        </div>
        <div class="form-group">
          <label>아이디 (이메일)</label>
          <input type="text" v-model="userInfo.email" readonly class="readonly-input" />
        </div>
        <div class="form-group">
          <label>닉네임</label>
          <input type="text" v-model="userInfo.nickname" readonly class="readonly-input" />
        </div>
        <div class="form-group">
          <label>권한</label>
          <input type="text" :value="roleLabel" readonly class="readonly-input" />
        </div>
      </div>
    </div>
  </section>

  <!-- 비밀번호 변경 -->
  <section class="card">
    <div class="card-header"><div class="card-title">비밀번호 변경</div></div>
    <div class="card-body">
      <div class="mypage-form-grid">
        <div class="form-group">
          <label>현재 비밀번호</label>
          <input type="password" v-model="pwForm.currentPassword" placeholder="현재 비밀번호" />
        </div>
        <div class="form-group">
          <label>새 비밀번호</label>
          <input type="password" v-model="pwForm.newPassword" placeholder="새 비밀번호" />
        </div>
        <div class="form-group">
          <label>새 비밀번호 확인</label>
          <input type="password" v-model="pwForm.confirmPassword" placeholder="새 비밀번호 확인" />
          <span v-if="pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword" class="pw-mismatch">비밀번호가 일치하지 않습니다.</span>
        </div>
      </div>
      <div class="mypage-actions">
        <button class="btn btn-primary" @click="changePassword" :disabled="pwLoading">
          {{ pwLoading ? '변경 중...' : '비밀번호 변경' }}
        </button>
      </div>
    </div>
  </section>

  <!-- 성경/큐티 설정 -->
  <section class="card">
    <div class="card-header"><div class="card-title">말씀 및 큐티 설정</div></div>
    <div class="card-body">
      <div class="mypage-form-grid">
        <div class="form-group">
          <label>말씀 (성경 번역)</label>
          <select v-model="settings.bibleVersion">
            <option value="gae">개역개정</option>
            <option value="sae">새번역</option>
            <option value="niv">NIV (English)</option>
          </select>
        </div>
        <div class="form-group">
          <label>큐티 (매일 성경)</label>
          <select v-model="settings.qtSource">
            <option value="duranno">두란노 (생명의삶)</option>
            <option value="sum">생명의삶 (매일성경)</option>
            <option value="manual">직접 입력</option>
          </select>
        </div>
      </div>
      <div class="mypage-actions">
        <button class="btn btn-primary" @click="saveSettings" :disabled="settingsLoading">
          {{ settingsLoading ? '저장 중...' : '설정 저장' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import '@/assets/css/mypage.css'
import { ref, reactive, computed, onMounted } from 'vue'
import { userApi } from '@/api'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const userId = 1 // admin (임시 — 로그인 연동 후 변경)

const userInfo = reactive({
  name: '',
  email: '',
  nickname: '',
  roleGroup: '',
})

const roleMap: Record<string, string> = {
  SYS_ADMIN: '시스템 관리자',
  AGENT_DEV: 'Agent 개발자',
  USER: '일반 사용자',
}
const roleLabel = computed(() => roleMap[userInfo.roleGroup] || userInfo.roleGroup)

const pwForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const pwLoading = ref(false)

const settings = reactive({
  bibleVersion: 'gae',
  qtSource: 'duranno',
})
const settingsLoading = ref(false)

async function loadUserInfo() {
  try {
    const res = await userApi.getById(userId)
    const data = res.data
    userInfo.name = data.name || ''
    userInfo.email = data.email || ''
    userInfo.nickname = data.nickname || ''
    userInfo.roleGroup = data.roleGroup || ''
    settings.bibleVersion = data.bibleVersion || 'gae'
    settings.qtSource = data.qtSource || 'duranno'
  } catch (e) {
    console.error('사용자 정보 조회 실패:', e)
    showToast('사용자 정보를 불러오지 못했습니다.')
  }
}

async function changePassword() {
  if (!pwForm.currentPassword || !pwForm.newPassword) {
    showToast('현재 비밀번호와 새 비밀번호를 입력하세요.')
    return
  }
  if (pwForm.newPassword !== pwForm.confirmPassword) {
    showToast('새 비밀번호가 일치하지 않습니다.')
    return
  }
  if (pwForm.newPassword.length < 6) {
    showToast('새 비밀번호는 6자 이상이어야 합니다.')
    return
  }

  pwLoading.value = true
  try {
    await userApi.changePassword(userId, {
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    })
    showToast('비밀번호가 변경되었습니다.')
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
  } catch (e: any) {
    const msg = e?.response?.data?.message || '비밀번호 변경에 실패했습니다.'
    showToast(msg)
  } finally {
    pwLoading.value = false
  }
}

async function saveSettings() {
  settingsLoading.value = true
  try {
    await userApi.updateSettings(userId, {
      bibleVersion: settings.bibleVersion,
      qtSource: settings.qtSource,
    })
    showToast('설정이 저장되었습니다.')
  } catch (e) {
    console.error('설정 저장 실패:', e)
    showToast('설정 저장에 실패했습니다.')
  } finally {
    settingsLoading.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>