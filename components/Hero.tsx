import React from 'react';
import { PeacockLogo } from './icons/PeacockLogo';

export const Hero: React.FC = () => {
    return (
        <section className="bg-peacock-green text-white animate-fade-in">
            <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center justify-center text-center md:text-left">
                <PeacockLogo className="h-24 w-24 md:h-32 md:w-32 mb-6 md:mb-0 md:mr-8 shrink-0" />
                <div>
                    <h1 
                        className="text-4xl md:text-5xl font-serif italic text-peacock-gold-light" 
                        style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}
                    >
                        Peacock- Love is all about sharing what we cherish!
                    </h1>
                </div>
            </div>
        </section>
    );
};
