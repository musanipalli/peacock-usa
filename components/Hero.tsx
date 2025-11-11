import React, { useState, useEffect } from 'react';
import { PeacockLogo } from './icons/PeacockLogo';
import { GoogleGenAI } from '@google/genai';

const defaultTagline = "Peacock - Love is all about sharing what we cherish!";

export const Hero: React.FC = () => {
    const [tagline, setTagline] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTagline = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: 'Generate a short, elegant, and welcoming tagline for an e-commerce website named "Peacock" that sells and rents premium, exquisite Indian attire like sarees, lehengas, and sherwanis. The tone should be sophisticated and celebratory. Max 15 words.',
                });
                
                const newTagline = response.text.trim().replace(/"/g, ''); // Remove quotes from response
                setTagline(newTagline || defaultTagline);
            } catch (error) {
                console.error("Failed to fetch tagline from Gemini API:", error);
                setTagline(defaultTagline);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTagline();
    }, []);
    
    const displayTagline = isLoading ? "Crafting a special welcome for you..." : tagline;

    return (
        <section className="bg-peacock-green text-white animate-fade-in">
            <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center justify-center text-center md:text-left min-h-[250px]">
                <PeacockLogo className="h-24 w-24 md:h-32 md:w-32 mb-6 md:mb-0 md:mr-8 shrink-0" />
                <div>
                    <h1 
                        className={`text-4xl md:text-5xl font-serif italic text-peacock-gold-light transition-opacity duration-700 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                        style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}
                    >
                        {displayTagline}
                    </h1>
                </div>
            </div>
        </section>
    );
};
