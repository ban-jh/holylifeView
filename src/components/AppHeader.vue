<template>
  <header class="header">
    <button class="mobile-menu-btn" @click="emit('open-sidebar')">
      <svg viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <div class="breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="header-actions">
      <div class="header-search">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="검색어를 입력하세요" />
      </div>
      <button class="icon-btn" title="알림">
        <svg viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span class="badge"></span>
      </button>
      <div class="header-avatar">박</div>
    </div>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'open-sidebar'): void
}>()
</script>

<style scoped>
.header {
  height: 64px;
  background: var(--warm-white);
  border-bottom: 1px solid var(--sand);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 14px;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 10;
}

.mobile-menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background var(--transition);
}

.mobile-menu-btn:hover {
  background: var(--cream-dark);
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cream);
  border: 1.5px solid var(--sand);
  border-radius: 22px;
  padding: 7px 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.header-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(201, 125, 78, 0.12);
}

.header-search svg {
  width: 15px;
  height: 15px;
  stroke: var(--text-muted);
  fill: none;
  stroke-width: 2;
  flex-shrink: 0;
}

.header-search input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--text-primary);
  width: 160px;
  font-family: inherit;
}

.header-search input::placeholder {
  color: var(--text-muted);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background var(--transition), color var(--transition);
  position: relative;
}

.icon-btn:hover {
  background: var(--cream-dark);
  color: var(--text-primary);
}

.icon-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: var(--accent);
  border-radius: 50%;
  border: 1.5px solid var(--warm-white);
}

.header-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: opacity var(--transition);
  margin-left: 4px;
  border: 2px solid var(--accent-light);
}

.header-avatar:hover {
  opacity: 0.85;
}

@media (max-width: 680px) {
  .header {
    padding: 0 16px;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .header-search {
    display: none;
  }
}
</style>