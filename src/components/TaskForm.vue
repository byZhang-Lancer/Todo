<script setup>
import { ref } from "vue";

const emit = defineEmits(["add-task"]);

const title = ref("");
const category = ref("工作");
const priority = ref("normal");
const dueDate = ref("");
const urgency = ref("normal");

function submitTask() {
  const trimmedTitle = title.value.trim();
  if (!trimmedTitle) return;

  emit("add-task", {
    title: trimmedTitle,
    category: category.value,
    priority: priority.value,
    dueDate: dueDate.value,
    urgency: urgency.value,
  });

  title.value = "";
  priority.value = "normal";
  dueDate.value = "";
  urgency.value = "normal";
}
</script>

<template>
  <form class="task-form" @submit.prevent="submitTask">
    <label class="sr-only" for="taskInput">新待办</label>
    <input
      id="taskInput"
      v-model="title"
      name="task"
      type="text"
      maxlength="120"
      placeholder="写下一件要完成的事"
      autocomplete="off"
      required
    />

    <label class="sr-only" for="categorySelect">分类</label>
    <select id="categorySelect" v-model="category" name="category" aria-label="分类">
      <option value="工作">工作</option>
      <option value="生活">生活</option>
      <option value="学习">学习</option>
      <option value="灵感">灵感</option>
    </select>

    <label class="sr-only" for="prioritySelect">优先级</label>
    <select id="prioritySelect" v-model="priority" name="priority" aria-label="优先级">
      <option value="normal">普通</option>
      <option value="high">重要</option>
      <option value="low">轻量</option>
    </select>

    <label class="sr-only" for="dueInput">截止日期</label>
    <input id="dueInput" v-model="dueDate" name="due" type="date" aria-label="截止日期" />

    <label class="sr-only" for="urgencySelect">紧急程度</label>
    <select id="urgencySelect" v-model="urgency" name="urgency" aria-label="紧急程度">
      <option value="normal">一般</option>
      <option value="urgent">紧急</option>
      <option value="later">可缓</option>
    </select>

    <button class="primary-button" type="submit">添加</button>
  </form>
</template>
