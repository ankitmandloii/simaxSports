import { createContext, useContext, useState, } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = ({ content, error = false, duration = 2000, icon = null }) => {
        setToast({ content, error, icon });
        setTimeout(() => {
            setToast(null);
        }, duration); // Auto-dismiss after `duration` ms
    };



    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div style={{
                    fontSize: '16px',
                    minWidth: '320px',
                    padding: '20px 32px',
                    maxWidth: '480px',
                    borderRadius: '8px',
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    transition: 'opacity 0.3s ease-in-out'
                }}>
                    <div style={{
                        backgroundColor: '#000000',
                        color: toast.error ? '#E32727FF' : '#ffffff',
                        padding: '12px 20px',
                        borderRadius: '6px',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '250px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px' // spacing between icon and text
                    }}>
                        {toast.icon && <span>{toast.icon}</span>}
                        <span>{toast.content}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);