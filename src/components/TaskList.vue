<script setup>
import TaskItem from "./TaskItem.vue";

defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  formatTaskMeta: {
    type: Function,
    required: true,
  },
});

defineEmits(["toggle-task", "edit-task", "delete-task"]);
</script>

<template>
  <ul v-if="tasks.length" class="task-list" aria-live="polite">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :meta="formatTaskMeta(task)"
      @toggle-task="$emit('toggle-task', task.id)"
      @edit-task="$emit('edit-task', task.id)"
      @delete-task="$emit('delete-task', task.id)"
    />
  </ul>
  <div v-else class="empty-state">
    <div class="empty-mark" aria-hidden="true">✓</div>
    <p>清单是空的</p>
  </div>
</template>
