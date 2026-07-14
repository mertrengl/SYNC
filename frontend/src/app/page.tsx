"use client";

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  client_name: string;
  description: string;
  status: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [client, setClient] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/tasks');
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch Hatası:", error);
      }
    };
    fetchData();
  }, []);

  const addTask = async () => {
    if (!client || !desc) return;
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_name: client, description: desc }),
      });
      if (res.ok) {
        setClient('');
        setDesc('');
        // Yeniden çekmek yerine güncel listeyi al
        const data = await res.json();
        setTasks((prev) => [...prev, data]);
      }
    } catch (err) { console.error("Ekleme hatası:", err); }
  };

  const updateStatus = async (task: Task) => {
    let nextStatus = "";
    if (task.status === "Todo") nextStatus = "In Progress";
    else if (task.status === "In Progress") nextStatus = "Done";
    else return;

    try {
      const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: nextStatus }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
      }
    } catch (err) { console.error("Güncelleme hatası:", err); }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) { console.error("Silme hatası:", err); }
  };

  return (
    <main className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">SYNC Studio</h1>
      
      <div className="flex gap-2 mb-8">
        <input placeholder="Müşteri" value={client} className="p-2 rounded text-black w-full" onChange={(e) => setClient(e.target.value)} />
        <input placeholder="Açıklama" value={desc} className="p-2 rounded text-black w-full" onChange={(e) => setDesc(e.target.value)} />
        <button onClick={addTask} className="bg-blue-600 px-4 py-2 rounded">Ekle</button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-medium">{task.description}</h3>
              <p className="text-sm text-zinc-400">Müşteri: {task.client_name}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => updateStatus(task)}
                disabled={task.status === "Done"}
                className={`px-3 py-1 rounded-full text-xs border ${
                  task.status === "Done" ? "bg-green-500/20 text-green-400 border-green-500/20 cursor-default" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {task.status}
              </button>
              <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-400 p-1">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}