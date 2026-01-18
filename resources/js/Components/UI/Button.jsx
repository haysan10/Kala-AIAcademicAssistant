import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/Lib/utils';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading = false,
    ...props
}, ref) => {
    const baseClasses = 'btn';

    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
    };

    const sizes = {
        sm: 'px-phi py-phi-xs text-xs',
        md: 'px-phi-md py-phi-sm text-sm',
        lg: 'px-phi-lg py-phi text-base',
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: (disabled || loading) ? 1 : 1.02 }}
            whileTap={{ scale: (disabled || loading) ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={cn(
                baseClasses,
                variants[variant],
                sizes[size],
                loading && 'relative',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    />
                </motion.div>
            )}
            <span className={loading ? 'opacity-0' : ''}>
                {children}
            </span>
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
