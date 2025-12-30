// src/components/pdf/InformePDF.jsx
import React from "react";
import { useEffect, useState } from "react";
import { usePdfPageNumbers } from "../../hooks/usePDFPageNumbers";
import RadarChart from './RadarChart';
import CarbonStackedChart from './CarbonStackedChart';
import REPProgressBar from './REPProgressBar';
import { CirculoNumeroSVG } from './CirculoNumeroSVG';
import { BadgePlazoSVG } from './BadgeSVG';
import { MatrizPriorizacionImagen } from './MatrizPriorizacionImagen';

import {
    TrendingUp, AlertTriangle, Shield, AlertCircle, Info, CheckCircle, Target, Zap, Clock,
    Rocket, Calendar, BarChart3, Leaf, Recycle, Droplet, ArrowRight, Circle, DollarSign, Lightbulb, TrendingDown,
    FileText
} from 'lucide-react';
import {
    FortalezaCard,
    OportunidadCard,
    RecomendacionMejorada,
    RoadmapTimeline,
    QuickWinsSection
} from './PlanAccionComponents';
import {
    identificarFortalezas,
    identificarOportunidades,
    generarRecomendacionesPriorizadas,
    generarRoadmap,
    identificarQuickWins
} from '../../utils/analisisEvaluacion';
import { QuickWinsAsImage } from './ImageRenderedComponents';
import { ProximosPasosWithImages } from './ImageRenderedComponents';

// AGREGAR ESTAS FUNCIONES JUSTO DESPUÉS DE LOS IMPORTS:

const formatNumber = (num, decimales = 0) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toLocaleString('es-CL', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
};

const kgAToneladas = (kg) => {
    if (!kg || kg === 0) return '0,00';
    return formatNumber(kg / 1000, 2);
};

const formatPorcentaje = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0,0';
    return formatNumber(num, 1);
};

function LogoAmbientAPP() {
    const [png, setPng] = useState(null);

    useEffect(() => {
        fetch("/logo-ambientapp.svg")
            .then(res => res.text())
            .then(svg => {
                const svg64 = btoa(unescape(encodeURIComponent(svg)));
                const imageSrc = `data:image/svg+xml;base64,${svg64}`;

                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    setPng(canvas.toDataURL("image/png"));
                };
            });
    }, []);

    if (!png) return <div style={{ height: 110 }} />;

    return (
        <img
            src={png}
            alt="AmbientAPP"
            style={{ height: "110px", objectFit: "contain" }}
        />
    );
}

export { LogoAmbientAPP };

/**
 * INFORME PDF — versión final
 * Mantiene el estilo original, pero adaptado a:
 *  - Gráfico RADAR (radarImg)
 *  - Gráfico BARRAS APILADAS (stackedImg)
 */

export default function InformePDF({
    evaluacion,
    emisiones,
    residuosRep,
    textoRadar,
    textoCarbono,
    textoRep,
    textoGlobal,
    radarImg,
    stackedImg,
    recomendaciones = [],
    factores = [],
}) {
    const ev = evaluacion || {};
    const empresa = ev.companyName || "Empresa no definida";
    const periodo = ev.period || "Período no definido";
    const fecha = new Date().toLocaleDateString("es-CL");
    // Variables de emisiones con formato correcto
    const totalEmisionesTon = kgAToneladas(emisiones?.totalKg || 0);
    const alcance1Ton = kgAToneladas(emisiones?.alcance1 || 0);
    const alcance2Ton = kgAToneladas(emisiones?.alcance2 || 0);
    const alcance1Kg = emisiones?.alcance1 || 0;
    const alcance2Kg = emisiones?.alcance2 || 0;
    const totalKg = emisiones?.totalKg || 0;

    // Porcentajes de alcances
    const porcentajeA1 = totalKg > 0 ? ((alcance1Kg / totalKg) * 100) : 0;
    const porcentajeA2 = totalKg > 0 ? ((alcance2Kg / totalKg) * 100) : 0;

    // Datos de combustibles individuales (del backend)
    const diesel = ev?.carbono?.diesel || 0;
    const bencina = ev?.carbono?.bencina || 0;
    const gasNatural = ev?.carbono?.gasNatural || 0;
    const otrosCombustibles = ev?.carbono?.otrosCombustibles || 0;
    const electricidad = ev?.carbono?.electricidad || 0;

    // Calcular emisiones por combustible (factores chilenos)
    const emisionesDiesel = diesel * 2.68;
    const emisionesBencina = bencina * 2.31;
    const emisionesGasNatural = gasNatural * 1.98;
    const emisionesOtros = otrosCombustibles * 2.5;
    const emisionesElectricidad = electricidad * 0.413;

    // Agua
    const consumoAgua = ev?.agua?.consumoTotal || 0;
    const consumoAguaMes = consumoAgua;
    const intensidadHidrica = ev?.agua?.consumoPerCapita || null;
    const tipoMedicion = ev?.agua?.tipoMedicion || 'persona';

    // Residuos
    const residuosTotales = ev?.residuos?.generados || 0;
    const residuosReciclados = ev?.residuos?.valorizados || 0;
    const tasaValorizacion = residuosTotales > 0 ? ((residuosReciclados / residuosTotales) * 100) : 0;
    const residuosNoValorizados = residuosTotales - residuosReciclados;
    const potencialMejora = 100 - tasaValorizacion;

    // Scores
    const carbonScore = ev?.carbono?.puntuacion || 0;
    const waterScore = ev?.agua?.puntuacion || 0;
    const wasteScore = ev?.residuos?.puntuacion || 0;
    const puntajeGlobal = ev?.puntuacionGeneral || 0;

    // REP
    const productosREP = ev?.productosREP || [];
    const anioEvaluacion = ev?.anio || 2024;


    usePdfPageNumbers({ empresa, fecha });

    const totalResiduos = ev?.wasteData?.residuosTotales || 0;

    // REP
    const repUltimo = residuosRep?.[0];
    const repPct =
        repUltimo && repUltimo.cantidadGenerada
            ? (repUltimo.cantidadValorizada / repUltimo.cantidadGenerada) * 100
            : 0;

    function BadgeSVG({ text, bg, border, color }) {
        return (
            <svg
                width="68"
                height="22"
                style={{ display: "inline-block", verticalAlign: "middle" }}
            >
                <rect
                    x="0.5"
                    y="0.5"
                    width="67"
                    height="21"
                    rx="6"
                    fill={bg}
                    stroke={border}
                />
                <text
                    x="50%"
                    y="50%"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    fill={color}
                    dominantBaseline="middle"
                    textAnchor="middle"
                >
                    {text}
                </text>
            </svg>
        );
    }

    function NumeroBadge({ n }) {
        return (
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="18" fill="#10b981" />
                <text
                    x="18"
                    y="21"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="white"
                    fontFamily="Inter, sans-serif"
                >
                    {n}
                </text>
            </svg>
        );
    }

    function PrioridadBadgeSVG({ prioridad }) {
        const map = {
            1: { txt: "Crítica", color: "#dc2626", bg: "#fee2e2", dot: "#b91c1c" },
            2: { txt: "Alta", color: "#c2410c", bg: "#ffedd5", dot: "#ea580c" },
            3: { txt: "Media", color: "#92400e", bg: "#fef3c7", dot: "#ca8a04" },
            4: { txt: "Baja", color: "#065f46", bg: "#d1fae5", dot: "#10b981" },
        };

        const p = map[prioridad] ?? map[3];

        return (
            <svg
                width="82"
                height="26"
                viewBox="0 0 82 26"
                style={{ display: "block" }}
            >
                <rect
                    x="0"
                    y="0"
                    width="82"
                    height="26"
                    rx="8"
                    fill={p.bg}
                    stroke={p.color + "33"}
                />
                <circle cx="14" cy="13" r="5" fill={p.dot} />
                <text
                    x="32"
                    y="16"
                    fontSize="11"
                    fontWeight="600"
                    fill={p.color}
                    fontFamily="Inter, sans-serif"
                >
                    {p.txt}
                </text>
            </svg>
        );
    }

    // 🔢 Círculo verde con número centrado (para Próximos Pasos)
    function PasoNumeroSVG({ n }) {
        return (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="12" r="11.5" fill="#10b981" />
                <text
                    x="12"
                    y="13.5"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#ffffff"
                    fontFamily="Inter, sans-serif"
                >
                    {n}
                </text>
            </svg>
        );
    }

    // 🧩 Bloque HTML de Próximos Pasos (ya no es un SVG gigante)
    function ProximosPasosBlock() {
        const pasos = [
            "Revisar y validar las recomendaciones con el equipo directivo",
            "Asignar responsables y presupuesto para cada acción prioritaria",
            "Establecer indicadores de seguimiento (KPIs) para medir el progreso",
            "Realizar nueva evaluación en 6 meses para medir mejoras",
        ];

        return (
            <div className="pdf-next-steps">
                <h3 className="pdf-next-steps-title">
                    <span className="icon">📌</span>
                    Próximos pasos sugeridos
                </h3>

                <ul className="pdf-next-steps-list">
                    {pasos.map((texto, idx) => (
                        <li key={idx} className="pdf-next-step-item">
                            <PasoNumeroSVG n={idx + 1} />
                            <span>{texto}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    function RecomendacionCard({ rec, numero }) {
        const impactoColor = {
            "Alto": "bg-red-100 text-red-800 border-red-300",
            "Medio": "bg-yellow-100 text-yellow-800 border-yellow-300",
            "Bajo": "bg-green-100 text-green-800 border-green-300",
        };

        const facilidadColor = {
            "Alta": "bg-emerald-100 text-emerald-800 border-emerald-300",
            "Media": "bg-blue-100 text-blue-800 border-blue-300",
            "Baja": "bg-slate-100 text-slate-800 border-slate-300",
        };

        const prioridadBadge = {
            1: <><Circle className="w-3 h-3 inline fill-red-600 text-red-600 mr-1" /> Crítica</>,
            2: <><Circle className="w-3 h-3 inline fill-orange-600 text-orange-600 mr-1" /> Básica</>,
            3: <><Circle className="w-3 h-3 inline fill-yellow-600 text-yellow-600 mr-1" /> Media</>,
            4: <><Circle className="w-3 h-3 inline fill-green-600 text-green-600 mr-1" /> Baja</>,
            5: <><Circle className="w-3 h-3 inline fill-green-700 text-green-700 mr-1" /> Avanzada</>
        };

        function PasoNumeroSVG({ n }) {
            return (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="12" cy="12" r="11.5" fill="#10b981" />
                    <text
                        x="12"
                        y="13.5"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                        fill="#ffffff"
                        fontFamily="Inter, sans-serif"
                    >
                        {n}
                    </text>
                </svg>
            );
        }

        return (
            <div className="border border-slate-300 rounded-lg p-4 py-2.5 bg-white shadow-sm avoid-break">
                <div className="flex items-start gap-3">

                    {/* Número */}
                    <div className="flex-shrink-0">
                        <NumeroBadge n={numero} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{rec.icono}</span>
                                    <h3 className="text-sm font-bold text-slate-800">{rec.titulo}</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{rec.dimension}</p>
                            </div>

                            {/* PRIORIDAD */}
                            <div className="flex-shrink-0">
                                <PrioridadBadgeSVG prioridad={rec.prioridad} />
                            </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                            {rec.descripcion}
                        </p>

                        {/* BADGES: Impacto / Facilidad */}
                        <div className="flex items-center gap-6 leading-none">

                            {/* IMPACTO */}
                            <BadgeSVG
                                text={rec.impacto}
                                bg={rec.impacto === "Alto" ? "#fee2e2" : rec.impacto === "Medio" ? "#fef9c3" : "#dcfce7"}
                                border={rec.impacto === "Alto" ? "#fecaca" : rec.impacto === "Medio" ? "#fde047" : "#bbf7d0"}
                                color={rec.impacto === "Alto" ? "#b91c1c" : rec.impacto === "Medio" ? "#92400e" : "#166534"}
                            />

                            {/* FACILIDAD */}
                            <BadgeSVG
                                text={rec.facilidad}
                                bg={rec.facilidad === "Alta" ? "#dcfce7" : rec.facilidad === "Media" ? "#dbeafe" : "#f1f5f9"}
                                border={rec.facilidad === "Alta" ? "#86efac" : rec.facilidad === "Media" ? "#93c5fd" : "#cbd5e1"}
                                color={rec.facilidad === "Alta" ? "#065f46" : rec.facilidad === "Media" ? "#1e40af" : "#475569"}
                            />
                        </div>

                        {/* FOOTER */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-">
                            <div className="flex items-center gap-1 text-xs text-emerald-700">
                                <DollarSign className="w-4 h-4 inline text-emerald-600" />
                                <span>{rec.ahorroPotencial}</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Clock className="w-4 h-4 inline text-blue-600" />
                                <span>{rec.plazo}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            id="pdf-root"
            className="bg-white text-slate-900 text-[11px] leading-relaxed"
            style={{
                width: "800px",
                margin: "0 auto",
                fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >






            {/* ========================================================= */}
            {/*                       PÁGINA 1 - PORTADA                  */}
            {/* ========================================================= */}
            <section
                className="pdf-page flex flex-col justify-between"
                style={{
                    minHeight: "1120px",
                    padding: "64px 72px",
                    backgroundImage: `
                        radial-gradient(circle at 20% 10%, rgba(16,185,129,0.09), transparent 55%),
                        radial-gradient(circle at 80% 90%, rgba(37,99,235,0.08), transparent 55%),
                        repeating-linear-gradient(
                            45deg,
                            rgba(0,0,0,0.015) 0px,
                            rgba(0,0,0,0.015) 1px,
                            transparent 1px,
                            transparent 6px
                        )
                    `,
                    backgroundSize: "cover",
                }}
            >
                {/* HEADER */}
                <header className="flex items-start justify-between mb-12">
                    <LogoAmbientAPP />
                </header>

                {/* TÍTULO */}
                <div className="mt-12" style={{ maxWidth: "520px" }}>
                    <h1 className="text-[40px] font-semibold leading-tight mb-3" style={{ letterSpacing: "0.4px" }}>

                        Diagnóstico Ambiental
                    </h1>
                    <p className="text-base text-slate-600">
                        Evaluación, análisis e interpretación de los indicadores ambientales
                        generados con AmbientAPP para apoyar la gestión y toma de decisiones.
                    </p>
                    <div className="h-[1px] w-32 bg-emerald-500/40 my-6"></div>
                </div>

                {/* INFORMACIÓN */}
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-xl text-sm">
                    <InfoBox label="Empresa evaluada" value={empresa} highlight />
                    <InfoBox label="Período" value={periodo} />
                    <InfoBox label="Fecha del informe" value={fecha} />
                    <InfoBox label="Generado por" value="AmbientAPP" />
                </div>

            </section>






            {/* ========================================================= */}
            {/*                 PÁGINA 2 - RESUMEN EJECUTIVO              */}
            {/* ========================================================= */}
            <section
                className="pdf-page"
                style={{ minHeight: "1120px", padding: "56px 72px", position: "relative" }}
            >
                <HeaderSection
                    title="Resumen ejecutivo"
                    desc="Visión general del desempeño ambiental de la organización."
                    page={2}
                />

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <CardKPI
                        title="Huella de carbono"
                        color="emerald"
                        value={`${totalEmisionesTon} tCO₂e`}
                        desc="Emisiones totales considerando combustibles (A1) y electricidad (A2)."
                    />

                    <CardKPI
                        title="Consumo de agua"
                        color="sky"
                        value={`${formatNumber(consumoAguaMes, 0)} L/mes`}
                        desc="Consumo mensual promedio declarado."
                    />

                    <CardKPI
                        title="Residuos generados"
                        color="lime"
                        value={`${formatNumber(residuosTotales, 0)} kg/año`}
                        desc="Total de residuos sólidos declarados."
                    />

                    <CardKPI
                        title="Valorización REP"
                        color="blue"
                        value={`${formatPorcentaje(tasaValorizacion)}%`}
                        desc="Porcentaje valorizado según último registro."
                    />
                </div>

                {/* PRINCIPALES HALLAZGOS Y OPORTUNIDADES */}
                {(() => {
                    // Calcular scores simplificados (0-100)
                    const huellaCarbono = emisiones.totalTon;
                    const alcance1 = emisiones.alcance1;
                    const alcance2 = emisiones.alcance2;

                    const carbonScore = huellaCarbono < 50 ? 80 : huellaCarbono < 100 ? 60 : 40;

                    const consumoAgua = ev?.waterData?.consumoMensual || 0;
                    const waterScore = consumoAgua < 10000 ? 80 : consumoAgua < 50000 ? 60 : 40;

                    const residuosGenerados = totalResiduos;
                    const residuosValorizados = ev?.wasteData?.valorizados || 0;
                    const pctValorizacion = residuosGenerados > 0 ? (residuosValorizados / residuosGenerados) * 100 : 0;
                    const wasteScore = pctValorizacion > 60 ? 80 : pctValorizacion > 30 ? 60 : 40;

                    const scores = { carbonScore, waterScore, wasteScore };
                    const productosREP = ev?.repData?.productos || [];

                    return (
                        <>
                            {/* PRINCIPALES HALLAZGOS */}
                            <div className="mt-6 p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-lg">
                                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-600" />
                                    Principales hallazgos
                                </h3>
                                <ul className="space-y-2">
                                    {/* Hallazgo 1: Carbono */}
                                    {scores.carbonScore < 60 && (
                                        <li className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-red-600 font-bold">•</span>
                                            <span>
                                                <strong>Huella de carbono elevada:</strong> El Alcance {alcance1 > alcance2 ? '1' : '2'} representa
                                                el {((Math.max(alcance1, alcance2) / huellaCarbono) * 100).toFixed(0)}% de las emisiones totales,
                                                indicando oportunidad de reducción significativa.
                                            </span>
                                        </li>
                                    )}
                                    {scores.carbonScore >= 60 && (
                                        <li className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-green-600 font-bold">•</span>
                                            <span>
                                                <strong>Gestión de carbono sólida:</strong> El desempeño actual está por sobre el promedio de la industria,
                                                con potencial de mejora en eficiencia energética.
                                            </span>
                                        </li>
                                    )}

                                    {/* Hallazgo 2: Agua */}
                                    {scores.waterScore < 60 && (
                                        <li className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">•</span>
                                            <span>
                                                <strong>Intensidad hídrica alta:</strong> El consumo de agua por unidad de producción sugiere
                                                oportunidades de optimización mediante tecnologías de recirculación y medición.
                                            </span>
                                        </li>
                                    )}
                                    {scores.waterScore >= 60 && (
                                        <li className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-green-600 font-bold">•</span>
                                            <span>
                                                <strong>Gestión hídrica eficiente:</strong> La intensidad de uso de agua está dentro de rangos
                                                adecuados, con oportunidad de implementar metas de reducción progresiva.
                                            </span>
                                        </li>
                                    )}

                                    {/* Hallazgo 3: Residuos */}
                                    {(() => {
                                        const tasaValorizacion = residuosGenerados > 0
                                            ? ((residuosValorizados / residuosGenerados) * 100)
                                            : 0;
                                        const tasaTexto = `${tasaValorizacion.toFixed(1).replace('.', ',')}%`;

                                        if (scores.wasteScore < 60) {
                                            return (
                                                <li className="text-xs text-slate-700 flex items-start gap-2">
                                                    <span className="text-red-600 font-bold">•</span>
                                                    <span>
                                                        <strong>Baja valorización de residuos:</strong> Solo {tasaTexto} de residuos valorizados.
                                                        Costos de disposición elevados y pérdida de oportunidades de economía circular.
                                                        Implementar segregación en origen puede duplicar esta tasa.
                                                    </span>
                                                </li>
                                            );
                                        }

                                        if (scores.wasteScore >= 60 && scores.wasteScore < 85) {
                                            return (
                                                <li className="text-xs text-slate-700 flex items-start gap-2">
                                                    <span className="text-amber-600 font-bold">•</span>
                                                    <span>
                                                        <strong>Valorización intermedia:</strong> Con {tasaTexto} de valorización,
                                                        la empresa cumple requisitos básicos pero tiene espacio importante de mejora
                                                        para alcanzar estándares de excelencia.
                                                    </span>
                                                </li>
                                            );
                                        }

                                        // wasteScore >= 85
                                        return (
                                            <li className="text-xs text-slate-700 flex items-start gap-2">
                                                <span className="text-green-600 font-bold">•</span>
                                                <span>
                                                    <strong>Valorización destacada:</strong> Con {tasaTexto} de valorización,
                                                    la empresa supera las metas legales y puede aspirar a certificaciones ambientales.
                                                </span>
                                            </li>
                                        );
                                    })()}

                                    {/* Hallazgo 4: REP (si aplica) */}
                                    {productosREP.length > 0 && (
                                        <li className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>
                                                <strong>Cumplimiento REP:</strong> La empresa gestiona {productosREP.length} categoría(s) de productos prioritarios.
                                                El cumplimiento de metas REP 2025-2030 requiere planificación de infraestructura.
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* ÁREAS DE OPORTUNIDAD INMEDIATA */}
                            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-lg">
                                <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                                    Áreas de oportunidad inmediata
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(() => {
                                        const minScore = Math.min(scores.carbonScore, scores.waterScore, scores.wasteScore);
                                        const areaDebil = minScore === scores.carbonScore ? 'carbono' :
                                            minScore === scores.waterScore ? 'agua' : 'residuos';

                                        return (
                                            <>
                                                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                                                    <p className="text-xs font-bold text-emerald-800 mb-1">
                                                        {areaDebil === 'carbono' ? '⚡ Eficiencia Energética' :
                                                            areaDebil === 'agua' ? '💧 Optimización Hídrica' :
                                                                '♻️ Economía Circular'}
                                                    </p>
                                                    <p className="text-[10px] text-slate-600">
                                                        {areaDebil === 'carbono' ? 'Auditoría energética puede identificar 20-30% de ahorro.' :
                                                            areaDebil === 'agua' ? 'Medidores inteligentes reducen consumo hasta 25%.' :
                                                                'Segregación en origen aumenta valorización 40-60%.'}
                                                    </p>
                                                </div>

                                                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                                                    <p className="text-xs font-bold text-emerald-800 mb-1">📊 Medición y Monitoreo</p>
                                                    <p className="text-[10px] text-slate-600">
                                                        Sistema de KPIs ambientales permite seguimiento mensual y toma de decisiones basada en datos.
                                                    </p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </>
                    );
                })()}

            </section>






            {/* ========================================================= */}
            {/*              PÁGINA 3 - PERFIL AMBIENTAL (RADAR)         */}
            {/* ========================================================= */}
            <section
                className="pdf-page"
                style={{ minHeight: "1120px", padding: "56px 72px", position: "relative" }}
            >
                <HeaderSection
                    title="Perfil ambiental de la organización"
                    desc="Desempeño global en carbono, agua y residuos basado en los puntajes ambientales."
                    page={3}
                />

                {/* RADAR E INTERPRETACIÓN - 2 COLUMNAS */}
                <div className="grid grid-cols-[1.1fr_1.2fr] gap-10 mb-6">

                    {/* RADAR */}
                    <ChartBox
                        title="Gráfico radar del desempeño"
                        desc={
                            <>
                                El radar representa visualmente el comportamiento de la organización
                                en carbono, agua y residuos. Valores más altos indican un mejor
                                desempeño relativo.
                            </>
                        }
                    >
                        <RadarChart
                            carbonScore={ev?.scores?.carbonScore}
                            waterScore={ev?.scores?.waterScore}
                            wasteScore={ev?.scores?.wasteScore}
                        />
                    </ChartBox>

                    {/* INTERPRETACIÓN */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold mb-2">
                            Interpretación del perfil
                        </h3>
                        <p className="text-sm leading-relaxed">{textoRadar}</p>

                        {/* TARJETAS */}
                        <ScoreGrid scores={ev.scores} />
                    </div>

                </div>

                {/* METODOLOGÍA Y CONTEXTO - ANCHO COMPLETO */}
                <div className="space-y-3">
                    {/* Metodología de ponderación */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-[11px] font-bold text-blue-900 mb-2 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Metodología de ponderación
                        </h4>
                        <p className="text-[9px] text-slate-700 leading-tight mb-2">
                            Cada dimensión ambiental se evalúa mediante indicadores cuantitativos específicos.
                            El puntaje final (0-100) refleja el desempeño en relación a estándares chilenos vigentes
                            y buenas prácticas internacionales:
                        </p>
                        <ul className="grid grid-cols-3 gap-2 text-[9px] text-slate-600">
                            <li className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span><strong>Huella de Carbono:</strong> Calculada según GHG Protocol con factores de emisión MMA 2023. Se ponderan Alcances 1 y 2.</span>
                            </li>
                            <li className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span><strong>Gestión Hídrica:</strong> Evaluación de intensidad de uso según NCh ISO 14046 y eficiencia operacional.</span>
                            </li>
                            <li className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span><strong>Residuos y REP:</strong> Tasa de valorización vs disposición final, cumplimiento Ley 20.920 y metas sectoriales.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Escala de evaluación */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <h4 className="text-[11px] font-bold text-slate-900 mb-2 flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            Escala de evaluación
                        </h4>
                        <div className="grid grid-cols-4 gap-3 text-[8px]">
                            <div className="p-2 bg-red-100 border border-red-300 rounded text-center">
                                <span className="font-bold text-red-800 block text-sm">0-29</span>
                                <span className="text-red-700 font-semibold">Bajo</span>
                                <p className="text-[7px] text-red-600 mt-0.5">Requiere acción inmediata</p>
                            </div>
                            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-center">
                                <span className="font-bold text-yellow-800 block text-sm">30-59</span>
                                <span className="text-yellow-700 font-semibold">Básico</span>
                                <p className="text-[7px] text-yellow-600 mt-0.5">Cumplimiento mínimo</p>
                            </div>
                            <div className="p-2 bg-blue-100 border border-blue-300 rounded text-center">
                                <span className="font-bold text-blue-800 block text-sm">60-79</span>
                                <span className="text-blue-700 font-semibold">Intermedio</span>
                                <p className="text-[7px] text-blue-600 mt-0.5">Sobre promedio</p>
                            </div>
                            <div className="p-2 bg-green-100 border border-green-300 rounded text-center">
                                <span className="font-bold text-green-800 block text-sm">80-100</span>
                                <span className="text-green-700 font-semibold">Avanzado</span>
                                <p className="text-[7px] text-green-600 mt-0.5">Excelencia ambiental</p>
                            </div>
                        </div>
                    </div>

                    {/* Significado de cada dimensión */}
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="text-[11px] font-bold text-indigo-900 mb-2">Significado de cada dimensión</h4>
                        <div className="grid grid-cols-3 gap-3 text-[9px] text-slate-700">
                            <div className="flex items-start gap-1.5">
                                <span className="text-indigo-600 font-bold">→</span>
                                <span><strong>Carbono:</strong> Mide la eficiencia en reducción de emisiones de gases de efecto invernadero (GEI). Mayor puntaje indica menor intensidad de carbono por unidad de actividad.</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <span className="text-indigo-600 font-bold">→</span>
                                <span><strong>Agua:</strong> Evalúa la optimización del recurso hídrico. Considera consumo total, intensidad de uso y eficiencia operacional.</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <span className="text-indigo-600 font-bold">→</span>
                                <span><strong>Residuos:</strong> Refleja la tasa de valorización y adherencia a principios de economía circular. Incluye cumplimiento REP cuando aplica.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INSIGHT CLAVE */}
                <div className="mt-3 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-lg">
                    <p className="text-[9px] text-slate-700">
                        <span className="font-bold text-blue-900">💡 Insight:</span> El perfil radar identifica brechas de desempeño.
                        Las dimensiones con menor puntaje representan las <strong>mayores oportunidades de mejora</strong> con
                        retorno de inversión más rápido. El plan de acción prioriza estas áreas para maximizar el impacto ambiental y económico.
                    </p>
                </div>

            </section>






            {/* ========================================================= */}
            {/*           PÁGINA 4 - HUELLA DE CARBONO (STACKED BAR)     */}
            {/* ========================================================= */}
            <section
                className="pdf-page"
                style={{ minHeight: "1120px", padding: "56px 72px", position: "relative" }}
            >
                <HeaderSection
                    title="Huella de carbono – Alcances 1 y 2"
                    desc="Análisis del aporte de combustibles (A1) y electricidad (A2) según período evaluado."
                    page={4}
                />

                <div className="grid grid-cols-[1.1fr_1.2fr] gap-10">

                    {/* STACKED BAR */}
                    <ChartBox
                        title="Distribución por Alcance (A1 / A2)"
                        desc="El gráfico muestra visualmente la participación relativa entre combustibles (A1) y electricidad (A2)."
                    >
                        <CarbonStackedChart
                            alcance1={emisiones?.alcance1 || 0}
                            alcance2={emisiones?.alcance2 || 0}
                        />
                    </ChartBox>

                    {/* INTERPRETACIÓN */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold mb-3">
                            Interpretación de las emisiones
                        </h3>
                        <p className="text-sm leading-relaxed mb-4">{textoCarbono}</p>

                        {/* KPIs - TAMAÑOS REDUCIDOS */}
                        {(() => {
                            const totalKg = emisiones?.totalKg || 0;
                            const alcance1Kg = emisiones?.alcance1 || 0;
                            const alcance2Kg = emisiones?.alcance2 || 0;

                            // Siempre mostrar en toneladas con formato chileno
                            const total = { valor: totalEmisionesTon, unidad: 'tCO₂e' };
                            const a1 = { valor: alcance1Ton, unidad: 'tCO₂e' };
                            const a2 = { valor: alcance2Ton, unidad: 'tCO₂e' };

                            return (
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">
                                            TOTAL
                                        </p>
                                        <p className="text-lg font-bold text-slate-900">
                                            {total.valor}
                                        </p>
                                        <p className="text-[9px] text-slate-500">{total.unidad}</p>
                                    </div>

                                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <p className="text-[10px] uppercase tracking-wider text-emerald-700 mb-1">
                                            A1
                                        </p>
                                        <p className="text-lg font-bold text-emerald-900">
                                            {a1.valor}
                                        </p>
                                        <p className="text-[9px] text-emerald-600">
                                            {a1.unidad} ({formatPorcentaje(porcentajeA1)}%)
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-[10px] uppercase tracking-wider text-blue-700 mb-1">
                                            A2
                                        </p>
                                        <p className="text-lg font-bold text-blue-900">
                                            {a2.valor}
                                        </p>
                                        <p className="text-[9px] text-blue-600">
                                            {a2.unidad} ({formatPorcentaje(porcentajeA2)}%)
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                </div>

                {/* DESGLOSE, META Y PROYECCIÓN */}
                {(() => {
                    const alcance1Kg = emisiones?.alcance1 || 0;
                    const alcance2Kg = emisiones?.alcance2 || 0;
                    const totalKg = emisiones?.totalKg || 0;

                    // Función helper para formatear kg o tCO₂e según valor
                    const formatEmisionKgToBestUnit = (kg) => {
                        if (kg >= 1000) {
                            const ton = kg / 1000;
                            return `${formatNumber(ton, 2)} tCO₂e`;
                        }
                        return `${formatNumber(kg, 0)} kg`;
                    };

                    // Determinar si mostrar en kg o toneladas para totales
                    const esMenorA1Ton = totalKg < 1000;
                    const valorMostrar = esMenorA1Ton ? totalKg : (totalKg / 1000);
                    const unidad = esMenorA1Ton ? 'kgCO₂e' : 'tCO₂e';

                    return (
                        <>
                            {/* DESGLOSE POR FUENTE */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-300">
                                <h4 className="text-xs font-bold text-slate-800 mb-3">
                                    Desglose por fuente de emisión
                                </h4>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Alcance 1 - Izquierda */}
                                    <div className="p-3 bg-white rounded border border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-800 mb-2">
                                            Alcance 1 - Emisiones directas
                                        </p>
                                        <ul className="space-y-1 text-[9px] text-slate-600">
                                            {diesel > 0 && (
                                                <li className="flex justify-between">
                                                    <span>• Diesel:</span>
                                                    <span className="font-semibold">
                                                        {formatEmisionKgToBestUnit(emisionesDiesel)}
                                                    </span>
                                                </li>
                                            )}
                                            {bencina > 0 && (
                                                <li className="flex justify-between">
                                                    <span>• Gasolina:</span>
                                                    <span className="font-semibold">
                                                        {formatEmisionKgToBestUnit(emisionesBencina)}
                                                    </span>
                                                </li>
                                            )}
                                            {gasNatural > 0 && (
                                                <li className="flex justify-between">
                                                    <span>• Gas natural:</span>
                                                    <span className="font-semibold">
                                                        {formatEmisionKgToBestUnit(emisionesGasNatural)}
                                                    </span>
                                                </li>
                                            )}
                                            {otrosCombustibles > 0 && (
                                                <li className="flex justify-between">
                                                    <span>• Otros combustibles:</span>
                                                    <span className="font-semibold">
                                                        {formatEmisionKgToBestUnit(emisionesOtros)}
                                                    </span>
                                                </li>
                                            )}

                                            {/* Si no hay ningún combustible */}
                                            {diesel === 0 &&
                                                bencina === 0 &&
                                                gasNatural === 0 &&
                                                otrosCombustibles === 0 && (
                                                    <li className="text-slate-400 italic">
                                                        Sin desglose de combustibles
                                                    </li>
                                                )}

                                            <li className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                                                <span className="font-bold">Total Alcance 1:</span>
                                                <span className="font-bold text-red-700">
                                                    {formatEmisionKgToBestUnit(alcance1Kg)}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Alcance 2 - Derecha */}
                                    <div className="p-3 bg-white rounded border border-orange-200">
                                        <p className="text-[10px] font-bold text-orange-800 mb-2">
                                            Alcance 2 - Emisiones indirectas
                                        </p>
                                        <ul className="space-y-1 text-[9px] text-slate-600">
                                            <li className="flex justify-between">
                                                <span>• Electricidad comprada:</span>
                                                <span className="font-semibold">
                                                    {formatEmisionKgToBestUnit(emisionesElectricidad)}
                                                </span>
                                            </li>
                                            <li className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                                                <span className="font-bold">Total Alcance 2:</span>
                                                <span className="font-bold text-orange-700">
                                                    {formatEmisionKgToBestUnit(alcance2Kg)}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* META SBTi Y PROYECCIÓN */}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* Meta SBTi */}
                                <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                                    <h4 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                                        <Target className="w-4 h-4" />
                                        Meta recomendada según SBTi
                                    </h4>
                                    <p className="text-[10px] text-slate-700 mb-2">
                                        La <strong>Science Based Targets initiative (SBTi)</strong> recomienda reducción de
                                        <strong className="text-blue-700"> 4.2% anual</strong> para limitar el calentamiento a 1.5°C.
                                    </p>
                                    <div className="bg-white p-3 rounded border border-blue-200">
                                        <p className="text-[9px] text-slate-600 mb-1">Huella actual:</p>
                                        <p className="text-lg font-bold text-slate-800">{formatNumber(valorMostrar, 2)}</p>
                                        <p className="text-[9px] text-slate-600 mt-2 mb-1">Meta 2030 (reducción 4.2%/año):</p>
                                        <p className="text-lg font-bold text-blue-700">
                                            {formatNumber(valorMostrar * Math.pow(0.958, 6), 2)} {unidad}
                                        </p>
                                        <p className="text-[8px] text-green-600 mt-1">
                                            ↓ {((1 - Math.pow(0.958, 6)) * 100).toFixed(0)}% reducción total
                                        </p>
                                    </div>
                                </div>

                                {/* Proyección con Plan de Acción */}
                                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                                    <h4 className="text-xs font-bold text-green-900 mb-2 flex items-center gap-1">
                                        <TrendingDown className="w-4 h-4" />
                                        Proyección con Plan de Acción
                                    </h4>
                                    <p className="text-[10px] text-slate-700 mb-2">
                                        Implementando las recomendaciones de alta prioridad, se estima una reducción de
                                        <strong className="text-green-700"> 20-30%</strong> en 12-18 meses.
                                    </p>
                                    <div className="bg-white p-3 rounded border border-green-200">
                                        <div className="space-y-2 text-[9px]">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Optimización energética:</span>
                                                <span className="font-semibold text-green-700">-15%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Eficiencia de procesos:</span>
                                                <span className="font-semibold text-green-700">-8%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Energías renovables:</span>
                                                <span className="font-semibold text-green-700">-7%</span>
                                            </div>
                                            <div className="flex justify-between border-t border-slate-300 pt-1 mt-1">
                                                <span className="font-bold text-slate-800">Reducción total estimada:</span>
                                                <span className="font-bold text-green-700">-30%</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-green-200">
                                            <p className="text-[9px] text-slate-600">Huella proyectada 2026:</p>
                                            <p className="text-lg font-bold text-green-700">
                                                {formatNumber(valorMostrar * 0.7, 2)} {unidad}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}

            </section>






            {/* ========================================================= */}
            {/*           PÁGINA 5 - GESTIÓN HÍDRICA                      */}
            {/* ========================================================= */}
            <section
                className="pdf-page"
                style={{ minHeight: "1120px", padding: "56px 72px", position: "relative" }}
            >
                <HeaderSection
                    title="Gestión hídrica"
                    desc="Análisis del consumo de agua y desempeño en gestión del recurso hídrico."
                    page={5}
                />


                <div className="grid grid-cols-2 gap-10">

                    {/* KPIs DE AGUA */}
                    <div className="space-y-6">
                        <CardKPI
                            title="Consumo mensual"
                            color="sky"
                            value={`${formatNumber(consumoAguaMes, 0)} L`}
                            desc="Volumen total de agua consumida en el período evaluado"
                        />

                        <CardKPI
                            title="Intensidad hídrica"
                            color="blue"
                            value={
                                intensidadHidrica
                                    ? `${formatNumber(intensidadHidrica, 0)} L/${tipoMedicion === 'persona' ? 'persona' : 'unidad'}`
                                    : "No calculada"
                            }
                            desc="Consumo de agua normalizado según unidad productiva o personas"
                        />

                        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 shadow-sm">
                            <h3 className="text-sm font-semibold mb-2">Contexto</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                La intensidad hídrica permite comparar el consumo de agua entre
                                diferentes períodos o empresas del mismo sector. Un valor bajo
                                indica mayor eficiencia en el uso del recurso. Se recomienda
                                monitorear mensualmente y establecer metas de reducción progresiva.
                            </p>
                        </div>
                    </div>

                    {/* INTERPRETACIÓN */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold mb-2">Interpretación</h3>
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">
                            {interpretarAgua(ev?.waterData, ev?.intensidadHidrica)}
                        </p>

                        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                <span>Recomendaciones</span>
                            </div>
                            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                                <li>Implementar sistemas de medición y monitoreo continuo</li>
                                <li>Identificar y reparar fugas en instalaciones</li>
                                <li>Evaluar tecnologías de ahorro (grifería eficiente, riego tecnificado)</li>
                                <li>Capacitar al personal en uso responsable del agua</li>
                                <li>Considerar sistemas de reutilización y captación de aguas lluvias</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* AGREGAR DEBAJO DE LOS KPIs DE AGUA EN PÁGINA 5 */}

                {/* RECOMENDACIONES DE EFICIENCIA */}
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" />
                        Recomendaciones de eficiencia hídrica
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Quick Wins */}
                        <div>
                            <p className="text-[10px] font-bold text-blue-800 mb-2">Acciones rápidas (0-3 meses):</p>
                            <ul className="space-y-1 text-[9px] text-slate-700">
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600">✓</span>
                                    <span><strong>Detección de fugas:</strong> Inspección de red puede identificar pérdidas del 10-15%</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600">✓</span>
                                    <span><strong>Medidores inteligentes:</strong> Instalación permite monitoreo en tiempo real</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600">✓</span>
                                    <span><strong>Capacitación personal:</strong> Concientización reduce consumo 5-10%</span>
                                </li>
                            </ul>
                        </div>

                        {/* Mediano plazo */}
                        <div>
                            <p className="text-[10px] font-bold text-blue-800 mb-2">Medidas estructurales (6-12 meses):</p>
                            <ul className="space-y-1 text-[9px] text-slate-700">
                                <li className="flex items-start gap-1">
                                    <span className="text-green-600">→</span>
                                    <span><strong>Sistemas de recirculación:</strong> Reutilización de aguas de proceso</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-green-600">→</span>
                                    <span><strong>Tecnologías eficientes:</strong> Equipos de bajo consumo (grifería, WC)</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-green-600">→</span>
                                    <span><strong>Captación pluvial:</strong> Aprovechamiento de aguas lluvias</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* METAS RECOMENDADAS */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-300 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-900 mb-3">Metas de reducción recomendadas</h4>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                        <div className="p-2 bg-white rounded border border-blue-200 text-center">
                            <p className="font-bold text-blue-700">Corto plazo (2025)</p>
                            <p className="text-2xl font-bold text-blue-800 my-1">-10%</p>
                            <p className="text-slate-600">Optimización inmediata</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-blue-200 text-center">
                            <p className="font-bold text-blue-700">Mediano plazo (2027)</p>
                            <p className="text-2xl font-bold text-blue-800 my-1">-25%</p>
                            <p className="text-slate-600">Infraestructura eficiente</p>
                        </div>
                        <div className="p-2 bg-white rounded border border-blue-200 text-center">
                            <p className="font-bold text-blue-700">Largo plazo (2030)</p>
                            <p className="text-2xl font-bold text-blue-800 my-1">-40%</p>
                            <p className="text-slate-600">Economía circular del agua</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/*               PÁGINA 6 - GESTIÓN DE RESIDUOS              */}
            {/* ========================================================= */}
            <section
                className="pdf-page avoid-break"
                style={{ minHeight: "1120px", padding: "56px 72px", position: "relative" }}
            >
                <HeaderSection
                    title="Gestión de residuos y Ley REP"
                    desc="Análisis de generación, valorización y cumplimiento de metas de responsabilidad extendida del productor."
                    page={6}
                />

                {/* KPIs PRINCIPALES - 3 COLUMNAS */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <CardKPI
                        title="Residuos totales"
                        color="lime"
                        value={`${formatNumber(residuosTotales, 0)} kg`}
                        desc="Cantidad total generada en el período"
                    />

                    <CardKPI
                        title="Residuos reciclados"
                        color="emerald"
                        value={`${formatNumber(residuosReciclados, 0)} kg`}
                        desc="Cantidad valorizada mediante reciclaje"
                    />

                    <CardKPI
                        title="Tasa de valorización"
                        color="green"
                        value={`${formatPorcentaje(tasaValorizacion)}%`}
                        desc="Porcentaje valorizado sobre el total"
                    />
                </div>

                {/* ANÁLISIS DE DESEMPEÑO - ANCHO COMPLETO */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm mb-6">
                    <h3 className="text-sm font-semibold mb-3">Análisis de desempeño</h3>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {interpretarResiduos(ev?.wasteData, ev?.scores?.wasteScore)}
                    </p>

                    {/* Métricas adicionales */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                        <div className="text-center p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-600 mb-1">Residuos no valorizados</p>
                            <p className="text-2xl font-bold text-red-600">
                                {formatNumber(residuosNoValorizados, 0)} kg
                            </p>
                            <p className="text-[10px] text-slate-500">Enviados a disposición final</p>
                        </div>

                        <div className="text-center p-3 bg-green-50 rounded">
                            <p className="text-xs text-slate-600 mb-1">Potencial de mejora</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatPorcentaje(potencialMejora)}%
                            </p>
                            <p className="text-[10px] text-slate-500">Margen para incrementar valorización</p>
                        </div>

                        <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-xs text-slate-600 mb-1">Meta recomendada 2025</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.min(parseFloat(calcularPorcentajeReciclaje(ev?.wasteData)) + 20, 80).toFixed(0)}%
                            </p>
                            <p className="text-[10px] text-slate-500">Valorización objetivo</p>
                        </div>
                    </div>
                </div>

                {/* RECOMENDACIONES Y CUMPLIMIENTO REP */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Recomendaciones */}
                    <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                        <h4 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Acciones prioritarias
                        </h4>
                        <ul className="text-xs text-emerald-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">1.</span>
                                <span><strong>Segregación en origen:</strong> Separar residuos por tipo desde la fuente de generación</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">2.</span>
                                <span><strong>Alianzas estratégicas:</strong> Establecer convenios con gestores certificados</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">3.</span>
                                <span><strong>Capacitación continua:</strong> Formar al personal en manejo responsable</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">4.</span>
                                <span><strong>Economía circular:</strong> Evaluar oportunidades de reutilización y upcycling</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cumplimiento REP */}
                    <div className="p-5 bg-blue-50 border-2 border-blue-300 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Responsabilidad Extendida (REP)
                        </h4>
                        <p className="text-xs text-slate-700 mb-3">
                            La Ley 20.920 establece metas de valorización para productos prioritarios.
                            El cumplimiento requiere:
                        </p>
                        <div className="space-y-2 text-xs">
                            <div className="p-2 bg-white rounded border border-blue-200">
                                <p className="font-bold text-blue-800">Registro y trazabilidad</p>
                                <p className="text-slate-600 text-[10px]">Documentar valorizaciones con gestores autorizados</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-blue-200">
                                <p className="font-bold text-blue-800">Metas progresivas</p>
                                <p className="text-slate-600 text-[10px]">Incremento anual según decreto sectorial</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-blue-200">
                                <p className="font-bold text-blue-800">Reporte anual</p>
                                <p className="text-slate-600 text-[10px]">Declaración al Ministerio del Medio Ambiente</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>







            {/* ========================================================= */}
            {/*      PÁGINA 7 - RESPONSABILIDAD EXTENDIDA (REP)          */}
            {/* ========================================================= */}

            {(() => {
                const productosREP = ev?.productosREP || [];
                const totalGenerado = productosREP.reduce((sum, p) => sum + (p.cantidadGenerada || 0), 0);
                const totalValorizado = productosREP.reduce((sum, p) => sum + (p.cantidadValorizada || 0), 0);
                const porcentajePromedio = totalGenerado > 0
                    ? ((totalValorizado / totalGenerado) * 100).toFixed(1)
                    : 0;
                const anio = ev?.period?.includes('2024') ? 2024 : 2024;

                // Dividir productos: máximo 3 por página
                const PRODUCTOS_POR_PAGINA = 3;
                const productosPage1 = productosREP.slice(0, PRODUCTOS_POR_PAGINA);
                const productosRestantes = productosREP.slice(PRODUCTOS_POR_PAGINA);
                const necesitaSegundaPagina = productosRestantes.length > 0;

                return (
                    <>
                        {/* ========== PÁGINA 7 - PARTE 1 ========== */}
                        <section
                            className="pdf-page"
                            style={{
                                minHeight: "1120px",
                                maxHeight: "1120px",
                                padding: "40px 60px",
                                paddingBottom: "80px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <HeaderSection
                                title="Responsabilidad Extendida del Productor (REP)"
                                desc="Revisión del cumplimiento, valorización y obligaciones normativas."
                                page={7}
                            />

                            {/* Estado de cumplimiento - COMPACTO */}
                            <div className="mb-4 flex-shrink-0">
                                <h3 className="text-sm font-semibold mb-2 text-slate-800">
                                    Estado de cumplimiento
                                </h3>

                                <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                                    Para el año {anio}, el porcentaje promedio de valorización es {porcentajePromedio}%.
                                    Considerando {totalGenerado.toLocaleString('es-CL')} kg de residuos,
                                    la gestión REP requiere seguimiento anual.
                                </p>

                                {/* Tabla de productos - COMPACTA */}
                                {productosREP.length > 0 && (
                                    <div className="overflow-hidden rounded-lg border border-slate-200 mb-3">
                                        <table className="w-full text-xs">
                                            <thead className="bg-slate-100">
                                                <tr>
                                                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-slate-700">
                                                        Producto
                                                    </th>
                                                    <th className="px-3 py-1.5 text-center text-[10px] font-semibold text-slate-700">
                                                        Año
                                                    </th>
                                                    <th className="px-3 py-1.5 text-right text-[10px] font-semibold text-slate-700">
                                                        Valorización
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-200">
                                                {productosREP.map((producto, idx) => {
                                                    const porcentaje = producto.cantidadGenerada > 0
                                                        ? ((producto.cantidadValorizada / producto.cantidadGenerada) * 100).toFixed(1)
                                                        : 0;

                                                    return (
                                                        <tr key={idx} className="hover:bg-slate-50">
                                                            <td className="px-3 py-1.5 text-[10px] text-slate-800">
                                                                {producto.categoria || producto.producto || 'Sin categoría'}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-center text-[10px] text-slate-600">
                                                                {producto.anio || anio}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-right text-[10px] font-semibold text-emerald-700">
                                                                {porcentaje}%
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Gráfico de progreso - PRIMEROS 3 PRODUCTOS */}
                            <div className="flex-1 overflow-hidden mb-3">
                                <h3 className="text-sm font-semibold mb-3 text-slate-800">
                                    Progreso de valorización por producto prioritario
                                    {necesitaSegundaPagina && <span className="text-xs text-slate-500"> (1/2)</span>}
                                </h3>
                                <REPProgressBar
                                    productosREP={productosPage1}
                                    anioEvaluacion={anio}
                                />
                            </div>

                            {/* Productos prioritarios REP - Solo si NO hay segunda página */}
                            {!necesitaSegundaPagina && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex-shrink-0">

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                            <h4>Productos prioritarios REP</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                            <span className="text-[10px] text-amber-800">• Envases y embalajes</span>
                                            <span className="text-[10px] text-amber-800">• Neumáticos</span>
                                            <span className="text-[10px] text-amber-800">• Aparatos eléctricos</span>
                                            <span className="text-[10px] text-amber-800">• Aceites lubricantes</span>
                                            <span className="text-[10px] text-amber-800">• Pilas y baterías</span>
                                            <span className="text-[10px] text-amber-800">• Diarios y periódicos</span>
                                        </div>
                                    </div>

                                </div>
                            )}

                        </section>

                        {/* ========== PÁGINA 7B - CONTINUACIÓN (Solo si hay más de 3 productos) ========== */}
                        {necesitaSegundaPagina && (
                            <section
                                className="pdf-page"
                                style={{
                                    minHeight: "1120px",
                                    maxHeight: "1120px",
                                    padding: "40px 60px",
                                    paddingBottom: "80px",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <HeaderSection
                                    title="Responsabilidad Extendida del Productor (REP) - Continuación"
                                    desc="Productos prioritarios adicionales y lista normativa."
                                    page="7B"
                                />

                                {/* Gráfico de progreso - PRODUCTOS RESTANTES */}
                                <div className="flex-1 overflow-hidden mb-3">
                                    <h3 className="text-sm font-semibold mb-3 text-slate-800">
                                        Progreso de valorización (continuación) (2/2)
                                    </h3>
                                    <REPProgressBar
                                        productosREP={productosRestantes}
                                        anioEvaluacion={anio}
                                        ocultarResumen={true}  // No mostrar resumen duplicado
                                    />
                                </div>

                                {/* Productos prioritarios REP */}
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex-shrink-0">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">⚠️</span>
                                        <div className="flex-1">
                                            <h4 className="text-xs font-semibold text-amber-900 mb-1.5">
                                                Productos prioritarios REP
                                            </h4>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                                <span className="text-[10px] text-amber-800">• Envases y embalajes</span>
                                                <span className="text-[10px] text-amber-800">• Neumáticos</span>
                                                <span className="text-[10px] text-amber-800">• Aparatos eléctricos</span>
                                                <span className="text-[10px] text-amber-800">• Aceites lubricantes</span>
                                                <span className="text-[10px] text-amber-800">• Pilas y baterías</span>
                                                <span className="text-[10px] text-amber-800">• Diarios y periódicos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </section>
                        )}
                    </>
                );
            })()}

            {/* ========================================================= */}
            {/*         PÁGINA 8 - ANÁLISIS ESTRATÉGICO                  */}
            {/* ========================================================= */}
            {(() => {

                const consumoAguaMes = ev?.agua?.consumoTotal || 0;
                const waterScore = ev?.agua?.puntuacion || 0;
                // Importar funciones de análisis
                const fortalezas = identificarFortalezas(ev);
                const oportunidades = identificarOportunidades(ev);

                return (
                    <section
                        className="pdf-page"
                        style={{
                            minHeight: "1120px",
                            maxHeight: "1120px",
                            padding: "40px 60px",
                            paddingBottom: "80px",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <HeaderSection
                            title="Análisis estratégico del desempeño ambiental"
                            desc="Identificación de fortalezas, oportunidades de mejora y análisis de riesgos."
                            page={8}
                        />

                        {/* SECCIÓN 1: FORTALEZAS */}
                        <div className="mb-4 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Fortalezas identificadas
                                </h3>
                            </div>

                            {fortalezas.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {fortalezas.slice(0, 4).map((fortaleza, idx) => (
                                        <FortalezaCard
                                            key={idx}
                                            area={fortaleza.area}
                                            puntaje={fortaleza.puntaje}
                                            dato={fortaleza.dato}
                                            destaque={fortaleza.destaque}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <p className="text-xs text-slate-600">
                                        No se identificaron fortalezas destacadas (puntaje {'≥'} 85) en esta evaluación.
                                        Se recomienda enfocar esfuerzos en mejorar las áreas críticas.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 2: OPORTUNIDADES DE MEJORA */}
                        <div className="mb-4 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Oportunidades de mejora
                                </h3>
                            </div>

                            {oportunidades.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {oportunidades.slice(0, 4).map((oportunidad, idx) => (
                                        <OportunidadCard
                                            key={idx}
                                            area={oportunidad.area}
                                            puntaje={oportunidad.puntaje}
                                            gap={oportunidad.gap}
                                            causa={oportunidad.causa}
                                            accionClave={oportunidad.accionClave}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <p className="text-xs text-emerald-800">
                                        <CheckCircle className="w-4 h-4 inline mr-1" />
                                        Excelente desempeño en todas las áreas evaluadas.
                                        Se recomienda mantener el nivel actual y explorar certificaciones avanzadas.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 3: ANÁLISIS DE RIESGOS */}
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Análisis de riesgos
                                </h3>
                            </div>

                            <div className="space-y-2">
                                {/* Riesgo 1: Cumplimiento REP */}
                                {(() => {
                                    const productosREP = ev?.productosREP || [];
                                    const productosBajoMeta = productosREP.filter(p => {
                                        const tasa = p.cantidadGenerada > 0
                                            ? (p.cantidadValorizada / p.cantidadGenerada) * 100
                                            : 0;
                                        return tasa < 50;
                                    });

                                    if (productosBajoMeta.length > 0) {
                                        return (
                                            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-red-900 mb-1">
                                                            Riesgo de incumplimiento REP
                                                        </p>
                                                        <p className="text-[10px] text-red-800">
                                                            {productosBajoMeta.length} producto(s) bajo meta de valorización.
                                                            Exposición a multas y sanciones de la Superintendencia del Medio Ambiente (SMA).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Riesgo 2: Emisiones crecientes */}
                                {(() => {
                                    const carbonScore = ev?.scores?.carbonScore || 100;
                                    if (carbonScore < 60) {
                                        return (
                                            <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-orange-900 mb-1">
                                                            Alta huella de carbono
                                                        </p>
                                                        <p className="text-[10px] text-orange-800">
                                                            Puntaje de carbono bajo ({carbonScore}/100).
                                                            Riesgo de no cumplir futuros compromisos climáticos y pérdida de competitividad.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Riesgo 3: Gestión de residuos */}
                                {(() => {
                                    const wasteScore = ev?.scores?.wasteScore || 100;

                                    if (wasteScore < 60 || tasaValorizacion < 50) {
                                        return (
                                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                                                <div className="flex items-start gap-2">
                                                    <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-yellow-900 mb-1">
                                                            Baja valorización de residuos
                                                        </p>
                                                        <p className="text-[10px] text-yellow-800">
                                                            Solo {tasaValorizacion.toFixed(1).replace('.', ',')}% de residuos valorizados.
                                                            Costos de disposición elevados y pérdida de oportunidades de economía circular.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Si no hay riesgos críticos */}
                                {(() => {
                                    const productosREP = ev?.productosREP || [];
                                    const productosBajoMeta = productosREP.filter(p => {
                                        const tasa = p.cantidadGenerada > 0
                                            ? (p.cantidadValorizada / p.cantidadGenerada) * 100
                                            : 0;
                                        return tasa < 50;
                                    });
                                    const carbonScore = ev?.scores?.carbonScore || 100;
                                    const wasteScore = ev?.scores?.wasteScore || 100;

                                    const sinRiesgos = productosBajoMeta.length === 0 &&
                                        carbonScore >= 60 &&
                                        wasteScore >= 60;

                                    if (sinRiesgos) {
                                        return (
                                            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-green-900 mb-1">
                                                            Riesgos controlados
                                                        </p>
                                                        <p className="text-[10px] text-green-800">
                                                            No se identificaron riesgos críticos en esta evaluación.
                                                            Se recomienda mantener monitoreo continuo y prepararse para regulaciones futuras.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>

                        {/* Nota al pie */}
                        <div className="mt-auto pt-3 border-t border-slate-200 flex-shrink-0">
                            <p className="text-[9px] text-slate-500 italic">
                                El análisis estratégico se basa en los datos proporcionados en esta evaluación.
                                Se recomienda validar con el equipo directivo antes de implementar acciones.
                            </p>
                        </div>

                    </section>
                );
            })()}

            {/* ========================================================= */}
            {/*         PÁGINA 9 - PLAN DE ACCIÓN PRIORIZADO (PARTE 1)   */}
            {/* ========================================================= */}
            {(() => {
                // Generar recomendaciones priorizadas
                const recomendaciones = generarRecomendacionesPriorizadas(ev);

                const altaPrioridad = recomendaciones.filter(r => r.prioridad === 'Alta');
                const mediaPrioridad = recomendaciones.filter(r => r.prioridad === 'Media');


                // Dividir: máximo 2 recomendaciones por página
                const recsPage1 = altaPrioridad.slice(0, 2);
                const recsRestantes = [
                    ...altaPrioridad.slice(2),
                    ...mediaPrioridad
                ];
                const necesitaSegundaPagina = recsRestantes.length > 0;

                return (
                    <>
                        {/* ========== PÁGINA 9 - PARTE 1 ========== */}
                        <section
                            className="pdf-page"
                            style={{
                                minHeight: "1120px",
                                maxHeight: "1120px",
                                padding: "40px 60px",
                                paddingBottom: "80px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <HeaderSection
                                title="Plan de acción priorizado"
                                desc="Recomendaciones estratégicas ordenadas por impacto y factibilidad de implementación."
                                page={9}
                            />

                            {/* RECOMENDACIONES ALTA PRIORIDAD - PRIMERAS 2 */}
                            {recsPage1.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Recomendaciones de alta prioridad
                                        </h3>
                                        <BadgePlazoSVG
                                            texto="Implementar en 0-6 meses"
                                            bgColor="#fee2e2"
                                            textColor="#991b1b"
                                        />
                                        {necesitaSegundaPagina && (
                                            <span className="ml-auto text-[9px] text-slate-500">(1/2)</span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {recsPage1.map((rec, idx) => (
                                            <RecomendacionMejorada
                                                key={rec.id}
                                                rec={rec}
                                                numero={idx + 1}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Nota metodológica */}
                            <div className="mt-auto pt-3 border-t border-slate-200 flex-shrink-0">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-[9px] text-slate-500 italic">
                                        Las recomendaciones están basadas en el análisis de sus datos y mejores prácticas del sector.
                                    </p>
                                </div>
                            </div>
                        </section >

                        {/* ========== PÁGINA 9B - CONTINUACIÓN (Solo si hay más recomendaciones) ========== */}
                        {
                            necesitaSegundaPagina && (
                                <section
                                    className="pdf-page"
                                    style={{
                                        minHeight: "1120px",
                                        maxHeight: "1120px",
                                        padding: "40px 60px",
                                        paddingBottom: "80px",
                                        position: "relative",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                >
                                    <HeaderSection
                                        title="Plan de acción priorizado"
                                        desc="Recomendaciones adicionales para implementación escalonada."
                                        page="9B"
                                    />

                                    {/* ALTA PRIORIDAD RESTANTES (si hay) */}
                                    {altaPrioridad.slice(2).length > 0 && (
                                        <div className="mb-4 flex-shrink-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                                    <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Alta prioridad
                                                </h3>
                                                <BadgePlazoSVG
                                                    texto="Implementar en 0-6 meses"
                                                    bgColor="#fee2e2"
                                                    textColor="#991b1b"
                                                />
                                                <span className="ml-auto text-[9px] text-slate-500">(2/2)</span>
                                            </div>

                                            <div className="space-y-3">
                                                {altaPrioridad.slice(2).map((rec, idx) => (
                                                    <RecomendacionMejorada
                                                        key={rec.id}
                                                        rec={rec}
                                                        numero={recsPage1.length + idx + 1}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* RECOMENDACIONES MEDIA PRIORIDAD */}
                                    {mediaPrioridad.length > 0 && (
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-white" strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Recomendaciones de media prioridad
                                                </h3>
                                                <BadgePlazoSVG
                                                    texto="6-18 meses"
                                                    bgColor="#fef3c7"
                                                    textColor="#78350f"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                {mediaPrioridad.slice(0, 2).map((rec, idx) => (
                                                    <RecomendacionMejorada
                                                        key={rec.id}
                                                        rec={rec}
                                                        numero={altaPrioridad.length + idx + 1}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nota metodológica */}
                                    <div className="mt-auto pt-3 border-t border-slate-200 flex-shrink-0">
                                        <div className="flex items-start gap-2">
                                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-[9px] text-slate-500 italic">
                                                Los presupuestos y plazos son estimaciones referenciales que deben ajustarse según
                                                la realidad específica de su organización.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )
                        }
                    </>
                );
            })()}

            {/* ========================================================= */}
            {/*         PÁGINA 10 - ROADMAP Y SEGUIMIENTO                */}
            {/* ========================================================= */}
            {
                (() => {
                    // Generar datos
                    const recomendaciones = generarRecomendacionesPriorizadas(ev);
                    const roadmap = generarRoadmap(recomendaciones);
                    const quickWins = identificarQuickWins(recomendaciones);

                    return (
                        <section
                            className="pdf-page"
                            style={{
                                minHeight: "1120px",
                                maxHeight: "1120px",
                                padding: "40px 60px",
                                paddingBottom: "80px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <HeaderSection
                                title="Hoja de ruta y seguimiento"
                                desc="Cronograma de implementación, acciones rápidas y KPIs de seguimiento."
                                page={10}
                            />

                            {/* SECCIÓN 1: QUICK WINS */}
                            {quickWins.length > 0 && (
                                <div className="mb-4 flex-shrink-0">

                                    <QuickWinsSection quickWins={quickWins} />
                                </div>
                            )}

                            {/* SECCIÓN 2: ROADMAP TRIMESTRAL */}
                            <div className="mb-4 flex-shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Roadmap de implementación 2025
                                    </h3>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                                    <RoadmapTimeline roadmap={roadmap} />
                                </div>
                            </div>

                            {/* SECCIÓN 3: KPIs DE SEGUIMIENTO */}
                            <div className="mb-4 flex-shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        KPIs de seguimiento recomendados
                                    </h3>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {/* KPI 1: Carbono */}
                                    <div className="p-3 bg-white border-2 border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-800">Carbono</h4>
                                        </div>
                                        <ul className="space-y-1">
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-emerald-600">•</span>
                                                <span>tCO₂e mensuales</span>
                                            </li>
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-emerald-600">•</span>
                                                <span>kWh consumidos</span>
                                            </li>
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-emerald-600">•</span>
                                                <span>L combustible/mes</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* KPI 2: Residuos */}
                                    <div className="p-3 bg-white border-2 border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <Recycle className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-800">Residuos</h4>
                                        </div>
                                        <ul className="space-y-1">
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-amber-600">•</span>
                                                <span>% Valorización</span>
                                            </li>
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-amber-600">•</span>
                                                <span>kg reciclados/mes</span>
                                            </li>
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-amber-600">•</span>
                                                <span>Cumplimiento REP</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* KPI 3: Agua */}
                                    <div className="p-3 bg-white border-2 border-slate-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Droplet className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-800">Agua</h4>
                                        </div>
                                        <ul className="space-y-1">
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-blue-600">•</span>
                                                <span>L/mes consumidos</span>
                                            </li>
                                            <li className="text-[9px] text-slate-600 flex items-start gap-1">
                                                <span className="text-blue-600">•</span>
                                                <span>Intensidad hídrica</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                                    <p className="text-[10px] text-purple-800">
                                        <strong>Frecuencia sugerida:</strong> Medición mensual con revisión trimestral del comité ambiental.
                                    </p>
                                </div>
                            </div>

                            {/* SECCIÓN 4: PRÓXIMOS PASOS INMEDIATOS */}
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Próximos pasos inmediatos
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {/* Paso 1 */}
                                    <div className="flex gap-2 p-2 bg-white border-l-4 border-red-500 rounded-r-lg shadow-sm">
                                        <CirculoNumeroSVG
                                            numero={1}
                                            size={24}
                                            bgColor="#dc2626"
                                            fontSize={12}
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-slate-800 mb-0.5">
                                                Asignar responsables
                                            </h4>
                                            <p className="text-[9px] text-slate-600 leading-tight">
                                                Designar líderes para cada acción prioritaria y definir roles del equipo.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Paso 2 */}
                                    <div className="flex gap-2 p-2 bg-white border-l-4 border-orange-500 rounded-r-lg shadow-sm">
                                        <CirculoNumeroSVG
                                            numero={2}
                                            size={24}
                                            bgColor="#ea580c"
                                            fontSize={12}
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-slate-800 mb-0.5">
                                                Aprobar presupuesto
                                            </h4>
                                            <p className="text-[9px] text-slate-600 leading-tight">
                                                Presentar plan de inversión a dirección para aprobación financiera.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Paso 3 */}
                                    <div className="flex gap-2 p-2 bg-white border-l-4 border-yellow-500 rounded-r-lg shadow-sm">
                                        <CirculoNumeroSVG
                                            numero={3}
                                            size={24}
                                            bgColor="#ca8a04"
                                            fontSize={12}
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-slate-800 mb-0.5">
                                                Kick-off del proyecto
                                            </h4>
                                            <p className="text-[9px] text-slate-600 leading-tight">
                                                Reunión inicial con equipo, definición de hitos y cronograma detallado.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Paso 4 */}
                                    <div className="flex gap-2 p-2 bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm">
                                        <CirculoNumeroSVG
                                            numero={4}
                                            size={24}
                                            bgColor="#16a34a"
                                            fontSize={12}
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-bold text-slate-800 mb-0.5">
                                                Programar seguimiento
                                            </h4>
                                            <p className="text-[9px] text-slate-600 leading-tight">
                                                Agendar próxima evaluación en 6 meses para medir progreso.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cierre motivacional */}
                            <div className="mt-auto pt-4 border-t-2 border-emerald-500 flex-shrink-0">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-emerald-900 mb-1">
                                            ¡Es momento de actuar!
                                        </p>
                                        <p className="text-[10px] text-emerald-800 leading-relaxed">
                                            Este plan de acción es su guía para mejorar el desempeño ambiental.
                                            La implementación gradual y el seguimiento constante son clave para el éxito.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </section>
                    );
                })()
            }


        </div >
    );
}


/* ===================================================================== */
/*                          COMPONENTES AUXILIARES                       */
/* ===================================================================== */

function InfoBox({ label, value, highlight }) {
    return (
        <div className={`border rounded-xl p-3 ${highlight ? "border-emerald-600/40" : "border-slate-200"}`}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}

function HeaderSection({ title, desc, page }) {
    return (
        <>
            <header className="mb-10">
                <h2 className="text-2xl font-semibold mb-1" style={{ letterSpacing: "0.3px" }}>{title}</h2>
                <p className="text-xs text-slate-500">{desc}</p>
                <div className="h-[1px] bg-slate-200 w-full mt-4" />
            </header>
        </>
    );
}

function CardKPI({ title, color, value, desc }) {
    return (
        <div className={`border border-${color}-200 rounded-xl p-5 bg-${color}-50/60 shadow-sm`}>
            <p className={`text-[10px] uppercase tracking-[0.18em] text-${color}-700 font-semibold mb-1`}>
                {title}
            </p>
            <p className={`text-3xl font-semibold text-${color}-900`}>{value}</p>
            <p className="text-[11px] text-slate-600 mt-1">{desc}</p>
        </div>
    );
}

function ChartBox({ title, desc, img, size, children }) {
    return (
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 shadow-sm">
            <h3 className="text-sm font-semibold mb-1">{title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-1">{desc}</p>

            <div className="w-full flex justify-center mt-1">
                {children ? (
                    // Si hay children, renderizar el componente
                    children
                ) : img ? (
                    // Si no hay children pero hay img, mostrar imagen
                    <img
                        src={img}
                        style={{ width: size, height: size, objectFit: "contain" }}
                        alt={title}
                    />
                ) : (
                    // Si no hay nada, mostrar mensaje de carga
                    <p className="text-xs text-slate-400 italic">Cargando gráfico…</p>
                )}
            </div>
        </div>
    );
}

function ScoreGrid({ scores }) {
    return (
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">

            <ScoreCard title="Carbono" color="emerald" value={scores?.carbonScore ?? 0} />
            <ScoreCard title="Agua" color="sky" value={scores?.waterScore ?? 0} />
            <ScoreCard title="Residuos" color="lime" value={scores?.wasteScore ?? 0} />

        </div>
    );
}

function ScoreCard({ title, color, value }) {
    return (
        <div className={`rounded-xl border border-${color}-200 bg-${color}-50/50 px-3 py-4`}>
            <p className={`text-[10px] uppercase tracking-[0.16em] text-${color}-700`}>{title}</p>
            <p className={`text-xl font-semibold text-${color}-900 mt-1`}>{value}</p>
        </div>
    );
}

function InterpretacionCarbono({ emisiones, texto }) {
    return (
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Interpretación de las emisiones</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{texto}</p>

            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <KPIBox title="Total" value={emisiones.totalTon.toFixed(2)} unit="tCO₂e" />
                <KPIBox
                    title="A1"
                    value={(emisiones.alcance1 / 1000).toFixed(2)}
                    unit={`tCO₂e (${((emisiones.alcance1 / emisiones.totalKg) * 100).toFixed(1)}%)`}
                    color="emerald"
                />
                <KPIBox
                    title="A2"
                    value={(emisiones.alcance2 / 1000).toFixed(2)}
                    unit={`tCO₂e (${((emisiones.alcance2 / emisiones.totalKg) * 100).toFixed(1)}%)`}
                    color="blue"
                />
            </div>
        </div>
    );
}

function KPIBox({ title, value, unit, color }) {
    const border = color ? `border-${color}-200` : "border-slate-200";
    const bg = color ? `bg-${color}-50` : "bg-slate-50";
    const text = color ? `text-${color}-900` : "text-slate-900";

    return (
        <div className={`rounded-xl ${border} ${bg} px-3 py-4`}>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">{title}</p>
            <p className={`text-xl font-semibold ${text} mt-1`}>{value}</p>
            <p className="text-[10px] text-slate-500">{unit}</p>
        </div>
    );
}


// Funciones auxiliares para interpretación
function interpretarAgua(waterData, intensidadHidrica) {
    const consumo = waterData?.consumoMensual || 0;

    if (consumo === 0) {
        return "No se registra consumo de agua para el período evaluado. Se recomienda verificar la calidad de los datos ingresados.";
    }

    let textoIntensidad = "";

    if (intensidadHidrica?.valor && intensidadHidrica?.unidad) {
        const valor = intensidadHidrica.valor.toFixed(2);
        const unidad = intensidadHidrica.unidad;

        textoIntensidad = ` La intensidad hídrica calculada es de ${valor} ${unidad}.`;

        // Interpretación según tipo de intensidad
        if (unidad.includes("persona")) {
            if (intensidadHidrica.valor > 80) {
                textoIntensidad += " Este valor es alto, sugiriendo oportunidades de mejora en eficiencia.";
            } else if (intensidadHidrica.valor > 40) {
                textoIntensidad += " Este valor es moderado, con margen para optimización.";
            } else {
                textoIntensidad += " Este valor refleja un uso eficiente del recurso hídrico.";
            }
        } else {
            // Por unidad de producción
            if (intensidadHidrica.valor > 50) {
                textoIntensidad += " Este valor es alto, sugiriendo oportunidades de mejora en eficiencia.";
            } else if (intensidadHidrica.valor > 20) {
                textoIntensidad += " Este valor es moderado, con margen para optimización.";
            } else {
                textoIntensidad += " Este valor refleja un uso eficiente del recurso hídrico.";
            }
        }
    } else {
        textoIntensidad = " No se ha calculado la intensidad hídrica. Se recomienda definir una unidad de normalización (producción o personas) para facilitar el seguimiento y comparación.";
    }

    return `El consumo mensual registrado es de ${consumo.toLocaleString('es-CL')} litros.${textoIntensidad} Se recomienda establecer indicadores de consumo y monitorear tendencias mensuales.`;
}

function interpretarResiduos(wasteData, wasteScore) {
    const total = wasteData?.residuosTotales || 0;
    const reciclados = wasteData?.residuosReciclados || 0;

    if (total === 0) {
        return "No se registra generación de residuos para el período evaluado. Se recomienda verificar la calidad de los datos ingresados.";
    }

    const porcentaje = total > 0 ? ((reciclados / total) * 100).toFixed(1) : 0;

    let nivel = "";
    if (wasteScore >= 80) {
        nivel = "excelente, con una alta tasa de valorización";
    } else if (wasteScore >= 60) {
        nivel = "intermedio, con oportunidades de mejora en segregación y valorización";
    } else {
        nivel = "bajo, requiriendo acciones urgentes para mejorar la gestión de residuos";
    }

    return `Se generaron ${total.toLocaleString('es-CL')} kg de residuos, de los cuales ${reciclados.toLocaleString('es-CL')} kg fueron reciclados (${porcentaje}%). El score de ${wasteScore} puntos refleja un desempeño ${nivel}. Se recomienda implementar un sistema de gestión integral de residuos.`;
}

function calcularPorcentajeReciclaje(wasteData) {
    const total = wasteData?.residuosTotales || 0;
    const reciclados = wasteData?.residuosReciclados || 0;

    if (total === 0) return "0.0";

    return ((reciclados / total) * 100).toFixed(1);
}