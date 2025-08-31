import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import PressureMapChart from './components/PressureMapChart';
import { calculateHeadLoss } from './services/calculationService';
import type { PipeParams, FluidParams, CalculationResult, UnitSystem, InputUnits } from './types';
import { MATERIALS } from './constants';
import { FLUIDS } from './constants/fluids';
import { getDefaultUnits } from './utils/units';

const App: React.FC = () => {
    const [unitSystem, setUnitSystem] = useState<UnitSystem>('SI');
    const [inputUnits, setInputUnits] = useState<InputUnits>(getDefaultUnits('SI'));
    const [selectedFluidName, setSelectedFluidName] = useState<string>(FLUIDS[0].name);

    const [pipeParams, setPipeParams] = useState<PipeParams>({
        length: 100,
        diameter: 50,
        roughness: MATERIALS[0].roughness,
    });

    const [fluidParams, setFluidParams] = useState<FluidParams>({
        flowRate: 10,
        kinematicViscosity: FLUIDS[0].kinematicViscosity,
        density: FLUIDS[0].density,
    });

    const [results, setResults] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Update units when system changes
    useEffect(() => {
        setInputUnits(getDefaultUnits(unitSystem));
    }, [unitSystem]);
    
    // Update fluid params when a fluid is selected from the list
    const handleFluidSelect = useCallback((fluidName: string) => {
        setSelectedFluidName(fluidName);
        if (fluidName !== 'Custom') {
            const selectedFluid = FLUIDS.find(f => f.name === fluidName);
            if (selectedFluid) {
                setFluidParams(prev => ({
                    ...prev,
                    density: selectedFluid.density,
                    kinematicViscosity: selectedFluid.kinematicViscosity,
                }));
            }
        }
    }, []);

    const handlePipeParamsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPipeParams(prev => ({ ...prev, [name]: parseFloat(value) }));
    }, []);
    
    const handleFluidParamsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFluidParams(prev => ({ ...prev, [name]: parseFloat(value) }));
    }, []);

    const handleMaterialChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoughness = parseFloat(e.target.value);
        setPipeParams(prev => ({ ...prev, roughness: selectedRoughness }));
    }, []);

    const handleUnitChange = useCallback(<K extends keyof InputUnits>(param: K, unit: InputUnits[K]) => {
        setInputUnits(prev => ({ ...prev, [param]: unit }));
    }, []);

    const handleCalculate = useCallback(() => {
        setIsLoading(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            try {
                const calculation = calculateHeadLoss(pipeParams, fluidParams);
                setResults(calculation);
            } catch (error) {
                console.error("Calculation error:", error);
                setResults(null);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, [pipeParams, fluidParams]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <InputForm
                            pipeParams={pipeParams}
                            fluidParams={fluidParams}
                            onPipeParamsChange={handlePipeParamsChange}
                            onFluidParamsChange={handleFluidParamsChange}
                            onMaterialChange={handleMaterialChange}
                            onCalculate={handleCalculate}
                            unitSystem={unitSystem}
                            onUnitSystemChange={setUnitSystem}
                            inputUnits={inputUnits}
                            onUnitChange={handleUnitChange}
                            selectedFluidName={selectedFluidName}
                            onFluidSelect={handleFluidSelect}
                        />
                    </div>
                    <div className="lg:col-span-3 space-y-8">
                         <ResultsDisplay results={results} isLoading={isLoading} unitSystem={unitSystem} />
                         <PressureMapChart data={results?.pressureMapData || []} unitSystem={unitSystem} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
