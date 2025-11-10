import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Allow time for fade-out animation before calling onClose
                setTimeout(onClose, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div 
            className={`fixed bottom-5 right-5 bg-peacock-dark text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            {message}
        </div>
    );
};