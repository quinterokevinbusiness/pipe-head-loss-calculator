import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CalculationResult, UnitSystem } from '../types';
import { getDisplayValue, getDisplayUnit } from '../utils/units';

interface PressureMapChartProps {
    data: CalculationResult['pressureMapData'];
    unitSystem: UnitSystem;
}

const PressureMapChart: React.FC<PressureMapChartProps> = ({ data, unitSystem }) => {
    
    const displayData = data.map(point => ({
        distance: getDisplayValue(point.distance, unitSystem, 'length'),
        pressureLoss: getDisplayValue(point.pressureLoss, unitSystem, 'pressureDropPascal')
    }));

    const xAxisUnit = getDisplayUnit(unitSystem, 'pressureDropPascal');
    const yAxisUnit = getDisplayUnit(unitSystem, 'length');

    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-600 rounded-lg shadow-lg">
                    <p className="label text-slate-300">{`Caída de Presión: ${label.toFixed(2)} ${xAxisUnit}`}</p>
                    <p className="intro text-sky-400">{`Longitud: ${payload[0].value.toFixed(2)} ${yAxisUnit}`}</p>
                </div>
            );
        }
        return null;
    };

    const formatXAxis = (value: number): string => {
        if (unitSystem === 'SI') {
             if (value === 0) return '0 Pa';
             const absValue = Math.abs(value);
             if (absValue >= 1e5) return `${(value / 1e5).toFixed(1)} bar`;
             if (absValue >= 1e3) return `${(value / 1e3).toFixed(1)} kPa`;
             return `${value.toFixed(0)} Pa`;
        }
        // Imperial (psi)
        return `${value.toFixed(1)}`;
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 rounded-xl shadow-lg p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <h3 className="text-lg font-medium text-slate-300">Mapa de Presión</h3>
                <p className="text-slate-500 text-center">Genere un cálculo para visualizar el gráfico de caída de presión.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg h-96">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={displayData}
                    margin={{ top: 5, right: 20, left: 40, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                        dataKey="pressureLoss" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        label={{ value: `Caída de Presión (${xAxisUnit})`, position: 'insideBottom', offset: -15, fill: '#94a3b8' }}
                        stroke="#94a3b8"
                        tick={{ fill: '#cbd5e1', fontSize: 12 }}
                        tickFormatter={formatXAxis}
                    />
                    <YAxis 
                        dataKey="distance"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        label={{ value: `Longitud (${yAxisUnit})`, angle: -90, position: 'insideLeft', fill: '#94a3b8', dx: -35 }}
                        stroke="#94a3b8"
                        tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }} />
                    <Line 
                        type="monotone" 
                        dataKey="distance" 
                        name="Longitud" 
                        stroke="#38bdf8" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#e0f2fe', strokeWidth: 2 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PressureMapChart;
