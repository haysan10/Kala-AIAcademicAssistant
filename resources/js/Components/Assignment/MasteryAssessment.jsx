import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AcademicCapIcon,
    XMarkIcon,
    SparklesIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import Button from '@/Components/UI/Button';
import axios from 'axios';

export default function MasteryAssessment({ task, onClose, onComplete }) {
    const [step, setStep] = useState('loading'); // loading, quiz, results
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [evaluation, setEvaluation] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [task.id]);

    const fetchQuiz = async () => {
        setStep('loading');
        try {
            const response = await axios.get(`/tasks/${task.id}/assessment`);
            setQuestions(response.data.questions || []);
            setStep('quiz');
        } catch (error) {
            console.error('Failed to fetch assessment quiz:', error);
            onClose();
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formattedAnswers = Object.entries(answers).map(([id, answer]) => ({
            question_id: id,
            answer
        }));

        try {
            const response = await axios.post(`/tasks/${task.id}/assessment`, {
                answers: formattedAnswers
            });
            setEvaluation(response.data);
            setStep('results');
            if (onComplete) onComplete(response.data);
        } catch (error) {
            console.error('Failed to submit assessment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-surface-dark-100 rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-white/10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {step === 'loading' && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <ArrowPathIcon className="w-10 h-10 text-kala-500 animate-spin" />
                        <p className="text-slate-600 dark:text-white/60 font-medium">Preparing your assessment...</p>
                    </div>
                )}

                {step === 'quiz' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-kala-500/10 flex items-center justify-center">
                                <AcademicCapIcon className="w-6 h-6 text-kala-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Mastery Check</h3>
                                <p className="text-sm text-slate-500 dark:text-white/50">{task.title}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {questions.map((q) => (
                                <div key={q.id} className="space-y-3">
                                    <label className="block text-slate-800 dark:text-white/90 font-medium leading-relaxed">
                                        {q.question}
                                    </label>
                                    <textarea
                                        required
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        placeholder="Type your explanation here..."
                                        className="w-full h-32 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-kala-500/50 outline-none transition-all resize-none"
                                    />
                                </div>
                            ))}

                            <Button
                                type="submit"
                                className="w-full py-4 rounded-2xl gap-2 text-lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Analyzing Responses...' : 'Submit Assessment'}
                                <ArrowRightIcon className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'results' && evaluation && (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                            </motion.div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Assessment Complete!</h3>
                            <p className="text-slate-500 dark:text-white/50">Your mastery level: <span className="text-kala-500 font-bold">{evaluation.mastery_level}</span></p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="text-sm text-slate-500 dark:text-white/40 mb-1">Understanding Score</div>
                                <div className="text-4xl font-display font-black text-slate-900 dark:text-white">{evaluation.score}%</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-kala-500/5 border border-kala-500/10">
                                <div className="text-sm text-kala-500/60 mb-1">Feedback</div>
                                <div className="text-slate-800 dark:text-white/90 text-sm leading-relaxed">{evaluation.feedback}</div>
                            </div>
                        </div>

                        <Button
                            onClick={onClose}
                            variant="primary"
                            className="w-full py-4 rounded-2xl"
                        >
                            Return to Assignment
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
