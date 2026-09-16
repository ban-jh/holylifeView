<template>
  <div class="signup-container">
    <!-- 로고 및 헤더 -->
    <div class="header">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
        <path d="M12 22V12" />
        <path d="M3 7l9 5 9-5" />
      </svg>
      <h1 class="title">FAITH PATHWAY</h1>
      <p class="subtitle">새로운 계정 생성하기</p>
    </div>

    <!-- 회원가입 폼 -->
    <form @submit.prevent="handleSignup" novalidate>
      <!-- 이름 -->
      <div class="form-group" :class="{ 'has-error': errors.name }">
        <label for="name" class="form-label">이름</label>
        <input type="text" id="name" v-model="name" class="form-input" placeholder="홍길동" />
        <span class="error-text" v-if="errors.name">이름을 입력해주세요.</span>
      </div>

      <!-- 이메일 -->
      <div class="form-group" :class="{ 'has-error': errors.email }">
        <label for="email" class="form-label">이메일 주소</label>
        <input type="email" id="email" v-model="email" class="form-input" placeholder="example@church.com" />
        <span class="error-text" v-if="errors.email">올바른 이메일 형식을 입력해주세요.</span>
      </div>

      <!-- 전화번호 -->
      <div class="form-group" :class="{ 'has-error': errors.phone }">
        <label for="phone" class="form-label">전화번호</label>
        <input type="tel" id="phone" v-model="phone" class="form-input" placeholder="010-1234-5678" />
        <span class="error-text" v-if="errors.phone">올바른 전화번호 형식(예: 010-1234-5678)을 입력해주세요.</span>
      </div>

      <!-- 닉네임 -->
      <div class="form-group" :class="{ 'has-error': errors.nickname }">
        <label for="nickname" class="form-label">닉네임</label>
        <input type="text" id="nickname" v-model="nickname" class="form-input" placeholder="사용할 닉네임 입력" />
        <span class="error-text" v-if="errors.nickname">닉네임을 입력해주세요.</span>
      </div>

      <!-- 비밀번호 -->
      <div class="form-group" :class="{ 'has-error': errors.password }">
        <label for="password" class="form-label">비밀번호</label>
        <input type="password" id="password" v-model="password" class="form-input" placeholder="8자 이상 입력" />
        <span class="error-text" v-if="errors.password">비밀번호는 8자 이상이어야 합니다.</span>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="form-group" :class="{ 'has-error': errors.passwordConfirm }">
        <label for="passwordConfirm" class="form-label">비밀번호 확인</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" class="form-input" placeholder="비밀번호 재입력" />
        <span class="error-text" v-if="errors.passwordConfirm">비밀번호가 일치하지 않습니다.</span>
      </div>

      <button type="submit" class="btn-submit">가입하기</button>
    </form>

    <!-- 하단 링크 -->
    <div class="footer">
      이미 계정이 있으신가요? <RouterLink to="/login" class="login-link">로그인</RouterLink>
    </div>
  </div>

  <!-- 경고 레이어 팝업 (모달) -->
  <div class="modal-overlay" :class="{ active: showModal }" @click.self="closeModal">
    <div class="modal-card">
      <div class="modal-icon-wrapper">
        <svg class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 class="modal-title">입력 오류</h3>
      <p class="modal-message">{{ modalMessage }}</p>
      <button type="button" class="btn-modal-close" @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/signup.css'
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const phone = ref('')
const nickname = ref('')
const password = ref('')
const passwordConfirm = ref('')

const errors = reactive({
  name: false,
  email: false,
  phone: false,
  nickname: false,
  password: false,
  passwordConfirm: false,
})

const showModal = ref(false)
const modalMessage = ref('입력하신 정보를 다시 확인해 주세요.')

function resetErrors() {
  errors.name = false
  errors.email = false
  errors.phone = false
  errors.nickname = false
  errors.password = false
  errors.passwordConfirm = false
}

function handleSignup() {
  resetErrors()
  let hasError = false
  let errorMsg = ''

  // 1. 이름 검증
  if (!name.value.trim()) {
    errors.name = true
    hasError = true
    if (!errorMsg) errorMsg = '이름을 입력해 주세요.'
  }

  // 2. 이메일 검증
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
    errors.email = true
    hasError = true
    if (!errorMsg) errorMsg = '올바른 이메일 주소를 입력해 주세요.'
  }

  // 3. 전화번호 검증 (010-1234-5678 또는 01012345678 형태 허용)
  const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/
  if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
    errors.phone = true
    hasError = true
    if (!errorMsg) errorMsg = '올바른 전화번호 형식을 입력해 주세요.'
  }

  // 4. 닉네임 검증
  if (!nickname.value.trim()) {
    errors.nickname = true
    hasError = true
    if (!errorMsg) errorMsg = '닉네임을 입력해 주세요.'
  }

  // 5. 비밀번호 검증 (8자 이상)
  if (!password.value || password.value.length < 8) {
    errors.password = true
    hasError = true
    if (!errorMsg) errorMsg = '비밀번호는 최소 8자 이상이어야 합니다.'
  }

  // 6. 비밀번호 확인 검증
  if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = true
    hasError = true
    if (!errorMsg) errorMsg = '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
  }

  if (hasError) {
    modalMessage.value = errorMsg
    showModal.value = true
  } else {
    // TODO: 실제 회원가입 API 호출
    alert('회원가입이 완료되었습니다!')
    router.push('/login')
  }
}

function closeModal() {
  showModal.value = false
}
</script>
