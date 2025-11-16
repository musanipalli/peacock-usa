import React from 'react';
import { PeacockLogo } from './icons/PeacockLogo';

const communityPages = [
    {
        title: 'Peacock Circle',
        description: 'Weekly styling forums hosted by diaspora creatives. Swap looks, source heirlooms, and crowdsource tailors.',
        action: 'Join the Thursday circle',
    },
    {
        title: 'Restyle Club',
        description: 'Community marketplace to lend or rent couture for weddings, baby showers, or photoshoots.',
        action: 'List a beloved outfit',
    },
    {
        title: 'Heritage Press',
        description: 'Stories, rituals, and DIY draping guides from aunties across 26 countries.',
        action: 'Read the latest issue',
    },
];

const aboutStats = [
    { label: 'Founded', value: 'Hyderabad, 2012' },
    { label: 'Artisans supported', value: '2,300+' },
    { label: 'Cities served', value: '48 worldwide' },
];

export const BrandShowcase: React.FC = () => (
    <section id="about" className="py-20 bg-[#050505] border-t border-white/10 text-white">
        <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-2">
                <div className="rounded-3xl bg-gradient-to-br from-[#112017] via-[#0f4a2c] to-[#07140d] p-10 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-white/10 p-3">
                            <PeacockLogo className="h-full w-full" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.5em] text-peacock-emerald">About us</p>
                            <h2 className="text-3xl font-serif text-peacock-gold-light">Peacock Heritage House</h2>
                        </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">
                        Born from a single trunk of heirloom sarees, Peacock helps the diaspora celebrate with intention.
                        We partner directly with ateliers in Jaipur, Kanchipuram, and Channapatna to craft slow fashion,
                        then concierge-ship them across the world with alterations, care guides, and cultural context.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {aboutStats.map((stat) => (
                            <div key={stat.label} className="rounded-2xl bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
                                <p className="text-lg font-semibold text-white mt-2">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-white/60 mt-6">
                        Love is all about sharing what we cherish&mdash;and making sure every celebration feels like home.
                    </p>
                </div>

                <div id="community" className="space-y-6">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-xs uppercase tracking-[0.5em] text-white/50">Community pages</p>
                                <h3 className="text-3xl font-serif mt-2">Where our patrons gather</h3>
                            </div>
                            <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-sm text-white/70">
                                <span className="w-2 h-2 rounded-full bg-peacock-magenta mr-2 animate-pulse" />
                                35K verified members
                            </span>
                        </div>
                        <p className="text-white/70 mt-4">
                            Tap into curated forums, swap closets, or volunteer to mentor first-time hosts&mdash;each page is moderated by local culture keepers.
                        </p>
                    </div>
                    <div className="grid gap-5">
                        {communityPages.map((page) => (
                            <div key={page.title} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 hover:border-peacock-magenta/40 transition">
                                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{page.title}</p>
                                <p className="text-lg text-white mt-2">{page.description}</p>
                                <button className="mt-4 inline-flex items-center text-peacock-magenta font-semibold">
                                    {page.action}
                                    <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);
