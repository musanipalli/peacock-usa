import React from 'react';
import { PeacockLogo } from './icons/PeacockLogo';

const lockups = [
    {
        id: 'emerald',
        background: 'from-[#0b2016] via-[#0f502f] to-[#0b2016]',
        accent: 'text-peacock-gold-light',
        description: 'Use on light hero moments where the golden crest can glow over emerald silk backdrops.',
    },
    {
        id: 'noir',
        background: 'from-[#020202] via-[#050505] to-[#020202]',
        accent: 'text-white',
        description: 'Monochrome engraving ideal for stationery, invoices, and packaging seals.',
    },
    {
        id: 'parchment',
        background: 'from-[#f4e6c4] via-[#fdf8e9] to-[#f4e6c4]',
        accent: 'text-[#b88917]',
        description: 'Soft gold typography for invitations, thank-you notes, and bespoke concierge messaging.',
    },
];

export const BrandShowcase: React.FC = () => (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                    <p className="text-xs uppercase tracking-[0.5em] text-peacock-emerald">Brand kit</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-peacock-dark mt-2">Crests &amp; Wordmarks</h2>
                    <p className="text-peacock-dark/70 mt-2 max-w-2xl">
                        Inspired by the provided logo board, these lockups combine the gilded feather with the signature
                        script line “Peacock – Love is all about sharing what we cherish!”. Drop them into hero banners,
                        onboarding emails, or event microsites for an instantly recognizable touch.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-3 h-3 rounded-full bg-peacock-magenta animate-pulse" />
                    <p className="text-sm text-peacock-dark/70">Premium UI refresh applied</p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {lockups.map((item) => (
                    <div key={item.id} className={`rounded-3xl p-8 text-center shadow-xl border border-black/5 bg-gradient-to-br ${item.background}`}>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="bg-white/5 rounded-full p-6">
                                <PeacockLogo className="h-20 w-20" />
                            </div>
                            <p className={`font-script text-3xl md:text-4xl ${item.accent}`}>Peacock</p>
                            <p className={`${item.accent} text-lg italic`}>Love is all about sharing what we cherish!</p>
                            <p className="text-sm text-white/80 md:text-left">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
