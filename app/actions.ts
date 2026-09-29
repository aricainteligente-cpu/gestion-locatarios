'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('🔐 Intentando login con:', email)

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('❌ Error de auth:', error.message)
        redirect('/login?message=' + encodeURIComponent('Error: ' + error.message))
  }

  console.log('✅ Auth exitoso, user ID:', authData.user?.id)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log('❌ No se pudo obtener el usuario')
  redirect('/login?message=' + encodeURIComponent('No se pudo obtener el usuario'))
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.log('❌ Error al consultar perfil:', profileError.message)
    redirect('/login?message=' + encodeURIComponent('Error al consultar perfil: ' + profileError.message))

  console.log('👤 Perfil encontrado, role:', profile?.role)

  revalidatePath('/', 'layout')

  if (profile?.role === 'admin') {
    console.log('🚀 Redirigiendo a /admin')
    redirect('/admin')
  }

  if (profile?.role === 'locatario') {
    console.log('🚀 Redirigiendo a /locatario')
    redirect('/locatario')
  }

  console.log('⏳ Cuenta pendiente, redirigiendo a login con mensaje')
  redirect('/login?message=Cuenta pendiente de activación')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?message=' + encodeURIComponent('Error: ' + error.message))

  revalidatePath('/', 'layout')
  redirect('/login?message=Registro exitoso. Espera la activación del administrador.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}