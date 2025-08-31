import React from 'react';
import type { CalculationResult, UnitSystem } from '../types';
import Tooltip from './Tooltip';
import { getDisplayValue, getDisplayUnit } from '../utils/units';

interface ResultsDisplayProps {
    results: CalculationResult | null;
    isLoading: boolean;
    unitSystem: UnitSystem;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-2 text-slate-500 hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="my-2 p-2 bg-slate-900 rounded-md text-center">
        <code className="text-sm text-sky-300 font-mono tracking-wider">{children}</code>
    </div>
);

const Variables: React.FC<{ items: { [key: string]: string } }> = ({ items }) => (
    <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
        {Object.entries(items).map(([key, value]) => (
            <li key={key}><strong className="font-semibold text-slate-300">{key}:</strong> <span className="text-slate-400">{value}</span></li>
        ))}
    </ul>
);

const ResultItemWithTooltip: React.FC<{ label: string; value: string; unit: string; tooltipContent: React.ReactNode; }> = ({ label, value, unit, tooltipContent }) => (
    <div className="flex justify-between items-baseline py-3 px-4 bg-slate-800 rounded-lg transition-colors duration-300 hover:bg-slate-700/50">
        <div className="flex items-center">
            <span className="text-slate-400">{label}</span>
            <Tooltip content={tooltipContent}>
                <InfoIcon />
            </Tooltip>
        </div>
        <div className="text-right">
            <span className="text-lg font-semibold text-sky-400">{value}</span>
            <span className="ml-2 text-slate-400 text-sm">{unit}</span>
        </div>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, unitSystem }) => {
    
    const regimeStyles = {
        Laminar: 'text-green-400 bg-green-900/50 border-green-500',
        Transición: 'text-amber-400 bg-amber-900/50 border-amber-500',
        Turbulento: 'text-red-400 bg-red-900/50 border-red-500',
    };

    const formatNumber = (num: number) => {
        if (num > 10000) return num.toExponential(2);
        if (num < 0.01 && num !== 0) return num.toExponential(2);
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
                </div>
            );
        }

        if (!results) {
            return (
                 <div className="flex flex-col justify-center items-center h-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-300">Esperando cálculo</h3>
                    <p className="text-slate-500">Ingrese sus datos y presione "Calcular".</p>
                </div>
            );
        }
        
        // Tooltip Contents
        const headLossTooltip = (
            <div>
                <p>Representa la energía perdida por el fluido debido a la fricción, expresada como una altura equivalente de columna de fluido.</p>
                <Formula>H<sub>f</sub> = f &middot; (L/D) &middot; (v²/2g)</Formula>
                <Variables items={{
                    'H\u2093': 'Pérdida de Carga',
                    'f': 'Factor de Fricción',
                    'L': 'Longitud',
                    'D': 'Diámetro',
                    'v': 'Velocidad',
                    'g': 'Gravedad',
                }} />
            </div>
        );

        const pressureDropTooltip = (
            <div>
                <p>Es la reducción de presión entre dos puntos de la tubería, causada por la pérdida de carga.</p>
                <Formula>ΔP = H<sub>f</sub> &middot; ρ &middot; g</Formula>
                <Variables items={{
                    'ΔP': 'Caída de Presión',
                    'H\u2093': 'Pérdida de Carga',
                    'ρ': 'Densidad del fluido',
                    'g': 'Gravedad',
                }} />
            </div>
        );

        const velocityTooltip = (
            <div>
                <p>Velocidad promedio a la que el fluido se desplaza a través de la tubería.</p>
                <Formula>v = Q / A</Formula>
                <Variables items={{
                    'v': 'Velocidad',
                    'Q': 'Caudal',
                    'A': 'Área transversal',
                }} />
            </div>
        );

        const reynoldsTooltip = (
            <div>
                <p>Valor adimensional que predice el régimen de flujo (laminar o turbulento).</p>
                <Formula>Re = (v &middot; D) / ν</Formula>
                <Variables items={{
                    'Re': 'Número de Reynolds',
                    'v': 'Velocidad',
                    'D': 'Diámetro',
                    'ν': 'Viscosidad cinemática',
                }} />
            </div>
        );

        const frictionFactorTooltip = (
            <div>
                <p>Coeficiente adimensional que representa la resistencia al flujo en la ecuación de Darcy-Weisbach.</p>
                <h4 className="mt-3 font-semibold text-slate-300">Flujo Laminar (Re &lt; 2300)</h4>
                <Formula>f = 64 / Re</Formula>
                <Variables items={{ 'f': 'Factor de Fricción', 'Re': 'Número de Reynolds' }} />
                
                <h4 className="mt-3 font-semibold text-slate-300">Flujo Turbulento (Re &gt; 4000)</h4>
                <p className="text-xs text-slate-400">Calculado con la ecuación de Swamee-Jain, que considera la rugosidad relativa (ε/D) y el Número de Reynolds.</p>
            </div>
        );
        
         const flowRegimeTooltip = (
            <div>
                <p>Clasificación del comportamiento del flujo según el Número de Reynolds (Re):</p>
                 <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                     <li><strong className="font-semibold text-slate-300">Laminar (Re &lt; 2300):</strong> Flujo suave y ordenado.</li>
                     <li><strong className="font-semibold text-slate-300">Transición (2300 ≤ Re ≤ 4000):</strong> Flujo inestable y mixto.</li>
                     <li><strong className="font-semibold text-slate-300">Turbulento (Re &gt; 4000):</strong> Flujo caótico y con remolinos.</li>
                 </ul>
            </div>
        );

        return (
            <div className="space-y-3">
                <ResultItemWithTooltip 
                    label="Pérdida de Carga" 
                    value={formatNumber(getDisplayValue(results.headLossMeters, unitSystem, 'headLoss'))} 
                    unit={getDisplayUnit(unitSystem, 'headLoss')}
                    tooltipContent={headLossTooltip} 
                />
                <ResultItemWithTooltip 
                    label="Caída de Presión" 
                    value={formatNumber(getDisplayValue(results.pressureDropBar, unitSystem, 'pressureDropBar'))}
                    unit={getDisplayUnit(unitSystem, 'pressureDropBar')}
                    tooltipContent={pressureDropTooltip} 
                />
                 {unitSystem === 'SI' && (
                    <ResultItemWithTooltip 
                        label="Caída de Presión (absoluta)" 
                        value={formatNumber(results.pressureDropPascal)} 
                        unit="Pa" 
                        tooltipContent={pressureDropTooltip} 
                    />
                )}
                <ResultItemWithTooltip 
                    label="Velocidad del Fluido" 
                    value={formatNumber(getDisplayValue(results.velocity, unitSystem, 'velocity'))}
                    unit={getDisplayUnit(unitSystem, 'velocity')}
                    tooltipContent={velocityTooltip} 
                />
                <ResultItemWithTooltip 
                    label="Número de Reynolds" 
                    value={formatNumber(results.reynoldsNumber)} 
                    unit="" 
                    tooltipContent={reynoldsTooltip} 
                />
                <ResultItemWithTooltip 
                    label="Factor de Fricción" 
                    value={formatNumber(results.frictionFactor)} 
                    unit="" 
                    tooltipContent={frictionFactorTooltip} 
                />
                <div className="flex justify-between items-center py-3 px-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-slate-400">Régimen de Flujo</span>
                         <Tooltip content={flowRegimeTooltip}>
                            <InfoIcon />
                        </Tooltip>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${regimeStyles[results.flowRegime]}`}>
                        {results.flowRegime}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg h-auto min-h-[24rem]">
            <h2 className="text-xl font-semibold text-white border-b-2 border-slate-600 pb-2 mb-4">Resultados del Cálculo</h2>
            <div className="flex-grow">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResultsDisplay;
