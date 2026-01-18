import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';
import Textarea from '@/Components/UI/Textarea';
import FileDropzone from '@/Components/Forms/FileDropzone';

export default function Create() {
    const { auth } = usePage().props;
    const [mode, setMode] = useState('text'); // 'text' or 'file'

    const { data, setData, post, processing, errors, transform } = useForm({
        raw_text: '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            raw_text: mode === 'text' ? data.raw_text : null,
            file: mode === 'file' ? data.file : null,
        }));

        post('/assignments', {
            forceFormData: true,
            onError: (errors) => {
                console.error('Assignment Creation Errors:', errors);
            }
        });
    };

    return (
        <AppLayout user={auth.user} title="New Assignment">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-16 h-16 rounded-phi-lg bg-slate-950 dark:bg-white flex items-center justify-center mx-auto mb-6 shadow-cinematic-light dark:shadow-cinematic">
                        <SparklesIcon className="w-8 h-8 text-white dark:text-black" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-3">
                        New Assignment
                    </h1>
                    <p className="text-slate-600 dark:text-white/40 max-w-md mx-auto text-phi-base">
                        Paste your instructions or upload a document. Kala will handle the rest.
                    </p>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-phi mb-8"
                >
                    <button
                        onClick={() => setMode('text')}
                        className={`flex-1 p-phi-md rounded-phi-lg border transition-all duration-300 flex flex-col items-center gap-2 ${mode === 'text'
                            ? 'bg-slate-950 dark:bg-white border-slate-950 dark:border-white text-white dark:text-black shadow-lg shadow-black/10'
                            : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:border-slate-400 dark:hover:border-white/30'
                            }`}
                    >
                        <DocumentTextIcon className="w-6 h-6" />
                        <span className="text-sm font-display font-bold uppercase tracking-wider">Paste Text</span>
                    </button>
                    <button
                        onClick={() => setMode('file')}
                        className={`flex-1 p-phi-md rounded-phi-lg border transition-all duration-300 flex flex-col items-center gap-2 ${mode === 'file'
                            ? 'bg-slate-950 dark:bg-white border-slate-950 dark:border-white text-white dark:text-black shadow-lg shadow-black/10'
                            : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:border-slate-400 dark:hover:border-white/30'
                            }`}
                    >
                        <DocumentTextIcon className="w-6 h-6" />
                        <span className="text-sm font-display font-bold uppercase tracking-wider">Upload File</span>
                    </button>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-phi-lg"
                >
                    {mode === 'text' ? (
                        <Textarea
                            label="Assignment Instructions"
                            placeholder="Paste your assignment instructions, rubric, or syllabus here..."
                            value={data.raw_text}
                            onChange={(e) => setData('raw_text', e.target.value)}
                            rows={12}
                            error={errors.raw_text}
                        />
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Upload Assignment File
                            </label>
                            <FileDropzone
                                onFileSelect={(file) => setData('file', file)}
                            />
                            {errors.file && (
                                <p className="mt-2 text-sm text-red-400">{errors.file}</p>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-4">
                        <a href="/dashboard" className="btn-secondary">
                            Cancel
                        </a>
                        <Button
                            type="submit"
                            loading={processing}
                            disabled={(mode === 'text' && !data.raw_text.trim()) || (mode === 'file' && !data.file)}
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Analyze with AI
                        </Button>
                    </div>
                </motion.form>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-phi-md bg-slate-100 dark:bg-white/[0.03] rounded-phi-lg border border-slate-200 dark:border-white/10"
                >
                    <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        Tips for best results:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-phi-xs text-slate-600 dark:text-white/40">
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            Include full assignment description and requirements
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            Add any rubric or grading criteria
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            Mention the deadline if available
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            Include specific instructions from professor
                        </li>
                    </ul>
                </motion.div>
            </div>
        </AppLayout>
    );
}
