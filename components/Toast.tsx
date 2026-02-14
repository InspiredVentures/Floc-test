import React, { useEffect, useState } from 'react';
import { useToast, Toast as ToastType } from '../contexts/ToastContext';

const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
    const { removeToast } = useToast();
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 300);
    };

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => handleClose(), toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const config = {
        success: {
            icon: 'check_circle',
            bg: 'bg-accent/90',
            border: 'border-accent/40',
            iconColor: 'text-white'
        },
        error: {
            icon: 'error',
            bg: 'bg-red-500/90',
            border: 'border-red-400',
            iconColor: 'text-red-100'
        },
        warning: {
            icon: 'warning',
            bg: 'bg-accent/90',
            border: 'border-accent/40',
            iconColor: 'text-white'
        },
        info: {
            icon: 'info',
            bg: 'bg-blue-500/90',
            border: 'border-blue-400',
            iconColor: 'text-blue-100'
        }
    }[toast.type];

    return (
        <div
            className={`flex items-center gap-3 ${config.bg} backdrop-blur-xl border ${config.border} rounded-2xl px-4 py-3 shadow-2xl min-w-[300px] max-w-md transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
                }`}
        >
            <div className={`${config.iconColor}`}>
                <span className="material-symbols-outlined text-2xl">{config.icon}</span>
            </div>
            <p className="flex-1 text-white font-semibold text-sm">{toast.message}</p>
            <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} />
                </div>
            ))}
        </div>
    );
};
