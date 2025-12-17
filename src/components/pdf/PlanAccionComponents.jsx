// src/components/pdf/PlanAccionComponents.jsx
import React from 'react';
import { 
  Target, DollarSign, Clock, Users, BarChart3, 
  Lightbulb, TrendingDown, BarChart2, Circle, Rocket 
} from 'lucide-react';

// ⬆️ Importar componentes SVG
import { CirculoNumeroSVG } from './CirculoNumeroSVG';
import { 
  BadgePuntajeSVG, 
  BadgePrioridadSVG, 
  BadgeAtributoSVG, 
  BadgeKPISVG,
  BadgeSVG,          // Para badges personalizados
  BadgeROISVG,       // Para ROI Estimado
  BadgePlazoSVG      // Para plazos de implementación
} from './BadgeSVG';

// Mapeo de colores para SVG
const COLORES_HEX = {
  'bg-red-600': '#dc2626',
  'bg-yellow-600': '#ca8a04',
  'bg-green-600': '#16a34a'
};

const COLORES_PUNTAJE = {
  'bg-emerald-600': '#059669',
  'bg-amber-600': '#d97706'
};

/**
 * Card para mostrar fortalezas identificadas
 */
export function FortalezaCard({ area, puntaje, dato, destaque }) {
  return (
    <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-xs font-semibold text-emerald-900 flex-1">
          {area}
        </h4>
        <BadgePuntajeSVG puntaje={puntaje} bgColor="#059669" width={60} height={24} />
      </div>
      <p className="text-[11px] font-semibold text-emerald-700 mb-1 flex items-center gap-1">
        <BarChart2 className="w-3 h-3" />
        {dato}
      </p>
      <p className="text-[10px] text-emerald-800 leading-relaxed">
        {destaque}
      </p>
    </div>
  );
}

/**
 * Card para mostrar oportunidades de mejora
 */
export function OportunidadCard({ area, puntaje, gap, causa, accionClave }) {
  return (
    <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-xs font-semibold text-amber-900 flex-1">
          {area}
        </h4>
        <BadgePuntajeSVG puntaje={puntaje} bgColor="#d97706" width={60} height={24} />
      </div>
      <p className="text-[10px] text-amber-800 mb-1">
        <span className="font-semibold">Gap:</span> {gap}
      </p>
      <p className="text-[10px] text-amber-700 mb-1">
        <span className="font-semibold">Causa:</span> {causa}
      </p>
      <p className="text-[10px] text-amber-900 font-semibold flex items-center gap-1">
        <Lightbulb className="w-3 h-3" />
        {accionClave}
      </p>
    </div>
  );
}

/**
 * Recomendación mejorada con todos los detalles
 */
export function RecomendacionMejorada({ rec, numero }) {
  const colorPrioridad = {
    'Alta': { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-600' },
    'Media': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-600' },
    'Baja': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-600' }
  };
  
  const colores = colorPrioridad[rec.prioridad] || colorPrioridad['Media'];
  
  return (
    <div className={`p-4 ${colores.bg} border-2 ${colores.border} rounded-xl mb-4`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <CirculoNumeroSVG
          numero={numero}
          size={32}
          bgColor={COLORES_HEX[colores.badge] || '#dc2626'}
          fontSize={14}
        />
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {rec.titulo}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <BadgePrioridadSVG prioridad={rec.prioridad} />
            <BadgeAtributoSVG texto={rec.categoria} bgColor="#e2e8f0" textColor="#334155" />
            <BadgeAtributoSVG texto={`Impacto: ${rec.impacto}`} bgColor="#dbeafe" textColor="#1e40af" />
            <BadgeAtributoSVG texto={`Esfuerzo: ${rec.esfuerzo}`} bgColor="#f3e8ff" textColor="#6b21a8" />
          </div>
        </div>
      </div>

      {/* Vínculo con análisis */}
      <div className="mb-3 p-2 bg-white/60 rounded-lg border border-slate-200">
        <p className="text-[10px] text-slate-700 mb-1 flex items-start gap-1">
          <TrendingDown className="w-3 h-3 mt-0.5 flex-shrink-0 text-red-600" />
          <span><span className="font-semibold">Problema:</span> {rec.vinculo.problema}</span>
        </p>
        <p className="text-[10px] text-slate-700 flex items-start gap-1">
          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-600" />
          <span><span className="font-semibold">Oportunidad:</span> {rec.vinculo.oportunidad}</span>
        </p>
      </div>

      {/* ROI */}
      <div className="mb-3 p-2 bg-emerald-100 rounded-lg border border-emerald-300 flex items-center gap-2">
        <Target className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <BadgeROISVG roi={rec.roi} />
      </div>

      {/* Grid: Pasos + Recursos */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Pasos */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-800 mb-1.5">Pasos de implementación:</h4>
          <ol className="space-y-1">
            {rec.pasos.map((paso, idx) => (
              <li key={idx} className="text-[9px] text-slate-700 flex gap-1">
                <span className="font-semibold">{idx + 1}.</span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Recursos */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-800 mb-1.5">Recursos necesarios:</h4>
          <div className="space-y-1">
            <p className="text-[9px] text-slate-700 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span><span className="font-semibold">Presupuesto:</span> {rec.recursos.presupuesto}</span>
            </p>
            <p className="text-[9px] text-slate-700 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span><span className="font-semibold">Tiempo:</span> {rec.recursos.tiempo}</span>
            </p>
            <p className="text-[9px] text-slate-700 flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-600" />
              <span><span className="font-semibold">Equipo:</span> {rec.recursos.equipo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-800 mb-1.5 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          KPIs de seguimiento:
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {rec.kpis.map((kpi, idx) => (
            <BadgeKPISVG key={idx} texto={kpi} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Matriz de priorización visual
 */
export function MatrizPriorizacion({ recomendaciones }) {
  // Tomar solo las top 5 para no saturar
  const top5 = recomendaciones.slice(0, 5);
  
  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-300 rounded-xl">
      <h3 className="text-xs font-bold text-slate-800 mb-3 text-center">
        Matriz de Priorización (Impacto vs Esfuerzo)
      </h3>
      
      <div className="relative" style={{ height: '220px', paddingLeft: '40px', paddingBottom: '35px' }}>
        
        {/* Contenedor del gráfico */}
        <div className="relative w-full h-full bg-white rounded-lg border-2 border-slate-300">
          {/* Ejes */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-400"></div>
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-slate-400"></div>
          
          {/* Label eje Y - SVG rotado */}
          <div style={{ position: 'absolute', left: '-50px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)' }}>
            <svg width="100" height="20" viewBox="0 0 100 20">
              <text
                x="50"
                y="3"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#475569"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Impacto →
              </text>
            </svg>
          </div>
          
          {/* Label eje X - SVG */}
          <div style={{ position: 'absolute', bottom: '-28px', left: '50%', transform: 'translateX(-50%)' }}>
            <svg width="80" height="16" viewBox="0 0 80 16">
              <text
                x="40"
                y="8"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#475569"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Esfuerzo →
              </text>
            </svg>
          </div>
          
          {/* Cuadrantes - Labels */}
          <div 
            className="absolute text-[8px] text-green-600 font-semibold leading-tight"
            style={{ top: '8px', left: '8px', textAlign: 'left' }}
          >
            Alto Impacto<br/>Bajo Esfuerzo
          </div>
          <div 
            className="absolute text-[8px] text-slate-400 font-semibold leading-tight"
            style={{ bottom: '8px', right: '8px', textAlign: 'right' }}
          >
            Bajo Impacto<br/>Alto Esfuerzo
          </div>
          
          {/* Puntos */}
          {top5.map((rec, idx) => {
            // Normalizar a % (esfuerzo de 0-10, impacto de 0-10)
            const x = (rec.esfuerzoNumerico / 10) * 100;
            const y = 100 - ((rec.impactoNumerico / 10) * 100); // Invertir Y
            
            const colorHex = rec.prioridad === 'Alta' ? '#ef4444' : 
                           rec.prioridad === 'Media' ? '#eab308' : '#22c55e';
            
            return (
              <div
                key={rec.id}
                className="absolute"
                style={{
                  left: `calc(${x}% - 12px)`,
                  top: `calc(${y}% - 12px)`
                }}
                title={rec.titulo}
              >
                <CirculoNumeroSVG
                  numero={idx + 1}
                  size={24}
                  bgColor={colorHex}
                  fontSize={10}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="mt-3 space-y-0.5">
        {top5.map((rec, idx) => (
          <div key={rec.id} className="flex items-center gap-2 text-[9px]">
            <span className="font-bold text-slate-700">{idx + 1}.</span>
            <span className="text-slate-600">{rec.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Timeline/Roadmap semestral
 */
export function RoadmapTimeline({ roadmap }) {
  return (
    <div className="space-y-2">
      {roadmap.map((periodo, idx) => (
        <div key={idx} className="flex gap-3">
          {/* Indicador temporal */}
          <div className="flex-shrink-0 w-16 text-center">
            <BadgeSVG
              texto={periodo.semestre}
              width={64}
              height={24}
              bgColor="#2563eb"
              textColor="#ffffff"
              fontSize={9}
              fontWeight="bold"
              borderRadius={4}
            />
            <div className="text-[8px] text-slate-500 mt-0.5">
              {periodo.mes}
            </div>
          </div>
          
          {/* Línea conectora */}
          <div className="flex-shrink-0 w-px bg-blue-300 relative">
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          
          {/* Acciones */}
          <div className="flex-1 pb-2">
            <ul className="space-y-1">
              {periodo.acciones.map((accion, i) => (
                <li key={i} className="text-[10px] text-slate-700 flex items-start gap-1.5">
                  <Circle className="w-2 h-2 fill-blue-600 text-blue-600 flex-shrink-0 mt-1" />
                  <span>{accion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}


/**
 * Quick Wins destacados
 */
export function QuickWinsSection({ quickWins }) {
  if (quickWins.length === 0) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Rocket className="w-5 h-5 text-green-600" />
        <h3 className="text-sm font-bold text-green-900">
          Quick Wins (0-3 meses)
        </h3>
      </div>
      <p className="text-[10px] text-green-800 mb-3">
        Acciones de alto impacto y rápida implementación para resultados inmediatos:
      </p>
      <div className="space-y-2">
        {quickWins.map((rec, idx) => (
          <div
            key={rec.id}
            className="flex gap-2 items-start p-2 bg-white rounded-lg border border-green-200"
          >
            <CirculoNumeroSVG
              numero={idx + 1}
              size={20}
              bgColor="#16a34a"
              fontSize={10}
            />

            {/* ⬇️ Este div ahora está correctamente dentro del contenedor */}
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-slate-900">
                {rec.titulo}
              </p>
              <p className="text-[9px] text-slate-600">
                {rec.roi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}