import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import {
    XMarkIcon,
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    CheckIcon,
    SparklesIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '@/Components/UI/Button';
import TutorSidecar from '@/Components/AI/TutorSidecar';

export default function FocusMode({ task, assignment, milestones, onClose }) {
    const [isCompleted, setIsCompleted] = useState(task?.is_completed || false);
    const [showTutor, setShowTutor] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Flatten all tasks from milestones
    const allTasks = milestones?.flatMap(milestone =>
        milestone.tasks?.map(t => ({ ...t, milestoneName: milestone.title })) || []
    ) || [];

    // Find current task index
    useEffect(() => {
        const index = allTasks.findIndex(t => t.id === task?.id);
        if (index !== -1) setCurrentTaskIndex(index);
    }, [task?.id]);

    const currentTask = allTasks[currentTaskIndex] || task;

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleToggleComplete = async () => {
        try {
            await router.patch(route('tasks.toggle', currentTask.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCompleted(!isCompleted);
                },
            });
        } catch (err) {
            console.error('Failed to toggle task:', err);
        }
    };

    const handlePrevTask = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(currentTaskIndex - 1);
            setIsCompleted(allTasks[currentTaskIndex - 1]?.is_completed || false);
            setTimerSeconds(0);
            setIsTimerRunning(false);
        }
    };

    const handleNextTask = () => {
        if (currentTaskIndex < allTasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
            setIsCompleted(allTasks[currentTaskIndex + 1]?.is_completed || false);
            setTimerSeconds(0);
            setIsTimerRunning(false);
        }
    };

    const estimatedMinutes = currentTask?.estimated_minutes || 30;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-950"
            >
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[200px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 z-10">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="text-sm text-white/40">Focus Mode</div>
                                <div className="text-white font-medium">{assignment?.title}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Task Navigation */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevTask}
                                    disabled={currentTaskIndex === 0}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-white/60 px-3">
                                    Task {currentTaskIndex + 1} of {allTasks.length}
                                </span>
                                <button
                                    onClick={handleNextTask}
                                    disabled={currentTaskIndex === allTasks.length - 1}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* AI Tutor Toggle */}
                            <button
                                onClick={() => setShowTutor(!showTutor)}
                                className={`p-3 rounded-xl border transition-all ${showTutor
                                        ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className={`h-full flex transition-all ${showTutor ? 'pr-[400px]' : ''}`}>
                    <main className="flex-1 flex items-center justify-center p-8">
                        <div className="max-w-2xl w-full">

                            {/* Milestone Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 text-center"
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/50">
                                    <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                                    {currentTask?.milestoneName || 'Milestone'}
                                </span>
                            </motion.div>

                            {/* Task Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
                            >
                                {/* Completed Overlay */}
                                {isCompleted && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/20 flex items-center justify-center"
                                    >
                                        <div className="text-center">
                                            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                            <p className="text-emerald-400 font-medium">Task Completed!</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Task Content */}
                                <div className={isCompleted ? 'opacity-20' : ''}>
                                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6 leading-tight">
                                        {currentTask?.title || 'No task selected'}
                                    </h1>

                                    {currentTask?.description && (
                                        <p className="text-lg text-white/60 leading-relaxed mb-8">
                                            {currentTask.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-6 text-white/40">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-5 h-5" />
                                            <span>Est. {estimatedMinutes} min</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <SparklesIcon className="w-5 h-5" />
                                            <span>AI assistance available</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Timer & Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-10 flex flex-col items-center"
                            >
                                {/* Timer Display */}
                                <div className="mb-8 text-center">
                                    <div className="text-6xl font-mono font-light text-white tracking-wider mb-2">
                                        {formatTime(timerSeconds)}
                                    </div>
                                    <div className="text-sm text-white/40">Time Elapsed</div>
                                </div>

                                {/* Timer Controls */}
                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isTimerRunning
                                                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                                                : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                                            }`}
                                    >
                                        {isTimerRunning ? (
                                            <PauseIcon className="w-8 h-8" />
                                        ) : (
                                            <PlayIcon className="w-8 h-8 ml-1" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                                    >
                                        <ArrowPathIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Complete Button */}
                                <button
                                    onClick={handleToggleComplete}
                                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${isCompleted
                                            ? 'bg-white/10 text-white/60 hover:bg-white/20'
                                            : 'bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/10 hover:scale-105'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <span className="flex items-center gap-2">
                                            <XMarkIcon className="w-5 h-5" />
                                            Mark Incomplete
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <CheckIcon className="w-5 h-5" />
                                            Mark Complete
                                        </span>
                                    )}
                                </button>
                            </motion.div>

                        </div>
                    </main>

                    {/* AI Tutor Sidebar */}
                    <AnimatePresence>
                        {showTutor && (
                            <motion.div
                                initial={{ x: 400, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 400, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="fixed right-0 top-0 h-full w-[400px] border-l border-white/10 bg-slate-900/80 backdrop-blur-xl"
                            >
                                <TutorSidecar
                                    assignment={assignment}
                                    currentTask={currentTask}
                                    isOpen={showTutor}
                                    onClose={() => setShowTutor(false)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="absolute bottom-6 left-6 text-xs text-white/20">
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 mr-2">ESC</span>
                    to exit focus mode
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
