import { Input } from '../shared/ui/Input';
import { calcularEmisionesCarbono } from '../../utils/calculosHuella';
import { formatDecimal, parseDecimalInput } from '../../utils/formatNumbers';

export function Paso2HuellaCarbono({ formData, updateFormData, errors }) {
    const handleCarbonoChange = (field, value) => {
        updateFormData('carbono', field, value);
    };

    // Usar los cálculos reales del archivo calculosHuella.js
    const calcularEmisiones = () => {
        const carbonData = {
            diesel: parseDecimalInput(formData.carbono.diesel),
            bencina: parseDecimalInput(formData.carbono.bencina),
            gas: parseDecimalInput(formData.carbono.gasNatural),
            electricidad: parseDecimalInput(formData.carbono.electricidad),
        };

        return calcularEmisionesCarbono(carbonData);
    };

    const emisiones = calcularEmisiones();
    const { alcance1, alcance2, totalTon, detalle } = emisiones;

    // Convertir de kg a toneladas para visualización
    const totalA1 = (alcance1 / 1000).toFixed(2);
    const totalA2 = (alcance2 / 1000).toFixed(2);

    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Huella de Carbono
                </h2>
                <p className="text-slate-600">
                    Ingresa los consumos anuales de combustibles y electricidad
                </p>
            </div>

            {/* ALCANCE 1 - COMBUSTIBLES */}
            <div className="border-2 border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">A1</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Alcance 1 - Combustibles Directos
                        </h3>
                        <p className="text-sm text-slate-600">
                            Emisiones de fuentes controladas por la empresa
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Diesel (litros/año)"
                        type="number"
                        placeholder="0"
                        value={formData.carbono.diesel}
                        onChange={(e) => handleCarbonoChange('diesel', e.target.value)}
                        error={errors.diesel}
                    />

                    <Input
                        label="Bencina (litros/año)"
                        type="number"
                        placeholder="0"
                        value={formData.carbono.bencina}
                        onChange={(e) => handleCarbonoChange('bencina', e.target.value)}
                        error={errors.bencina}
                    />

                    <Input
                        label="Gas Natural (kg/año)"
                        type="number"
                        placeholder="0"
                        value={formData.carbono.gasNatural}
                        onChange={(e) => handleCarbonoChange('gasNatural', e.target.value)}
                        error={errors.gasNatural}
                    />

                    <Input
                        label="Otros Combustibles (litros/año)"
                        type="number"
                        placeholder="0"
                        value={formData.carbono.otrosCombustibles}
                        onChange={(e) => handleCarbonoChange('otrosCombustibles', e.target.value)}
                    />
                </div>

                {/* Desglose A1 */}
                {detalle && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-emerald-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Desglose de emisiones:</p>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                                <p className="text-slate-500">Diesel</p>
                                <p className="font-semibold text-emerald-700">{formatDecimal(detalle.diesel / 1000)} tCO₂e</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Bencina</p>
                                <p className="font-semibold text-emerald-700">{formatDecimal(detalle.bencina / 1000)} tCO₂e</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Gas Natural</p>
                                <p className="font-semibold text-emerald-700">{formatDecimal(detalle.gasNatural / 1000)} tCO₂e</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total A1 */}
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-emerald-300">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">
                            Emisiones Alcance 1:
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                            {formatDecimal(totalA1)} tCO₂e
                        </span>
                    </div>
                </div>
            </div>

            {/* ALCANCE 2 - ELECTRICIDAD */}
            <div className="border-2 border-sky-200 rounded-xl p-6 bg-gradient-to-br from-sky-50 to-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">A2</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Alcance 2 - Electricidad
                        </h3>
                        <p className="text-sm text-slate-600">
                            Emisiones indirectas por consumo eléctrico
                        </p>
                    </div>
                </div>

                <Input
                    label="Electricidad Consumida (kWh/año)"
                    type="number"
                    placeholder="0"
                    value={formData.carbono.electricidad}
                    onChange={(e) => handleCarbonoChange('electricidad', e.target.value)}
                    error={errors.electricidad}
                />

                {/* Total A2 */}
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-sky-300">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">
                            Emisiones Alcance 2:
                        </span>
                        <span className="text-2xl font-bold text-sky-600">
                            {formatDecimal(totalA2)} tCO₂e
                        </span>
                    </div>
                </div>
            </div>

            {/* TOTAL GENERAL */}
            <div className="border-2 border-slate-300 rounded-xl p-6 bg-gradient-to-br from-slate-100 to-white">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Huella de Carbono Total</p>
                        <p className="text-4xl font-bold text-slate-900">
                            {formatDecimal(totalTon)} <span className="text-xl text-slate-600">tCO₂e/año</span>
                        </p>
                    </div>
                    <div className="text-6xl">🌍</div>
                </div>

                {/* Distribución visual */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-emerald-100 rounded-lg">
                        <p className="text-xs text-emerald-700 mb-1">Alcance 1</p>
                        <p className="text-lg font-bold text-emerald-600">
                            {totalTon > 0 ? ((parseFloat(totalA1) / parseFloat(totalTon)) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                    <div className="text-center p-3 bg-sky-100 rounded-lg">
                        <p className="text-xs text-sky-700 mb-1">Alcance 2</p>
                        <p className="text-lg font-bold text-sky-600">
                            {totalTon > 0 ? ((parseFloat(totalA2) / parseFloat(totalTon)) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900">
                    📋 <strong>Factores de Emisión Chile 2023:</strong> Diesel: 2.68 kg CO₂e/L | Bencina: 2.32 kg CO₂e/L |
                    Gas Natural: 2.00 kg CO₂e/kg | Electricidad: 0.30 kg CO₂e/kWh (SIC-SING).
                    Fuente: Ministerio del Medio Ambiente - Inventario GEI Chile.
                </p>
            </div>

        </div>
    );
}