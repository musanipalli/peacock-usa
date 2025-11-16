import React, { useState } from 'react';
import { User, UserType } from '../types';
import { backend } from '../services/backend';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User, userType: UserType) => void;
}

type Mode = 'login' | 'signup';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [userType, setUserType] = useState<UserType>('customer');
    const [mode, setMode] = useState<Mode>('login');
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setMode('login');
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        onClose();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        
        const result = await backend.loginUser(email, password, userType);

        if (result.success && result.user) {
            onLoginSuccess(result.user, userType);
            handleClose();
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const newUser: Omit<User, 'phoneNumber'> = { name, email, password };
        const result = await backend.signupUser(newUser, userType);
        
        if (result.success) {
            alert(result.message);
            setMode('login');
            setName('');
            setEmail('');
            setPassword('');
        } else {
            setError(result.message);
        }
    };

    const renderLoginForm = () => (
        <form className="space-y-4" onSubmit={handleLogin}>
            {error && <p className="text-sm text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}
            <div>
                <label className="text-sm font-medium text-gray-800">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-800">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-peacock-magenta text-white py-3 rounded-full font-bold hover:bg-peacock-sapphire transition-colors duration-300"
            >
                Login
            </button>
            <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="font-medium text-peacock-magenta hover:underline">Sign up</button>
            </p>
        </form>
    );

    const renderSignupForm = () => (
        <form className="space-y-4" onSubmit={handleSignup}>
             {error && <p className="text-sm text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}
            <div>
                <label className="text-sm font-medium text-gray-800">Full Name</label>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-800">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-800">Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md focus:ring-peacock-magenta focus:border-peacock-magenta text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-peacock-marigold text-white py-3 rounded-full font-bold hover:bg-peacock-magenta transition-colors duration-300"
            >
                Create Account
            </button>
            <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-medium text-peacock-magenta hover:underline">Log in</button>
            </p>
        </form>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleClose}>
            <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-serif font-bold text-center mb-4 capitalize">
                     {mode === 'login' 
                        ? `${userType} Login` 
                        : `Create ${userType} Account`
                    }
                </h2>
                
                <div className="flex border-b mb-6">
                    <button 
                        onClick={() => setUserType('customer')}
                        className={`flex-1 py-2 text-center font-medium transition-colors ${userType === 'customer' ? 'text-peacock-magenta border-b-2 border-peacock-magenta' : 'text-gray-500'}`}
                    >
                        Customer
                    </button>
                    <button 
                        onClick={() => setUserType('seller')}
                        className={`flex-1 py-2 text-center font-medium transition-colors ${userType === 'seller' ? 'text-peacock-magenta border-b-2 border-peacock-magenta' : 'text-gray-500'}`}
                    >
                        Seller
                    </button>
                </div>
                
                {mode === 'login' ? renderLoginForm() : renderSignupForm()}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Just browsing?{' '}
                    <button type="button" onClick={handleClose} className="font-medium text-peacock-magenta hover:underline">
                        Continue as guest
                    </button>
                </p>
            </div>
        </div>
    );
};
