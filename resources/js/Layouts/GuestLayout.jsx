import { Link } from '@inertiajs/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light-300 dark:bg-surface-dark-300 transition-colors duration-500 relative overflow-hidden p-4">
            {/* Cinematic Background Glows */}
            <div className="absolute top-0 -left-40 w-80 h-80 bg-kala-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-kala-400/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-kala-600/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:max-w-md relative z-10"
            >
                {/* Logo and Brand */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex flex-col items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-14 h-14 rounded-phi-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-xl shadow-black/20"
                        >
                            <SparklesIcon className="w-8 h-8 text-white dark:text-black" />
                        </motion.div>
                        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Kala</h1>
                    </Link>
                </div>

                {/* Auth Card - Consistent with Dark Theme */}
                <div className="relative">
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-kala-500/20 via-kala-400/10 to-kala-500/20 rounded-phi-xl blur-xl opacity-0 dark:opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Main Card */}
                    <div className="relative bg-white dark:bg-surface-dark-100 rounded-phi-xl p-8 shadow-2xl shadow-black/5 dark:shadow-none border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                        {children}
                    </div>
                </div>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-sm text-slate-500 dark:text-white/30"
                >
                    Study Smarter • Plan Better • Excel with Kala
                </motion.p>
            </motion.div>
        </div>
    );
}
