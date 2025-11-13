import React, { useState, useEffect } from 'react';
import { PeacockLogo } from './icons/PeacockLogo';
import { GoogleGenAI } from '@google/genai';

const defaultTagline = 'Peacock - Love is all about sharing what we cherish!';
const heroBackdrop = {
    backgroundImage: `url('/feather-pattern.svg')`,
    backgroundSize: '220px',
    backgroundRepeat: 'repeat',
};

export const Hero: React.FC = () => {
    const [tagline, setTagline] = useState(defaultTagline);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const fetchTagline = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: 'Write a short, elegant, and celebratory tagline (max 15 words) for a luxury Indian fashion house named Peacock that curates sarees, lehengas, sherwanis, and heritage decor available for purchase or rent.',
                }, { signal: controller.signal });

                const newTagline = response?.text?.trim().replace(/"/g, '');
                if (newTagline) {
                    setTagline(newTagline);
                }
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.warn('Gemini tagline fallback:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTagline();
        return () => controller.abort();
    }, []);

    return (
        <section className="relative overflow-hidden text-white isolate animate-fade-in">
            <div className="absolute inset-0" style={heroBackdrop} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b2016] via-[#144734] to-[#0b2016] opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
            <div className="relative container mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
                <div className="bg-white/5 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md border border-white/10 max-w-md w-full text-center md:text-left">
                    <PeacockLogo className="h-24 w-24 mx-auto md:mx-0 drop-shadow-lg" />
                    <p className="mt-6 text-4xl md:text-5xl font-script text-peacock-gold-light leading-snug">
                        {isLoading ? 'Crafting a special welcome for you...' : tagline}
                    </p>
                    <p className="mt-6 text-base md:text-lg text-white/80 font-serif">
                        Draped in emerald, brushed in gold—discover heirloom pieces curated for modern celebrations.
                    </p>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
                    {[
                        { title: 'Curated Couture', text: 'Designer sarees, lehengas, and sherwanis inspired by royal ateliers.' },
                        { title: 'Rent or Cherish', text: 'Experience luxury for the moment or keep it forever.' },
                        { title: 'Artisanal Decor', text: 'Heritage accents and pooja essentials crafted to illuminate every space.' },
                        { title: 'Concierge Care', text: 'Tailored fittings, global delivery, and white-glove support.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur peacock-sheen shadow-lg">
                            <p className="text-peacock-gold-light font-serif uppercase tracking-[0.2em] text-xs mb-2">{item.title}</p>
                            <p className="text-white/90">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
