// タスクの型
export type Todo = {
  id: number;
  name: string;
  content: string;
  priority: number;
  status: number;
  progress: number;
  limit: string;
  created_at: string;
  updated_at?: string;
  user_id?: number;
};

// 名前で絞り込む
export function filterByName(todos: Todo[], keyword: string): Todo[] {
  if (keyword === "") return todos;
  return todos.filter((todo) => todo.name.includes(keyword));
}

// 優先度で絞り込む(1:高 2:中 3:低)
export function filterByPriority(todos: Todo[], priority: number): Todo[] {
  return todos.filter((todo) => todo.priority === priority);
}