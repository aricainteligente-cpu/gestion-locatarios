import { signup } from '@/app/actions'

export default function RegisterPage() {
  return (
    <div className="card w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
      <form action={signup} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Contraseña (mínimo 6)</label>
          <input
            type="password"
            name="password"
            className="input"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Registrarme
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta? <a href="/login" className="text-primary font-medium hover:underline">Inicia sesión</a>
      </p>
    </div>
  )
}