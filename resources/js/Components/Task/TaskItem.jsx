import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckIcon,
    ClockIcon,
    LightBulbIcon,
    BoltIcon,
    ChatBubbleLeftIcon,
    AcademicCapIcon,
    TrashIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { taskApi } from '@/Lib/api';
import { cn } from '@/Lib/cn';
import MasteryAssessment from '../Assignment/MasteryAssessment';
import ConfirmationModal from '../UI/ConfirmationModal';
import Dropdown from '@/Components/UI/Dropdown';

export default function TaskItem({ task, onFocusClick, onEnterFocus }) {
    const [isCompleted, setIsCompleted] = useState(task.is_completed);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [showAssessment, setShowAssessment] = useState(false);
    const [assessmentData, setAssessmentData] = useState({
        score: task.understanding_score,
        feedback: task.mastery_assessment
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await taskApi.update(task.id, { title: editedTitle });
            setIsEditing(false);
            router.reload({ only: ['assignment'] });
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const confirmDelete = () => {
        router.delete(`/tasks/${task.id}`, {
            preserveScroll: true,
            onFinish: () => setShowDeleteConfirm(false)
        });
    };

    const handleToggle = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        const previousState = isCompleted;
        setIsCompleted(!isCompleted);

        try {
            await taskApi.toggle(task.id);
        } catch (error) {
            console.error('Failed to toggle task:', error);
            setIsCompleted(previousState);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={cn(
                'group flex items-start gap-4 p-4 rounded-phi-md transition-all duration-200',
                'hover:bg-slate-50 dark:hover:bg-white/5',
                isCompleted && 'opacity-60'
            )}
        >
            {/* Checkbox */}
            <button
                onClick={handleToggle}
                disabled={isUpdating}
                className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200',
                    'flex items-center justify-center mt-0.5',
                    isCompleted
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 dark:border-white/30 hover:border-kala-500',
                    isUpdating && 'opacity-50 cursor-not-allowed'
                )}
            >
                <AnimatePresence>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <CheckIcon className="w-4 h-4 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <form onSubmit={handleSave} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-kala-500/50 outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="flex items-center gap-3">
                        <p
                            className={cn(
                                'text-slate-900 dark:text-white font-medium transition-all cursor-text',
                                isCompleted && 'line-through text-slate-400 dark:text-white/50'
                            )}
                            onClick={() => !isCompleted && setIsEditing(true)}
                        >
                            {task.title}
                        </p>
                        {task.context_hint && (
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-slate-400 dark:text-white/30 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                title="Show hint"
                            >
                                <LightBulbIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Time estimate */}
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-white/50">
                    <ClockIcon className="w-4 h-4" />
                    <span>{task.estimated_minutes} min</span>
                </div>

                {/* Context hint */}
                <AnimatePresence>
                    {showHint && task.context_hint && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-amber-500/10 dark:bg-amber-500/10 rounded-phi border border-amber-500/20"
                        >
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                💡 {task.context_hint}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            {!isCompleted ? (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Ask AI Button */}
                    {onFocusClick && (
                        <button
                            onClick={() => onFocusClick(task)}
                            className="p-2 text-slate-400 dark:text-white/40 hover:text-kala-500 dark:hover:text-kala-400 
                                       hover:bg-kala-500/10 rounded-phi transition-all"
                            title="Ask AI about this task"
                        >
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                        </button>
                    )}

                    {/* Edit Button */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-slate-400 dark:text-white/40 hover:text-blue-500 hover:bg-blue-500/10 rounded-phi transition-all"
                        title="Edit task"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </button>

                    {/* Focus Mode Button */}
                    {onEnterFocus && (
                        <button
                            onClick={() => onEnterFocus(task)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-600 dark:text-violet-400 
                                       hover:bg-violet-500/10 rounded-phi transition-all"
                            title="Enter Focus Mode"
                        >
                            <BoltIcon className="w-4 h-4" />
                            <span>Focus</span>
                        </button>
                    )}

                    {/* Actions Menu */}
                    <Dropdown
                        items={[
                            {
                                label: 'Edit Task',
                                icon: PencilSquareIcon,
                                onClick: () => setIsEditing(true)
                            },
                            {
                                label: 'Delete Task',
                                icon: TrashIcon,
                                danger: true,
                                onClick: () => setShowDeleteConfirm(true)
                            }
                        ]}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    {assessmentData.score ? (
                        <button
                            onClick={() => setShowAssessment(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                        >
                            <CheckIcon className="w-3 h-3" />
                            {assessmentData.score}% Mastery
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAssessment(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-kala-500/10 text-kala-500 rounded-full border border-kala-500/20 hover:bg-kala-500/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <AcademicCapIcon className="w-3.5 h-3.5" />
                            Check Mastery
                        </button>
                    )}
                </div>
            )}

            <AnimatePresence>
                {showAssessment && (
                    <MasteryAssessment
                        task={task}
                        onClose={() => setShowAssessment(false)}
                        onComplete={(data) => setAssessmentData(data)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <ConfirmationModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={confirmDelete}
                        title="Delete Task"
                        message="Are you sure you want to delete this task? This action cannot be undone."
                        confirmText="Delete Task"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
