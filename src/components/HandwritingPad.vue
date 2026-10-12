<template>
  <div v-if="show" class="handwriting-overlay">
    <div class="handwriting-container">
      <!-- 헤더 -->
      <div class="handwriting-header">
        <div class="handwriting-title">✍️ 손글씨 필기</div>
        <button class="handwriting-close" @click="cancel">×</button>
      </div>

      <!-- 도구 모음 -->
      <div class="handwriting-toolbar">
        <div class="hw-tool-group">
          <button
            v-for="c in colors"
            :key="c"
            class="hw-color-btn"
            :class="{ active: currentColor === c }"
            :style="{ background: c }"
            @click="currentColor = c"
          ></button>
        </div>

        <div class="hw-tool-group">
          <button
            v-for="s in sizes"
            :key="s.value"
            class="hw-size-btn"
            :class="{ active: currentSize === s.value }"
            @click="currentSize = s.value"
          >{{ s.label }}</button>
        </div>

        <div class="hw-tool-group">
          <button class="hw-tool-btn" :class="{ active: mode === 'eraser' }" @click="mode = 'eraser'">지우개</button>
          <button class="hw-tool-btn" @click="undo">↶ 취소</button>
          <button class="hw-tool-btn" @click="clearCanvas">전체 지움</button>
        </div>

        <!-- 캔버스 높이 조절 -->
        <div class="hw-tool-group hw-height-group">
          <span class="hw-height-label">캔버스 높이</span>
          <button class="hw-height-btn" @click="changeHeight(-200)">−</button>
          <span class="hw-height-value">{{ canvasHeight }}px</span>
          <button class="hw-height-btn" @click="changeHeight(200)">+</button>
          <button class="hw-tool-btn" @click="addPage">📄 페이지 추가</button>
        </div>
      </div>

      <!-- 스크롤 안내 -->
      <div class="hw-scroll-hint">💡 + 버튼이나 📄 페이지 추가로 캔버스를 늘리면 화면이 자동으로 스크롤됩니다</div>

      <!-- 캔버스 (스크롤 가능) -->
      <div class="handwriting-canvas-wrap" ref="canvasWrapRef">
        <canvas
          ref="canvasRef"
          :style="{ height: canvasHeight + 'px' }"
          @pointerdown="startDraw"
          @pointermove="draw"
          @pointerup="endDraw"
          @pointerleave="endDraw"
        ></canvas>
      </div>

      <!-- 하단 버튼 -->
      <div class="handwriting-footer">
        <button class="hw-btn hw-btn-cancel" @click="cancel">취소</button>
        <button class="hw-btn hw-btn-insert" @click="insertImage">에디터에 삽입</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const emit = defineEmits<{
  (e: 'insert', dataUrl: string): void
}>()

const show = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapRef = ref<HTMLDivElement | null>(null)
const isDrawing = ref(false)
const currentColor = ref('#000000')
const currentSize = ref(3)
const mode = ref<'pen' | 'eraser'>('pen')
const canvasHeight = ref(500)

const colors = ['#000000', '#c97d4e', '#e74c3c', '#2980b9', '#27ae60', '#8e44ad']
const sizes = [
  { label: '얇음', value: 2 },
  { label: '보통', value: 4 },
  { label: '굵게', value: 7 },
]

// 드로잉 히스토리 (undo용)
const history: ImageData[] = []
let ctx: CanvasRenderingContext2D | null = null

function open() {
  show.value = true
  canvasHeight.value = 400
  nextTick(() => {
    initCanvas()
  })
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  const wrap = canvasWrapRef.value
  const w = wrap?.clientWidth ? wrap.clientWidth - 24 : window.innerWidth - 80
  const h = canvasHeight.value

  canvas.width = w
  canvas.height = h

  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    saveHistory()
  }
}

// 캔버스 높이 변경 — 기존 내용 보존
function changeHeight(delta: number) {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  const newHeight = Math.max(200, canvasHeight.value + delta)
  if (newHeight === canvasHeight.value) return

  // 기존 내용 저장
  const oldData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const oldHeight = canvas.height

  // 새 크기로 캔버스 재설정
  canvasHeight.value = newHeight
  canvas.height = newHeight

  // 흰 배경 채우기
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, newHeight)

  // 기존 내용 복원
  ctx.putImageData(oldData, 0, 0)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  saveHistory()
}

// 페이지 추가 — 200px 증가 후 overlay 스크롤을 맨 아래로
function addPage() {
  changeHeight(200)
  nextTick(() => {
    const overlay = document.querySelector('.handwriting-overlay')
    if (overlay) {
      overlay.scrollTop = overlay.scrollHeight
    }
  })
}

function saveHistory() {
  if (ctx && canvasRef.value) {
    const imageData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    history.push(imageData)
    if (history.length > 30) history.shift()
  }
}

function getPos(e: PointerEvent): { x: number; y: number } {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function startDraw(e: PointerEvent) {
  // 두 손가락(터치 2개)이면 스크롤 모드 — 그리지 않음
  if (e.pointerType === 'touch' && (e as any).isPrimary === false) return
  e.preventDefault()
  isDrawing.value = true
  const pos = getPos(e)
  if (ctx) {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }
}

function draw(e: PointerEvent) {
  if (!isDrawing.value || !ctx) return
  // 두 손가락이면 그리기 중단
  if (e.pointerType === 'touch' && (e as any).isPrimary === false) {
    isDrawing.value = false
    return
  }
  e.preventDefault()
  const pos = getPos(e)

  if (mode.value === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = currentSize.value * 3
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = currentColor.value
    ctx.lineWidth = currentSize.value
  }

  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

function endDraw() {
  if (isDrawing.value) {
    isDrawing.value = false
    if (ctx) ctx.globalCompositeOperation = 'source-over'
    saveHistory()
  }
}

function undo() {
  if (history.length > 1) {
    history.pop()
    const last = history[history.length - 1]
    if (ctx) ctx.putImageData(last, 0, 0)
  }
}

function clearCanvas() {
  if (ctx && canvasRef.value) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    saveHistory()
  }
}

function insertImage() {
  if (canvasRef.value) {
    // 캔버스 전체를 이미지로 변환 — 흰 여백 부분도 포함
    const dataUrl = canvasRef.value.toDataURL('image/png')
    emit('insert', dataUrl)
    show.value = false
  }
}

function cancel() {
  show.value = false
}

defineExpose({ open })
</script>

<style scoped>
.handwriting-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px 0;
}
.handwriting-container {
  background: #fff;
  border-radius: 16px;
  width: 95vw;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  margin: auto;
}
.handwriting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0d5c7;
  flex-shrink: 0;
}
.handwriting-title {
  font-size: 18px;
  font-weight: 700;
  color: #3d2e1f;
}
.handwriting-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}
.handwriting-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0ebe5;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.hw-tool-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.hw-color-btn {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;
}
.hw-color-btn.active {
  border-color: #c97d4e;
  transform: scale(1.15);
}
.hw-size-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #e0d5c7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  color: #7a6a5a;
}
.hw-size-btn.active {
  background: #c97d4e;
  color: #fff;
  border-color: #c97d4e;
}
.hw-tool-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #e0d5c7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  color: #7a6a5a;
  white-space: nowrap;
}
.hw-tool-btn.active {
  background: #c97d4e;
  color: #fff;
  border-color: #c97d4e;
}
/* 캔버스 높이 조절 */
.hw-height-group {
  margin-left: auto;
}
.hw-height-label {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
}
.hw-height-btn {
  width: 28px; height: 28px;
  border: 1px solid #e0d5c7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  color: #7a6a5a;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.hw-height-btn:hover {
  background: #f5f0eb;
}
.hw-height-value {
  font-size: 12px;
  color: #3d2e1f;
  min-width: 50px;
  text-align: center;
}
/* 스크롤 안내 */
.hw-scroll-hint {
  padding: 6px 16px;
  font-size: 11px;
  color: #94a3b8;
  background: #faf7f2;
  border-bottom: 1px solid #f0ebe5;
  flex-shrink: 0;
}

/* 캔버스 영역 — 캔버스 크기에 맞춰 자연스럽게 늘어남 */
.handwriting-canvas-wrap {
  flex: 1 1 auto;
  padding: 10px 12px;
  display: block;
  background: #f9f5f0;
}
.handwriting-canvas-wrap canvas {
  display: block;
  width: 100%;
  border: 2px solid #e0d5c7;
  border-radius: 8px;
  background: #fff;
  touch-action: none;
  cursor: crosshair;
}
.handwriting-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid #e0d5c7;
  flex-shrink: 0;
}
.hw-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.hw-btn-cancel {
  background: #f5f0eb;
  color: #7a6a5a;
}
.hw-btn-insert {
  background: #c97d4e;
  color: #fff;
}
.hw-btn-insert:hover {
  background: #a05a30;
}
</style>