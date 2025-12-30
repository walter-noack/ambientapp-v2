import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/shared/ui/Button';
import { Card } from '../components/shared/ui/Card';
import { validarPasoPorNombre } from '../utils/validaciones';
import { getEvaluacionById, createEvaluacion, updateEvaluacion } from '../services/api';

import { Paso1InfoGeneral } from '../components/formulario/Paso1InfoGeneral';
import { Paso2HuellaCarbono } from '../components/formulario/Paso2HuellaCarbono';
import { Paso3GestionAgua } from '../components/formulario/Paso3GestionAgua';
import { Paso4GestionResiduos } from '../components/formulario/Paso4GestionResiduos';
import { Paso5ProductosREP } from '../components/formulario/Paso5ProductosREP';
import { Paso6Revision } from '../components/formulario/Paso6Revision';

export default function NuevaEvaluacion({ modoEdicion = false, modoDuplicar = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cargandoDatos, setCargandoDatos] = useState((modoEdicion || modoDuplicar) && !!id);
  console.log('🔎 NuevaEvaluacion props:', { modoEdicion, modoDuplicar });
  const [formData, setFormData] = useState({

    // Paso 1: Información General
    companyName: '',
    semestre: 'S1',
    anio: new Date().getFullYear(),
    fechaEvaluacion: new Date().toISOString().split('T')[0],

    // Dimensiones activadas
    dimensiones: {
      carbono: true,
      agua: true,
      residuos: true,
      rep: false,
    },

    // Paso 2: Huella de Carbono
    carbono: {
      diesel: '',
      bencina: '',
      gasNatural: '',
      otrosCombustibles: '',
      electricidad: '',
    },

    // Paso 3: Agua
    agua: {
      consumoTotal: '',
      tipoMedicion: 'persona', // 'persona' o 'produccion'
      numeroTrabajadores: '',
      produccionAnual: '',
    },

    // Paso 4: Residuos
    residuos: {
      generados: '',
      valorizados: '',
    },

    // Paso 5: REP
    productosREP: [],
  });

  // Errores de validación
  const [errors, setErrors] = useState({});

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    console.log('🌀 useEffect editar/duplicar', { modoEdicion, modoDuplicar, id });

    if ((modoEdicion || modoDuplicar) && id) {
      setCargandoDatos(true); // 👈 Agregar esta línea al inicio

      async function cargarEvaluacion() {
        try {
          const response = await getEvaluacionById(id);
          console.log('📋 Datos de diagnóstico cargado desde backend:', response);

          // Aquí ajustamos según la estructura real { success, data: { diagnostico: { ... } } }
          const evaluacion =
            response?.data?.diagnostico ||  // caso correcto
            response?.diagnostico ||        // por si cambia en el futuro
            response?.data ||               // fallback
            response;                       // último recurso

          console.log('✅ Evaluación normalizada:', evaluacion);

          // Mapear datos del diagnóstico al formato del formulario
          setFormData({
            // Paso 1: Información General
            companyName: modoDuplicar
              ? `${evaluacion.companyName || ''} (Copia)`
              : (evaluacion.companyName || ''),

            semestre: evaluacion.semestre || 'S1',
            anio: evaluacion.anio || new Date().getFullYear(),

            fechaEvaluacion: evaluacion.fechaEvaluacion
              ? evaluacion.fechaEvaluacion.split('T')[0]
              : new Date().toISOString().split('T')[0],

            // Dimensiones activadas
            dimensiones: {
              carbono: evaluacion.dimensiones?.carbono ?? true,
              agua: evaluacion.dimensiones?.agua ?? true,
              residuos: evaluacion.dimensiones?.residuos ?? true,
              rep: evaluacion.dimensiones?.rep ?? !!(evaluacion.productosREP?.length),
            },

            // Paso 2: Huella de Carbono
            carbono: {
              diesel: evaluacion.carbono?.diesel != null
                ? String(evaluacion.carbono.diesel)
                : '',
              bencina: evaluacion.carbono?.bencina != null
                ? String(evaluacion.carbono.bencina)
                : '',
              gasNatural: evaluacion.carbono?.gasNatural != null
                ? String(evaluacion.carbono.gasNatural)
                : '',
              otrosCombustibles: evaluacion.carbono?.otrosCombustibles != null
                ? String(evaluacion.carbono.otrosCombustibles)
                : '',
              electricidad: evaluacion.carbono?.electricidad != null
                ? String(evaluacion.carbono.electricidad)
                : '',
            },

            // Paso 3: Agua
            agua: {
              consumoTotal: evaluacion.agua?.consumoTotal != null
                ? String(evaluacion.agua.consumoTotal)
                : '',
              tipoMedicion: evaluacion.agua?.tipoMedicion || 'persona',
              numeroTrabajadores: evaluacion.agua?.numeroTrabajadores != null
                ? String(evaluacion.agua.numeroTrabajadores)
                : '',
              produccionAnual: evaluacion.agua?.produccionAnual != null
                ? String(evaluacion.agua.produccionAnual)
                : '',
            },

            // Paso 4: Residuos
            residuos: {
              generados: evaluacion.residuos?.generados != null
                ? String(evaluacion.residuos.generados)
                : '',
              valorizados: evaluacion.residuos?.valorizados != null
                ? String(evaluacion.residuos.valorizados)
                : '',
            },

            // Paso 5: REP
            productosREP: Array.isArray(evaluacion.productosREP)
              ? evaluacion.productosREP.map(p => ({
                categoria: p.categoria || '',
                subCategoria: p.subCategoria || '',
                cantidadGenerada: p.cantidadGenerada ?? 0,
                cantidadValorizada: p.cantidadValorizada ?? 0,
              }))
              : [],
          });

          setCargandoDatos(false);
        } catch (error) {
          console.error('❌ Error cargando diagnóstico:', error);
          alert('Error al cargar los datos del diagnóstico');
          setCargandoDatos(false);
        }
      }

      cargarEvaluacion();
    }
  }, [modoEdicion, modoDuplicar, id]);

  // Función para actualizar formData
  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      }
    }));
  };

  // Función para actualizar campos de nivel superior
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calcular pasos activos según dimensiones seleccionadas
  const getActiveSteps = () => {
    const steps = [
      { id: 1, name: 'Información General', active: true },
    ];

    if (formData.dimensiones.carbono) {
      steps.push({ id: steps.length + 1, name: 'Huella de Carbono', active: true });
    }
    if (formData.dimensiones.agua) {
      steps.push({ id: steps.length + 1, name: 'Gestión del Agua', active: true });
    }
    if (formData.dimensiones.residuos) {
      steps.push({ id: steps.length + 1, name: 'Gestión de Residuos', active: true });
    }
    if (formData.dimensiones.rep) {
      steps.push({ id: steps.length + 1, name: 'Productos REP', active: true });
    }

    steps.push({ id: steps.length + 1, name: 'Revisión', active: true });

    return steps;
  };

  const activeSteps = getActiveSteps();
  const totalSteps = activeSteps.length;

  // Navegación
  const goToNextStep = () => {
    // Obtener el nombre del paso actual
    const nombrePasoActual = activeSteps[currentStep - 1]?.name;

    // Validar el paso actual
    const erroresValidacion = validarPasoPorNombre(nombrePasoActual, formData);

    // Si hay errores, mostrarlos y no avanzar
    if (Object.keys(erroresValidacion).length > 0) {
      setErrors(erroresValidacion);

      // Scroll al inicio para ver los errores
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Mostrar alerta
      alert('⚠️ Por favor completa correctamente todos los campos obligatorios antes de continuar.');
      return;
    }

    // Si no hay errores, limpiar errores anteriores y avanzar
    setErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('📤 Enviando diagnóstico al backend...', formData);

      if (modoEdicion && id) {
        // Actualizar diagnóstico existente
        const response = await updateEvaluacion(id, formData);
        console.log('✅ Diagnóstico actualizado:', response);
        alert('¡Diagnóstico actualizado exitosamente!');
      } else {
        // Crear nuevo diagnóstico
        const response = await createEvaluacion(formData);
        console.log('✅ Diagnóstico creado:', response);
        alert('¡Diagnóstico guardado exitosamente!');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error al guardar diagnóstico:', error);
      alert(error.message || 'Error al guardar el diagnóstico. Por favor intenta nuevamente.');
    }
  };

  // Loading mientras carga datos en modo edición
  if (cargandoDatos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-slate-600">Cargando diagnóstico...</p>
        </div>
      </div>
    );
  }

  // 👇 AGREGA ESTE LOG AQUÍ
  console.log('📝 Current Form Data:', formData);
  console.log('📝 Company Name:', formData.companyName);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {modoEdicion
              ? 'Editar Diagnóstico Ambiental'
              : modoDuplicar
                ? 'Duplicar Diagnóstico Ambiental'
                : 'Nueva Diagnóstico Ambiental'}
          </h1>
          <p className="text-slate-600 mt-2">
            {modoEdicion
              ? 'Modifica los datos del diagnóstico ambiental'
              : modoDuplicar
                ? 'Revisa y ajusta los datos copiados antes de guardar'
                : 'Completa el diagnóstico ambiental de tu empresa'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">
              Paso {currentStep} de {totalSteps}: {activeSteps[currentStep - 1]?.name}
            </p>
            <p className="text-sm text-slate-500">
              {Math.round((currentStep / totalSteps) * 100)}% completado
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Steps indicators */}
          <div className="flex justify-between mt-4">
            {activeSteps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${idx + 1 === currentStep
                    ? 'bg-primary-600 text-white'
                    : idx + 1 < currentStep
                      ? 'bg-primary-200 text-primary-700'
                      : 'bg-slate-200 text-slate-500'
                    }`}
                >
                  {idx + 1 < currentStep ? '✓' : idx + 1}
                </div>
                <p className="text-xs text-slate-600 mt-1 text-center max-w-[80px] hidden md:block">
                  {step.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <Card className="p-8">
          <div className="min-h-[400px]">
            {/* Paso 1 - Información General */}
            {activeSteps[currentStep - 1]?.name === 'Información General' && (
              <Paso1InfoGeneral
                formData={formData}
                updateField={updateField}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {/* Paso 2 - Huella de Carbono */}
            {activeSteps[currentStep - 1]?.name === 'Huella de Carbono' && (
              <Paso2HuellaCarbono
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {/* Paso 3 - Gestión del Agua */}
            {activeSteps[currentStep - 1]?.name === 'Gestión del Agua' && (
              <Paso3GestionAgua
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {/* Paso 4 - Gestión de Residuos */}
            {activeSteps[currentStep - 1]?.name === 'Gestión de Residuos' && (
              <Paso4GestionResiduos
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {/* Paso 5 - Productos REP */}
            {activeSteps[currentStep - 1]?.name === 'Productos REP' && (
              <Paso5ProductosREP
                formData={formData}
                updateField={updateField}
                errors={errors}
              />
            )}

            {/* Paso 6 - Revisión */}
            {activeSteps[currentStep - 1]?.name === 'Revisión' && (
              <Paso6Revision formData={formData} />
            )}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="secondary"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
            >
              ← Anterior
            </Button>

            <div className="flex gap-3">
              <Button variant="outline">
                Guardar Borrador
              </Button>

              {currentStep === totalSteps ? (
                <Button variant="primary" onClick={handleSubmit}>
                  {modoEdicion ? 'Actualizar Diagnóstico' : 'Finalizar Diagnóstico'}
                </Button>
              ) : (
                <Button variant="primary" onClick={goToNextStep}>
                  Siguiente →
                </Button>
              )}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}