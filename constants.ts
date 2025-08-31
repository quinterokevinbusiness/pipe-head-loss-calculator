
import type { Material } from './types';

export const MATERIALS: Material[] = [
    { name: 'Acero comercial o soldado', roughness: 0.045 },
    { name: 'Acero inoxidable', roughness: 0.002 },
    { name: 'Hierro fundido (nuevo)', roughness: 0.26 },
    { name: 'Hierro galvanizado', roughness: 0.15 },
    { name: 'PVC, Plástico, Vidrio', roughness: 0.0015 },
    { name: 'Cobre o Latón', roughness: 0.0015 },
    { name: 'Hormigón', roughness: 0.9 },
];

export const GRAVITY = 9.81; // m/s^2
