import { login } from '@/app/actions'
import { Suspense } from 'react'

function MessageDisplay({ searchParams }: { searchParams: { message?: string } }) {
  if (searchParams.message) {
    const message = decodeURIComponent(searchParams.message)
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 text-sm">
        {message}
      </div>
    )
  }
  return null
}

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <div className="card w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
      <Suspense>
        <MessageDisplay searchParams={searchParams} />
      </Suspense>
      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            name="email"
            className="input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            className="input"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Entrar
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿No tienes cuenta? <a href="/register" className="text-primary font-medium hover:underline">Regístrate</a>
      </p>
    </div>
  )
}