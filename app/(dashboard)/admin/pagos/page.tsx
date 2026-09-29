import { createClient } from '@/lib/supabase/server'
import PaymentManager from './PaymentManager'
export default async function PagosPage() {
  const supabase = await createClient()
  const { data: payments } = await supabase.from('payments').select('*, profile:profiles(full_name, local_number, email)').order('created_at', { ascending: false })
  const { data: locatarios } = await supabase.from('profiles').select('id, full_name, local_number').eq('role', 'locatario')
  return (<div><h1 className="text-3xl font-bold mb-6">Gestión de Pagos</h1><PaymentManager locatarios={locatarios ?? []} payments={payments ?? []} /></div>)
}