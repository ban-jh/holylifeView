import { ref } from 'vue'
import { fileApi } from '@/api'

export function useFileUpload() {
  const uploading = ref(false)
  const uploadedUrl = ref<string | null>(null)
  const uploadedFileName = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function upload(file: File, category: string = 'general') {
    uploading.value = true
    error.value = null
    try {
      const res = await fileApi.upload(file, category)
      uploadedUrl.value = res.data.url
      uploadedFileName.value = res.data.fileName
      return res.data
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || '업로드 실패'
      throw e
    } finally {
      uploading.value = false
    }
  }

  async function remove(filePath: string) {
    try {
      await fileApi.delete(filePath)
      uploadedUrl.value = null
      uploadedFileName.value = null
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || '삭제 실패'
      throw e
    }
  }

  function reset() {
    uploading.value = false
    uploadedUrl.value = null
    uploadedFileName.value = null
    error.value = null
  }

  return {
    uploading,
    uploadedUrl,
    uploadedFileName,
    error,
    upload,
    remove,
    reset,
  }
}