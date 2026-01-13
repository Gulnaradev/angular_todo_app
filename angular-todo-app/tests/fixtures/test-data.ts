export type TodoSeedItem = {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
};

export const seedTodos: TodoSeedItem[] = [
  { id: 1, title: 'Buy milk', completed: false, userId: 1 },
  { id: 2, title: 'Write tests', completed: false, userId: 1 },
  { id: 3, title: 'Done task', completed: true, userId: 1 },
];
