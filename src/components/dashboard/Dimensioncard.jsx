import { Card } from '../shared/ui/Card';

export function DimensionCard({ titulo, valor, color, icon, descripcion }) {
  const porcentaje = (valor / 100) * 100;

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
            {titulo}
          </p>
          <p className="text-4xl font-bold text-slate-900">
            {valor.toFixed(1)}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>

      <p className="text-xs text-slate-500 mb-3">{descripcion}</p>

      {/* Barra de progreso */}
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${porcentaje}%`,
            backgroundColor: color 
          }}
        />
      </div>
    </Card>
  );
}