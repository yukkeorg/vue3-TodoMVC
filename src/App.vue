<script setup lang="ts">
import { ref, type Ref, watch, computed, onMounted } from 'vue';
import { type Todo } from './types/Todo';
import todoStorage from './storage.js';
import filters from './filters.js';

const todos: Ref<Todo[]> = ref([]);
const newTodo: Ref<string> = ref('');
const editedTodo: Ref<Todo | null> = ref(null);
const visibility: Ref<string> = ref('all');

let beforeEditCache: string = '';

window.addEventListener('hashchange', () => {
  const v = window.location.hash.replace(/#\/?/, '');
  if (filters[v]) {
    visibility.value = v;
  } else {
    window.location.hash = '';
    visibility.value = 'all';
  }
});

const filteredTodos = computed(() => filters[visibility.value]?.(todos.value));
const remaining = computed(() => filters.active(todos.value).length);
const allDone = computed({
  get() {
    return remaining.value === 0;
  },
  set(value) {
    todos.value.forEach((todo) => {
      todo.completed = value;
    });
  }
});

watch(
  todos,
  async (newTodos: Todo[]) => {
    todoStorage.save(newTodos);
  },
  { deep: true }
);

function addTodo() {
  var value = newTodo.value.trim();
  if (!value) {
    return;
  }
  todos.value.push({
    id: todoStorage.getId(),
    title: value,
    completed: false
  });
  newTodo.value = '';
}

function removeTodo(todo: Todo) {
  todos.value = todos.value.filter((t: Todo) => t.id !== todo.id);
}

function editTodo(todo: Todo) {
  beforeEditCache = todo.title;
  editedTodo.value = todo;
}

function doneEdit(todo: Todo) {
  if (!editedTodo.value) {
    return;
  }
  editedTodo.value = null;
  todo.title = todo.title.trim();
  if (!todo.title) {
    removeTodo(todo);
  }
}

function cancelEdit(todo: Todo) {
  editedTodo.value = null;
  todo.title = beforeEditCache;
}

function removeCompleted() {
  todos.value = filters.active(todos.value);
}

onMounted(() => {
  todos.value = todoStorage.fetch();
});
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="終わらせたいタスクを入力"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>

    <main class="main" v-show="todos.length" v-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </main>

    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count"
        >残り<strong>{{ remaining }}</strong
        >個</span
      >
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">すべて</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">実施中</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">完了済</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">完了済みを削除する</button>
    </footer>
  </section>
</template>

<style scoped lang="scss"></style>
