<template>
  <div>
    <div class="page-header-row">
      <div>
        <div class="page-title">사용자 등록</div>
        <div class="page-desc">새로운 사용자를 등록합니다.</div>
      </div>
      <button class="btn btn-secondary" @click="goBack">
        <svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        사용자 관리로 돌아가기
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">사용자 정보</div>
      </div>
      <div class="user-create-form">
        <div class="form-grid">
          <!-- 이메일 -->
          <div class="form-field" :class="{ 'has-error': errors.email }">
            <label>이메일<span class="required">*</span></label>
            <input
              type="email"
              v-model="form.email"
              placeholder="user@example.com"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <!-- 이름 -->
          <div class="form-field" :class="{ 'has-error': errors.name }">
            <label>이름<span class="required">*</span></label>
            <input
              type="text"
              v-model="form.name"
              placeholder="홍길동"
              @blur="validateField('name')"
            />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>

          <!-- 닉네임 -->
          <div class="form-field" :class="{ 'has-error': errors.nickname }">
            <label>닉네임<span class="required">*</span></label>
            <input
              type="text"
              v-model="form.nickname"
              placeholder="길동이"
              @blur="validateField('nickname')"
            />
            <span v-if="errors.nickname" class="field-error">{{ errors.nickname }}</span>
          </div>

          <!-- 전화번호 -->
          <div class="form-field">
            <label>전화번호</label>
            <input
              type="text"
              v-model="form.phone"
              placeholder="010-1234-5678"
            />
          </div>

          <!-- 구분선 -->
          <div class="form-divider"></div>

          <!-- 비밀번호 -->
          <div class="form-field" :class="{ 'has-error': errors.password }">
            <label>비밀번호<span class="required">*</span></label>
            <input
              type="password"
              v-model="form.password"
              placeholder="최소 8자 이상"
              @blur="validateField('password')"
            />
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            <span v-else class="field-hint">최소 8자 이상 입력하세요.</span>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="form-field" :class="{ 'has-error': errors.passwordConfirm }">
            <label>비밀번호 확인<span class="required">*</span></label>
            <input
              type="password"
              v-model="passwordConfirm"
              placeholder="비밀번호 재입력"
              @blur="validateField('passwordConfirm')"
            />
            <span v-if="errors.passwordConfirm" class="field-error">{{ errors.passwordConfirm }}</span>
          </div>

          <!-- 권한 그룹 -->
          <div class="form-field">
            <label>권한 그룹</label>
            <select v-model="form.roleGroup" class="role-select">
              <option value="" disabled>선택하세요</option>
              <option v-for="role in roles" :key="role.roleId" :value="role.groupCode">{{ role.groupName }}</option>
            </select>
          </div>

          <!-- 메모 -->
          <div class="form-field full-row">
            <label>메모</label>
            <textarea
              v-model="form.memo"
              placeholder="사용자에 대한 메모를 입력하세요."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-cancel" @click="goBack">취소</button>
        <button class="btn btn-save" :disabled="saving" @click="handleSave">
          <svg v-if="!saving" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          {{ saving ? '저장 중...' : '저장' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/user-create.css'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, roleApi } from '@/api'
import { useToast } from '@/composables/useToast'

interface UserCreateForm {
  email: string
  password: string
  name: string
  nickname: string
  phone: string
  roleGroup: string
  memo: string
}

interface FormErrors {
  email?: string
  password?: string
  passwordConfirm?: string
  name?: string
  nickname?: string
}

const router = useRouter()
const { showToast } = useToast()

const form = reactive<UserCreateForm>({
  email: '',
  password: '',
  name: '',
  nickname: '',
  phone: '',
  roleGroup: '',
  memo: '',
})

const roles = ref<any[]>([])

const passwordConfirm = ref('')
const errors = reactive<FormErrors>({})
const saving = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(field: keyof FormErrors): boolean {
  switch (field) {
    case 'email':
      if (!form.email.trim()) {
        errors.email = '이메일을 입력하세요.'
      } else if (!emailRegex.test(form.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.'
      } else {
        errors.email = undefined
      }
      break
    case 'password':
      if (!form.password) {
        errors.password = '비밀번호를 입력하세요.'
      } else if (form.password.length < 8) {
        errors.password = '비밀번호는 최소 8자 이상이어야 합니다.'
      } else {
        errors.password = undefined
      }
      // 비밀번호가 변경되면 확인 필드도 재검증
      if (passwordConfirm.value) {
        validateField('passwordConfirm')
      }
      break
    case 'passwordConfirm':
      if (!passwordConfirm.value) {
        errors.passwordConfirm = '비밀번호 확인을 입력하세요.'
      } else if (passwordConfirm.value !== form.password) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
      } else {
        errors.passwordConfirm = undefined
      }
      break
    case 'name':
      if (!form.name.trim()) {
        errors.name = '이름을 입력하세요.'
      } else {
        errors.name = undefined
      }
      break
    case 'nickname':
      if (!form.nickname.trim()) {
        errors.nickname = '닉네임을 입력하세요.'
      } else {
        errors.nickname = undefined
      }
      break
  }
  return !errors[field]
}

function validateAll(): boolean {
  const fields: (keyof FormErrors)[] = ['email', 'password', 'passwordConfirm', 'name', 'nickname']
  let valid = true
  for (const field of fields) {
    if (!validateField(field)) {
      valid = false
    }
  }
  return valid
}

async function handleSave() {
  if (!validateAll()) {
    showToast('입력값을 확인해 주세요.')
    return
  }

  saving.value = true
  try {
    // 빈 값은 전송에서 제외
    const payload: Record<string, string> = {
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      roleGroup: form.roleGroup,
    }
    if (form.phone.trim()) {
      payload.phone = form.phone.trim()
    }
    if (form.memo.trim()) {
      payload.memo = form.memo.trim()
    }

    await userApi.create(payload)
    showToast('사용자가 등록되었습니다.')
    router.push('/system/users')
  } catch (err: unknown) {
    const message = extractErrorMessage(err)
    showToast(message)
  } finally {
    saving.value = false
  }
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string }
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message
    }
    if (axiosErr.message) {
      return `사용자 등록에 실패했습니다: ${axiosErr.message}`
    }
  }
  return '사용자 등록에 실패했습니다.'
}

function goBack() {
  router.push('/system/users')
}

onMounted(async () => {
  try {
    const res = await roleApi.getAll()
    roles.value = (res.data || []).filter((r: any) => r.useYn)
  } catch (e) {
    console.error('권한 그룹 로드 실패', e)
  }
})
</script>