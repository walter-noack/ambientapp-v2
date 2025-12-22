import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ajusta la ruta según tu proyecto

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando tu correo, por favor espera...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Token no proporcionado en la URL.');
      return;
    }

    // Llamada a backend para verificar el token
    api.post('/auth/verify-email', { token })
      .then(() => {
        setStatus('¡Correo verificado correctamente! Serás redirigido en unos segundos...');
        // Redirigir después de 3 segundos a login o dashboard
        setTimeout(() => {
          navigate('/login'); // Cambia a la ruta que prefieras
        }, 3000);
      })
      .catch(() => {
        setStatus('Token inválido o expirado. Por favor solicita un nuevo correo de verificación.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow text-center">
        <h1 className="text-xl font-semibold mb-4">Verificación de correo</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;