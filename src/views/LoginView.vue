<template>
  <div class="login-container">
    <!-- 로고 및 헤더 -->
    <div class="header">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
        <path d="M12 22V12" />
        <path d="M3 7l9 5 9-5" />
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
</template>

<script setup lang="ts">
import '@/assets/css/login.css'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const showModal = ref(false)

function handleLogin() {
  // TODO: 실제 로그인 API 호출
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
