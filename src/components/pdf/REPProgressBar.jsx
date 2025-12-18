// src/components/pdf/REPProgressBar.jsx
import React from 'react';
import { Target } from 'lucide-react';

// Función para obtener meta simplificada (sin imports externos)
function obtenerMeta(producto) {
    if (!producto) return 50;
    const productoLower = producto.toLowerCase();

    // Metas para 2024 (primer año)
    if (productoLower.includes('envase') || productoLower.includes('embalaje')) return 40;
    if (productoLower.includes('neumático') || productoLower.includes('neumatico')) return 25;
    if (productoLower.includes('raee') || productoLower.includes('eléctrico') || productoLower.includes('electrónico')) return 30;
    if (productoLower.includes('aceite') || productoLower.includes('lubricante')) return 50;
    if (productoLower.includes('pila') || productoLower.includes('batería')) return 50;

    return 50; // Meta por defecto
}

// Componente individual para cada producto
function ProductoREPBar({ producto, anio, cantidadGenerada, cantidadValorizada }) {
    const meta = obtenerMeta(producto);

    // Calcular porcentaje🎯
    const porcentaje = cantidadGenerada > 0
        ? ((cantidadValorizada / cantidadGenerada) * 100)
        : 0;

    const porcentajeMostrar = Math.min(Math.max(porcentaje, 0), 100);

    // Determinar color
    let colors = { bg: '#ef4444', light: '#fee2e2', text: '#991b1b', border: '#fca5a5' };

    if (porcentajeMostrar >= meta) {
        colors = { bg: '#10b981', light: '#d1fae5', text: '#065f46', border: '#86efac' };
    } else if (porcentajeMostrar >= meta * 0.8) {
        colors = { bg: '#eab308', light: '#fef9c3', text: '#854d0e', border: '#fde047' };
    }

    const cumpleMeta = porcentajeMostrar >= meta;

    return (
        <div
            className="p-3 rounded-lg border-2 mb-2"
            style={{
                backgroundColor: colors.light,
                borderColor: colors.border
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h4 className="text-xs font-semibold text-slate-700 mb-0.5">
                        {producto}
                    </h4>
                    <p className="text-[10px] text-slate-600">
                        {cantidadValorizada.toLocaleString('es-CL')} / {cantidadGenerada.toLocaleString('es-CL')} kg
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: colors.text }}>
                        {porcentajeMostrar.toFixed(1)}%
                    </p>
                    {cumpleMeta ? (
                        <span className="text-[9px] font-semibold" style={{ color: colors.text }}>
                            ✓ Cumplida
                        </span>
                    ) : (
                        <span className="text-[9px] font-semibold text-slate-600">
                            Falta {(meta - porcentajeMostrar).toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>

            {/* Meta label */}
            <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-[9px] text-slate-600">Progreso actual</span>
                <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-red-600">Meta {anio}:</span>
                    <span className="text-[10px] font-bold text-red-700">{meta}%</span>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="relative">
                <div
                    className="w-full h-7 rounded-md overflow-hidden relative"
                    style={{ backgroundColor: '#f1f5f9' }}
                >
                    {/* Progreso */}
                    <div
                        className="h-full flex items-center justify-center"
                        style={{
                            width: `${porcentajeMostrar}%`,
                            backgroundColor: colors.bg,
                            minWidth: porcentajeMostrar > 10 ? '30px' : '0'
                        }}
                    >
                        {porcentajeMostrar > 10 && (
                            <span className="text-white font-bold text-[10px]">
                                {porcentajeMostrar.toFixed(0)}%
                            </span>
                        )}
                    </div>

                    {/* Línea de meta */}
                    <div
                        className="absolute top-0 bottom-0 z-10"
                        style={{
                            left: `calc(${meta}% - 1.5px)`,  // Centrar la línea
                            width: '3px',
                            backgroundColor: '#dc2626',
                            boxShadow: '0 0 10px rgba(220, 38, 38, 0.7)'
                        }}
                    >
                        {/* Emoji indicador */}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2"
                            style={{ top: '-16px' }}
                        >
                            <Target className="w-3 h-3" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente principal
export default function REPProgressBar({ productosREP = [], anioEvaluacion = 2024, ocultarResumen = false }) {
    // Validación
    if (!productosREP || productosREP.length === 0) {
        return (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                    No se registraron productos prioritarios para este período.
                </p>
            </div>
        );
    }

    // Calcular totales
    const totalValorizado = productosREP.reduce((sum, p) => sum + (p.cantidadValorizada || 0), 0);
    const totalGenerado = productosREP.reduce((sum, p) => sum + (p.cantidadGenerada || 0), 0);
    const porcentajeTotal = totalGenerado > 0 ? ((totalValorizado / totalGenerado) * 100) : 0;

    return (
        <div className="space-y-3">
            {/* Resumen general - Solo si no está oculto */}
            {!ocultarResumen && (
                <>
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wide mb-0.5">
                                    Valorización Total {anioEvaluacion}
                                </p>
                                <p className="text-2xl font-bold text-emerald-900">
                                    {porcentajeTotal.toFixed(1)}%
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-emerald-700 font-medium">
                                    {totalValorizado.toLocaleString('es-CL')} kg valorizados
                                </p>
                                <p className="text-[10px] text-emerald-600">
                                    de {totalGenerado.toLocaleString('es-CL')} kg generados
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="flex items-center gap-2 py-1">
                        <div className="h-px flex-1 bg-slate-300"></div>
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                            Desglose por producto
                        </p>
                        <div className="h-px flex-1 bg-slate-300"></div>
                    </div>
                </>
            )}

            {/* Grid de productos */}
            <div className="space-y-2">
                {productosREP.map((producto, idx) => (
                    <ProductoREPBar
                        key={idx}
                        producto={producto.categoria || producto.producto || 'Producto sin nombre'}
                        anio={producto.anio || anioEvaluacion}
                        cantidadGenerada={producto.cantidadGenerada || 0}
                        cantidadValorizada={producto.cantidadValorizada || 0}
                    />
                ))}
            </div>

            {/* Leyenda */}
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-1 h-6 bg-red-600 rounded flex-shrink-0"></div>
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-xs text-red-900">
                        <span className="font-bold">Línea roja:</span> Representa la meta de valorización establecida por la Ley REP para cada producto prioritario en el año {anioEvaluacion}. El cumplimiento de esta meta es obligatorio y sujeto a fiscalización por la Superintendencia del Medio Ambiente.
                    </span>
                </div>
            </div>
        </div>
    );
}