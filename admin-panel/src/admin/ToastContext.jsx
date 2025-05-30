import { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = ({ content, error = false, duration = 3000 }) => {
        setToast({ content, error });
        setTimeout(() => {
            setToast(null);
        }, duration); // Auto-dismiss after `duration` ms
    };

    const dismissToast = () => setToast(null);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    transition: 'opacity 0.3s ease-in-out'
                }}>
                    <div style={{
                        backgroundColor: toast.error ? '#fdecea' : '#e6f7ec',
                        color: toast.error ? '#a61b1b' : '#067f3c',
                        padding: '12px 20px',
                        borderRadius: '6px',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '250px'
                    }}>
                        {toast.content}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
