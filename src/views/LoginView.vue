<template>
  <div class="auth-body">
    <div class="login-container">
      <!-- 로고 및 헤더 -->
      <div class="header">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v18M8 7h8" />
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <h1 class="title">FAITH PATHWAY</h1>
        <p class="subtitle">말씀과 독서로 자라나는 신앙의 길</p>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">이메일 주소</label>
          <input type="email" id="email" v-model="email" class="form-input" placeholder="example@church.com" required />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">비밀번호</label>
          <input type="password" id="password" v-model="password" class="form-input" placeholder="비밀번호를 입력하세요" required />
        </div>

        <div class="form-actions">
          <a href="#" class="forgot-link">비밀번호를 잊으셨나요?</a>
        </div>

        <button type="submit" class="btn-submit">로그인</button>
      </form>

      <!-- 하단 링크 -->
      <div class="footer">
        계정이 없으신가요? <RouterLink to="/signup" class="signup-link">회원가입</RouterLink>
      </div>
    </div>

    <!-- 레이어 팝업 (모달) -->
    <div class="modal-overlay" :class="{ active: showModal }" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-icon-wrapper">
          <svg class="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 class="modal-title">로그인 실패</h3>
        <p class="modal-message">아이디/패스워드 가 맞지 않습니다.<br />다시 확인해주세요.</p>
        <button type="button" class="btn-modal-close" @click="closeModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const showModal = ref(false)

function handleLogin() {
  // TODO: 실제 로그인 API 호출
  // 임시: 빈 값이 아니면 성공, 아니면 실패 모달
  if (email.value && password.value) {
    router.push('/sermons')
  } else {
    showModal.value = true
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
  padding: 20px;
}

.login-container {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 40px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
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
  margin-top: 6px;
}

.form-group {
  margin-bottom: 20px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.forgot-link {
  font-size: 12px;
  color: #64748b;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
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

.signup-link {
  color: var(--auth-blue);
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.signup-link:hover {
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
  .login-container {
    padding: 32px 20px;
  }
}
</style>