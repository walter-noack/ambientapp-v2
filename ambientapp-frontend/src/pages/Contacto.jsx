// src/pages/Contacto.jsx
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    mensaje: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.nombre || !formData.email || !formData.empresa) {
      setErrorMessage('Por favor completa los campos requeridos.');
      return;
    }

    setFormStatus('sending');

    try {
      // Ajusta la URL según tu backend; ejemplo: POST /api/contacto
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Error al enviar el formulario');
      }

      setFormStatus('success');
      setFormData({ nombre: '', email: '', empresa: '', telefono: '', mensaje: '' });
    } catch (err) {
      console.error('Error enviando demo request:', err);
      setErrorMessage(err.message || 'Error al enviar. Intenta nuevamente.');
      setFormStatus('error');
    }
  };

  return (
    <section id="demo" className="bg-gradient-to-r from-emerald-600 to-emerald-700/95 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Solicita una Demo Gratuita</h2>
          <p className="text-gray-600 text-center mb-8">Descubre cómo AmbientAPP puede transformar tu gestión ambiental</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre completo *</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico *</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  placeholder="juan@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Empresa *</label>
              <input
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                placeholder="Cuéntanos sobre tus necesidades..."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'sending' || !formData.nombre || !formData.email || !formData.empresa}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              {formStatus === 'sending' ? 'Enviando...' : (
                <>
                  <Send className="w-5 h-5" /> Solicitar Demo
                </>
              )}
            </button>

            {formStatus === 'success' && (
              <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
                <p className="text-green-800 font-semibold">¡Gracias! Nos contactaremos con usted a la brevedad.</p>
              </div>
            )}

            {formStatus === 'error' && errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded">
                <p className="text-red-800 font-semibold">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}