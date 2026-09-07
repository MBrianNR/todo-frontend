export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosApiResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  source: string;
}
