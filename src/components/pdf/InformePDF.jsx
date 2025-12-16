// src/components/pdf/InformePDF.jsx
import React from "react";
import { useEffect, useState } from "react";
import { usePdfPageNumbers } from "../../hooks/usePDFPageNumbers";
import RadarChart from './RadarChart';
import CarbonStackedChart from './CarbonStackedChart';
import REPProgressBar from './REPProgressBar';

import {
    TrendingUp, AlertTriangle, Shield, AlertCircle, Info, CheckCircle, Target, Zap, Clock,
    Rocket, Calendar, BarChart3, Leaf, Recycle, Droplet, ArrowRight, Circle, DollarSign, Lightbulb
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
import { MatrizPriorizacionAsImage } from './ImageRenderedComponents';
import { QuickWinsAsImage } from './ImageRenderedComponents';
import { ProximosPasosWithImages } from './ImageRenderedComponents';


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
                        value={`${emisiones.totalTon.toFixed(2)} tCO₂e`}
                        desc="Emisiones totales considerando combustibles (A1) y electricidad (A2)."
                    />

                    <CardKPI
                        title="Consumo de agua"
                        color="sky"
                        value={`${ev?.waterData?.consumoMensual?.toLocaleString("es-CL") ?? "–"} L/mes`}
                        desc="Consumo mensual promedio declarado."
                    />

                    <CardKPI
                        title="Residuos generados"
                        color="lime"
                        value={`${totalResiduos.toLocaleString("es-CL")} kg/año`}
                        desc="Total de residuos sólidos declarados."
                    />

                    <CardKPI
                        title="Valorización REP"
                        color="blue"
                        value={repUltimo ? `${repPct.toFixed(1)}%` : "–"}
                        desc="Porcentaje valorizado según último registro."
                    />

                </div>

                {/* Interpretación global */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/80 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        Interpretación general
                    </p>
                    <p className="text-sm text-slate-800 leading-relaxed">
                        {textoGlobal}
                    </p>
                </div>

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

                <div className="grid grid-cols-[1.1fr_1.2fr] gap-10">

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
                        {/* ⬇️⬇️⬇️ AGREGAR GRÁFICO ⬇️⬇️⬇️ */}
                        <CarbonStackedChart
                            alcance1={emisiones?.alcance1 || 0}
                            alcance2={emisiones?.alcance2 || 0}
                        />
                        {/* ⬆️⬆️⬆️ HASTA AQUÍ ⬆️⬆️⬆️ */}
                    </ChartBox>

                    {/* INTERPRETACIÓN */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold mb-3">
                            Interpretación de las emisiones
                        </h3>
                        <p className="text-sm leading-relaxed mb-4">{textoCarbono}</p>

                        {/* KPIs */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">
                                    TOTAL
                                </p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {emisiones?.totalTon?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-[10px] text-slate-500">tCO₂e</p>
                            </div>

                            <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <p className="text-[10px] uppercase tracking-wider text-emerald-700 mb-1">
                                    A1
                                </p>
                                <p className="text-2xl font-bold text-emerald-900">
                                    {emisiones?.alcance1?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-[10px] text-emerald-600">
                                    tCO₂e ({((emisiones?.alcance1 / (emisiones?.alcance1 + emisiones?.alcance2)) * 100).toFixed(1)}%)
                                </p>
                            </div>

                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-[10px] uppercase tracking-wider text-blue-700 mb-1">
                                    A2
                                </p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {emisiones?.alcance2?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-[10px] text-blue-600">
                                    tCO₂e ({((emisiones?.alcance2 / (emisiones?.alcance1 + emisiones?.alcance2)) * 100).toFixed(1)}%)
                                </p>
                            </div>
                        </div>
                    </div>


                </div>

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
                            value={`${(ev?.waterData?.consumoMensual || 0).toLocaleString('es-CL')} L`}
                            desc="Volumen total de agua consumida en el período evaluado"
                        />

                        <CardKPI
                            title="Intensidad hídrica"
                            color="blue"
                            value={
                                ev?.intensidadHidrica?.valor
                                    ? `${ev.intensidadHidrica.valor.toFixed(2)} ${ev.intensidadHidrica.unidad}`
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


                <div className="grid grid-cols-2 gap-10 mb-8 shadow-sm no-split">

                    {/* KPIs DE RESIDUOS */}
                    <div className="space-y-6">
                        <CardKPI
                            title="Residuos totales"
                            color="lime"
                            value={`${(totalResiduos || 0).toLocaleString('es-CL')} kg`}
                            desc="Cantidad total de residuos generados en el período"
                        />

                        <CardKPI
                            title="Residuos reciclados"
                            color="emerald"
                            value={`${(ev?.wasteData?.residuosReciclados || 0).toLocaleString('es-CL')} kg`}
                            desc="Cantidad de residuos valorizados mediante reciclaje"
                        />

                        <CardKPI
                            title="Porcentaje de reciclaje"
                            color="green"
                            value={`${calcularPorcentajeReciclaje(ev?.wasteData)}%`}
                            desc="Tasa de valorización sobre el total generado"
                        />
                    </div>

                    {/* INTERPRETACIÓN */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm shadow-sm no-split">
                        <h3 className="text-sm font-semibold mb-2">Interpretación</h3>
                        <p className="text-sm text-slate-700 leading-relaxed mb-4">
                            {interpretarResiduos(ev?.wasteData, ev?.scores?.wasteScore)}
                        </p>

                        <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                            <h4 className="text-xs font-semibold text-emerald-900 mb-2">
                                💡 Recomendaciones
                            </h4>
                            <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                                <li>Implementar segregación en origen por tipo de residuo</li>
                                <li>Establecer alianzas con gestores certificados</li>
                                <li>Capacitar al personal en manejo de residuos</li>
                                <li>Evaluar oportunidades de economía circular</li>
                                <li>Documentar y reportar valorizaciones para cumplimiento REP</li>
                            </ul>
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
                                                                {producto.producto}
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
                                    const tasaValor = ev.residuosGenerados > 0
                                        ? (ev.residuosValorizados / ev.residuosGenerados) * 100
                                        : 0;

                                    if (wasteScore < 60 || tasaValor < 50) {
                                        return (
                                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                                                <div className="flex items-start gap-2">
                                                    <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-yellow-900 mb-1">
                                                            Baja valorización de residuos
                                                        </p>
                                                        <p className="text-[10px] text-yellow-800">
                                                            Solo {tasaValor.toFixed(1)}% de residuos valorizados.
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

                            {/* MATRIZ DE PRIORIZACIÓN */}
                            <div className="mb-4 flex-shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Criterios de priorización
                                    </h3>
                                </div>

                                <div className="grid grid-cols-[1fr_1.2fr] gap-4">
                                    {/* Explicación */}
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                        <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                                            Las recomendaciones han sido priorizadas según dos criterios principales:
                                        </p>
                                        <ul className="space-y-1.5">
                                            <li className="flex items-start gap-2 text-[10px] text-slate-600">
                                                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                                <span><strong>Impacto:</strong> Potencial de mejora en desempeño ambiental</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-[10px] text-slate-600">
                                                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                                <span><strong>Esfuerzo:</strong> Recursos y tiempo requeridos</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Matriz */}
                                    <MatrizPriorizacionAsImage recomendaciones={recomendaciones} />
                                </div>
                            </div>

                            {/* RECOMENDACIONES ALTA PRIORIDAD - PRIMERAS 2 */}
                            {recsPage1.length > 0 && (
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Recomendaciones de alta prioridad
                                        </h3>
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">
                                            Implementar en 0-6 meses
                                        </span>
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
                        </section>

                        {/* ========== PÁGINA 9B - CONTINUACIÓN (Solo si hay más recomendaciones) ========== */}
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
                                    title="Plan de acción priorizado (continuación)"
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
                                                Alta prioridad (continuación)
                                            </h3>
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">
                                                0-6 meses
                                            </span>
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
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] font-bold rounded">
                                                6-18 meses
                                            </span>
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
                        )}
                    </>
                );
            })()}

            {/* ========================================================= */}
            {/*         PÁGINA 10 - ROADMAP Y SEGUIMIENTO                */}
            {/* ========================================================= */}
            {(() => {
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
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                        <Rocket className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Quick Wins (0-3 meses)
                                    </h3>
                                </div>
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
                                            <span>% Agua reutilizada</span>
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
                                    <div
                                        className="bg-red-600 text-white font-bold flex-shrink-0"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            fontSize: '0.75rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        1
                                    </div>
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
                                    <div
                                        className="bg-orange-600 text-white font-bold flex-shrink-0"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            fontSize: '0.75rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        2
                                    </div>
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
                                    <div
                                        className="bg-yellow-600 text-white font-bold flex-shrink-0"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            fontSize: '0.75rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        3
                                    </div>
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
                                    <div
                                        className="bg-green-600 text-white font-bold flex-shrink-0"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            fontSize: '0.75rem',
                                            lineHeight: 1
                                        }}
                                    >
                                        4
                                    </div>
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
            })()}


        </div>
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