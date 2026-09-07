'use client';

import React, { useState } from 'react';
import { TaskItem } from '@/types/api-todo';
import { getTaskStats } from '@/lib/tasks';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { todoService } from '@/services/todoService';

type ApiTodoListProps = {
  initialTasks: TaskItem[];
};

export default function ApiTodoList({ initialTasks }: ApiTodoListProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = getTaskStats(tasks);

  // 1. Tambah Tugas Baru
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulasikan tambah ke API DummyJSON
      const result = await todoService.createTodo({
        todo: trimmed,
        completed: false,
        userId: 5,
      });

      const newTask: TaskItem = {
        id: result.id || Date.now(),
        title: result.todo,
        completed: result.completed,
        userId: result.userId,
        source: 'dummyjson-api',
      };

      setTasks((prev) => [newTask, ...prev]);
      setNewTitle('');
    } catch (err) {
      console.error('Gagal menambahkan task:', err);
      // Fallback optimistic jika offline/error
      const newTask: TaskItem = {
        id: Date.now(),
        title: trimmed,
        completed: false,
        userId: 1,
        source: 'local-fallback',
      };
      setTasks((prev) => [newTask, ...prev]);
      setNewTitle('');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Toggle Status Tugas
  const handleToggle = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedCompleted = !task.completed;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: updatedCompleted } : t))
    );

    try {
      await todoService.updateTodoStatus(id, updatedCompleted);
    } catch (err) {
      console.warn('Gagal sinkron status ke API (menggunakan lokal state):', err);
    }
  };

  // 3. Hapus Tugas
  const handleDelete = async (id: number) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      console.warn('Gagal menghapus task dari API (menggunakan lokal state):', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kartu Statistik Tugas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">Total Tugas</p>
          <p className="text-xl font-bold text-dark-70">{stats.total}</p>
        </div>
        <div className="p-3 bg-success-10/30 rounded-xl border border-success-20 text-center">
          <p className="text-xs text-success-80 font-medium">Selesai</p>
          <p className="text-xl font-bold text-success-70">{stats.completed}</p>
        </div>
        <div className="p-3 bg-yellow-10/40 rounded-xl border border-yellow-20 text-center">
          <p className="text-xs text-yellow-80 font-medium">Tertunda</p>
          <p className="text-xl font-bold text-yellow-80">{stats.pending}</p>
        </div>
        <div className="p-3 bg-primary-10/30 rounded-xl border border-primary-20 text-center">
          <p className="text-xs text-primary-80 font-medium">Kemajuan</p>
          <p className="text-xl font-bold text-primary-70">{stats.completionPercentage}%</p>
        </div>
      </div>

      {/* Form Tambah Tugas */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Tambahkan tugas baru ke API..."
          className="flex-1 bg-white"
          variantSize="md"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!newTitle.trim() || isLoading}
          variant="default"
          size="md"
        >
          {isLoading ? 'Menyimpan...' : 'Tambah'}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-danger-70 bg-danger-10/30 p-3 rounded-lg">{error}</p>
      )}

      {/* Daftar Tugas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark-70">Daftar Tugas DummyJSON</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {tasks.length} item
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center p-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            <p>Tidak ada tugas yang ditemukan.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${
                  task.completed
                    ? 'bg-success-10/20 border-success-20'
                    : 'bg-white border-gray-100 hover:border-primary-70/40'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    className="w-5 h-5 rounded text-primary-70 focus:ring-primary-70 cursor-pointer accent-primary-70"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-base font-medium truncate cursor-pointer transition-all ${
                      task.completed ? 'line-through text-gray-400' : 'text-dark-70'
                    }`}
                  >
                    {task.title}
                  </label>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={task.source === 'dummyjson-api' ? 'blue' : 'gray'} size="default">
                    {task.source}
                  </Badge>

                  <Button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    title="Hapus tugas"
                    variant="destructive"
                    size="xs"
                    className="text-xs font-medium"
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
