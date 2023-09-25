/**
 * ストレージに入出力オブジェクト
 */
import { type Todo } from '@/types/Todo';

export type Storage = {
  uid: number;
  getId(): number;
  fetch(): Todo[];
  save(todos: Todo[]): void;
};

const STORAGE_KEY = 'todos-vuejs-2.0';

const storage: Storage = {
  uid: 0,
  getId(): number {
    return this.uid++;
  },
  fetch(): Todo[] {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    todos.forEach((todo: Todo, index: number) => {
      todo.id = index;
    });
    this.uid = todos.length;
    return todos;
  },
  save(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

export default storage;
