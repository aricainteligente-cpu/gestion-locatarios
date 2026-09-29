import { logout } from '@/app/actions'
import Link from 'next/link'

export default function Navbar({ role }: { role: 'admin' | 'locatario' }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
      <div className="flex items-center gap-6 flex-wrap">
        <span className="font-bold text-lg">Gestión Locatarios</span>
        {role === 'admin' && (
          <div className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:text-primary">Panel</Link>
            <Link href="/admin/locatarios" className="hover:text-primary">Locatarios</Link>
            <Link href="/admin/pagos" className="hover:text-primary">Pagos</Link>
            <Link href="/admin/mensajes" className="hover:text-primary">Mensajes</Link>
          </div>
        )}
      </div>
      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm">
          Salir
        </button>
      </form>
    </nav>
  )
}