import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    PaperAirplaneIcon,
    ChevronDownIcon,
    BookOpenIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';
import ChatBubble from '@/Components/AI/ChatBubble';
import TypingIndicator from '@/Components/AI/TypingIndicator';
import { chatApi } from '@/Lib/api';

export default function TutorIndex({ auth, assignments = [] }) {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const dropdownRef = useRef(null);

    // Auto-select first assignment if available
    useEffect(() => {
        if (assignments.length > 0 && !selectedAssignment) {
            setSelectedAssignment(assignments[0]);
        }
    }, [assignments]);

    // Load chat history when assignment changes
    useEffect(() => {
        if (selectedAssignment) {
            loadHistory();
        }
    }, [selectedAssignment?.id]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadHistory = async () => {
        if (!selectedAssignment) return;
        setIsLoadingHistory(true);
        setMessages([]);
        try {
            const response = await chatApi.history(selectedAssignment.id);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !selectedAssignment) return;

        const userMessage = input.trim();
        setInput('');

        // Optimistically add user message
        const tempId = Date.now();
        setMessages((prev) => [
            ...prev,
            { id: tempId, role: 'user', content: userMessage },
        ]);

        setIsLoading(true);

        try {
            const response = await chatApi.send(selectedAssignment.id, userMessage);

            // Add AI response
            setMessages((prev) => [
                ...prev,
                { id: tempId + 1, role: 'assistant', content: response.data.message },
            ]);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: tempId + 1,
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-400';
            case 'in_progress': return 'text-blue-400';
            case 'at_risk': return 'text-amber-400';
            default: return 'text-slate-400';
        }
    };

    const quickPrompts = [
        "How do I start this assignment?",
        "Explain the key concepts",
        "What research should I do?",
        "Help me understand the requirements",
        "What's the best approach?",
    ];

    return (
        <AppLayout>
            <Head title="AI Tutor" />

            <div className="h-[calc(100vh-64px)] flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Title & Back */}
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-kala-500 dark:to-purple-600 flex items-center justify-center shadow-lg shadow-black/20">
                                        <SparklesIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                                            AI Tutor
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-white/50">
                                            Get help understanding your assignments
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Selector */}
                            {assignments.length > 0 && (
                                <div ref={dropdownRef} className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-slate-300 dark:hover:border-white/20 transition-all min-w-[280px] max-w-[400px]"
                                    >
                                        <BookOpenIcon className="w-5 h-5 text-slate-400 dark:text-white/40 flex-shrink-0" />
                                        <span className="flex-1 text-left truncate text-sm font-medium text-slate-900 dark:text-white">
                                            {selectedAssignment?.title || 'Select assignment'}
                                        </span>
                                        <ChevronDownIcon className={`w-5 h-5 text-slate-400 dark:text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-full min-w-[320px] bg-white dark:bg-surface-dark-100 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                                            >
                                                <div className="p-2 max-h-[300px] overflow-y-auto">
                                                    {assignments.map((assignment) => (
                                                        <button
                                                            key={assignment.id}
                                                            onClick={() => {
                                                                setSelectedAssignment(assignment);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedAssignment?.id === assignment.id
                                                                    ? 'bg-slate-100 dark:bg-white/10'
                                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(assignment.status)}`} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                                                        {assignment.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-white/50">
                                                                        <span className="flex items-center gap-1">
                                                                            <CalendarIcon className="w-3.5 h-3.5" />
                                                                            {assignment.due_date_formatted}
                                                                        </span>
                                                                        <span>{assignment.progress_percent}% done</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden">
                    {assignments.length === 0 ? (
                        /* No Assignments State */
                        <div className="h-full flex items-center justify-center p-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center max-w-md"
                            >
                                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-6">
                                    <AcademicCapIcon className="w-10 h-10 text-slate-500 dark:text-white/50" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                    No assignments yet
                                </h2>
                                <p className="text-slate-600 dark:text-white/60 mb-6">
                                    Create your first assignment to start chatting with your AI tutor.
                                    I'll help you understand concepts and guide you through your work!
                                </p>
                                <Link href="/assignments/create">
                                    <Button variant="primary" size="lg">
                                        Create Assignment
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col max-w-4xl mx-auto">
                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                                {isLoadingHistory ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin w-8 h-8 border-2 border-slate-300 dark:border-kala-500 border-t-transparent rounded-full" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    /* Welcome State */
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="h-full flex items-center justify-center"
                                    >
                                        <div className="text-center max-w-lg py-12">
                                            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-kala-500 dark:to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                                                <SparklesIcon className="w-10 h-10 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                                Hi! I'm Kala 👋
                                            </h2>
                                            <p className="text-slate-600 dark:text-white/60 mb-2">
                                                I'm your AI academic tutor. I'm here to help you understand your assignment:
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-kala-400 mb-6">
                                                "{selectedAssignment?.title}"
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-white/50 mb-8">
                                                Ask me about concepts, research strategies, or how to approach your work.
                                                I'll guide you—but I won't do the work for you! 💪
                                            </p>

                                            {/* Quick Prompts */}
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {quickPrompts.map((prompt) => (
                                                    <button
                                                        key={prompt}
                                                        onClick={() => setInput(prompt)}
                                                        className="text-sm px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70 rounded-full transition-colors"
                                                    >
                                                        {prompt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <>
                                        {messages.map((msg) => (
                                            <ChatBubble key={msg.id} message={msg} />
                                        ))}
                                        {isLoading && <TypingIndicator />}
                                    </>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
                                <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={selectedAssignment ? "Ask me anything about your assignment..." : "Select an assignment first..."}
                                            className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-kala-500/50 focus:border-slate-400 dark:focus:border-kala-500/50 transition-all"
                                            disabled={isLoading || !selectedAssignment}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isLoading || !selectedAssignment}
                                            className="px-5 py-3 bg-slate-900 dark:bg-kala-500 hover:bg-slate-800 dark:hover:bg-kala-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10 dark:shadow-kala-500/20"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-slate-400 dark:text-white/30 mt-3">
                                        Remember: I help you learn, not do the work for you.
                                    </p>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
