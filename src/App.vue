<script setup>
import { computed, ref, watch } from "vue";
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";
import TaskSummary from "./components/TaskSummary.vue";

const storageKey = "todo-list-site.tasks";
const themeKey = "todo-list-site.theme";

const priorityLabels = {
  high: "重要",
  normal: "普通",
  low: "轻量",
};

const filterTabs = [
  { value: "all", label: "全部" },
  { value: "open", label: "待办" },
  { value: "today", label: "今天" },
  { value: "done", label: "完成" },
];

const tasks = ref(loadTasks());
const activeFilter = ref("all");
const query = ref("");
const theme = ref(localStorage.getItem(themeKey) || "light");

const todayLabel = new Intl.DateTimeFormat("zh-CN", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

const visibleTasks = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();

  return tasks.value.filter((task) => {
    const matchesQuery = [task.title, task.category, priorityLabels[task.priority]]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    if (!matchesQuery) return false;
    if (activeFilter.value === "open") return !task.done;
    if (activeFilter.value === "done") return task.done;
    if (activeFilter.value === "today") return !task.done && isToday(task.dueDate);
    return true;
  });
});

const doneCount = computed(() => tasks.value.filter((task) => task.done).length);
const openCount = computed(() => tasks.value.length - doneCount.value);
const dueSoonCount = computed(() => tasks.value.filter((task) => !task.done && isDueSoon(task.dueDate)).length);
const progress = computed(() => (tasks.value.length ? Math.round((doneCount.value / tasks.value.length) * 100) : 0));
const canClearDone = computed(() => doneCount.value > 0);
const themeIcon = computed(() => (theme.value === "dark" ? "☼" : "◐"));

watch(
  tasks,
  (nextTasks) => {
    localStorage.setItem(storageKey, JSON.stringify(nextTasks));
  },
  { deep: true },
);

watch(
  theme,
  (nextTheme) => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(themeKey, nextTheme);
  },
  { immediate: true },
);

function addTask(task) {
  tasks.value = [
    {
      id: crypto.randomUUID(),
      done: false,
      createdAt: Date.now(),
      ...task,
    },
    ...tasks.value,
  ];
}

function updateTask(id, patch) {
  tasks.value = tasks.value.map((task) => (task.id === id ? { ...task, ...patch } : task));
}

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id);
  if (!task) return;
  updateTask(id, { done: !task.done });
}

function editTask(id) {
  const task = tasks.value.find((item) => item.id === id);
  if (!task) return;

  const nextTitle = prompt("编辑任务", task.title);
  if (nextTitle === null) return;

  const title = nextTitle.trim();
  if (!title) return;

  updateTask(id, { title });
}

function deleteTask(id) {
  tasks.value = tasks.value.filter((task) => task.id !== id);
}

function clearDone() {
  tasks.value = tasks.value.filter((task) => !task.done);
}

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

function formatTaskMeta(task) {
  const dueLabel = task.dueDate ? `截止 ${formatDueDate(task.dueDate)}` : "无截止日期";
  return `${task.category || "工作"} · ${priorityLabels[task.priority] || "普通"} · ${dueLabel} · ${formatRelativeDate(task.createdAt)}`;
}

function formatDueDate(dateValue) {
  const date = parseLocalDate(dateValue);
  if (!date) return "";

  if (isToday(dateValue)) return "今天";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatRelativeDate(timestamp) {
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;

  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function isToday(dateValue) {
  const date = parseLocalDate(dateValue);
  if (!date) return false;

  const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}

function isDueSoon(dateValue) {
  const date = parseLocalDate(dateValue);
  if (!date) return false;

  const today = startOfDay(new Date());
  const due = startOfDay(date);
  const diffDays = Math.round((due - today) / 86400000);
  return diffDays >= 0 && diffDays <= 2;
}

function parseLocalDate(dateValue) {
  if (!dateValue) return null;
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    return savedTasks.map((task) => ({
      category: "工作",
      dueDate: "",
      ...task,
    }));
  } catch {
    return [];
  }
}
</script>

<template>
  <main class="app-shell">
    <section class="workspace" aria-label="Todo List">
      <header class="topbar">
        <div>
          <p class="date-label">{{ todayLabel }}</p>
          <p class="owner-label">Lancer</p>
          <h1>今日待办</h1>
        </div>
        <button class="icon-button" type="button" aria-label="切换主题" title="切换主题" @click="toggleTheme">
          <span aria-hidden="true">{{ themeIcon }}</span>
        </button>
      </header>

      <TaskForm @add-task="addTask" />

      <TaskSummary
        :open-count="openCount"
        :due-soon-count="dueSoonCount"
        :done-count="doneCount"
        :progress="progress"
      />

      <div class="controls">
        <div class="filter-tabs" role="tablist" aria-label="筛选任务">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            class="tab"
            :class="{ 'is-active': activeFilter === tab.value }"
            type="button"
            @click="activeFilter = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="search-box">
          <label class="sr-only" for="searchInput">搜索任务</label>
          <input id="searchInput" v-model="query" type="search" placeholder="搜索" autocomplete="off" />
        </div>
        <button class="ghost-button" type="button" :disabled="!canClearDone" @click="clearDone">清除已完成</button>
      </div>

      <TaskList
        :tasks="visibleTasks"
        :format-task-meta="formatTaskMeta"
        @toggle-task="toggleTask"
        @edit-task="editTask"
        @delete-task="deleteTask"
      />
    </section>
  </main>
</template>
