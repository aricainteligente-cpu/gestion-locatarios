'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
export default function ActivateForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState('')
  const [localNumber, setLocalNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName, local_number: localNumber, contact_phone: phone, role: 'locatario', assigned: true }).eq('id', profile.id)
    if (error) alert('Error: ' + error.message)
    else router.refresh()
    setSaving(false)
  }
  return (<form onSubmit={handleActivate} className="card flex flex-wrap items-end gap-3"><div className="text-sm text-gray-600 basis-full">{profile.email}</div><input placeholder="Nombre completo" className="input flex-1" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><input placeholder="N° local" className="input w-24" value={localNumber} onChange={(e) => setLocalNumber(e.target.value)} required /><input placeholder="Teléfono" className="input w-32" value={phone} onChange={(e) => setPhone(e.target.value)} /><button type="submit" disabled={saving} className="btn-primary">{saving ? '...' : 'Activar como locatario'}</button></form>)
}