import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ChevronRightIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/Lib/utils';

export default function AssignmentCard({ assignment, index = 0 }) {
    if (!assignment) return null;

    const {
        id,
        title = 'Untitled Assignment',
        due_date,
        progress_percent = 0,
        total_tasks = 0,
        completed_tasks = 0,
        is_at_risk = false,
    } = assignment;

    // Safety for due_date
    const dueDateObj = due_date ? new Date(due_date) : null;
    const daysUntilDeadline = dueDateObj && !isNaN(dueDateObj)
        ? Math.ceil((dueDateObj - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }}
        >
            <Link href={`/assignments/${id}`} className="block group h-full">
                <div className="card h-full p-6 flex flex-col gap-4 relative">

                    {/* Ambient Glow Ribbon */}
                    <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rotate-45 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-3xl transition-all duration-500 pointer-events-none",
                        (is_at_risk || isUrgent) ? "bg-white dark:bg-white" : "bg-kala-500"
                    )} />

                    {/* Header */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                        <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white group-hover:text-kala-600 dark:group-hover:text-kala-400 transition-colors line-clamp-2">
                            {title}
                        </h3>
                        <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-white/30 group-hover:text-kala-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    {/* Progress Section */}
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-600 dark:text-white/60">
                                Progress
                            </span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {progress_percent}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-surface-dark-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress_percent}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                className={cn(
                                    "h-full rounded-full transition-all",
                                    (is_at_risk || isUrgent)
                                        ? "bg-slate-900 dark:bg-white"
                                        : "bg-kala-600 dark:bg-kala-400"
                                )}
                            />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="relative z-10 mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-kala-500" />
                                <span>{completed_tasks}/{total_tasks} tasks</span>
                            </div>

                            {due_date && (
                                <div className={cn(
                                    "flex items-center gap-1.5",
                                    isUrgent ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-500 dark:text-white/40"
                                )}>
                                    {isUrgent && <ExclamationCircleIcon className="w-3.5 h-3.5" />}
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    <span>
                                        {daysUntilDeadline > 0
                                            ? `${daysUntilDeadline}d left`
                                            : daysUntilDeadline === 0
                                                ? 'Due today'
                                                : 'Overdue'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
