export function SeccionREP({ productosREP }) {
  // Si no hay productos, mostrar mensaje
  if (!productosREP || productosREP.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Productos Prioritarios — Ley REP
          </h2>
          <p className="text-slate-600">
            Gestión de productos bajo Responsabilidad Extendida del Productor
          </p>
        </div>

        <div className="p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-center">
          <p className="text-slate-500 mb-2">📦 Sin productos REP registrados</p>
          <p className="text-sm text-slate-400">
            No se han cargado datos de productos prioritarios para esta empresa
          </p>
        </div>
      </section>
    );
  }

  // Calcular totales
  const totalGenerado = productosREP.reduce((sum, p) => sum + (p.cantidadGenerada || 0), 0);
  const totalValorizado = productosREP.reduce((sum, p) => sum + (p.cantidadValorizada || 0), 0);
  const tasaValorizacionGlobal = totalGenerado > 0 
    ? ((totalValorizado / totalGenerado) * 100).toFixed(1)
    : 0;

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Productos Prioritarios — Ley REP
        </h2>
        <p className="text-slate-600">
          Gestión de productos bajo Responsabilidad Extendida del Productor
        </p>
      </div>

      {/* KPIs Globales */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
          <p className="text-xs uppercase tracking-wider text-purple-700 mb-2">
            Total Generado
          </p>
          <p className="text-3xl font-bold text-purple-600">
            {totalGenerado.toLocaleString()}
          </p>
          <p className="text-sm text-purple-700">kg</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <p className="text-xs uppercase tracking-wider text-green-700 mb-2">
            Total Valorizado
          </p>
          <p className="text-3xl font-bold text-green-600">
            {totalValorizado.toLocaleString()}
          </p>
          <p className="text-sm text-green-700">kg</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <p className="text-xs uppercase tracking-wider text-blue-700 mb-2">
            Tasa Global
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {tasaValorizacionGlobal}%
          </p>
          <p className="text-sm text-blue-700">Valorización</p>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm">Producto</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Año</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Generado (kg)</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Valorizado (kg)</th>
              <th className="text-center py-3 px-4 font-semibold text-sm">Valorización (%)</th>
              <th className="text-center py-3 px-4 font-semibold text-sm">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {productosREP.map((producto, idx) => {
              const tasaValorizacion = producto.cantidadGenerada > 0
                ? ((producto.cantidadValorizada / producto.cantidadGenerada) * 100).toFixed(1)
                : 0;

              // Determinar estado según tasa de valorización
              let estadoColor = 'bg-red-100 text-red-800 border-red-200';
              let estadoTexto = 'Bajo';
              
              if (tasaValorizacion >= 70) {
                estadoColor = 'bg-green-100 text-green-800 border-green-200';
                estadoTexto = 'Excelente';
              } else if (tasaValorizacion >= 50) {
                estadoColor = 'bg-blue-100 text-blue-800 border-blue-200';
                estadoTexto = 'Bueno';
              } else if (tasaValorizacion >= 30) {
                estadoColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                estadoTexto = 'Regular';
              }

              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{producto.producto}</p>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {producto.anio}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">
                    {producto.cantidadGenerada.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    {producto.cantidadValorizada.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-bold text-slate-900">
                        {tasaValorizacion}%
                      </span>
                      {/* Mini barra de progreso */}
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${tasaValorizacion}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${estadoColor}`}>
                      {estadoTexto}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Nota informativa */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>📋 Ley REP:</strong> La Responsabilidad Extendida del Productor establece 
          que los fabricantes e importadores deben gestionar los residuos de productos prioritarios. 
          Los productos incluidos son: aceites lubricantes, aparatos eléctricos y electrónicos (RAEE), 
          baterías, envases y embalajes, neumáticos y pilas.
        </p>
      </div>
    </section>
  );
}