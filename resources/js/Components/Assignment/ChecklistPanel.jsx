import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XMarkIcon,
    SparklesIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/Components/UI/Button';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';

export default function ChecklistPanel({ assignment, onClose }) {
    const [checklist, setChecklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

    // Generate checklist from assignment requirements
    useEffect(() => {
        generateChecklist();
    }, [assignment]);

    const generateChecklist = async () => {
        setLoading(true);
        setError(null);

        try {
            // Generate checklist from parsed data deliverables
            const parsedData = assignment.parsed_data || {};
            const items = [];

            // Add deliverables from parsed data
            if (parsedData.deliverables && Array.isArray(parsedData.deliverables)) {
                parsedData.deliverables.forEach((deliverable, index) => {
                    items.push({
                        id: `deliverable-${index}`,
                        text: deliverable,
                        type: 'deliverable',
                        checked: false,
                    });
                });
            }

            // Add rubric items if available
            if (parsedData.rubric_items && Array.isArray(parsedData.rubric_items)) {
                parsedData.rubric_items.forEach((item, index) => {
                    items.push({
                        id: `rubric-${index}`,
                        text: item.criterion || item,
                        type: 'rubric',
                        checked: false,
                    });
                });
            }

            // Add default checklist items if no parsed data
            if (items.length === 0) {
                items.push(
                    { id: 'default-1', text: 'All required sections are complete', type: 'general', checked: false },
                    { id: 'default-2', text: 'Spelling and grammar checked', type: 'general', checked: false },
                    { id: 'default-3', text: 'Citations and references added', type: 'general', checked: false },
                    { id: 'default-4', text: 'Formatting requirements met', type: 'general', checked: false },
                    { id: 'default-5', text: 'Assignment instructions reviewed', type: 'general', checked: false },
                );
            }

            // Add common final checks
            items.push(
                { id: 'final-1', text: 'Final proofread completed', type: 'final', checked: false },
                { id: 'final-2', text: 'Ready to submit', type: 'final', checked: false },
            );

            setChecklist(items);
        } catch (err) {
            setError('Failed to generate checklist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (id) => {
        setChecklist(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const completedCount = checklist.filter(item => item.checked).length;
    const totalCount = checklist.length;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const typeLabels = {
        deliverable: 'Deliverables',
        rubric: 'Rubric Requirements',
        general: 'General Checks',
        final: 'Final Checks',
    };

    const groupedChecklist = checklist.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-surface-dark-100 border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-phi bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">
                            Pre-Submit Checklist
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-white/50">
                            Verify before submission
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-phi text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Progress */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-white/70">
                        Completion Progress
                    </span>
                    <span className={`text-sm font-bold ${completionPercentage === 100
                        ? 'text-emerald-500'
                        : completionPercentage >= 50
                            ? 'text-amber-500'
                            : 'text-slate-500 dark:text-white/50'
                        }`}>
                        {completedCount}/{totalCount} ({completionPercentage}%)
                    </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${completionPercentage === 100
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : completionPercentage >= 50
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'bg-gradient-to-r from-slate-400 to-slate-500'
                            }`}
                    />
                </div>

                {completionPercentage === 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-phi bg-emerald-500/10 border border-emerald-500/20"
                    >
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircleSolidIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">All items verified! Ready to submit.</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Checklist Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ArrowPathIcon className="w-8 h-8 text-slate-400 dark:text-white/40 animate-spin mb-4" />
                        <p className="text-sm text-slate-500 dark:text-white/50">Generating checklist...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={generateChecklist} variant="secondary" size="sm">
                            Retry
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedChecklist).map(([type, items]) => (
                            <div key={type}>
                                <h3 className="text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-3">
                                    {typeLabels[type] || type}
                                </h3>
                                <div className="space-y-2">
                                    {items.map((item) => (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => toggleItem(item.id)}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full flex items-start gap-3 p-4 rounded-phi text-left transition-all ${item.checked
                                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                                : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.checked
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : 'border-slate-300 dark:border-white/20'
                                                }`}>
                                                {item.checked && (
                                                    <motion.svg
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-3 h-3 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </motion.svg>
                                                )}
                                            </div>
                                            <span className={`text-sm leading-relaxed ${item.checked
                                                ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70'
                                                : 'text-slate-700 dark:text-white/80'
                                                }`}>
                                                {item.text}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowRegenerateConfirm(true)}
                        variant="secondary"
                        className="flex-1 justify-center gap-2"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        Regenerate
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="primary"
                        className="flex-1 justify-center"
                        disabled={completionPercentage < 100}
                    >
                        {completionPercentage === 100 ? 'Confirm Ready' : 'Complete Checklist'}
                    </Button>
                </div>
            </div>
            <AnimatePresence>
                {showRegenerateConfirm && (
                    <ConfirmationModal
                        isOpen={showRegenerateConfirm}
                        onClose={() => setShowRegenerateConfirm(false)}
                        onConfirm={() => {
                            generateChecklist();
                            setShowRegenerateConfirm(false);
                        }}
                        title="Regenerate Checklist"
                        message="Are you sure you want to regenerate the checklist? Current progress will be lost."
                        confirmText="Regenerate"
                        loading={loading}
                        type="warning"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
