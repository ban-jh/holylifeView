<template>
  <div class="tiptap-editor">
    <!-- 툴바 -->
    <div class="tiptap-toolbar" v-if="editor">
      <!-- 글꼴 선택 -->
      <select class="tiptap-select" @change="onFontFamilyChange" title="글꼴">
        <option value="">글꼴</option>
        <option v-for="font in fontFamilies" :key="font.value" :value="font.value" :style="{ fontFamily: font.value }">{{ font.label }}</option>
      </select>

      <!-- 글자 크기 선택 -->
      <select class="tiptap-select tiptap-select-size" @change="onFontSizeChange" title="글자 크기">
        <option value="">크기</option>
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <!-- 글자 색상 -->
      <div class="tiptap-color-wrap">
        <button class="tiptap-btn tiptap-color-btn" title="글자 색상">
          <span style="border-bottom: 3px solid currentColor;">A</span>
        </button>
        <input type="color" class="tiptap-color-input" @input="onColorChange" title="글자 색상" />
      </div>

      <!-- 구분선 -->
      <span class="tiptap-divider"></span>

      <!-- 텍스트 서식 버튼들 -->
      <button
        v-for="btn in toolbarButtons"
        :key="btn.title"
        class="tiptap-btn"
        :class="{ active: btn.isActive ? btn.isActive() : false }"
        @click="btn.action()"
        :title="btn.title"
      >
        <span v-if="btn.icon" v-html="btn.icon"></span>
        <span v-else>{{ btn.label }}</span>
      </button>
    </div>

    <!-- 에디터 본문 -->
    <EditorContent :editor="editor" class="tiptap-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { TextStyle, FontFamily, FontSize, Color } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { watch, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 글꼴 옵션
const fontFamilies = [
  { label: '기본', value: '' },
  { label: 'Pretendard', value: 'Pretendard, sans-serif' },
  { label: 'Noto Sans KR', value: '"Noto Sans KR", sans-serif' },
  { label: 'Noto Serif KR', value: '"Noto Serif KR", serif' },
  { label: '나눔고딕', value: '"Nanum Gothic", sans-serif' },
  { label: '나눔명조', value: '"Nanum Myeongjo", serif' },
  { label: 'Goorm Sans', value: '"Goorm Sans", sans-serif' },
  { label: '굴림', value: 'Gulim, sans-serif' },
  { label: '바탕', value: 'Batang, serif' },
  { label: '돋움', value: 'Dotum, sans-serif' },
  { label: '맑은 고딕', value: '"Malgun Gothic", sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
]

// 글자 크기 옵션
const fontSizes = ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px', '28px', '32px', '36px', '40px', '48px']

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    TextStyle,
    FontFamily,
    Color,
    Highlight,
    FontSize,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// 외부 값 변경 시 에디터 업데이트
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// 글꼴 변경
function onFontFamilyChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  if (value) {
    editor.value?.chain().focus().setFontFamily(value).run()
  } else {
    editor.value?.chain().focus().unsetFontFamily().run()
  }
}

// 글자 크기 변경
function onFontSizeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  if (value) {
    editor.value?.chain().focus().setFontSize(value).run()
  } else {
    editor.value?.chain().focus().unsetFontSize().run()
  }
}

// 글자 색상 변경
function onColorChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  editor.value?.chain().focus().setColor(value).run()
}

// 툴바 버튼 설정
const toolbarButtons = ref([
  {
    title: '굵게',
    label: 'B',
    icon: '<b>B</b>',
    isActive: () => editor.value?.isActive('bold') || false,
    action: () => editor.value?.chain().focus().toggleBold().run(),
  },
  {
    title: '이탤릭',
    label: 'I',
    icon: '<i>I</i>',
    isActive: () => editor.value?.isActive('italic') || false,
    action: () => editor.value?.chain().focus().toggleItalic().run(),
  },
  {
    title: '밑줄',
    label: 'U',
    icon: '<u>U</u>',
    isActive: () => editor.value?.isActive('underline') || false,
    action: () => editor.value?.chain().focus().toggleUnderline().run(),
  },
  {
    title: '취소선',
    label: 'S',
    icon: '<s>S</s>',
    isActive: () => editor.value?.isActive('strike') || false,
    action: () => editor.value?.chain().focus().toggleStrike().run(),
  },
  {
    title: '형광펜',
    label: 'H',
    icon: '',
    isActive: () => editor.value?.isActive('highlight') || false,
    action: () => editor.value?.chain().focus().toggleHighlight().run(),
  },
  { title: '구분선', label: '', icon: '─', action: () => editor.value?.chain().focus().setHorizontalRule().run() },
  {
    title: '제목1',
    label: 'H1',
    icon: '',
    isActive: () => editor.value?.isActive('heading', { level: 1 }) || false,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: '제목2',
    label: 'H2',
    icon: '',
    isActive: () => editor.value?.isActive('heading', { level: 2 }) || false,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: '제목3',
    label: 'H3',
    icon: '',
    isActive: () => editor.value?.isActive('heading', { level: 3 }) || false,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: '글머리 기호',
    label: '•',
    icon: '',
    isActive: () => editor.value?.isActive('bulletList') || false,
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
  },
  {
    title: '번호 목록',
    label: '1.',
    icon: '',
    isActive: () => editor.value?.isActive('orderedList') || false,
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
  },
  {
    title: '인용구',
    label: '❝',
    icon: '',
    isActive: () => editor.value?.isActive('blockquote') || false,
    action: () => editor.value?.chain().focus().toggleBlockquote().run(),
  },
  {
    title: '코드블록',
    label: '</>',
    icon: '',
    isActive: () => editor.value?.isActive('codeBlock') || false,
    action: () => editor.value?.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: '왼쪽 정렬',
    label: '⬅',
    icon: '',
    isActive: () => editor.value?.isActive({ textAlign: 'left' }) || false,
    action: () => editor.value?.chain().focus().setTextAlign('left').run(),
  },
  {
    title: '가운데 정렬',
    label: '⬌',
    icon: '',
    isActive: () => editor.value?.isActive({ textAlign: 'center' }) || false,
    action: () => editor.value?.chain().focus().setTextAlign('center').run(),
  },
  {
    title: '오른쪽 정렬',
    label: '➡',
    icon: '',
    isActive: () => editor.value?.isActive({ textAlign: 'right' }) || false,
    action: () => editor.value?.chain().focus().setTextAlign('right').run(),
  },
  {
    title: '링크',
    label: '🔗',
    icon: '',
    isActive: () => editor.value?.isActive('link') || false,
    action: () => {
      const url = window.prompt('URL 입력')
      if (url) {
        editor.value?.chain().focus().setLink({ href: url }).run()
      } else {
        editor.value?.chain().focus().unsetLink().run()
      }
    },
  },
  {
    title: '이미지',
    label: '🖼',
    icon: '',
    action: () => {
      const url = window.prompt('이미지 URL 입력')
      if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run()
      }
    },
  },
  { title: '실행 취소', label: '↶', icon: '', action: () => editor.value?.chain().focus().undo().run() },
  { title: '다시 실행', label: '↷', icon: '', action: () => editor.value?.chain().focus().redo().run() },
])
</script>