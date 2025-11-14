import React from 'react';
import { PeacockLogo } from './icons/PeacockLogo';
import { CartIcon } from './icons/CartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { User, UserType, Category } from '../types';

interface HeaderProps {
    cartItemCount: number;
    onCartClick: () => void;
    onLoginClick: () => void;
    onOrderHistoryClick: () => void;
    onProfileClick: () => void;
    onVideoGeneratorClick: () => void;
    onMyProductsClick: () => void;
    onSelectCategory: (category: Category) => void;
    onGoHome: () => void;
    user: User | null;
    userType: UserType | null;
    onLogout: () => void;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const NavLink: React.FC<{ href?: string; children: React.ReactNode; onClick?: () => void }> = ({ href = "#", children, onClick }) => (
    <a href={href} onClick={(e) => {
        if (onClick) { e.preventDefault(); onClick(); }
    }} className="text-gray-600 hover:text-peacock-magenta transition-colors duration-300 font-medium cursor-pointer">
        {children}
    </a>
);

const Dropdown: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative group">
        <button className="text-gray-600 hover:text-peacock-magenta transition-colors duration-300 font-medium flex items-center">
            {title}
            <ChevronDownIcon className="h-3 w-3 ml-1" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-50">
            {children}
        </div>
    </div>
);

const DropdownLink: React.FC<{ href?: string; children: React.ReactNode; onClick?: () => void }> = ({ href = "#", children, onClick }) => (
    <a href={href} onClick={(e) => {
        if (onClick) { e.preventDefault(); onClick(); }
    }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-peacock-magenta cursor-pointer">
        {children}
    </a>
);

export const Header: React.FC<HeaderProps> = ({
    cartItemCount,
    onCartClick,
    onLoginClick,
    user,
    userType,
    onLogout,
    onOrderHistoryClick,
    onProfileClick,
    onMyProductsClick,
    onVideoGeneratorClick,
    onSelectCategory,
    onGoHome,
}) => {
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#020202]/85 backdrop-blur-xl text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex h-20 items-center justify-between gap-6">
                    <button onClick={onGoHome} className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full bg-white/5 p-2 shadow-lg ring-1 ring-white/10">
                            <PeacockLogo className="h-full w-full" />
                        </div>
                        <div>
                            <p className="text-xl font-script leading-none text-peacock-gold-light">Peacock</p>
                            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Est. 2025</p>
                        </div>
                    </button>
                    <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
                        <NavLink onClick={() => onSelectCategory(Category.Women)}>Women</NavLink>
                        <NavLink onClick={() => onSelectCategory(Category.Men)}>Men</NavLink>
                        <Dropdown title="Kids">
                            <DropdownLink onClick={() => onSelectCategory(Category.KidsBoys)}>Boys</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.KidsGirls)}>Girls</DropdownLink>
                        </Dropdown>
                        <Dropdown title="Accessories">
                            <DropdownLink onClick={() => onSelectCategory(Category.Handbags)}>Handbags</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.Jwellery)}>Jewellery</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.Shoes)}>Shoes</DropdownLink>
                        </Dropdown>
                        <Dropdown title="Decor">
                            <DropdownLink onClick={() => onSelectCategory(Category.HomeDecor)}>Home</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.PoojaItems)}>Pooja</DropdownLink>
                        </Dropdown>
                        <NavLink onClick={onVideoGeneratorClick}>Video Atelier</NavLink>
                        <NavLink>Stories</NavLink>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/50 hover:text-white transition">
                            <SearchIcon className="h-5 w-5" />
                        </button>
                        <button onClick={onCartClick} className="relative rounded-full border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/50 transition">
                            <CartIcon className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-peacock-magenta text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                                    <span className="text-white/80">Hi, {user.name.split(' ')[0]}</span>
                                    <ChevronDownIcon className="h-3 w-3" />
                                </button>
                                <div className="invisible absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0f0f0f] p-2 text-white/80 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                                    <DropdownLink onClick={onProfileClick}>My Profile</DropdownLink>
                                    <DropdownLink onClick={onOrderHistoryClick}>Order History</DropdownLink>
                                    {userType === 'seller' && (
                                        <DropdownLink onClick={onMyProductsClick}>My Products</DropdownLink>
                                    )}
                                    <DropdownLink onClick={onLogout}>Logout</DropdownLink>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="rounded-full bg-peacock-magenta px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-peacock-magenta/30 transition hover:bg-peacock-sapphire"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
