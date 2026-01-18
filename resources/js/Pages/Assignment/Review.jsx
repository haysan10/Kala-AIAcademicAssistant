import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { SparklesIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';

export default function Review({ assignment }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/assignments/${assignment.id}/confirm`);
    };

    const parsedData = assignment.parsed_data || {};

    return (
        <AppLayout user={auth.user} title="Review Assignment">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <CheckIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Review & Confirm
                    </h1>
                    <p className="text-white/60 max-w-md mx-auto">
                        Kala analyzed your assignment. Review the details below and confirm to generate your study plan.
                    </p>
                </motion.div>

                {/* AI Parsed Data Preview */}
                {parsedData.deliverables && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 mb-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-kala-400" />
                            AI Analysis
                        </h3>

                        <div className="space-y-4">
                            {parsedData.deliverables?.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-white/70 mb-2">Deliverables</p>
                                    <ul className="space-y-1">
                                        {parsedData.deliverables.map((item, i) => (
                                            <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                                <span className="text-kala-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {parsedData.estimated_difficulty && (
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-sm text-white/70">Difficulty</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${parsedData.estimated_difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                parsedData.estimated_difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {parsedData.estimated_difficulty}
                                        </span>
                                    </div>
                                    {parsedData.estimated_hours && (
                                        <div>
                                            <p className="text-sm text-white/70">Estimated Time</p>
                                            <p className="text-white font-medium mt-1">
                                                {parsedData.estimated_hours} hours
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Edit Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <PencilIcon className="w-5 h-5 text-white/50" />
                        Assignment Details
                    </h3>

                    <div className="space-y-4">
                        <Input
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Assignment title"
                            error={errors.title}
                        />

                        <Textarea
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description of the assignment"
                            rows={3}
                            error={errors.description}
                        />

                        <Input
                            label="Due Date"
                            type="datetime-local"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            error={errors.due_date}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <a href="/dashboard" className="btn-secondary">
                            Cancel
                        </a>
                        <Button type="submit" loading={processing}>
                            <SparklesIcon className="w-5 h-5" />
                            Generate Study Plan
                        </Button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}
