// src/pages/Upgrade.jsx
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle } from 'lucide-react';

export default function Upgrade() {
    const navigate = useNavigate();

    const features = [
        'Diagnósticos ilimitados',
        'Múltiples usuarios',
        'Exportar a PDF',
        'Recomendaciones completas',
        'Evolución temporal',
        'Soporte prioritario',
    ];

    const handleUpgradeClick = () => {
        alert('Gracias por tu interés en el Plan Pro. Próximamente podrás contratarlo aquí.');
        // Aquí podrías abrir un formulario o redirigir a una página de pago real
    };

    return (
        <div className="container-app py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Mejora a Plan Pro</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Plan Free */}
                <div className="border border-slate-300 rounded-xl p-6 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-emerald-600" />
                        <h2 className="text-xl font-semibold">Plan Free</h2>
                    </div>
                    <p className="mb-6 text-slate-600">
                        Ideal para comenzar. Incluye hasta 3 diagnósticos mensuales y 1 usuario.
                    </p>
                    <ul className="mb-6 space-y-2 text-sm text-slate-700">
                        <li>- 3 diagnósticos mensuales</li>
                        <li>- 1 usuario</li>
                        <li>- Funciones básicas</li>
                        <li>- No incluye exportación a PDF ni soporte prioritario</li>
                    </ul>
                    <button
                        disabled
                        className="w-full py-2 rounded-lg bg-slate-300 text-slate-600 cursor-not-allowed"
                        title="Ya tienes este plan"
                    >
                        Plan actual
                    </button>
                </div>

                {/* Plan Pro */}
                <div
                    className="rounded-xl p-[3px] max-w-md mx-auto"
                    style={{
                        background: 'linear-gradient(90deg, #005429 0%, #73c91b 50%, #0068ec 100%)',
                    }}
                >
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Crown className="w-6 h-6 text-[#005429]" />
                            <h2 className="text-lg font-semibold text-gray-900">Plan Pro</h2>
                        </div>

                        <p className="mb-5 text-gray-700">
                            Acceso completo sin límites, múltiples usuarios y funciones avanzadas.
                        </p>

                        <ul className="mb-6 space-y-3 text-gray-700 text-sm">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#73c91b]" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgradeClick}
                            className="w-full py-2 rounded-lg bg-[#1d7849] text-white hover:bg-[#145433] transition"
                        >
                            ¡Quiero ser pro!
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500 max-w-xl mx-auto">
                <p>
                    ¿Tienes dudas o quieres una demo personalizada?{' '}
                    <a
                        href="mailto:contacto@ambientapp.cl"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Contáctanos
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}