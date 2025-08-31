
import type { PipeParams, FluidParams, CalculationResult } from '../types';
import { GRAVITY } from '../constants';

export function calculateHeadLoss(pipe: PipeParams, fluid: FluidParams): CalculationResult | null {
    if (pipe.diameter <= 0 || pipe.length <= 0 || fluid.flowRate <= 0) {
        return null;
    }

    // --- Unit Conversions to SI units ---
    const D = pipe.diameter / 1000; // mm to m
    const L = pipe.length; // m
    const e = pipe.roughness / 1000; // mm to m
    const Q = fluid.flowRate / 1000; // L/s to m^3/s
    const nu = fluid.kinematicViscosity / 1e6; // cSt to m^2/s
    const rho = fluid.density; // kg/m^3

    // --- Core Calculations ---
    const area = Math.PI * Math.pow(D / 2, 2);
    const velocity = Q / area;

    const reynoldsNumber = (velocity * D) / nu;

    let frictionFactor: number;
    let flowRegime: 'Laminar' | 'Transición' | 'Turbulento';

    if (reynoldsNumber < 2300) {
        flowRegime = 'Laminar';
        frictionFactor = 64 / reynoldsNumber;
    } else if (reynoldsNumber >= 2300 && reynoldsNumber <= 4000) {
        flowRegime = 'Transición';
        // Swamee-Jain is for turbulent flow but is a reasonable approximation in transition
        const logTerm = Math.log10((e / (3.7 * D)) + (5.74 / Math.pow(reynoldsNumber, 0.9)));
        frictionFactor = 0.25 / Math.pow(logTerm, 2);
    } else { // reynoldsNumber > 4000
        flowRegime = 'Turbulento';
        const logTerm = Math.log10((e / (3.7 * D)) + (5.74 / Math.pow(reynoldsNumber, 0.9)));
        frictionFactor = 0.25 / Math.pow(logTerm, 2);
    }

    const headLossMeters = frictionFactor * (L / D) * (Math.pow(velocity, 2) / (2 * GRAVITY));
    const pressureDropPascal = headLossMeters * rho * GRAVITY;
    const pressureDropBar = pressureDropPascal / 100000;

    // --- Generate Pressure Map Data ---
    const steps = 100;
    const pressureMapData = Array.from({ length: steps + 1 }, (_, i) => {
        const distance = (L / steps) * i;
        const currentHeadLoss = frictionFactor * (distance / D) * (Math.pow(velocity, 2) / (2 * GRAVITY));
        const pressureLoss = currentHeadLoss * rho * GRAVITY;
        return { distance: parseFloat(distance.toFixed(2)), pressureLoss: parseFloat(pressureLoss.toFixed(2)) };
    });

    return {
        headLossMeters,
        pressureDropPascal,
        pressureDropBar,
        velocity,
        reynoldsNumber,
        frictionFactor,
        flowRegime,
        pressureMapData,
    };
}
