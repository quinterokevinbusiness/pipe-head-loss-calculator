
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v1.5m0 9V18m-6-6h1.5m9 0H18" />
                        </svg>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Calculadora de Pérdida de Carga
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
