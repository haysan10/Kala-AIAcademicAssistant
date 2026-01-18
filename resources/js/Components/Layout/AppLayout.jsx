import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ children, title = 'Kala' }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-surface-light-300 dark:bg-surface-dark-300 transition-colors duration-500">

                {/* Ambient Background Glows */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-500/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse-soft" />
                    <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-slate-400/5 dark:bg-white/5 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
                </div>

                {/* Layout Structure */}
                <div className="relative flex h-screen overflow-hidden">

                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">

                        {/* Header */}
                        <Header onMenuClick={() => setSidebarOpen(true)} />

                        {/* Page Content */}
                        <main className="flex-1 overflow-y-auto scrollbar-thin">
                            <div className="page-enter">
                                {children}
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light-200/50 dark:bg-surface-dark-200/50 backdrop-blur-sm">
                            <div className="px-phi-lg py-phi text-center">
                                <p className="text-xs text-slate-500 dark:text-white/30">
                                    © 2026 <span className="font-semibold text-kala-600 dark:text-kala-400">Kala</span>. Powered by AI.
                                </p>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        </>
    );
}
