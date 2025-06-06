<<<<<<< HEAD
"use client";

import React from "react";
import PageLayout from '@/components/layout/PageLayout';

const Pedidos = () => {
  const pedidos = [
    {
      imagen: "/img/Camisas/Camisa 1.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
    {
      imagen: "/img/Camisas/Camisa 2.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
    {
      imagen: "/img/Camisas/Camisa 3.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
  ];
=======
'use client';
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import PedidosContent from "@/app/perfil/PedidosComponent";

const PedidosPage = () => {
  return (
    <PageLayout>
      <PedidosContent />
    </PageLayout>
  );
};

export default PedidosPage;
