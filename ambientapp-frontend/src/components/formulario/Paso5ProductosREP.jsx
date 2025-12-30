import { useState } from 'react';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { formatDecimal, parseDecimalInput } from '../../utils/formatNumbers';

export function Paso5ProductosREP({ formData, updateField, errors }) {
  const [nuevoProducto, setNuevoProducto] = useState({
    categoria: '',
    subCategoria: '',
    cantidadGenerada: '',
    cantidadValorizada: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);

  const categoriasREP = [
    'Aceites Lubricantes',
    'Aparatos Eléctricos y Electrónicos (RAEE)',
    'Baterías',
    'Envases y Embalajes',
    'Neumáticos',
    'Pilas',
  ];

  const agregarProducto = () => {
    // Validar
    if (!nuevoProducto.categoria) {
      alert('Debes seleccionar una categoría');
      return;
    }
    if (!nuevoProducto.subCategoria || nuevoProducto.subCategoria.trim() === '') {
      alert('Debes especificar el tipo de producto');
      return;
    }
    if (!nuevoProducto.cantidadGenerada || parseDecimalInput(nuevoProducto.cantidadGenerada) <= 0) {
      alert('Debes ingresar una cantidad generada válida');
      return;
    }
    if (!nuevoProducto.cantidadValorizada || parseDecimalInput(nuevoProducto.cantidadValorizada) < 0) {
      alert('Debes ingresar una cantidad valorizada válida');
      return;
    }

    const producto = {
      categoria: nuevoProducto.categoria,
      subCategoria: nuevoProducto.subCategoria.trim(),
      cantidadGenerada: parseDecimalInput(nuevoProducto.cantidadGenerada),
      cantidadValorizada: parseDecimalInput(nuevoProducto.cantidadValorizada),
    };

    // Si estamos editando, actualizar el producto existente
    if (editandoIndex !== null) {
      const nuevaLista = [...formData.productosREP];
      nuevaLista[editandoIndex] = producto;
      updateField('productosREP', nuevaLista);
      setEditandoIndex(null);
    } else {
      // Si no, agregar nuevo producto
      updateField('productosREP', [...formData.productosREP, producto]);
    }

    // Limpiar formulario
    setNuevoProducto({
      categoria: '',
      subCategoria: '',
      cantidadGenerada: '',
      cantidadValorizada: '',
    });
    setShowForm(false);
  };

  const editarProducto = (index) => {
    const producto = formData.productosREP[index];
    setNuevoProducto({
      categoria: producto.categoria,
      subCategoria: producto.subCategoria,
      cantidadGenerada: String(producto.cantidadGenerada),
      cantidadValorizada: String(producto.cantidadValorizada),
    });
    setEditandoIndex(index);
    setShowForm(true);
  };

  const cancelarEdicion = () => {
    setNuevoProducto({
      categoria: '',
      subCategoria: '',
      cantidadGenerada: '',
      cantidadValorizada: '',
    });
    setEditandoIndex(null);
    setShowForm(false);
  };

  // Calcular totales
  const totalGenerado = formData.productosREP.reduce((sum, p) => sum + p.cantidadGenerada, 0);
  const totalValorizado = formData.productosREP.reduce((sum, p) => sum + p.cantidadValorizada, 0);
  const tasaGlobal = totalGenerado > 0 ? (totalValorizado / totalGenerado) * 100 : 0;

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Productos Prioritarios — Ley REP
        </h2>
        <p className="text-slate-600">
          Gestión de productos bajo Responsabilidad Extendida del Productor
        </p>
      </div>

      {/* Nota informativa */}
      <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
        <p className="text-sm text-purple-900">
          ℹ️ Los datos ingresados corresponden al período evaluado: <strong>{formData.semestre} {formData.anio}</strong>
        </p>
      </div>

      {/* Totales globales */}
      {formData.productosREP.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
            <p className="text-xs uppercase tracking-wider text-purple-700 mb-2">
              Total Generado
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {formatDecimal(totalGenerado / 1000, 1)}
            </p>
            <p className="text-sm text-purple-700">toneladas</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <p className="text-xs uppercase tracking-wider text-green-700 mb-2">
              Total Valorizado
            </p>
            <p className="text-3xl font-bold text-green-600">
              {formatDecimal(totalValorizado / 1000, 1)}
            </p>
            <p className="text-sm text-green-700">toneladas</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <p className="text-xs uppercase tracking-wider text-blue-700 mb-2">
              Tasa Global
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {formatDecimal(tasaGlobal, 1)}%
            </p>
            <p className="text-sm text-blue-700">Valorización</p>
          </div>
        </div>
      )}

      {/* Lista de productos agregados */}
      {formData.productosREP.length > 0 && (
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">
              Productos Agregados ({formData.productosREP.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-200">
            {formData.productosREP.map((producto, idx) => {
              const tasa = (producto.cantidadValorizada / producto.cantidadGenerada) * 100;
              return (
                <div key={idx} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                          {producto.categoria}
                        </span>
                        <p className="font-semibold text-slate-900 mb-2">
                          {producto.subCategoria || producto.producto || 'Sin especificar'}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
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
                            {formatDecimal(tasa, 1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => editarProducto(idx)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarProducto(idx)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón agregar / Formulario */}
      {!showForm ? (
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="w-full"
        >
          + Agregar Producto REP
        </Button>
      ) : (
        <div className="border-2 border-purple-300 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editandoIndex !== null ? 'Editar Producto REP' : 'Nuevo Producto REP'}
          </h3>

          <div className="space-y-4">
            {/* Categoría */}
            <div>
              <label className="label">Categoría *</label>
              <select
                className="input"
                value={nuevoProducto.categoria}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
              >
                <option value="">Seleccionar categoría...</option>
                {categoriasREP.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subcategoría / Tipo de producto */}
            <Input
              label="Tipo de Producto *"
              type="text"
              placeholder="Ej: Plástico PET, Cartón corrugado, Vidrio verde, etc."
              value={nuevoProducto.subCategoria}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, subCategoria: e.target.value })}
            />

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Ejemplos:</strong> Si seleccionaste "Envases y Embalajes", especifica el tipo:
                "Plástico PET", "Cartón", "Vidrio", "Latas de aluminio", etc.
              </p>
            </div>

            {/* Cantidad generada */}
            <Input
              label="Cantidad Generada (kg) *"
              type="number"
              placeholder="0"
              value={nuevoProducto.cantidadGenerada}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidadGenerada: e.target.value })}
            />

            {/* Cantidad valorizada */}
            <Input
              label="Cantidad Valorizada (kg) *"
              type="number"
              placeholder="0"
              value={nuevoProducto.cantidadValorizada}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidadValorizada: e.target.value })}
            />

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={cancelarEdicion}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={agregarProducto}
                className="flex-1"
              >
                {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info sobre Ley REP */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900 leading-relaxed">
          📋 <strong>Ley REP:</strong> La Responsabilidad Extendida del Productor establece que los fabricantes e importadores
          deben gestionar los residuos de productos prioritarios. Los 6 productos incluidos son: aceites lubricantes,
          aparatos eléctricos y electrónicos (RAEE), baterías, envases y embalajes, neumáticos y pilas.
        </p>
      </div>

    </div>
  );
}
