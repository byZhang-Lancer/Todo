<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
  meta: {
    type: String,
    required: true,
  },
});

defineEmits(["toggle-task", "edit-task", "delete-task"]);
</script>

<template>
  <li class="task-item" :class="{ 'is-done': task.done }" :data-priority="task.priority">
    <button class="check-button" type="button" aria-label="切换完成状态" @click="$emit('toggle-task')"></button>
    <div class="task-content">
      <p class="task-title">{{ task.title }}</p>
      <span class="task-meta">{{ meta }}</span>
    </div>
    <div class="task-actions">
      <button class="edit-button" type="button" aria-label="编辑任务" title="编辑任务" @click="$emit('edit-task')">✎</button>
      <button class="delete-button" type="button" aria-label="删除任务" title="删除任务" @click="$emit('delete-task')">×</button>
    </div>
  </li>
</template>
