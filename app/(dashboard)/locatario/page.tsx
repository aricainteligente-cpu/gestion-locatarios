import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientLocatario from './ClientLocatario'
export default async function LocatarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'locatario') redirect('/login')
  const [{ data: payments }, { data: documents }, { data: messages }] = await Promise.all([
    supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('messages').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])
  return (<div><div className="mb-6"><h1 className="text-3xl font-bold">Hola, {profile.full_name ?? 'Locatario'}</h1><p className="text-gray-600">Local N° {profile.local_number} · {profile.email}</p></div><ClientLocatario userId={user.id} payments={payments ?? []} documents={documents ?? []} messages={messages ?? []} /></div>)
}