import React from 'react';
import TodoCachedApp from './components/TodoCachedApp';
import { getTodos } from '@/lib/todos';

export default async function CachedTodosPage() {
  const initialTodos = await getTodos();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Daftar Tugas (Cache LocalStorage)
          </h1>
        </header>

        <TodoCachedApp initialTodos={initialTodos} />
      </div>
    </main>
  );
}
