import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, BoltIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Button from '@/Components/UI/Button';
import TaskItem from '../Task/TaskItem';
import { cn } from '@/Lib/cn';
import ConfirmationModal from '../UI/ConfirmationModal';
import Dropdown from '@/Components/UI/Dropdown';

export default function MilestoneAccordion({ milestone, onTaskFocus, onEnterFocus }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await axios.post('/tasks', {
                milestone_id: milestone.id,
                title: newTaskTitle,
            });
            setNewTaskTitle('');
            setIsAddingTask(false);
            router.reload();
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const confirmDeleteMilestone = () => {
        setIsDeleting(true);
        router.delete(`/milestones/${milestone.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setShowDeleteConfirm(false);
            }
        });
    };

    const { id, title, description, progress, tasks } = milestone;
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.is_completed).length || 0;
    const isCompleted = completedTasks === totalTasks && totalTasks > 0;

    return (
        <div className="card overflow-hidden group relative">
            {/* Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 -rotate-90">
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="transparent"
                                stroke="rgba(148, 163, 184, 0.2)"
                                className="dark:stroke-white/10"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="transparent"
                                stroke={isCompleted ? "#10b981" : "url(#milestoneGradient)"}
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - progress }}
                                style={{
                                    strokeDasharray: 100,
                                }}
                            />
                            <defs>
                                <linearGradient id="milestoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className={cn(
                            "absolute inset-0 flex items-center justify-center text-xs font-semibold",
                            isCompleted ? "text-emerald-500" : "text-slate-700 dark:text-white"
                        )}>
                            {progress}%
                        </span>
                    </div>

                    <div className="text-left">
                        <h3 className={cn(
                            "font-semibold text-slate-900 dark:text-white",
                            isCompleted && "line-through opacity-60"
                        )}>
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-slate-500 dark:text-white/50 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-sm",
                        isCompleted
                            ? "text-emerald-500"
                            : "text-slate-500 dark:text-white/50"
                    )}>
                        {completedTasks}/{totalTasks} tasks
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDownIcon className="w-5 h-5 text-slate-400 dark:text-white/50" />
                    </motion.div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                            items={[
                                {
                                    label: 'Delete Milestone',
                                    icon: TrashIcon,
                                    danger: true,
                                    onClick: () => setShowDeleteConfirm(true)
                                }
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Tasks */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-200 dark:border-white/10 px-2 py-2">
                            {tasks?.map((task, index) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onFocusClick={onTaskFocus}
                                    onEnterFocus={onEnterFocus}
                                />
                            ))}
                            {(!tasks || tasks.length === 0) && (
                                <p className="text-center text-slate-400 dark:text-white/40 py-4 text-sm">
                                    No tasks in this milestone
                                </p>
                            )}
                        </div>

                        {/* Add Task Form */}
                        <div className="bg-slate-50 dark:bg-white/5 px-4 py-3 border-t border-slate-200 dark:border-white/10">
                            {isAddingTask ? (
                                <form onSubmit={handleAddTask} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Task title..."
                                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-kala-500/50 outline-none"
                                        autoFocus
                                    />
                                    <Button type="submit" size="sm" variant="primary">Add</Button>
                                    <Button type="button" size="sm" variant="secondary" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsAddingTask(true)}
                                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/50 hover:text-kala-500 dark:hover:text-kala-400 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add Task
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <ConfirmationModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={confirmDeleteMilestone}
                        title="Delete Milestone"
                        message="Are you sure you want to delete this milestone? All tasks within it will be permanently deleted."
                        confirmText="Delete Milestone"
                        loading={isDeleting}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
