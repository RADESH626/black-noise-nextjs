"use client";

import { useState, useEffect } from 'react';

function SupplierReturnsAndCancellationsPage() {
  const [returns, setReturns] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch returns data
        const returnsResponse = await fetch('/api/proveedor/returns');
        const returnsData = await returnsResponse.json();
        setReturns(returnsData);

        // Fetch cancellations data
        const cancellationsResponse = await fetch('/api/proveedor/cancellations');
        const cancellationsData = await cancellationsResponse.json();
        setCancellations(cancellationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Devoluciones y Cancelaciones</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Devoluciones</h2>
        {returns.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Cancellation Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((item) => (
                <tr key={item._id} className="hover:bg-gray-200">
                  <td className="border px-4 py-2">{item.orderId}</td>
                  <td className="border px-4 py-2">{item.userId}</td>
                  <td className="border px-4 py-2">{item.motivo_devolucion}</td>
                  <td className="border px-4 py-2">{item.fecha_cancelacion ? new Date(item.fecha_cancelacion).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay devoluciones o cancelaciones.</p>
        )}
      </section>

    </div>
  );
}

export default SupplierReturnsAndCancellationsPage;
