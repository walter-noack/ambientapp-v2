// src/pages/Registro.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/shared/ui/Button';
import { Input } from '../components/shared/ui/Input';
import { Alert } from '../components/shared/ui/Alert';
import { registrarUsuario } from '../services/authApi'; // asegúrate de tener esta función

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password || !password2) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // 1) Registrar en backend
      const res = await registrarUsuario({
        nombre,
        email,
        password,
        empresa,
        rut,
        telefono,
      });

      // Backend debe devolver { success, data: { user, token } }
      if (!res?.success || !res?.data?.token) {
        setError(res?.message || 'No se pudo completar el registro');
        setLoading(false);
        return;
      }

      const { user, token } = res.data;

      // 2) Guardar token (si ya lo manejas en AuthContext, úsalo; si no, localStorage)
      localStorage.setItem('token', token);

      // 3) Actualizar contexto
      if (setUser) {
        setUser(user);
      }

      // 4) Redirigir al dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Error de conexión. Intenta nuevamente.'
      );
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
            Crea tu cuenta en AmbientApp
          </h1>
          <p className="text-slate-600 text-sm">
            Comienza con el plan Free: 4 diagnósticos mensuales.
          </p>
        </div>

        {/* Formulario */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <Alert type="danger">
                {error}
              </Alert>
            )}

            {/* Nombre */}
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />

            {/* Empresa (opcional) */}
            <Input
              label="Empresa (opcional)"
              placeholder="Nombre de tu empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={loading}
            />

            {/* RUT (opcional) */}
            <Input
              label="RUT (opcional)"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              disabled={loading}
            />

            {/* Teléfono (opcional) */}
            <Input
              label="Teléfono (opcional)"
              placeholder="+56 9 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              disabled={loading}
            />

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
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {/* Confirmar password */}
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={loading}
            />

            {/* Botón */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            {/* Link a login */}
            <div className="text-center text-xs text-slate-500 mt-2">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Inicia sesión
              </Link>
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