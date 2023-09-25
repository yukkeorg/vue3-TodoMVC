/**
 * データフィルタ用オブジェクト
 */
import { type Todo } from '@/types/Todo';

export type FilterFunctions = {
  all(todos: Todo[]): Todo[];
  active(todos: Todo[]): Todo[];
  completed(todos: Todo[]): Todo[];
  [key: string]: any;
};

const filter: FilterFunctions = {
  all(todos: Todo[]) {
    return todos;
  },
  active(todos: Todo[]) {
    return todos.filter((todo) => !todo.completed);
  },
  completed(todos: Todo[]) {
    return todos.filter((todo) => todo.completed);
  }
};

export default filter;
