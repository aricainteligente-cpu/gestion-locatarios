'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Mail, MailOpen } from 'lucide-react'

export default function MensajesPage() {
  const [mensajes, setMensajes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadMensajes()
  }, [])

  async function loadMensajes() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar mensajes:', error)
    } else {
      setMensajes(data || [])
      // Marcar todos como leídos
      const noLeidos = (data || []).filter((m: any) => !m.is_read)
      if (noLeidos.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', noLeidos.map((m: any) => m.id))
      }
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Mensajes</h1>
      </div>

      {mensajes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Mail className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold text-gray-700">No hay mensajes</h2>
          <p className="text-gray-500 mt-2">Aún no has recibido mensajes de los locatarios.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mensajes.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                m.is_read ? 'border-gray-300' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {m.is_read ? (
                    <MailOpen size={18} className="text-gray-400" />
                  ) : (
                    <Mail size={18} className="text-blue-500" />
                  )}
                  <span className="font-semibold text-gray-900">
                    {m.from_name || 'Locatario'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(m.created_at).toLocaleString('es-AR')}
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">
                {m.subject || 'Sin asunto'}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {m.body || 'Sin contenido'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total: {mensajes.length} mensaje(s)
      </div>
    </div>
  )
}