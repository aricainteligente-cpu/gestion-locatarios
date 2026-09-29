'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
export default function PaymentManager({ locatarios, payments }: { locatarios: any[]; payments: any[] }) {
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [concept, setConcept] = useState('')
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [dueDate, setDueDate] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('payments').insert({ user_id: userId, amount: parseFloat(amount), concept, period, due_date: dueDate || null })
    router.refresh()
    setAmount(''); setConcept(''); setDueDate('')
  }
  const markPaid = async (id: string) => {
    await supabase.from('payments').update({ status: 'pagado', paid_at: new Date().toISOString() }).eq('id', id)
    router.refresh()
  }
  return (<div><form onSubmit={handleCreate} className="card mb-6 grid grid-cols-1 md:grid-cols-6 gap-3"><select className="input md:col-span-2" value={userId} onChange={(e) => setUserId(e.target.value)} required><option value="">Selecciona locatario</option>{locatarios.map(l => (<option key={l.id} value={l.id}>Local {l.local_number} — {l.full_name}</option>))}</select><input type="number" step="0.01" placeholder="Monto" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} required /><input placeholder="Concepto" className="input" value={concept} onChange={(e) => setConcept(e.target.value)} required /><input type="month" className="input" value={period} onChange={(e) => setPeriod(e.target.value)} required /><input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Vence" /><button type="submit" className="btn-primary">Crear pago</button></form><div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="text-left border-b"><tr><th className="py-2">Locatario</th><th>Concepto</th><th>Periodo</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{payments.map(p => (<tr key={p.id} className="border-b"><td className="py-2">{p.profile?.full_name ?? '—'} (L{p.profile?.local_number})</td><td>{p.concept}</td><td>{p.period}</td><td>${p.amount}</td><td><span className={`px-2 py-1 rounded text-xs ${p.status === 'pagado' ? 'bg-green-100 text-green-800' : p.status === 'vencido' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td><td>{p.status !== 'pagado' && (<button onClick={() => markPaid(p.id)} className="text-primary text-xs hover:underline">Marcar pagado</button>)}</td></tr>))}</tbody></table></div></div>)
}