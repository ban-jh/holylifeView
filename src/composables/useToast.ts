import { ref, readonly } from 'vue'

/**
 * Toast 알림을 표시하기 위한 글로벌 컴포저블.
 * 단일 인스턴스를 앱 전체에서 공유한다.
 */
const message = ref('')
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function showToast(msg: string) {
  message.value = msg
  visible.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, 2800)
}

function hideToast() {
  visible.value = false
  if (timer) clearTimeout(timer)
}

export function useToast() {
  return {
    message: readonly(message),
    visible: readonly(visible),
    showToast,
    hideToast,
  }
}