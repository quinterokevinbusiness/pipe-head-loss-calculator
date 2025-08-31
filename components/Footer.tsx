
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 mt-12">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Calculadora de Pérdida de Carga. Creado con fines demostrativos.</p>
            </div>
        </footer>
    );
};

export default Footer;
