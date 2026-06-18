// タスクの型
type Todo = {
  name: string;
  priority: number;
  status: number;
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