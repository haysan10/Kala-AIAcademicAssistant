import { motion } from 'framer-motion';
import { cn } from '@/Lib/utils';

export default function StatCard({ title, value, icon: Icon, color = 'kala', index = 0 }) {
    const colorClasses = {
        kala: 'from-kala-700 to-kala-900',
        green: 'from-kala-500 to-kala-700',
        orange: 'from-kala-400 to-kala-600',
        blue: 'from-kala-600 to-kala-800',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="card p-phi-md flex items-center gap-phi"
        >
            {/* Icon */}
            <div className={cn(
                "w-12 h-12 rounded-phi-md bg-gradient-to-br flex items-center justify-center shadow-lg",
                `bg-gradient-to-br ${colorClasses[color]}`,
                color === 'kala' && 'shadow-kala-950/20',
                color === 'green' && 'shadow-slate-800/10',
                color === 'orange' && 'shadow-slate-900/10',
                color === 'blue' && 'shadow-slate-800/10'
            )}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 dark:text-white/50 mb-0.5">
                    {title}
                </p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    {value}
                </p>
            </div>
        </motion.div>
    );
}
