import type { UnitSystem, InputUnits, LengthUnit, DiameterUnit, RoughnessUnit, FlowRateUnit, DensityUnit, ViscosityUnit } from "../types";

// --- Type Definitions ---
export type AllUnits = LengthUnit | DiameterUnit | RoughnessUnit | FlowRateUnit | DensityUnit | ViscosityUnit;
export type ParamType = 'length' | 'diameter' | 'roughness' | 'flowRate' | 'density' | 'kinematicViscosity' | 'velocity' | 'headLoss' | 'pressureDropBar' | 'pressureDropPascal';

// --- Unit Configuration ---
const UNIT_CONFIG: Record<ParamType, Partial<Record<UnitSystem, AllUnits[]>>> = {
    length:             { SI: ['m', 'cm'], Imperial: ['ft', 'in'] },
    diameter:           { SI: ['mm', 'cm'], Imperial: ['in'] },
    roughness:          { SI: ['mm', 'µm'], Imperial: ['in'] },
    flowRate:           { SI: ['L/s', 'm³/h'], Imperial: ['GPM', 'ft³/s'] },
    density:            { SI: ['kg/m³'], Imperial: ['lb/ft³'] },
    kinematicViscosity: { SI: ['cSt', 'm²/s'], Imperial: ['cSt'] }, // cSt is common
    // Output-only params
    velocity:           {},
    headLoss:           {},
    pressureDropBar:    {},
    pressureDropPascal: {},
};

const DEFAULT_UNITS: Record<UnitSystem, InputUnits> = {
    SI: {
        length: 'm',
        diameter: 'mm',
        roughness: 'mm',
        flowRate: 'L/s',
        density: 'kg/m³',
        kinematicViscosity: 'cSt',
    },
    Imperial: {
        length: 'ft',
        diameter: 'in',
        roughness: 'in',
        flowRate: 'GPM',
        density: 'lb/ft³',
        kinematicViscosity: 'cSt',
    }
};

// Base units are SI
const CONVERSION_FACTORS: Record<AllUnits, number> = {
    // Length (base: m)
    'm': 1,
    'cm': 0.01,
    'mm': 0.001,
    'ft': 0.3048,
    'in': 0.0254,
    // Roughness (base: mm)
    'µm': 0.001,
    // Flow Rate (base: L/s)
    'L/s': 1,
    'm³/h': 1000 / 3600,
    'GPM': 0.0630902,
    'ft³/s': 28.3168,
    // Density (base: kg/m³)
    'kg/m³': 1,
    'lb/ft³': 16.0185,
    // Viscosity (base: cSt)
    'cSt': 1,
    'm²/s': 1e6,
};


/**
 * Converts a value from one unit to another.
 * @param value The numerical value to convert.
 * @param from The starting unit.
 * @param to The target unit.
 * @returns The converted value.
 */
export const convert = (value: number, from: AllUnits, to: AllUnits): number => {
    if (from === to) return value;
    
    // Get the factor to convert 'from' unit to its SI base
    const fromFactor = CONVERSION_FACTORS[from] ?? 1;
    // Get the factor to convert 'to' unit to its SI base
    const toFactor = CONVERSION_FACTORS[to] ?? 1;

    // Convert 'from' value to SI base, then from SI base to 'to' unit
    const valueInBase = value * fromFactor;
    return valueInBase / toFactor;
};

/**
 * Gets the list of available units for a parameter type and unit system.
 */
export const getUnitsFor = (paramType: ParamType, system: UnitSystem): AllUnits[] => {
    return UNIT_CONFIG[paramType]?.[system] ?? [];
};

/**
 * Gets the default set of units for a given system.
 */
export const getDefaultUnits = (system: UnitSystem): InputUnits => {
    return DEFAULT_UNITS[system];
};


// --- Functions for Displaying Results (maintaining old simple logic) ---

const DISPLAY_CONVERSIONS = {
    toImperial: {
        velocity: (ms: number) => ms * 3.28084,
        headLoss: (m: number) => m * 3.28084,
        pressureDropBar: (bar: number) => bar * 14.5038,
        pressureDropPascal: (pa: number) => pa * 0.000145038,
        length: (m: number) => m * 3.28084,
    }
};

const DISPLAY_UNITS: Record<UnitSystem, Record<string, string>> = {
    SI: {
        velocity: 'm/s',
        headLoss: 'm',
        pressureDropBar: 'bar',
        pressureDropPascal: 'Pa',
        length: 'm'
    },
    Imperial: {
        velocity: 'ft/s',
        headLoss: 'ft',
        pressureDropBar: 'psi',
        pressureDropPascal: 'psi',
        length: 'ft'
    }
};

/**
 * Converts a result value from SI to the target display system.
 * This is for the results section, not the granular inputs.
 */
export const getDisplayValue = (siValue: number, system: UnitSystem, type: ParamType): number => {
    if (system === 'SI' || !DISPLAY_CONVERSIONS.toImperial[type]) {
        return siValue;
    }
    return DISPLAY_CONVERSIONS.toImperial[type](siValue);
};

/**
 * Gets the appropriate unit label for the results display.
 */
export const getDisplayUnit = (system: UnitSystem, type: ParamType): string => {
    return DISPLAY_UNITS[system][type] ?? '';
};
