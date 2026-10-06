import { createClient } from '@/lib/supabase/server'
import { Users, DollarSign, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: totalLocatarios }, { count: pending }, { count: unpaidPayments }, { count: unreadMessages }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'locatario'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'pending'),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pendiente'),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  const stats = [
    { label: 'Locatarios activos', value: totalLocatarios ?? 0, icon: Users, color: 'bg-blue-500', href: '/admin/locatarios' },
    { label: 'Cuentas pendientes', value: pending ?? 0, icon: Users, color: 'bg-yellow-500', href: '/admin/pendientes' },
    { label: 'Pagos pendientes', value: unpaidPayments ?? 0, icon: DollarSign, color: 'bg-red-500', href: '/admin/pagos' },
    { label: 'Mensajes sin leer', value: unreadMessages ?? 0, icon: MessageSquare, color: 'bg-purple-500', href: '/admin/mensajes' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
              <div className={stat.color + ' text-white p-3 rounded-lg'}>
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}