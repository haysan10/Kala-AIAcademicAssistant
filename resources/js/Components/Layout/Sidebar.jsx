import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    AcademicCapIcon,
    SparklesIcon,
    Cog6ToothIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/Lib/utils';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Assignments', href: '/assignments', icon: AcademicCapIcon },
        { name: 'AI Tutor', href: '/tutor', icon: SparklesIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-surface-light-200 dark:bg-surface-dark-100 border-r border-surface-light-border dark:border-surface-dark-border transition-all duration-300 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>

                {/* Header */}
                <div className="h-16 flex items-center justify-between px-phi-md border-b border-surface-light-border dark:border-surface-dark-border">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-phi bg-kala-950 dark:bg-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:shadow-xl transition-all">
                            <span className="text-white dark:text-black font-display font-bold text-lg">K</span>
                        </div>
                        <span className="font-display font-bold text-xl text-slate-900 dark:text-white">Kala</span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-phi text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-phi-md space-y-1 overflow-y-auto scrollbar-thin">
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-phi-md transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-slate-950 dark:bg-white text-white dark:text-black"
                                        : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute left-0 w-1 h-6 bg-slate-950 dark:bg-white rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    isActive && "scale-110"
                                )} />
                                <span className="font-medium">{item.name}</span>

                                {/* Hover Glow */}
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-phi-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute inset-0 bg-slate-950/5 dark:bg-white/5 rounded-phi-md" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-phi-md border-t border-surface-light-border dark:border-surface-dark-border">
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 p-3 rounded-phi-md hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white font-semibold border border-slate-300 dark:border-white/10">
                            {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {auth.user?.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-white/40 truncate">
                                View profile
                            </p>
                        </div>
                    </Link>
                </div>

            </aside>
        </>
    );
}
