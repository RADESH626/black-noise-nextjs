"use client";

import { useState, useEffect } from 'react';

const AdminPagosPage = () => {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch('/api/pagos');
        if (!response.ok) {
          throw new Error('Failed to fetch pagos');
        }
        const data = await response.json();
        setPagos(data);
      } catch (error) {
        console.error('Error fetching pagos:', error);
      }
    };

    fetchPagos();
  }, []);

  return (
    <div>
      <h1>Admin Pagos</h1>
      {pagos.length > 0 ? (
        <ul>
          {pagos.map((pago) => (
            <li key={pago._id}>
              {/* Display payment information here */}
              Pago ID: {pago._id}, Amount: {pago.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pagos found.</p>
      )}
    </div>
  );
};

export default AdminPagosPage;
