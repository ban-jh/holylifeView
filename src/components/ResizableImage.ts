import Image from '@tiptap/extension-image'

/**
 * 크기 조절 + 정렬 가능한 이미지 확장
 * - 이미지 클릭 → 노드 선택 (선택 표시 + 툴바/핸들 노출)
 * - 우하단 핸들 드래그 → 폭 조절 (width 속성 저장)
 * - 선택 툴바에서 좌/가운데/우 정렬 + 삭제
 */
const ALIGN_STYLES: Record<string, { marginLeft: string; marginRight: string }> = {
  left: { marginLeft: '0', marginRight: 'auto' },
  center: { marginLeft: 'auto', marginRight: 'auto' },
  right: { marginLeft: 'auto', marginRight: '0' },
}

const ICONS: Record<string, string> = {
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="13" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  center: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
}

const ResizableImage = Image.extend({
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('width') || element.style.width || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-align') || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.align) return {}
          return { 'data-align': attributes.align }
        },
      },
    }
  },

  addNodeView() {
    return (({ node, editor, getPos }: any) => {
      let currentNode = node

      const wrapper = document.createElement('div')
      wrapper.className = 'img-resize-wrapper'
      wrapper.setAttribute('draggable', 'false')

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.draggable = false
      img.setAttribute('draggable', 'false')

      const applyStyle = () => {
        const w = currentNode.attrs.width
        img.style.width = w ? (String(w).endsWith('px') ? String(w) : `${w}px`) : ''
        img.style.display = 'block'
        img.style.marginLeft = ''
        img.style.marginRight = ''
        // 정렬은 래퍼(블록)에 적용 — 이미지 폭에 맞춰 줄어든 블록을 좌/중앙/우 배치
        const align = currentNode.attrs.align
        if (align && ALIGN_STYLES[align]) {
          wrapper.style.marginLeft = ALIGN_STYLES[align].marginLeft
          wrapper.style.marginRight = ALIGN_STYLES[align].marginRight
        } else {
          wrapper.style.marginLeft = '0'
          wrapper.style.marginRight = 'auto'
        }
      }
      applyStyle()

      // ── 선택 툴바 (정렬 + 삭제) ──
      const toolbar = document.createElement('div')
      toolbar.className = 'img-toolbar'
      ;(['left', 'center', 'right'] as const).forEach((a) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'img-toolbar-btn'
        btn.dataset.align = a
        btn.title = a === 'left' ? '왼쪽 정렬' : a === 'center' ? '가운데 정렬' : '오른쪽 정렬'
        btn.innerHTML = ICONS[a]
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault()
          e.stopPropagation()
          updateNode({ align: currentNode.attrs.align === a ? null : a })
        })
        toolbar.appendChild(btn)
      })
      const sep = document.createElement('span')
      sep.className = 'img-toolbar-sep'
      toolbar.appendChild(sep)

      const delBtn = document.createElement('button')
      delBtn.type = 'button'
      delBtn.className = 'img-toolbar-btn img-toolbar-del'
      delBtn.title = '이미지 삭제'
      delBtn.innerHTML = ICONS.trash
      delBtn.addEventListener('mousedown', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const pos = typeof getPos === 'function' ? getPos() : null
        if (pos == null) return
        editor.chain().focus().deleteRange({ from: pos, to: pos + currentNode.nodeSize }).run()
      })
      toolbar.appendChild(delBtn)

      const syncToolbarState = () => {
        toolbar.querySelectorAll<HTMLButtonElement>('.img-toolbar-btn[data-align]').forEach((b) => {
          b.classList.toggle('active', b.dataset.align === (currentNode.attrs.align || 'left'))
        })
      }
      syncToolbarState()

      // ── 리사이즈 핸들 ──
      const handle = document.createElement('span')
      handle.className = 'img-resize-handle'
      handle.title = '드래그해서 크기 조절'

      wrapper.appendChild(img)
      wrapper.appendChild(toolbar)
      wrapper.appendChild(handle)

      // ── 노드 선택 ──
      const selectNode = () => {
        const pos = typeof getPos === 'function' ? getPos() : null
        if (pos === null || pos === undefined) return
        if (editor.state.selection.from !== pos) {
          editor.commands.setNodeSelection(pos)
        }
      }

      const onWrapperMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('.img-resize-handle') || target.closest('.img-toolbar')) return
        e.preventDefault()
        selectNode()
      }
      wrapper.addEventListener('mousedown', onWrapperMouseDown)
      img.addEventListener('click', (e) => {
        e.preventDefault()
        selectNode()
      })

      // ── 노드 속성 업데이트 ──
      const updateNode = (attrs: Record<string, any>) => {
        const pos = typeof getPos === 'function' ? getPos() : null
        if (pos === null || pos === undefined) return
        const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
          ...currentNode.attrs,
          ...attrs,
        })
        editor.view.dispatch(tr)
        editor.commands.setNodeSelection(pos)
      }

      // ── 리사이즈 드래그 ──
      let startX = 0
      let startWidth = 0
      let currentWidth = 0

      const onMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startX
        const next = Math.max(60, Math.round(startWidth + delta))
        currentWidth = next
        img.style.width = `${next}px`
      }
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        if (currentWidth) updateNode({ width: `${currentWidth}px` })
        currentWidth = 0
      }
      const onHandleMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        selectNode()
        startX = e.clientX
        startWidth = img.getBoundingClientRect().width
        currentWidth = Math.round(startWidth)
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }
      handle.addEventListener('mousedown', onHandleMouseDown)

      return {
        dom: wrapper,
        update(updatedNode: any) {
          if (updatedNode.type.name !== currentNode.type.name) return false
          const srcChanged = updatedNode.attrs.src !== currentNode.attrs.src
          currentNode = updatedNode
          if (srcChanged) img.src = updatedNode.attrs.src
          applyStyle()
          syncToolbarState()
          return true
        },
        selectNode() {
          wrapper.classList.add('selected')
        },
        deselectNode() {
          wrapper.classList.remove('selected')
        },
        destroy() {
          wrapper.removeEventListener('mousedown', onWrapperMouseDown)
          handle.removeEventListener('mousedown', onHandleMouseDown)
          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)
        },
      }
    }) as any
  },
})

export default ResizableImage
