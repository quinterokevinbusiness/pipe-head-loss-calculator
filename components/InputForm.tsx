import React from 'react';
import type { PipeParams, FluidParams, UnitSystem, InputUnits, LengthUnit, DiameterUnit, RoughnessUnit, FlowRateUnit, DensityUnit, ViscosityUnit } from '../types';
import { MATERIALS } from '../constants';
import { FLUIDS } from '../constants/fluids';
import { convert, getUnitsFor, ParamType, AllUnits } from '../utils/units';

// --- PROPS INTERFACE ---
interface InputFormProps {
    pipeParams: PipeParams;
    fluidParams: FluidParams;
    onPipeParamsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onFluidParamsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMaterialChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCalculate: () => void;
    unitSystem: UnitSystem;
    onUnitSystemChange: (system: UnitSystem) => void;
    inputUnits: InputUnits;
    onUnitChange: <K extends keyof InputUnits>(param: K, unit: InputUnits[K]) => void;
    selectedFluidName: string;
    onFluidSelect: (fluidName: string) => void;
}


// --- SUB-COMPONENTS ---
const UnitSystemToggle: React.FC<{ system: UnitSystem; onChange: (system: UnitSystem) => void; }> = ({ system, onChange }) => (
    <div className="flex p-1 bg-slate-900 rounded-lg">
        <button
            type="button"
            onClick={() => onChange('SI')}
            className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${system === 'SI' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
        >
            SI
        </button>
        <button
            type="button"
            onClick={() => onChange('Imperial')}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${system === 'Imperial' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
        >
            Imperial
        </button>
    </div>
);

const InputFieldWithUnitSelector: React.FC<{
    label: string;
    name: keyof PipeParams | keyof FluidParams;
    siValue: number;
    siUnit: AllUnits;
    selectedUnit: AllUnits;
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUnitChange: (unit: any) => void;
    unitSystem: UnitSystem;
    paramType: ParamType;
    min?: number;
    step?: string;
    disabled?: boolean;
}> = ({ label, name, siValue, siUnit, selectedUnit, onValueChange, onUnitChange, unitSystem, paramType, min = 0, step = "any", disabled = false }) => {

    const displayValue = convert(siValue, siUnit, selectedUnit);
    const availableUnits = getUnitsFor(paramType, unitSystem);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
             const syntheticEvent = { target: { name, value: '0' } } as React.ChangeEvent<HTMLInputElement>;
             onValueChange(syntheticEvent);
             return;
        }

        const currentDisplayValue = parseFloat(rawValue);
        if (isNaN(currentDisplayValue)) return;
        
        const newSiValue = convert(currentDisplayValue, selectedUnit, siUnit);
        
        const syntheticEvent = {
            target: { name, value: String(newSiValue) }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onValueChange(syntheticEvent);
    };
    
    const formattedDisplayValue = parseFloat(displayValue.toPrecision(6));

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">
                {label}
            </label>
            <div className="flex">
                <input
                    type="number"
                    id={name}
                    name={name}
                    value={formattedDisplayValue}
                    onChange={handleChange}
                    min={min}
                    step={step}
                    className="w-full bg-slate-800 border border-slate-600 rounded-l-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed"
                    required
                    disabled={disabled}
                />
                <select 
                    value={selectedUnit} 
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="bg-slate-700 border border-l-0 border-slate-600 rounded-r-md text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                    {availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
            </div>
        </div>
    );
};


// --- MAIN FORM COMPONENT ---
const InputForm: React.FC<InputFormProps> = ({ 
    pipeParams, 
    fluidParams, 
    onPipeParamsChange, 
    onFluidParamsChange, 
    onMaterialChange, 
    onCalculate, 
    unitSystem, 
    onUnitSystemChange,
    inputUnits,
    onUnitChange,
    selectedFluidName,
    onFluidSelect
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate();
    };

    const isCustomFluid = selectedFluidName === 'Custom';

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-xl shadow-lg space-y-8">
            <div className="flex justify-between items-center border-b-2 border-slate-600 pb-3 mb-6">
                <h2 className="text-xl font-semibold text-white">Parámetros</h2>
                <UnitSystemToggle system={unitSystem} onChange={onUnitSystemChange} />
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-medium text-sky-400">Tubería</h3>
                <InputFieldWithUnitSelector label="Longitud de la Tubería" name="length" siValue={pipeParams.length} siUnit="m" selectedUnit={inputUnits.length} onValueChange={onPipeParamsChange} onUnitChange={(u: LengthUnit) => onUnitChange('length', u)} unitSystem={unitSystem} paramType="length" />
                <InputFieldWithUnitSelector label="Diámetro Interno" name="diameter" siValue={pipeParams.diameter} siUnit="mm" selectedUnit={inputUnits.diameter} onValueChange={onPipeParamsChange} onUnitChange={(u: DiameterUnit) => onUnitChange('diameter', u)} unitSystem={unitSystem} paramType="diameter" />
                <div>
                     <label htmlFor="material" className="block text-sm font-medium text-slate-300 mb-1">
                        Material de la Tubería
                    </label>
                    <select
                        id="material"
                        name="material"
                        onChange={onMaterialChange}
                        value={pipeParams.roughness}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                        {MATERIALS.map(material => (
                            <option key={material.name} value={material.roughness}>
                                {material.name}
                            </option>
                        ))}
                    </select>
                </div>
                 <InputFieldWithUnitSelector label="Rugosidad Absoluta" name="roughness" siValue={pipeParams.roughness} siUnit="mm" selectedUnit={inputUnits.roughness} onValueChange={onPipeParamsChange} onUnitChange={(u: RoughnessUnit) => onUnitChange('roughness', u)} unitSystem={unitSystem} paramType="roughness" step="0.0001" />
            </div>

            <div className="space-y-6">
                 <h3 className="text-lg font-medium text-sky-400">Fluido</h3>
                 <div>
                    <label htmlFor="fluid" className="block text-sm font-medium text-slate-300 mb-1">
                        Fluido
                    </label>
                    <select
                        id="fluid"
                        name="fluid"
                        onChange={(e) => onFluidSelect(e.target.value)}
                        value={selectedFluidName}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                        <option value="Custom">Fluido Personalizado</option>
                        {FLUIDS.map(fluid => (
                            <option key={fluid.name} value={fluid.name}>
                                {fluid.name}
                            </option>
                        ))}
                    </select>
                </div>

                 <InputFieldWithUnitSelector label="Caudal" name="flowRate" siValue={fluidParams.flowRate} siUnit="L/s" selectedUnit={inputUnits.flowRate} onValueChange={onFluidParamsChange} onUnitChange={(u: FlowRateUnit) => onUnitChange('flowRate', u)} unitSystem={unitSystem} paramType="flowRate" />
                 <InputFieldWithUnitSelector label="Viscosidad Cinemática" name="kinematicViscosity" siValue={fluidParams.kinematicViscosity} siUnit="cSt" selectedUnit={inputUnits.kinematicViscosity} onValueChange={onFluidParamsChange} onUnitChange={(u: ViscosityUnit) => onUnitChange('kinematicViscosity', u)} unitSystem={unitSystem} paramType="kinematicViscosity" step="0.001" disabled={!isCustomFluid} />
                 <InputFieldWithUnitSelector label="Densidad" name="density" siValue={fluidParams.density} siUnit="kg/m³" selectedUnit={inputUnits.density} onValueChange={onFluidParamsChange} onUnitChange={(u: DensityUnit) => onUnitChange('density', u)} unitSystem={unitSystem} paramType="density" disabled={!isCustomFluid}/>
            </div>

            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                Calcular
            </button>
        </form>
    );
};

export default InputForm;
