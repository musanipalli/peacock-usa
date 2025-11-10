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

export const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onLoginClick, user, userType, onLogout, onOrderHistoryClick, onProfileClick, onMyProductsClick, onVideoGeneratorClick, onSelectCategory, onGoHome }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <button onClick={onGoHome} className="flex items-center focus:outline-none">
                        <PeacockLogo className="h-12 w-12" />
                        <h1 className="ml-2 text-2xl font-serif font-bold text-peacock-dark">Peacock</h1>
                    </button>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink onClick={() => onSelectCategory(Category.Women)}>Women</NavLink>
                        <NavLink onClick={() => onSelectCategory(Category.Men)}>Men</NavLink>
                        <Dropdown title="Kids">
                            <DropdownLink onClick={() => onSelectCategory(Category.KidsBoys)}>Boys</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.KidsGirls)}>Girls</DropdownLink>
                        </Dropdown>
                        <Dropdown title="Accessories">
                            <DropdownLink onClick={() => onSelectCategory(Category.Handbags)}>Handbags</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.Shoes)}>Shoes</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.Jwellery)}>Jwellery</DropdownLink>
                        </Dropdown>
                        <Dropdown title="Home Decor">
                            <DropdownLink onClick={() => onSelectCategory(Category.PoojaItems)}>Pooja Items</DropdownLink>
                            <DropdownLink onClick={() => onSelectCategory(Category.HomeDecor)}>Decor</DropdownLink>
                        </Dropdown>
                        <NavLink>About Us</NavLink>
                        <NavLink>Community</NavLink>
                        <NavLink onClick={onVideoGeneratorClick}>Video Gen</NavLink>
                    </nav>
                    <div className="flex items-center space-x-4">
                         <button className="text-gray-600 hover:text-peacock-magenta transition-colors duration-300">
                           <SearchIcon className="h-6 w-6" />
                        </button>
                        <button onClick={onCartClick} className="relative text-gray-600 hover:text-peacock-magenta transition-colors duration-300">
                            <CartIcon className="h-7 w-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-peacock-magenta text-white text-xs font-bold">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                         {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 font-medium text-sm text-peacock-dark px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
                                     <span>Hi, {user.name.split(' ')[0]}</span>
                                     <ChevronDownIcon className="h-3 w-3" />
                                </button>
                                <div className="absolute top-full right-0 pt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-50">
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
                                className="bg-peacock-magenta text-white px-4 py-2 rounded-full hover:bg-peacock-sapphire transition-all duration-300 shadow-sm font-medium text-sm"
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