// src/components/pdf/ImageRenderedComponents.jsx
import React from 'react';
import { useRenderAsImage } from '../../utils/renderToImage';
import { MatrizPriorizacion, QuickWinsSection } from './PlanAccionComponents';

/**
 * Wrapper que renderiza MatrizPriorizacion como imagen
 */
export function MatrizPriorizacionAsImage({ recomendaciones }) {
  const { ref, imageUrl, isRendering } = useRenderAsImage({ scale: 3 });

  return (
    <>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Matriz de Priorización" 
          className="w-full"
          style={{ display: 'block' }}
        />
      ) : (
        <div ref={ref} style={{ width: '100%' }}>
          <MatrizPriorizacion recomendaciones={recomendaciones} />
        </div>
      )}
      {isRendering && (
        <div className="text-xs text-slate-500 text-center py-2">
          Renderizando gráfico...
        </div>
      )}
    </>
  );
}

/**
 * Wrapper que renderiza QuickWins como imagen
 */
export function QuickWinsAsImage({ quickWins }) {
  const { ref, imageUrl, isRendering } = useRenderAsImage({ scale: 3 });

  return (
    <>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Quick Wins" 
          className="w-full"
          style={{ display: 'block' }}
        />
      ) : (
        <div ref={ref} style={{ width: '100%' }}>
          <QuickWinsSection quickWins={quickWins} />
        </div>
      )}
      {isRendering && (
        <div className="text-xs text-slate-500 text-center py-2">
          Renderizando sección...
        </div>
      )}
    </>
  );
}

/**
 * Wrapper genérico para renderizar círculos numerados
 */
export function NumberedCircleAsImage({ number, bgColor = 'bg-red-600', size = 'w-8 h-8' }) {
  const { ref, imageUrl } = useRenderAsImage({ scale: 4 });

  return (
    <>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`Número ${number}`}
          className={size}
          style={{ display: 'block' }}
        />
      ) : (
        <div ref={ref}>
          <div className={`${size} ${bgColor} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
            {number}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente de Próximos Pasos con círculos renderizados como imagen
 */
export function ProximosPasosWithImages() {
  const pasos = [
    {
      numero: 1,
      titulo: 'Asignar responsables',
      descripcion: 'Designar líderes para cada acción prioritaria y definir roles del equipo.',
      color: 'bg-red-600',
      borderColor: 'border-red-500'
    },
    {
      numero: 2,
      titulo: 'Aprobar presupuesto',
      descripcion: 'Presentar plan de inversión a dirección para aprobación financiera.',
      color: 'bg-orange-600',
      borderColor: 'border-orange-500'
    },
    {
      numero: 3,
      titulo: 'Kick-off del proyecto',
      descripcion: 'Reunión inicial con equipo, definición de hitos y cronograma detallado.',
      color: 'bg-yellow-600',
      borderColor: 'border-yellow-500'
    },
    {
      numero: 4,
      titulo: 'Programar seguimiento',
      descripcion: 'Agendar próxima evaluación en 6 meses para medir progreso.',
      color: 'bg-green-600',
      borderColor: 'border-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {pasos.map((paso) => (
        <div key={paso.numero} className={`flex gap-2 p-2 bg-white border-l-4 ${paso.borderColor} rounded-r-lg shadow-sm`}>
          <NumberedCircleAsImage 
            number={paso.numero} 
            bgColor={paso.color}
            size="w-6 h-6"
          />
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-slate-800 mb-0.5">
              {paso.titulo}
            </h4>
            <p className="text-[9px] text-slate-600 leading-tight">
              {paso.descripcion}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}