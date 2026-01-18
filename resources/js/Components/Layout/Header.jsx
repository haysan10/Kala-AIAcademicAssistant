import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
    PlusIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import Button from '@/Components/UI/Button';

export default function Header({ onMenuClick }) {
    const { auth } = usePage().props;
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <header className="sticky top-0 z-40 h-16 bg-surface-light-200/80 dark:bg-surface-dark-200/80 backdrop-blur-cinematic border-b border-surface-light-border dark:border-surface-dark-border transition-colors duration-500">
            <div className="h-full flex items-center justify-between px-4 lg:px-phi-lg">

                {/* Left: Search + Mobile Menu */}
                <div className="flex items-center gap-3 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-phi text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                    >
                        <Bars3Icon className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center flex-1 max-w-md group">
                        <div className="relative w-full">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30 group-focus-within:text-slate-950 dark:group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                className="w-full pl-10 pr-4 py-2 rounded-phi-md bg-slate-100 dark:bg-surface-dark-100 border border-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-slate-950/20 dark:focus:ring-white/10 focus:border-slate-950/40 dark:focus:border-white/20 focus:bg-white dark:focus:bg-surface-dark-200 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-phi-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-5 h-5" />
                        ) : (
                            <MoonIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Create New Button */}
                    <Link href="/assignments/create">
                        <Button variant="primary" size="sm" className="gap-1.5">
                            <PlusIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">New</span>
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    );
}
