import { Input } from '../shared/ui/Input';

export function Paso1InfoGeneral({ formData, updateField, updateFormData, errors }) {
  const handleDimensionChange = (dimension) => {
    updateFormData('dimensiones', dimension, !formData.dimensiones[dimension]);
  };

  const alMenosUnaDimension = 
    formData.dimensiones.carbono || 
    formData.dimensiones.agua || 
    formData.dimensiones.residuos || 
    formData.dimensiones.rep;

  return (
    <div className="space-y-6">
      
      {/* Nombre de la Empresa */}
      <Input
        label="Nombre de la Empresa"
        type="text"
        placeholder="Ej: Empresa Demo S.A."
        value={formData.companyName}
        onChange={(e) => updateField('companyName', e.target.value)}
        error={errors.companyName}
      />

      {/* Período Evaluado */}
      <div>
        <label className="label">Período Evaluado *</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Semestre */}
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Semestre</label>
            <select
              className="input"
              value={formData.semestre}
              onChange={(e) => updateField('semestre', e.target.value)}
            >
              <option value="S1">S1 (Enero - Junio)</option>
              <option value="S2">S2 (Julio - Diciembre)</option>
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Año</label>
            <select
              className="input"
              value={formData.anio}
              onChange={(e) => updateField('anio', parseInt(e.target.value))}
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fecha de Evaluación */}
      <Input
        label="Fecha de Evaluación"
        type="date"
        value={formData.fechaEvaluacion}
        onChange={(e) => updateField('fechaEvaluacion', e.target.value)}
      />

      {/* Dimensiones a Evaluar */}
      <div className="border-2 border-primary-200 rounded-xl p-6 bg-gradient-to-br from-primary-50 to-white">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          📊 Dimensiones a Evaluar
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Selecciona al menos una dimensión para evaluar
        </p>

        <div className="space-y-3">
          {/* Carbono */}
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-primary-50 transition-colors"
            style={{ 
              borderColor: formData.dimensiones.carbono ? '#10b981' : '#e2e8f0',
              backgroundColor: formData.dimensiones.carbono ? '#ecfdf5' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={formData.dimensiones.carbono}
              onChange={() => handleDimensionChange('carbono')}
              className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <span className="font-semibold text-slate-900">Huella de Carbono</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Evalúa emisiones de Alcance 1 (combustibles) y Alcance 2 (electricidad)
              </p>
            </div>
          </label>

          {/* Agua */}
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ 
              borderColor: formData.dimensiones.agua ? '#3b82f6' : '#e2e8f0',
              backgroundColor: formData.dimensiones.agua ? '#eff6ff' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={formData.dimensiones.agua}
              onChange={() => handleDimensionChange('agua')}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💧</span>
                <span className="font-semibold text-slate-900">Gestión del Agua</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Evalúa consumo hídrico e intensidad por persona o unidad de producción
              </p>
            </div>
          </label>

          {/* Residuos */}
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-green-50 transition-colors"
            style={{ 
              borderColor: formData.dimensiones.residuos ? '#10b981' : '#e2e8f0',
              backgroundColor: formData.dimensiones.residuos ? '#ecfdf5' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={formData.dimensiones.residuos}
              onChange={() => handleDimensionChange('residuos')}
              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">♻️</span>
                <span className="font-semibold text-slate-900">Gestión de Residuos</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Evalúa residuos generados, valorizados y tasa de valorización
              </p>
            </div>
          </label>

          {/* REP */}
          <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-purple-50 transition-colors"
            style={{ 
              borderColor: formData.dimensiones.rep ? '#8b5cf6' : '#e2e8f0',
              backgroundColor: formData.dimensiones.rep ? '#f5f3ff' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={formData.dimensiones.rep}
              onChange={() => handleDimensionChange('rep')}
              className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <span className="font-semibold text-slate-900">Productos REP</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Opcional
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Registra productos prioritarios según Ley de Responsabilidad Extendida del Productor
              </p>
            </div>
          </label>
        </div>

        {/* Mensaje de validación */}
        {!alMenosUnaDimension && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Debes seleccionar al menos una dimensión para continuar
            </p>
          </div>
        )}

        {/* Info adicional */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Puedes evaluar una, varias o todas las dimensiones según tus necesidades.
          </p>
        </div>
      </div>

    </div>
  );
}