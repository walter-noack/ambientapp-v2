// src/pages/Perfil.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import { Crown, Info, Sparkles, Clock, AlertCircle, Key } from 'lucide-react';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function Perfil() {
    const navigate = useNavigate();

    const { user: authUser, setUser: setAuthUser } = useAuth?.() || {};
    const [profile, setProfile] = useState(authUser || null);
    const [loading, setLoading] = useState(!authUser);
    const [error, setError] = useState(null);
    const [diasRestantes, setDiasRestantes] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProfile();
                setProfile(data);
                // opcional: sincronizar con AuthContext si quieres
                if (setAuthUser) setAuthUser(data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || 'Error al cargar el perfil'
                );
            } finally {
                setLoading(false);
            }
        };

        if (!authUser) {
            fetchProfile();
        }
    }, [authUser, setAuthUser]);

    // Efecto para calcular días restantes en tiempo real
    useEffect(() => {
        const calcularDiasRestantes = () => {
            if (!profile?.validezTemporal?.fechaExpiracion) {
                setDiasRestantes(null);
                return;
            }

            const ahora = new Date();
            const fechaExpiracion = new Date(profile.validezTemporal.fechaExpiracion);
            const diferenciaMilisegundos = fechaExpiracion - ahora;
            const dias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

            setDiasRestantes(Math.max(0, dias));
        };

        // Calcular inmediatamente
        calcularDiasRestantes();

        // Actualizar cada hora
        const intervalo = setInterval(calcularDiasRestantes, 1000 * 60 * 60);

        return () => clearInterval(intervalo);
    }, [profile?.validezTemporal?.fechaExpiracion]);

    // Debug: ver qué trae profile
    console.log('Perfil.jsx - profile:', profile);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-slate-500 text-sm">Cargando perfil...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6">
                <p className="text-red-600 text-sm">
                    No se pudo cargar el perfil del usuario.
                </p>
            </div>
        );
    }

    const {
        nombre,
        email,
        empresa,
        rut,
        telefono,
        tipoSuscripcion,
        estadoSuscripcion,
        role,
        planInfo = {},
        features = {},
        limites = {}, // mantener por si acaso para usuarios
        validezTemporal = {},
    } = profile;

    // Usar planInfo (viene del backend como virtual)
    const {
        diagnosticosTotales,
        diagnosticosRestantes,
        usuariosRestantes,
    } = planInfo;

    const isPro = tipoSuscripcion === 'pro';

    // Calcular diagnósticos usados
    const diagnosticosUsados =
        typeof diagnosticosTotales === 'number' && typeof diagnosticosRestantes === 'number'
            ? Math.max(0, diagnosticosTotales - diagnosticosRestantes)
            : 0;

    // Porcentaje de uso para la barra
    const porcentajeUso =
        typeof diagnosticosTotales === 'number' && diagnosticosTotales > 0 && !isPro
            ? Math.min(
                100,
                Math.round((Number(diagnosticosUsados || 0) / diagnosticosTotales) * 100)
            )
            : null;

    // Usuarios (mantener lógica original si limites existe)
    const maxUsuarios = limites.maxUsuarios ?? (isPro ? 5 : 1);
    const usuariosActuales = limites.usuariosActuales ?? 1;
    const ultimoResetDiagnosticos = limites.ultimoResetDiagnosticos;

    const handleUpgradeClick = (e) => {
        e.preventDefault();
        console.log('Upgrade click. isPro =', isPro, 'navigate type =', typeof navigate);
        if (!isPro) {
            navigate('/upgrade');
        } else {
            console.log('Usuario ya es Pro, no navega.');
        }
    };

    return (
        <div className="container-app py-6 space-y-6">
            {/* Header perfil */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
                    <p className="text-sm text-slate-600">
                        Información de tu cuenta, plan y límites actuales.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Card plan actual compacta */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPro ? 'bg-purple-100' : 'bg-emerald-100'
                            }`}>
                            {isPro ? (
                                <Crown className="w-5 h-5 text-purple-600" />
                            ) : (
                                <Sparkles className="w-5 h-5 text-emerald-600" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wide text-slate-500">
                                Plan actual
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                                {isPro ? 'Plan Pro' : 'Plan Free'}
                            </span>
                            <span className="text-xs text-slate-500">
                                Estado: {estadoSuscripcion || '—'}
                            </span>
                        </div>
                    </div>

                    {/* Contador de días restantes */}
                    {validezTemporal?.tipo && validezTemporal.tipo !== 'ilimitado' && diasRestantes !== null && (
                        <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm ${diasRestantes <= 3
                            ? 'bg-red-50 border-red-200'
                            : diasRestantes <= 7
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${diasRestantes <= 3
                                ? 'bg-red-100'
                                : diasRestantes <= 7
                                    ? 'bg-amber-100'
                                    : 'bg-blue-100'
                                }`}>
                                {diasRestantes <= 3 ? (
                                    <AlertCircle className={`w-5 h-5 ${diasRestantes <= 3 ? 'text-red-600' : 'text-amber-600'}`} />
                                ) : (
                                    <Clock className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-wide text-slate-500">
                                    Validez de cuenta
                                </span>
                                <span className={`text-sm font-semibold ${diasRestantes <= 3
                                    ? 'text-red-700'
                                    : diasRestantes <= 7
                                        ? 'text-amber-700'
                                        : 'text-blue-700'
                                    }`}>
                                    {diasRestantes === 0
                                        ? 'Expirada'
                                        : `${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'} restantes`}
                                </span>
                                <span className="text-xs text-slate-500">
                                    Plan: {validezTemporal.tipo === '7dias' ? '7 días' :
                                        validezTemporal.tipo === '15dias' ? '15 días' :
                                            validezTemporal.tipo === '30dias' ? '30 días' : validezTemporal.tipo}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Layout principal: info + plan/limites */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna izquierda: datos de la cuenta */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Datos personales / de empresa */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold text-slate-800">
                                Datos de la cuenta
                            </h2>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {role === 'admin' ? 'Admin' : 'Usuario'}
                            </span>
                        </div>

                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <dt className="text-slate-500">Nombre</dt>
                                <dd className="font-medium text-slate-900">
                                    {nombre || '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Email</dt>
                                <dd className="font-medium text-slate-900">
                                    {email || '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Empresa</dt>
                                <dd className="font-medium text-slate-900">
                                    {empresa || '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">RUT</dt>
                                <dd className="font-medium text-slate-900">
                                    {rut || '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Teléfono</dt>
                                <dd className="font-medium text-slate-900">
                                    {telefono || '—'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Info de características del plan */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-500" />
                            <h2 className="text-sm font-semibold text-slate-800">
                                Características de tu plan
                            </h2>
                        </div>

                        <ul className="space-y-2 text-sm">
                            <FeatureRow
                                label="Exportar a PDF"
                                enabled={!!features.exportarPDF}
                                hint={isPro ? '' : 'Disponible en Plan Pro'}
                            />

                            <FeatureRow
                                label="Diagnósticos ilimitados"
                                enabled={!!features.exportarPDF}
                                hint={isPro ? '' : 'Disponible en Plan Pro'}
                            />
                            <FeatureRow
                                label="Recomendaciones completas"
                                enabled={!!features.recomendacionesCompletas}
                                hint={isPro ? '' : 'Disponible en Plan Pro'}
                            />
                            <FeatureRow
                                label="Uso en múltiples dispositivos"
                                enabled={!!features.evolucionTemporal}
                                hint={isPro ? '' : 'Disponible en Plan Pro'}
                            />
                            <FeatureRow
                                label="Soporte prioritario"
                                enabled={!!features.soportePrioritario}
                                hint={isPro ? '' : 'Disponible en Plan Pro'}
                            />
                        </ul>

                        {!isPro && (
                            <p className="text-xs text-slate-500">
                                Estas características se habilitan automáticamente al pasar a Plan Pro.
                            </p>
                        )}
                    </div>
                </div>

                {/* Columna derecha: plan, límites y upgrade */}
                <div className="space-y-4">
                    {/* Resumen de plan y límites */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Límites y uso
                        </h2>

                        {/* Diagnósticos */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Diagnósticos este mes</span>
                                <span>
                                    {isPro
                                        ? '∞'
                                        : `${diagnosticosUsados} / ${diagnosticosTotales ?? 0}`}
                                </span>
                            </div>
                            {porcentajeUso !== null && (
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full ${porcentajeUso >= 80
                                            ? 'bg-red-400'
                                            : porcentajeUso >= 60
                                                ? 'bg-amber-400'
                                                : 'bg-emerald-400'
                                            }`}
                                        style={{ width: `${porcentajeUso}%` }}
                                    />
                                </div>
                            )}
                            <div className="text-[11px] text-slate-500">
                                {isPro
                                    ? 'Plan Pro: diagnósticos ilimitados.'
                                    : `Plan Free: ${diagnosticosTotales ?? 4} diagnósticos mensuales.`}
                            </div>
                            {ultimoResetDiagnosticos && (
                                <div className="text-[11px] text-slate-400">
                                    Último reinicio:{' '}
                                    {new Date(ultimoResetDiagnosticos).toLocaleDateString('es-CL')}
                                </div>
                            )}
                        </div>

                        
                    </div>

                    {/* Card Upgrade */}

                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-5 shadow-md">
                        <div className="flex items-start gap-3">
                            <Crown className="w-5 h-5 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold">Upgrade a Plan Pro</h3>
                                <p className="text-xs text-emerald-100">
                                    Desbloquea diagnósticos ilimitados, múltiples usuarios, exportación a
                                    PDF y recomendaciones completas para tu empresa.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={`mt-4 inline-flex items-center justify-center w-full px-3 py-2 text-sm font-semibold rounded-lg border transition-colors
    ${isPro
                                    ? 'bg-white/20 text-white/80 border-white/20 cursor-not-allowed opacity-70'
                                    : 'bg-white/10 hover:bg-white/20 border-white/30 text-white'}`}
                            onClick={handleUpgradeClick}
                            disabled={isPro}
                            aria-label={isPro ? 'Ya tienes Plan Pro' : 'Ver beneficios del Plan Pro'}
                        >
                            {isPro ? 'Ya tienes Plan Pro' : 'Ver beneficios del Plan Pro'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {error}
                </div>
            )}
        </div>
    );
}

function FeatureRow({ label, enabled, hint }) {
    return (
        <li className="flex items-start gap-2">
            <span
                className={`mt-0.5 w-2 h-2 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
            />
            <div className="flex flex-col">
                <span
                    className={`text-sm ${enabled ? 'text-slate-800' : 'text-slate-500'
                        }`}
                >
                    {label}
                </span>
                {hint && !enabled && (
                    <span className="text-[11px] text-slate-400">{hint}</span>
                )}
            </div>
        </li>
    );
}