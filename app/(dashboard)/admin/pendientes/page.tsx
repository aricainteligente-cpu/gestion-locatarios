'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function PendientesPage() {
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPendientes()
  }, [])

  async function loadPendientes() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar pendientes:', error)
    } else {
      setPendientes(data || [])
    }
    setLoading(false)
  }

  async function activarLocatario(id: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'locatario' })
      .eq('id', id)

    if (error) {
      alert('Error al activar: ' + error.message)
    } else {
      alert('¡Locatario activado exitosamente!')
      loadPendientes()
    }
  }

  async function rechazarLocatario(id: string) {
    if (!confirm('¿Estás seguro de rechazar este registro?')) return

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al rechazar: ' + error.message)
    } else {
      alert('Registro eliminado')
      loadPendientes()
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Cuentas Pendientes</h1>
      </div>

      {pendientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700">¡No hay cuentas pendientes!</h2>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendientes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{p.email || 'Sin email'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.local_number || 'Sin local'}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => activarLocatario(p.id)} className="text-green-600 hover:text-green-900 mr-4">Activar</button>
                    <button onClick={() => rechazarLocatario(p.id)} className="text-red-600 hover:text-red-900">Rechazar</button>
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