import { useState, useEffect } from 'react';
import { usePage, Link, router, Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    TrashIcon,
    ArrowLeftIcon,
    ClipboardDocumentCheckIcon,
    BoltIcon,
    PencilSquareIcon,
    SparklesIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import AppLayout from '@/Components/Layout/AppLayout';
import ProgressRing from '@/Components/Assignment/ProgressRing';
import StatusBadge from '@/Components/Assignment/StatusBadge';
import MilestoneAccordion from '@/Components/Milestone/MilestoneAccordion';
import TutorSidecar from '@/Components/AI/TutorSidecar';
import ChecklistPanel from '@/Components/Assignment/ChecklistPanel';
import FocusMode from '@/Components/Assignment/FocusMode';
import Button from '@/Components/UI/Button';

import { formatDate } from '@/Lib/utils';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import Dropdown from '@/Components/UI/Dropdown';

export default function Show({ assignment }) {
    console.log('Assignment Show Loaded:', assignment);

    if (!assignment) {
        return (
            <AppLayout title="Error">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to load assignment</h2>
                        <Link href="/dashboard" className="text-kala-500 hover:underline">Return to Dashboard</Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const { auth } = usePage().props;
    const [tutorOpen, setTutorOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);
    const [focusTask, setFocusTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/assignments/${assignment.id}`);
    };

    const confirmRegenerate = () => {
        setIsRegenerating(true);
        router.post(`/assignments/${assignment.id}/regenerate`, {}, {
            onFinish: () => {
                setIsRegenerating(false);
                setShowRegenerateConfirm(false);
            }
        });
    };

    const handleTaskFocus = (task) => {
        setCurrentTask(task);
        setTutorOpen(true);
    };

    const handleEnterFocusMode = (task) => {
        setFocusTask(task);
    };

    const isNearDeadline = assignment.days_remaining <= 3;
    const isCompleted = assignment.status === 'completed';

    return (
        <AppLayout title={assignment.title}>
            <Head title={`${assignment.title} - Kala`} />

            <div className="max-w-4xl mx-auto p-phi-md lg:p-phi-lg">
                {/* Back link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Progress Ring */}
                        <ProgressRing
                            progress={assignment.progress_percent}
                            size={100}
                            strokeWidth={8}
                            className="flex-shrink-0 mx-auto md:mx-0"
                        />

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                                    {assignment.title}
                                </h1>
                                <StatusBadge status={assignment.status} />
                            </div>

                            {assignment.description && (
                                <p className="text-slate-600 dark:text-white/60 mb-4">
                                    {assignment.description}
                                </p>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                    <CalendarDaysIcon className="w-4 h-4" />
                                    <span>Due {formatDate(assignment.due_date)}</span>
                                </div>
                                <div className={`${(assignment.days_remaining || 0) <= 0
                                    ? 'text-red-500'
                                    : (assignment.days_remaining || 0) <= 3
                                        ? 'text-amber-500'
                                        : 'text-slate-600 dark:text-white/60'
                                    }`}>
                                    {(assignment.days_remaining || 0) <= 0
                                        ? <span className="font-medium">Due today!</span>
                                        : assignment.days_remaining === 1
                                            ? <span className="font-medium">Due tomorrow</span>
                                            : `${assignment.days_remaining} days remaining`}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2 justify-center flex-shrink-0">
                            <Button
                                onClick={() => setTutorOpen(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-white dark:text-black border-none shadow-cinematic-light dark:shadow-cinematic hover:scale-105 transition-transform group"
                            >
                                <SparklesIcon className="w-5 h-5 text-kala-400 dark:text-kala-600 group-hover:rotate-12 transition-transform" />
                                <span>Ask Tutor</span>
                            </Button>
                            <Button
                                onClick={() => setShowChecklist(true)}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                                Checklist
                            </Button>
                            <div className="flex justify-center md:justify-end">
                                <Dropdown
                                    align="right"
                                    items={[
                                        {
                                            label: 'Regenerate Plan',
                                            icon: ArrowPathIcon,
                                            onClick: () => setShowRegenerateConfirm(true)
                                        },
                                        {
                                            label: 'Delete Assignment',
                                            icon: TrashIcon,
                                            danger: true,
                                            onClick: () => setShowDeleteConfirm(true)
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Bar */}
                {
                    !isCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            {assignment.milestones?.[0]?.tasks?.[0] && (
                                <button
                                    onClick={() => handleEnterFocusMode(
                                        assignment.milestones.flatMap(m => m.tasks || []).find(t => !t.is_completed) ||
                                        assignment.milestones[0].tasks[0]
                                    )}
                                    className="flex-1 flex items-center justify-center gap-3 p-4 rounded-phi-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-purple-500/20 transition-all group"
                                >
                                    <BoltIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Enter Focus Mode</span>
                                </button>
                            )}

                            {isNearDeadline && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-phi-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                                    <span className="text-sm font-medium">⚡ Sprint to finish!</span>
                                </div>
                            )}
                        </motion.div>
                    )
                }

                {/* Milestones */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Study Plan</h2>
                            <span className="text-sm text-slate-500 dark:text-white/40">
                                {assignment.milestones?.length || 0} milestones
                            </span>
                        </div>
                    </div>

                    {assignment.milestones && assignment.milestones.length > 0 ? (
                        <div className="space-y-4">
                            {assignment.milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <MilestoneAccordion
                                        milestone={milestone}
                                        onTaskFocus={handleTaskFocus}
                                        onEnterFocus={handleEnterFocusMode}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-8 text-center" id="no-milestones">
                            <p className="text-slate-600 dark:text-white/60">
                                No milestones yet. The study plan is being generated...
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* AI Tutor Sidecar */}
                <TutorSidecar
                    assignmentId={assignment.id}
                    assignment={assignment}
                    currentTask={currentTask}
                    isOpen={tutorOpen}
                    onClose={() => {
                        setTutorOpen(false);
                        setCurrentTask(null);
                    }}
                />

                {/* Checklist Panel */}
                <AnimatePresence>
                    {showChecklist && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                                onClick={() => setShowChecklist(false)}
                            />
                            <ChecklistPanel
                                assignment={assignment}
                                onClose={() => setShowChecklist(false)}
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Focus Mode */}
                <AnimatePresence>
                    {focusTask && (
                        <FocusMode
                            task={focusTask}
                            assignment={assignment}
                            milestones={assignment.milestones}
                            onClose={() => setFocusTask(null)}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <ConfirmationModal
                            isOpen={showDeleteConfirm}
                            onClose={() => setShowDeleteConfirm(false)}
                            onConfirm={confirmDelete}
                            title="Delete Assignment"
                            message="Are you sure you want to delete this assignment permanently? This action cannot be undone."
                            confirmText="Delete Assignment"
                            loading={isDeleting}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showRegenerateConfirm && (
                        <ConfirmationModal
                            isOpen={showRegenerateConfirm}
                            onClose={() => setShowRegenerateConfirm(false)}
                            onConfirm={confirmRegenerate}
                            title="Regenerate Study Plan"
                            message="Are you sure you want to regenerate the study plan? This will replace your current milestones and tasks. Your current progress will be lost."
                            confirmText="Regenerate Plan"
                            type="warning"
                            loading={isRegenerating}
                        />
                    )}
                </AnimatePresence>
            </div >
        </AppLayout >
    );
}
