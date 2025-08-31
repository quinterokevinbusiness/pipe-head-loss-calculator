export type UnitSystem = 'SI' | 'Imperial';

export interface Fluid {
    name: string;
    density: number; // kg/m^3
    kinematicViscosity: number; // cSt
}

export interface PipeParams {
  length: number; // metros
  diameter: number; // milímetros
  roughness: number; // milímetros
}

export interface FluidParams {
  flowRate: number; // litros por segundo
  kinematicViscosity: number; // cSt (centiStokes)
  density: number; // kg/m^3
}

export interface CalculationResult {
  headLossMeters: number; // metros
  pressureDropPascal: number; // Pascales
  pressureDropBar: number; // Bar
  velocity: number; // m/s
  reynoldsNumber: number; // adimensional
  frictionFactor: number; // adimensional
  flowRegime: 'Laminar' | 'Transición' | 'Turbulento';
  pressureMapData: { distance: number; pressureLoss: number }[];
}

export interface Material {
    name: string;
    roughness: number; // en mm
}

// Specific unit types for input fields
export type LengthUnit = 'm' | 'cm' | 'ft' | 'in';
export type DiameterUnit = 'mm' | 'cm' | 'in';
export type RoughnessUnit = 'mm' | 'µm' | 'in';
export type FlowRateUnit = 'L/s' | 'm³/h' | 'GPM' | 'ft³/s';
export type DensityUnit = 'kg/m³' | 'lb/ft³';
export type ViscosityUnit = 'cSt' | 'm²/s';

export interface InputUnits {
    length: LengthUnit;
    diameter: DiameterUnit;
    roughness: RoughnessUnit;
    flowRate: FlowRateUnit;
    density: DensityUnit;
    kinematicViscosity: ViscosityUnit;
}
