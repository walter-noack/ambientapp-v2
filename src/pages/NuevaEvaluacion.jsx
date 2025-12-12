import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shared/ui/Button';
import { Card } from '../components/shared/ui/Card';

import { Paso1InfoGeneral } from '../components/formulario/Paso1InfoGeneral';
import { Paso2HuellaCarbono } from '../components/formulario/Paso2HuellaCarbono';
import { Paso3GestionAgua } from '../components/formulario/Paso3GestionAgua';
import { Paso4GestionResiduos } from '../components/formulario/Paso4GestionResiduos';
import { Paso5ProductosREP } from '../components/formulario/Paso5ProductosREP';
import { Paso6Revision } from '../components/formulario/Paso6Revision';

export default function NuevaEvaluacion() {
  const navigate = useNavigate();

  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(1);
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
    console.log('Datos finales:', formData);
    // Aquí irá la llamada al API
    alert('¡Evaluación guardada! (Modo demo)');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Nueva Evaluación Ambiental</h1>
          <p className="text-slate-600 mt-2">
            Completa el diagnóstico ambiental de tu empresa
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
            {currentStep === 1 && (
              <Paso1InfoGeneral
                formData={formData}
                updateField={updateField}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 2 && activeSteps[1]?.name === 'Huella de Carbono' && (
              <Paso2HuellaCarbono
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 3 && activeSteps[currentStep - 1]?.name === 'Gestión del Agua' && (
              <Paso3GestionAgua
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 4 && activeSteps[currentStep - 1]?.name === 'Gestión de Residuos' && (
              <Paso4GestionResiduos
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 5 && activeSteps[currentStep - 1]?.name === 'Productos REP' && (
              <Paso5ProductosREP
                formData={formData}
                updateField={updateField}
                errors={errors}
              />
            )}

            {currentStep === 6 && activeSteps[currentStep - 1]?.name === 'Revisión' && (
              <Paso6Revision formData={formData} />
            )}

            {currentStep > 6 && (
              <p className="text-slate-600">
                Paso {currentStep}: {activeSteps[currentStep - 1]?.name}
                <br />
                <span className="text-sm text-slate-500">
                  (Este paso no debería aparecer)
                </span>
              </p>
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
                  Finalizar Evaluación
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