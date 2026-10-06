'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PagosPage() {
  const [pagos, setPagos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPagos()
  }, [])

  async function loadPagos() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'pendiente')
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error al cargar pagos:', error)
    } else {
      setPagos(data || [])
    }
    setLoading(false)
  }

  async function marcarComoPagado(id: string) {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'pagado' })
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('¡Pago marcado como pagado!')
      loadPagos()
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Pagos Pendientes</h1>
      </div>

      {pagos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700">¡No hay pagos pendientes!</h2>
          <p className="text-gray-500 mt-2">Todos los locatarios están al día.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locatario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vence</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{p.profile_id || 'ID: ' + p.profile_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.concept || 'Expensas'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${p.amount || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.due_date ? new Date(p.due_date).toLocaleDateString('es-AR') : 'Sin fecha'}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => marcarComoPagado(p.id)} className="text-green-600 hover:text-green-900">
                      Marcar Pagado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}