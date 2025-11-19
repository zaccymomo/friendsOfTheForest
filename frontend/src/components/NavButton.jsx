import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavButton({ to, children, className = '' }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = location.pathname.startsWith(to);

    const baseClasses = 'px-4 py-1 rounded-full font-bold transition-colors duration-200';
    const activeClasses = 'bg-warning border border-brand hover:bg-warning-dark';
    const inactiveClasses = 'bg-white text-brand border border-brand hover:bg-gray-100';

    const buttonClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`;

    return (
        <button
            className={buttonClasses}
            onClick={() => navigate(to)}
        >
            {children}
        </button>
    );
} 