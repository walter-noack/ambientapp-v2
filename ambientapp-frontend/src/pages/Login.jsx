import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/shared/ui/Button';
import { Input } from '../components/shared/ui/Input';
import { Alert } from '../components/shared/ui/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo-ambientapp.svg"
              alt="AmbientApp"
              className="h-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido a AmbientApp
          </h1>
          <p className="text-slate-600">
            Diagnóstico Ambiental Empresarial
          </p>
        </div>

        {/* Formulario */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error Alert */}
            {error && (
              <Alert type="danger">
                {error}
              </Alert>
            )}

            {/* Email */}
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <div className="text-center text-xs text-slate-500 mt-2">
              ¿No tienes cuenta?{' '}
              <a
                href="/registro"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Crea una cuenta gratis
              </a>
            </div>

            
          </form>
        </div>


        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AmbientApp. Creado por @mellamowalter.cl
        </div>
      </div>
    </div>
  );
}