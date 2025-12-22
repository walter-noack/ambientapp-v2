import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../services/authApi";

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  if (!user) return null;
  if (user.emailVerificado) return null; // no mostrar si ya verificado
  if (!visible) return null;

  const handleResend = async () => {
    try {
      setSending(true);
      setMessage(null);
      await resendVerification({ email: user.email });
      setMessage('Email de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      console.error('Error reenviando verificación:', err);
      setMessage('Error reenviando el correo. Intenta nuevamente más tarde.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 flex items-start justify-between container-app">
      <div>
        <p className="font-medium text-yellow-800">Verifica tu correo</p>
        <p className="text-sm text-yellow-700">
          Tu correo aún no está verificado. Es recomendable verificar tu cuenta para
          acceder a todas las funcionalidades.
        </p>
        {message && <p className="text-sm mt-2 text-yellow-900">{message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleResend}
          disabled={sending}
          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          {sending ? 'Enviando...' : 'Reenviar email'}
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-sm text-gray-600 underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}