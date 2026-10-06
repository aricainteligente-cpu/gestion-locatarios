import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default async function LocatariosPage() {
  const supabase = await createClient()

  const { data: locatarios, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'locatario')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener locatarios:', error)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Gestión de Locatarios</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {locatarios && locatarios.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locatarios.map((locatario: any) => (
                <tr key={locatario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{locatario.email || 'Sin email'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{locatario.local_number || 'Sin local'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {locatario.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(locatario.created_at).toLocaleDateString('es-AR')}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3"><Edit size={18} /></button>
                    <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">No hay locatarios registrados aún.</div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">Total: {locatarios?.length || 0} locatarios activos</div>
    </div>
  )
}