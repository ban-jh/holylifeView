<template>
  <div class="auth-body">
    <div class="signup-container">
      <!-- 로고 및 헤더 -->
      <div class="header">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v18M8 7h8" />
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

        <!-- 닉네임 -->
        <div class="form-group" :class="{ 'has-error': errors.nickname }">
          <label for="nickname" class="form-label">닉네임</label>
          <input type="text" id="nickname" v-model="nickname" class="form-input" placeholder="사용할 닉네임 입력" />
          <span class="error-text" v-if="errors.nickname">닉네임을 입력해주세요.</span>
        </div>

        <!-- 전화번호 -->
        <div class="form-group" :class="{ 'has-error': errors.phone }">
          <label for="phone" class="form-label">전화번호</label>
          <input type="tel" id="phone" v-model="phone" class="form-input" placeholder="010-1234-5678" />
          <span class="error-text" v-if="errors.phone">올바른 전화번호 형식(예: 010-1234-5678)을 입력해주세요.</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const nickname = ref('')
const phone = ref('')

const errors = reactive({
  name: false,
  email: false,
  password: false,
  passwordConfirm: false,
  nickname: false,
  phone: false,
})

const showModal = ref(false)
const modalMessage = ref('입력하신 정보를 다시 확인해 주세요.')

function resetErrors() {
  errors.name = false
  errors.email = false
  errors.password = false
  errors.passwordConfirm = false
  errors.nickname = false
  errors.phone = false
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

  // 3. 비밀번호 검증 (8자 이상)
  if (!password.value || password.value.length < 8) {
    errors.password = true
    hasError = true
    if (!errorMsg) errorMsg = '비밀번호는 최소 8자 이상이어야 합니다.'
  }

  // 4. 비밀번호 확인 검증
  if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = true
    hasError = true
    if (!errorMsg) errorMsg = '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
  }

  // 5. 닉네임 검증
  if (!nickname.value.trim()) {
    errors.nickname = true
    hasError = true
    if (!errorMsg) errorMsg = '닉네임을 입력해 주세요.'
  }

  // 6. 전화번호 검증
  const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/
  if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
    errors.phone = true
    hasError = true
    if (!errorMsg) errorMsg = '올바른 전화번호 형식을 입력해 주세요.'
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

<style scoped>
.auth-body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
  background-image: radial-gradient(#d1d5db 0.75px, transparent 0.75px),
    radial-gradient(#d1d5db 0.75px, #f4f6f8 0.75px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  padding: 40px 20px;
}

.signup-container {
  background: #ffffff;
  width: 100%;
  max-width: 460px;
  padding: 40px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 10px;
  color: var(--auth-blue);
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: var(--auth-blue);
  box-shadow: 0 0 0 3px rgba(43, 76, 126, 0.15);
}

.error-text {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
}

.form-group.has-error .form-input {
  border-color: #ef4444;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: var(--auth-blue);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: var(--auth-blue-dark);
}

.footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #64748b;
}

.login-link {
  color: var(--auth-blue);
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  z-index: 1000;
  padding: 20px;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 360px;
  padding: 28px 24px 24px 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transform: scale(0.92);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-overlay.active .modal-card {
  transform: scale(1);
}

.modal-icon-wrapper {
  width: 56px;
  height: 56px;
  background-color: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
}

.warning-icon {
  width: 28px;
  height: 28px;
  color: #ef4444;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.modal-message {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 24px;
  word-break: keep-all;
}

.btn-modal-close {
  width: 100%;
  padding: 12px;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-modal-close:hover {
  background-color: #dc2626;
}

@media (max-width: 480px) {
  .signup-container {
    padding: 32px 20px;
  }
}
</style>