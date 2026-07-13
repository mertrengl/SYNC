"use client";

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  clientName: string;
  description: string;
  status: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [client, setClient] = useState('');
  const [desc, setDesc] = useState('');

  async function fetchTasks() {
    try {
      const res = await fetch('http://localhost:5000/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  }

  // 1. Sayfa yüklendiğinde verileri backend'den çek
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  // 2. Yeni görev ekle
  const addTask = async () => {
    console.log("Butona basıldı! Veriler:", client, desc);

    if (!client || !desc) {
      console.warn("Müşteri veya açıklama boş!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: client, description: desc, status: 'Todo' }),
      });

      const result = await response.json();
      console.log("Backend'den gelen cevap:", result);

      setClient('');
      setDesc('');
      fetchTasks();
    } catch (error) {
      console.error("İstek atılırken hata oluştu:", error);
    }
  };

  // 3. Görevlerin Durumu Güncelleme (Opsiyonel)
  const updateStatus = async (task: Task) => {
    if (task.status === 'Done') return;

    const nextStatus = task.status === 'To Do' ? 'In Progress' : 'Done';
    alert(task.status)

    await fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    fetchTasks();
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <header className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">SYNC Studio</h1>
      </header>

      {/* Form Alanı */}
      <div className="flex gap-2 mb-8">
        <input
          placeholder="Müşteri"
          value={client}
          className="border p-2 rounded text-black bg-white"
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          placeholder="Açıklama"
          value={desc}
          className="border p-2 rounded text-black bg-white"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded">
          Ekle
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-medium">{task.description}</h3>
              <p className="text-sm text-zinc-400">Müşteri: {task.clientName}</p>
            </div>

            <button
              onClick={() => updateStatus(task)}
              disabled={task.status === 'Done'}
              className={`px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 transition-all
                ${task.status === 'Done'
                  ? 'bg-green-500/10 text-green-400 cursor-default border-green-500/20'
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer'
                }`}
            >
              {task.status}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}