import { forwardRef } from 'react';
import { cn } from '@/Lib/utils';

const Input = forwardRef(({
    type = 'text',
    className,
    error,
    label,
    helperText,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                ref={ref}
                className={cn(
                    'input',
                    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {(error || helperText) && (
                <p className={cn(
                    'mt-1.5 text-xs',
                    error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-white/40'
                )}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
