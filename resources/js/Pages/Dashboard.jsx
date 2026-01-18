import { Link } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import StatCard from '@/Components/Dashboard/StatCard';
import AssignmentCard from '@/Components/Assignment/AssignmentCard';
import Button from '@/Components/UI/Button';
import {
    AcademicCapIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PlusIcon,
    SparklesIcon,
    BoltIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, assignments = [], stats = {}, next_task = null }) {
    const [showNextFocus, setShowNextFocus] = useState(true);

    const {
        total_assignments = 0,
        active_assignments = 0,
        completed_assignments = 0,
        at_risk_assignments = 0,
    } = stats;

    // ... (rest of statsData stays the same)

    return (
        <AppLayout title="Dashboard">
            <div className="p-phi-lg max-w-7xl mx-auto space-y-phi-lg">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-phi">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-2">
                            Welcome back, <span className="text-slate-700 dark:text-kala-400">{auth.user?.name?.split(' ')[0] || 'Student'}</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-white/60">
                            You have <span className="font-bold text-slate-900 dark:text-white">{active_assignments} active</span> assignments.
                        </p>
                    </motion.div>

                    {next_task && showNextFocus && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 max-w-sm w-full group relative"
                        >
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <BoltIcon className="w-5 h-5 text-indigo-200" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Next Focus</span>
                                </div>
                                <button
                                    onClick={() => setShowNextFocus(false)}
                                    className="text-indigo-200 hover:text-white transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="font-display font-bold text-lg mb-1 group-hover:underline">
                                <Link href={`/assignments/${next_task.assignment_id}`}>
                                    {next_task.title}
                                </Link>
                            </h3>
                            <p className="text-sm text-indigo-100/80 mb-4 line-clamp-1">
                                {next_task.assignment_title}
                            </p>
                            <Link href={`/assignments/${next_task.assignment_id}`}>
                                <Button variant="secondary" size="sm" className="w-full bg-white text-indigo-700 border-none hover:bg-indigo-50">
                                    Start Now
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Stats Grid */}
                {/* ... (stats grid stays same) */}

                {/* Assignments Section */}
                <div className="space-y-phi">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                                Your Assignments
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-white/50 mt-1">
                                {assignments.length > 0
                                    ? `Showing ${assignments.length} assignment${assignments.length > 1 ? 's' : ''}`
                                    : 'No assignments yet'}
                            </p>
                        </div>
                        <Link href="/assignments/create">
                            <Button variant="primary" className="gap-2">
                                <PlusIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">New Assignment</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Assignments Grid */}
                    {assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-md">
                            {assignments.map((assignment, index) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="card p-phi-xl text-center"
                        >
                            <div className="max-w-md mx-auto space-y-phi">
                                <div className="w-20 h-20 mx-auto rounded-full bg-slate-950 dark:bg-white flex items-center justify-center shadow-xl shadow-black/20">
                                    <SparklesIcon className="w-10 h-10 text-white dark:text-black" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                                        Ready to reach your goals?
                                    </h3>
                                    <p className="text-slate-600 dark:text-white/60 mb-phi">
                                        Kala uses advanced AI to break down complex assignments into simple, manageable steps tailored for you.
                                    </p>
                                </div>
                                <Link href="/assignments/create">
                                    <Button variant="primary" size="lg" className="w-full gap-2 py-6 rounded-2xl text-lg">
                                        <PlusIcon className="w-6 h-6" />
                                        Create Your First Assignment
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>


                {/* AI Tutor CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link href="/tutor">
                        <div className="card-glass p-phi-lg group cursor-pointer overflow-hidden relative">
                            <div className="relative z-10 flex items-center justify-between gap-phi">
                                <div className="flex items-center gap-phi">
                                    <div className="w-14 h-14 rounded-phi-lg bg-slate-950 dark:bg-white flex items-center justify-center shadow-xl shadow-black/20 group-hover:shadow-black/40 transition-all">
                                        <SparklesIcon className="w-7 h-7 text-white dark:text-black" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
                                            Need help? Ask AI Tutor
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-white/60">
                                            Get instant contextual help for your assignments
                                        </p>
                                    </div>
                                </div>
                                <Button variant="secondary" className="flex-shrink-0">
                                    Open Tutor
                                </Button>
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>
        </AppLayout>
    );
}
