// src/components/evaluaciones/SeccionAgua.jsx
import React from 'react';
import { Droplet, TrendingDown, Factory } from 'lucide-react';

export function SeccionAgua({ consumoAgua, aguaReutilizada, intensidadHidrica }) {
  // Calcular porcentaje de reutilización
  const porcentajeReutilizacion = consumoAgua > 0 
    ? ((aguaReutilizada / consumoAgua) * 100).toFixed(1)
    : 0;

  // Consumo anual
  const consumoAnual = consumoAgua * 12;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-blue-600">Gestión Hídrica</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Consumo mensual */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-semibold mb-1">Consumo mensual</p>
          <p className="text-3xl font-bold text-blue-800">
            {consumoAgua.toLocaleString('es-CL')}
          </p>
          <p className="text-xs text-blue-600 mt-1">litros/mes</p>
          <p className="text-xs text-slate-500 mt-2">
            Anual: {consumoAnual.toLocaleString('es-CL')} L
          </p>
        </div>
        

        {/* Intensidad hídrica */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-700 font-semibold mb-1">Intensidad hídrica</p>
          {intensidadHidrica ? (
            <>
              <p className="text-3xl font-bold text-indigo-800">
                {intensidadHidrica.valor.toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                {intensidadHidrica.unidad}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <Factory className="w-4 h-4 text-indigo-600" />
                <p className="text-xs text-indigo-600">
                  Indicador de eficiencia
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-400">No disponible</p>
              <p className="text-xs text-slate-400 mt-1">
                Requiere datos adicionales
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">💡 Intensidad hídrica:</span> Indicador clave de eficiencia. 
          Un valor menor indica mejor uso del recurso hídrico. Se recomienda establecer metas anuales de reducción.
        </p>
      </div>
    </div>
  );
}