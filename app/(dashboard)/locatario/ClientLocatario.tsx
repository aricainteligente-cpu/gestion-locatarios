'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { FileText, DollarSign, MessageSquare } from 'lucide-react'
export default function ClientLocatario({ userId, payments, documents, messages }: { userId: string; payments: any[]; documents: any[]; messages: any[] }) {
  const [tab, setTab] = useState<'pagos' | 'docs' | 'dudas'>('pagos')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('messages').insert({ user_id: userId, subject, body })
    setSubject(''); setBody('')
    router.refresh()
  }
  const unpaid = payments.filter(p => p.status !== 'pagado').reduce((s, p) => s + Number(p.amount), 0)
  return (<div><div className="grid grid-cols-3 gap-4 mb-6"><div className="card"><div className="flex items-center gap-3"><DollarSign className="text-red-500" /><div><div className="text-xs text-gray-500">Deuda pendiente</div><div className="text-xl font-bold">${unpaid.toFixed(2)}</div></div></div></div><div className="card"><div className="flex items-center gap-3"><FileText className="text-blue-500" /><div><div className="text-xs text-gray-500">Documentos</div><div className="text-xl font-bold">{documents.length}</div></div></div></div><div className="card"><div className="flex items-center gap-3"><MessageSquare className="text-purple-500" /><div><div className="text-xs text-gray-500">Mensajes</div><div className="text-xl font-bold">{messages.length}</div></div></div></div></div><div className="flex gap-2 mb-4 border-b">{(['pagos', 'docs', 'dudas'] as const).map(t => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}>{t === 'pagos' ? 'Mis pagos' : t === 'docs' ? 'Mis documentos' : 'Mis dudas'}</button>))}</div>{tab === 'pagos' && (<div className="card"><table className="w-full text-sm"><thead className="text-left border-b"><tr><th className="py-2">Concepto</th><th>Periodo</th><th>Monto</th><th>Vence</th><th>Estado</th></tr></thead><tbody>{payments.map(p => (<tr key={p.id} className="border-b"><td className="py-2">{p.concept}</td><td>{p.period}</td><td>${p.amount}</td><td>{p.due_date ?? '—'}</td><td><span className={`px-2 py-1 rounded text-xs ${p.status === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td></tr>))}</tbody></table></div>)}{tab === 'docs' && (<div className="card"><ul className="space-y-2">{documents.map(d => (<li key={d.id} className="flex justify-between items-center border-b pb-2"><div><a href={d.file_url} target="_blank" className="text-primary hover:underline">{d.file_name}</a><div className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</div></div></li>))}</ul></div>)}{tab === 'dudas' && (<div className="card"><form onSubmit={sendMessage} className="space-y-3 mb-6"><input placeholder="Asunto" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} required /><textarea placeholder="Tu mensaje..." className="input" rows={4} value={body} onChange={(e) => setBody(e.target.value)} required /><button type="submit" className="btn-primary">Enviar mensaje</button></form><ul className="space-y-3">{messages.map(m => (<li key={m.id} className="border-l-4 border-primary pl-3"><div className="font-medium">{m.subject}</div><div className="text-sm text-gray-700">{m.body}</div><div className="text-xs text-gray-500">{new Date(m.created_at).toLocaleString()}</div></li>))}</ul></div>)}</div>)
}