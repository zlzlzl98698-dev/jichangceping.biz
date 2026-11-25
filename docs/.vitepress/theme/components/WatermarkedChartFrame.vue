<script setup lang="ts">
import { computed } from 'vue'
import { getStatusMeta, sanitizeHexColor } from './observatory'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    brandName?: string
    accentColor?: string
    dataStatus?: string
    testedAt?: string
    sourceLabel?: string
    showWatermark?: boolean
    compact?: boolean
  }>(),
  {
    subtitle: '',
    brandName: '',
    accentColor: '#0284c7',
    dataStatus: 'Not Tested',
    testedAt: '',
    sourceLabel: '',
    showWatermark: true,
    compact: false
  }
)

const status = computed(() => getStatusMeta(props.dataStatus))
const accent = computed(() => sanitizeHexColor(props.accentColor, '#0284c7'))
</script>

<template>
  <figure
    class="obs-frame"
    :class="{ 'is-compact': compact }"
    :style="{ '--obs-accent': accent }"
  >
    <div class="obs-accent-bar" aria-hidden="true" />
    <header class="obs-header">
      <div class="obs-title-group">
        <div class="obs-kicker-row">
          <span v-if="brandName" class="obs-brand-pill">{{ brandName }}</span>
          <span class="obs-lab-tag">NETWORK OBSERVATORY</span>
        </div>
        <figcaption class="obs-title">{{ title }}</figcaption>
        <p v-if="subtitle" class="obs-subtitle">{{ subtitle }}</p>
      </div>
      <div class="obs-status-wrap">
        <span
          class="obs-status-badge"
          :style="{
            color: status.color,
            backgroundColor: status.bg,
            borderColor: status.border
          }"
        >
          <span class="obs-status-dot" :style="{ backgroundColor: status.color }" />
          <span class="obs-status-en">{{ status.enTag }}</span>
          <span class="obs-status-zh">{{ status.zhLabel }}</span>
        </span>
      </div>
    </header>

    <div class="obs-body">
      <slot />
      <div v-if="showWatermark" class="obs-watermark-overlay" aria-hidden="true">
        机场测评 · jichangceping.biz
      </div>
    </div>

    <footer class="obs-footer">
      <div class="obs-footer-meta">
        <span v-if="testedAt" class="obs-meta-item">
          <span class="obs-meta-key">时间</span>
          <code class="obs-meta-val">{{ testedAt }}</code>
        </span>
        <span v-if="sourceLabel" class="obs-meta-item">
          <span class="obs-meta-key">来源</span>
          <span class="obs-meta-val">{{ sourceLabel }}</span>
        </span>
      </div>
      <span v-if="showWatermark" class="obs-footer-watermark">
        机场测评 · jichangceping.biz
      </span>
    </footer>
  </figure>
</template>

<style scoped>
.obs-frame {
  position: relative;
  margin: 1.5rem 0;
  border-radius: 12px;
  background: #0b1220;
  border: 1px solid #1e2d4a;
  color: #e2e8f0;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(5, 11, 24, 0.24);
}

.obs-accent-bar {
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--obs-accent, #0284c7), rgba(56, 189, 248, 0.25));
}

.obs-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem 1rem;
  padding: 1rem 1.25rem 0.85rem;
  background: #131d31;
  border-bottom: 1px solid #1e2d4a;
}

.obs-frame.is-compact .obs-header {
  padding: 0.8rem 1rem 0.7rem;
}

.obs-kicker-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.obs-brand-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.5rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(56, 189, 248, 0.14);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.obs-lab-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: #64748b;
}

.obs-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #f8fafc;
  line-height: 1.35;
}

.obs-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.45;
}

.obs-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.75rem;
  white-space: nowrap;
}

.obs-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.obs-status-en {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.obs-status-zh {
  font-weight: 500;
}

.obs-body {
  position: relative;
  padding: 1.1rem 1.25rem;
  background-image:
    linear-gradient(to right, rgba(30, 45, 74, 0.22) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 45, 74, 0.22) 1px, transparent 1px);
  background-size: 28px 28px;
}

.obs-frame.is-compact .obs-body {
  padding: 0.9rem 1rem;
}

.obs-watermark-overlay {
  position: absolute;
  right: 0.85rem;
  bottom: 0.55rem;
  pointer-events: none;
  user-select: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: rgba(226, 232, 240, 0.24);
}

.obs-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem 1rem;
  padding: 0.65rem 1.25rem;
  background: #0f172a;
  border-top: 1px solid #1e2d4a;
  font-size: 0.76rem;
  color: #94a3b8;
}

.obs-footer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.obs-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.obs-meta-key {
  color: #64748b;
}

.obs-meta-val {
  color: #cbd5e1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background: transparent;
  padding: 0;
}

.obs-footer-watermark {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  color: rgba(148, 163, 184, 0.62);
}

@media (max-width: 640px) {
  .obs-header,
  .obs-body,
  .obs-footer {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
}
</style>
