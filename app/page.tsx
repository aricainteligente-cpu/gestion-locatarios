import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Forzar que esta página se ejecute en cada request (no cachear)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    redirect('/login')
  }
  
  if (profile.role === 'admin') {
    redirect('/admin')
  }
  
  if (profile.role === 'locatario') {
    redirect('/locatario')
  }
  
  // pending
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="card w-full max-w-md text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold mb-2">Cuenta pendiente de activación</h2>
        <p className="text-gray-600 mb-4">
          Ya tienes cuenta, pero el administrador aún no te asignó un local.
        </p>
      </div>
    </div>
  )
}