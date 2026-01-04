// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import LogoBlanco from '../assets/logo-sf-blanco.svg';
import {
    Leaf, BarChart3, Droplet, Recycle, FileText, Users, TrendingUp, Send,
    Check, X, Activity, Star, Search, User, Lightbulb, Wrench, Rocket, Brain, Zap
} from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        empresa: '',
        telefono: '',
        mensaje: ''
    });
    const [formStatus, setFormStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');

        try {
            const res = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setFormStatus('success');
                setFormData({ nombre: '', email: '', empresa: '', telefono: '', mensaje: '' });
            } else {
                setFormStatus('error');
                alert(data.message || 'Error enviando formulario');
            }
        } catch (error) {
            setFormStatus('error');
            alert('Error enviando formulario');
        }

        setTimeout(() => setFormStatus(''), 4500);
    };

    const features = [
        {
            icon: <BarChart3 className="w-9 h-9 text-emerald-600" />,
            title: 'Huella de Carbono',
            description: 'Calcula emisiones con factores locales y visualizaciones interactivas.'
        },
        {
            icon: <Droplet className="w-9 h-9 text-blue-600" />,
            title: 'Gestión del Agua',
            description: 'Monitorea consumos y KPIs con alertas y recomendaciones.'
        },
        {
            icon: <Recycle className="w-9 h-9 text-emerald-600" />,
            title: 'Residuos y LEY REP',
            description: 'Registro y análisis de valorización por tipo de residuo.'
        },
        {
            icon: <TrendingUp className="w-9 h-9 text-purple-600" />,
            title: 'Visualizaciones Avanzadas',
            description: 'Dashboards, series y comparativas para seguimiento continuo.'
        },
        {
            icon: <FileText className="w-9 h-9 text-orange-600" />,
            title: 'Informes PDF',
            description: 'Reportes profesionales listos para descargar y compartir.'
        },
        {
            icon: <Users className="w-9 h-9 text-indigo-600" />,
            title: 'Multiusuario',
            description: 'Roles y permisos para equipos y consultoras.'
        }
    ];

    const plans = [
        {
            key: 'free',
            name: 'Free',
            color: 'bg-blue-100',
            iconColor: 'text-blue-600',
            descriptionTitle: 'Para conocer la herramienta y hacer diagnósticos puntuales',
            descriptionText: 'Pensado para probar la plataforma y obtener una primera visión general.',
            features: [
                { icon: <Search className="w-6 h-6" />, text: 'Hasta 3 diagnósticos mensuales' },
                { icon: <User className="w-6 h-6" />, text: 'Uso en un solo dispositivo' },
                { icon: <BarChart3 className="w-6 h-6" />, text: 'Acceso completo a todas las dimensiones de análisis' },
                { icon: <Lightbulb className="w-6 h-6" />, text: 'Recomendaciones básicas para una primera orientación' },
                { icon: <Wrench className="w-6 h-6" />, text: 'Soporte estándar' }
            ],
            cta: 'Comenzar Gratis',
            ctaColor: 'bg-blue-600 hover:bg-blue-700 text-white',
            footerText: 'Ideal para exploración inicial y uso ocasional.'
        },
        {
            key: 'pro',
            name: 'Pro',
            color: 'bg-green-100',
            iconColor: 'text-green-700',
            descriptionTitle: 'Para gestionar, comparar y tomar decisiones con datos',
            descriptionText: 'La experiencia completa para equipos que necesitan análisis continuo y reportes profesionales.',
            features: [
                { icon: <Rocket className="w-6 h-6" />, text: 'Diagnósticos ilimitados' },
                { icon: <Users className="w-6 h-6" />, text: 'Uso en múltiples dispositivos' },
                { icon: <BarChart3 className="w-6 h-6" />, text: 'Acceso completo a todas las dimensiones' },
                { icon: <FileText className="w-6 h-6" />, text: 'Exportación de reportes profesionales en PDF' },
                { icon: <Brain className="w-6 h-6" />, text: 'Recomendaciones completas y accionables' },
                { icon: <TrendingUp className="w-6 h-6" />, text: 'Análisis de evolución en el tiempo (próximamente)' },
                { icon: <Zap className="w-6 h-6" />, text: 'Soporte prioritario' }
            ],
            cta: 'Solicitar Demo',
            ctaColor: 'bg-green-700 hover:bg-green-800 text-white',
            footerText: 'La mejor opción para gestión continua y toma de decisiones.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
            {/* Header (blanco) */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate('/')}
                        aria-label="Ir al inicio"
                    >
                        <img
                            src={Logo}
                            alt="AmbientAPP"
                            className="object-contain"
                            style={{ width: 112, height: 112 }}
                        />
                        <div className="leading-tight">
                            <span className="text-2xl font-extrabold text-gray-800 tracking-tight">AmbientAPP</span>
                            <div className="text-sm text-gray-500 -mt-1">Diagnóstico Ambiental</div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-4">
                        <a href="#features" className="text-gray-700 hover:text-emerald-600 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Características
                        </a>
                        <a href="#plans" className="text-gray-700 hover:text-emerald-600 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Planes
                        </a>
                        <a href="#demo" className="text-gray-700 hover:text-emerald-600 flex items-center gap-2">
                            <Send className="w-4 h-4" /> Demo
                        </a>
                        <button
                            onClick={() => navigate('/login')}
                            className="ml-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-emerald-700 transition"
                        >
                            Iniciar sesión
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20 px-6 text-center">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                        Diagnóstico Ambiental Inteligente para tu Empresa
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-emerald-50/90">
                        Mide, visualiza y mejora tu desempeño ambiental en minutos. Huella de Carbono, Gestión del Agua y Residuos en una sola plataforma.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/contacto')}
                            className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold text-lg hover:scale-[1.02] transform transition shadow-xl"
                        >
                            Comenzar Gratis
                        </button>
                        <a
                            href="#features"
                            className="bg-emerald-500/90 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-400 transition shadow-md flex items-center gap-2 justify-center"
                        >
                            <Leaf className="w-5 h-5" />
                            Conocer Más
                        </a>
                    </div>

                    <div className="mt-10 flex justify-center gap-4">
                        <div className="bg-white/10 px-4 py-2 rounded-lg shadow-inner text-sm">
                            <strong>Rápido</strong> — Resultados en minutos
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg shadow-inner text-sm">
                            <strong>Escalable</strong> — Desde PYMEs a Consultoras
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg shadow-inner text-sm">
                            <strong>Exportable</strong> — PDF profesional
                        </div>
                    </div>
                </div>
            </section>

            {/* Problema / Solución */}
            <section className="container mx-auto px-6 py-14 -mt-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <div className="md:flex md:items-center md:gap-10">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                                ¿Gastando tiempo y dinero en diagnósticos manuales?
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Las consultorías tradicionales son costosas y lentas. AmbientAPP automatiza el proceso y entrega informes accionables al instante.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-700">
                                    <Check className="w-5 h-5 text-emerald-600 mt-1" />
                                    <span><strong>Automatización</strong> de cálculos y KPIs clave.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700">
                                    <Check className="w-5 h-5 text-emerald-600 mt-1" />
                                    <span><strong>Informes exportables</strong> y personalizables.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700">
                                    <Check className="w-5 h-5 text-emerald-600 mt-1" />
                                    <span><strong>Escalable</strong> para equipos y consultoras.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="md:w-1/2 mt-8 md:mt-0">
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Beneficio inmediato</h3>
                                <p className="text-gray-600 mb-4">Reduce tiempo de diagnóstico y obtén recomendaciones claras para mejorar tu desempeño ambiental.</p>
                                <div className="flex gap-3">
                                    <a href="#demo" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">
                                        Solicitar demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Características */}
            <section id="features" className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Todo lo que necesitas</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
                                <div className="mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
                                <p className="text-gray-600">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Planes */}
            <section id="plans" className="container mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Elige tu plan</h2>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.key} className={`rounded-2xl p-8 shadow-lg ${plan.color}`}>
                            <h3 className={`text-3xl font-extrabold mb-2 ${plan.iconColor}`}>{plan.name}</h3>
                            <p className="font-semibold mb-4 text-gray-700">{plan.descriptionTitle}</p>
                            <p className="mb-6 text-gray-600">{plan.descriptionText}</p>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map(({ icon, text }, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-800">
                                        <div className={`${plan.iconColor} flex-shrink-0`}>{icon}</div>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA según plan */}
                            {plan.key === 'free' ? (
                                <button
                                    type="button"
                                    className={`w-full py-3 rounded-lg font-bold transition ${plan.ctaColor}`}
                                    aria-label={`${plan.name} plan call to action`}
                                   onClick={() => {
                                        // Intentamos hacer scroll suave al elemento con id="demo"
                                        const el = document.getElementById('demo');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            // Fallback: cambia el hash (útil si el usuario viene desde otra ruta)
                                            window.location.hash = '#demo';
                                        }
                                    }}
                                >
                                    {plan.cta}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={`w-full py-3 rounded-lg font-bold transition ${plan.ctaColor}`}
                                    aria-label={`${plan.name} plan call to action`}
                                    onClick={() => {
                                        // Intentamos hacer scroll suave al elemento con id="demo"
                                        const el = document.getElementById('demo');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            // Fallback: cambia el hash (útil si el usuario viene desde otra ruta)
                                            window.location.hash = '#demo';
                                        }
                                    }}
                                >
                                    {plan.cta}
                                </button>
                            )}

                            <p className="mt-6 text-center italic text-gray-700">{plan.footerText}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Demo Form */}
            <section id="demo" className="bg-gradient-to-r from-emerald-600 to-emerald-700/95 py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Solicita una Demo Gratuita</h2>
                        <p className="text-gray-600 text-center mb-8">Descubre cómo AmbientAPP puede transformar tu gestión ambiental</p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Nombre completo *</label>
                                    <input name="nombre" value={formData.nombre} onChange={handleChange} required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="Juan Pérez" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico *</label>
                                    <input name="email" value={formData.email} onChange={handleChange} type="email" required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="juan@empresa.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Empresa *</label>
                                <input name="empresa" value={formData.empresa} onChange={handleChange} required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="Nombre de tu empresa" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                                <input name="telefono" value={formData.telefono} onChange={handleChange} type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="+56 9 1234 5678" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
                                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="Cuéntanos sobre tus necesidades..." />
                            </div>

                            <button type="submit"
                                disabled={formStatus === 'sending' || !formData.nombre || !formData.email || !formData.empresa}
                                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition flex items-center justify-center gap-3 disabled:bg-gray-400"
                            >
                                {formStatus === 'sending' ? 'Enviando...' : <>
                                    <Send className="w-5 h-5" /> Solicitar Demo
                                </>}
                            </button>

                            {formStatus === 'success' && (
                                <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
                                    <p className="text-green-800 font-semibold">¡Gracias! Nos contactaremos con usted a la brevedad.</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-0">
                        <img src={LogoBlanco} alt="AmbientAPP" style={{ width: 200, height: 200 }} className="object-contain" />
                    </div>
                    <p className="mb-2">Diagnóstico Ambiental Inteligente para Empresas</p>
                    <div className="flex justify-center gap-6 mb-6">
                        <a href="#demo" className="hover:text-white transition">Contacto</a>
                    </div>
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} AmbientAPP. Creado por @mellamowalter.cl</p>
                </div>
            </footer>
        </div>
    );
}