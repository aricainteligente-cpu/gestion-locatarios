import { createClient } from '@/lib/supabase/server'

export default async function MensajesPage() {
  const supabase = await createClient()
  
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*, profile:profiles(full_name, local_number)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Error al consultar mensajes:', error)
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Mensajes de Locatarios</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-bold">Error al cargar mensajes:</p>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }
  
  console.log('✅ Mensajes encontrados:', messages?.length || 0)
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mensajes de Locatarios</h1>
      <div className="card space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((m: any) => (
            <div key={m.id} className="border-b pb-3">
              <div className="font-medium">
                {m.profile?.full_name || 'Sin nombre'} (Local {m.profile?.local_number || 'N/A'})
              </div>
              <div className="text-sm font-semibold">{m.subject}</div>
              <div className="text-sm text-gray-700">{m.body}</div>
              <div className="text-xs text-gray-500">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No hay mensajes</p>
        )}
      </div>
    </div>
  )
}