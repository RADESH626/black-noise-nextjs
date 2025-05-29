"use client";

import React, { useState, useEffect } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function PerfilUsuario() {
  const [tab, setTab] = useState('diseños');

  const diseños = [
    { id: 1, nombre: 'Camisa Azul', precio: '$20', categoria: 'Camisa', likes: 5 },
    { id: 2, nombre: 'Pantalón Negro', precio: '$35', categoria: 'Pantalón', likes: 3 },
  ];

  const pedidos = [
    { id: 1, producto: 'Camisa Azul', cantidad: 2, total: '$40' },
    { id: 2, producto: 'Pantalón Negro', cantidad: 1, total: '$35' },
  ];

  const [likesState, setLikesState] = useState(diseños.map(d => d.likes));

  useEffect(() => {
    if (tab === 'diseños') {
      setLikesState(diseños.map(d => d.likes));
    }
  }, [tab]);

  const handleLike = index => {
    setLikesState(prev => {
      const arr = [...prev];
      arr[index]++;
      return arr;
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-black via-[#C255AA] to-black font-poppins">
      <div className="max-w-4xl w-full bg-[#111] rounded-2xl shadow-lg overflow-hidden text-white">
        <div className="flex flex-col md:flex-row">
          {/* Menú lateral */}
          <aside className="md:w-1/4 bg-[#171717] p-6">
            <h2 className="text-2xl font-bold mb-4">Perfil</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    tab === 'diseños' ? 'bg-[#C255AA]' : 'hover:bg-[#2a2a2a]'
                  }`}
                  onClick={() => setTab('diseños')}
                >
                  Diseños
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    tab === 'pedidos' ? 'bg-[#C255AA]' : 'hover:bg-[#2a2a2a]'
                  }`}
                  onClick={() => setTab('pedidos')}
                >
                  Pedidos
                </button>
              </li>
            </ul>
          </aside>

          {/* Contenido */}
          <section className="flex-1 p-6">
            {tab === 'diseños' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Mis Diseños</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {diseños.map((d, i) => (
                    <div key={d.id} className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner">
                      <h4 className="font-bold text-lg">{d.nombre}</h4>
                      <p className="text-sm text-gray-400">Categoría: {d.categoria}</p>
                      <p className="text-sm text-gray-400">Precio: {d.precio}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          className="text-sm px-3 py-1 bg-[#2a2a2a] rounded-md"
                          onClick={() => handleLike(i)}
                        >
                          ❤️ {likesState[i]}
                        </button>
                        <button className="text-sm px-3 py-1 bg-[#C255AA] rounded-md">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'pedidos' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Mis Pedidos</h3>
                <ul className="space-y-4">
                  {pedidos.map(p => (
                    <li
                      key={p.id}
                      className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner flex justify-between items-center"
                    >
                      <div>
                        <p>{p.producto} x {p.cantidad}</p>
                        <p className="text-gray-400 text-sm">Total: {p.total}</p>
                      </div>
                      <BotonGeneral>Ver detalle</BotonGeneral>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
