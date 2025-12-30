import { formatDecimal, parseDecimalInput } from '../../utils/formatNumbers';
import { calcularEmisionesCarbono } from '../../utils/calculosHuella';

export function Paso6Revision({ formData }) {
  // Calcular emisiones de carbono si está activo
  let emisionesCarbono = null;
  if (formData.dimensiones.carbono) {
    const carbonData = {
      diesel: parseDecimalInput(formData.carbono.diesel),
      bencina: parseDecimalInput(formData.carbono.bencina),
      gas: parseDecimalInput(formData.carbono.gasNatural),
      electricidad: parseDecimalInput(formData.carbono.electricidad),
    };
    emisionesCarbono = calcularEmisionesCarbono(carbonData);
  }

  // Calcular intensidad hídrica si está activo
  let intensidadHidrica = null;
  if (formData.dimensiones.agua) {
    const consumoTotal = parseDecimalInput(formData.agua.consumoTotal);
    if (formData.agua.tipoMedicion === 'persona') {
      const trabajadores = parseDecimalInput(formData.agua.numeroTrabajadores);
      if (trabajadores > 0) {
        intensidadHidrica = {
          valor: consumoTotal / trabajadores,
          unidad: 'm³/persona·año'
        };
      }
    } else if (formData.agua.tipoMedicion === 'produccion') {
      const produccion = parseDecimalInput(formData.agua.produccionAnual);
      if (produccion > 0) {
        intensidadHidrica = {
          valor: consumoTotal / produccion,
          unidad: 'm³/unidad'
        };
      }
    }
  }

  // Calcular tasa de valorización si está activo
  let tasaValorizacion = null;
  if (formData.dimensiones.residuos) {
    const generados = parseDecimalInput(formData.residuos.generados);
    const valorizados = parseDecimalInput(formData.residuos.valorizados);
    if (generados > 0) {
      tasaValorizacion = (valorizados / generados) * 100;
    }
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Revisión y Confirmación
        </h2>
        <p className="text-slate-600">
          Verifica que toda la información sea correcta antes de guardar
        </p>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <div className="border-2 border-slate-200 rounded-xl p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📋</span>
          <h3 className="text-lg font-bold text-slate-900">Información General</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Empresa</p>
            <p className="font-semibold text-slate-900">{formData.companyName || '—'}</p>
          </div>
          <div>
            <p className="text-slate-500">Período</p>
            <p className="font-semibold text-slate-900">
              {formData.semestre} {formData.anio}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Fecha de Evaluación</p>
            <p className="font-semibold text-slate-900">
              {new Date(formData.fechaEvaluacion).toLocaleDateString('es-CL')}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Dimensiones Evaluadas</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {formData.dimensiones.carbono && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                  Carbono
                </span>
              )}
              {formData.dimensiones.agua && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  Agua
                </span>
              )}
              {formData.dimensiones.residuos && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  Residuos
                </span>
              )}
              {formData.dimensiones.rep && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                  REP
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HUELLA DE CARBONO */}
      {formData.dimensiones.carbono && (
        <div className="border-2 border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌍</span>
            <h3 className="text-lg font-bold text-slate-900">Huella de Carbono</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-slate-500">Diesel</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.carbono.diesel), 0)} L/año
              </p>
            </div>
            <div>
              <p className="text-slate-500">Bencina</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.carbono.bencina), 0)} L/año
              </p>
            </div>
            <div>
              <p className="text-slate-500">Gas Natural</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.carbono.gasNatural), 0)} kg/año
              </p>
            </div>
            <div>
              <p className="text-slate-500">Electricidad</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.carbono.electricidad), 0)} kWh/año
              </p>
            </div>
          </div>

          {emisionesCarbono && (
            <div className="pt-4 border-t border-emerald-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Alcance 1</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatDecimal(emisionesCarbono.alcance1 / 1000)} tCO₂e
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Alcance 2</p>
                  <p className="text-lg font-bold text-sky-600">
                    {formatDecimal(emisionesCarbono.alcance2 / 1000)} tCO₂e
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Total</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDecimal(emisionesCarbono.totalTon)} tCO₂e
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GESTIÓN DEL AGUA */}
      {formData.dimensiones.agua && (
        <div className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💧</span>
            <h3 className="text-lg font-bold text-slate-900">Gestión del Agua</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Consumo Total</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.agua.consumoTotal), 0)} m³/año
              </p>
            </div>
            <div>
              <p className="text-slate-500">Tipo de Medición</p>
              <p className="font-semibold text-slate-900">
                {formData.agua.tipoMedicion === 'persona' ? 'Por persona' : 'Por unidad de producción'}
              </p>
            </div>
            {formData.agua.tipoMedicion === 'persona' && (
              <div>
                <p className="text-slate-500">Número de Trabajadores</p>
                <p className="font-semibold text-slate-900">
                  {formatDecimal(parseDecimalInput(formData.agua.numeroTrabajadores), 0)} personas
                </p>
              </div>
            )}
            {formData.agua.tipoMedicion === 'produccion' && (
              <div>
                <p className="text-slate-500">Producción Anual</p>
                <p className="font-semibold text-slate-900">
                  {formatDecimal(parseDecimalInput(formData.agua.produccionAnual), 0)} unidades
                </p>
              </div>
            )}
            {intensidadHidrica && (
              <div>
                <p className="text-slate-500">Intensidad Hídrica</p>
                <p className="font-semibold text-blue-600">
                  {formatDecimal(intensidadHidrica.valor, 2)} {intensidadHidrica.unidad}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GESTIÓN DE RESIDUOS */}
      {formData.dimensiones.residuos && (
        <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">♻️</span>
            <h3 className="text-lg font-bold text-slate-900">Gestión de Residuos</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Generados</p>
              <p className="font-semibold text-slate-900">
                {formatDecimal(parseDecimalInput(formData.residuos.generados), 0)} kg/año
              </p>
            </div>
            <div>
              <p className="text-slate-500">Valorizados</p>
              <p className="font-semibold text-green-600">
                {formatDecimal(parseDecimalInput(formData.residuos.valorizados), 0)} kg/año
              </p>
            </div>
            {tasaValorizacion !== null && (
              <div>
                <p className="text-slate-500">Tasa de Valorización</p>
                <p className="font-semibold text-blue-600">
                  {formatDecimal(tasaValorizacion, 1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCTOS REP */}
      {formData.dimensiones.rep && formData.productosREP.length > 0 && (
        <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📦</span>
            <h3 className="text-lg font-bold text-slate-900">
              Productos REP ({formData.productosREP.length})
            </h3>
          </div>

          <div className="space-y-3">
            {formData.productosREP.map((producto, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold mr-2">
                      {producto.categoria}
                    </span>
                    <span className="font-semibold text-slate-900">{producto.subCategoria}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Generado</p>
                    <p className="font-semibold text-slate-900">
                      {formatDecimal(producto.cantidadGenerada, 0)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Valorizado</p>
                    <p className="font-semibold text-green-600">
                      {formatDecimal(producto.cantidadValorizada, 0)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Tasa</p>
                    <p className="font-semibold text-blue-600">
                      {formatDecimal((producto.cantidadValorizada / producto.cantidadGenerada) * 100, 1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje final */}
      <div className="p-5 bg-gradient-to-r from-primary-50 to-emerald-50 border-2 border-primary-200 rounded-xl">
        <p className="text-sm text-slate-700 leading-relaxed">
          ✓ Revisa cuidadosamente toda la información. Una vez que presiones 
          <strong> "Finalizar Evaluación"</strong>, los datos se guardarán y podrás generar el informe completo.
        </p>
      </div>

    </div>
  );
}