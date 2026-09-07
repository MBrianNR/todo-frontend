'use client';

import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Todo } from '@/types/todo';

type TodoStateOnlyAppProps = {
  initialTodos: Todo[];
};

export default function TodoStateOnlyApp({ initialTodos }: TodoStateOnlyAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // 1. Tambah Tugas
  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: 'Tugas baru yang tersimpan dalam state React.',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // 2. Toggle Status Tugas
  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. Hapus Tugas
  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
