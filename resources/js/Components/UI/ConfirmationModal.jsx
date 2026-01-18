import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/Components/UI/Button';
import { useEffect } from 'react';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    loading = false
}) {
    // Prevent verify scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // remove antigravity-scroll-lock if present from other tools
            document.body.classList.remove('antigravity-scroll-lock');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'text-red-500',
            bg: 'bg-red-500/10',
            button: 'bg-red-500 hover:bg-red-600 border-transparent text-white',
        },
        warning: {
            icon: 'text-amber-500',
            bg: 'bg-amber-500/10',
            button: 'bg-amber-500 hover:bg-amber-600 border-transparent text-white',
        },
        info: {
            icon: 'text-blue-500',
            bg: 'bg-blue-500/10',
            button: 'btn-primary',
        }
    };

    const theme = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${theme.bg}`}>
                        <ExclamationTriangleIcon className={`w-8 h-8 ${theme.icon}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-white/60 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                            className="justify-center"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            loading={loading}
                            className={`justify-center ${theme.button}`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
