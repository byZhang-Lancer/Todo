<script setup>
defineProps({
  openCount: {
    type: Number,
    required: true,
  },
  dueSoonCount: {
    type: Number,
    required: true,
  },
  doneCount: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <section class="summary-band" aria-label="任务统计">
    <div>
      <strong>{{ openCount }}</strong>
      <span>未完成</span>
    </div>
    <div>
      <strong>{{ dueSoonCount }}</strong>
      <span>临近</span>
    </div>
    <div>
      <strong>{{ doneCount }}</strong>
      <span>已完成</span>
    </div>
    <div>
      <strong>{{ progress }}%</strong>
      <span>进度</span>
    </div>
  </section>
  <div class="progress-track" aria-hidden="true">
    <span :style="{ width: `${progress}%` }"></span>
  </div>
</template>
