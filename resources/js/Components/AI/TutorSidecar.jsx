import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { chatApi } from '@/Lib/api';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import { cn } from '@/Lib/utils';

export default function TutorSidecar({
    assignmentId,
    assignment = null,
    currentTask = null,
    isOpen,
    onClose,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const messagesEndRef = useRef(null);

    // Load chat history
    useEffect(() => {
        if (isOpen && assignmentId) {
            loadHistory();
        }
    }, [isOpen, assignmentId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await chatApi.history(assignmentId);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

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
            const response = await chatApi.send(assignmentId, userMessage, currentTask?.id);

            // Add AI response
            setMessages((prev) => [
                ...prev,
                { id: tempId + 1, role: 'assistant', content: response.data.message },
            ]);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Add error message
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sidecar */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/80 dark:bg-surface-dark-100/80 backdrop-blur-cinematic border-l border-slate-200 dark:border-white/10 flex flex-col shadow-cinematic"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-phi-md border-b border-slate-200 dark:border-white/10 bg-white/20 dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-phi-md bg-slate-950 dark:bg-white flex items-center justify-center shadow-lg transform rotate-3">
                                    <SparklesIcon className="w-6 h-6 text-white dark:text-black" />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-none">Kala Tutor</h2>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-kala-500 dark:text-white/40 mt-1 block">Contextual AI</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-phi transition-all"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Current task context - Unified Glass Style */}
                        {currentTask && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-5 py-3 bg-kala-500/5 border-b border-slate-200 dark:border-white/10 flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-kala-500 animate-pulse" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-tight text-kala-600 dark:text-kala-400">Current Task</p>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{currentTask.title}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-white/20">
                                    <div className="animate-spin w-8 h-8 border-3 border-kala-500 border-t-transparent rounded-full mb-4" />
                                    <p className="text-xs uppercase tracking-widest font-bold">Synchronizing...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 shadow-phi border border-slate-100 dark:border-white/10">
                                        <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-kala-300 dark:text-white/20" />
                                    </div>
                                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Hi! I'm Kala 👋</h3>
                                    <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed mb-10">
                                        I have context on your <span className="text-slate-900 dark:text-white font-semibold">"{assignment?.title}"</span> assignment. How can I assist you today?
                                    </p>

                                    <div className="w-full space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 text-left px-2 mb-3 items-center flex gap-2">
                                            <SparklesIcon className="w-3 h-3" /> Possible strategies
                                        </p>
                                        {[
                                            'Explain the main goal of this assignment',
                                            'Help me plan my first steps',
                                            'What are the key requirements?'
                                        ].map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setInput(q)}
                                                className="w-full text-left text-sm px-4 py-3 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 rounded-phi-md border border-slate-200 dark:border-white/10 transition-all hover:translate-x-1"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => (
                                        <ChatBubble
                                            key={msg.id}
                                            message={msg}
                                            isLatest={idx === messages.length - 1}
                                        />
                                    ))}
                                    {isLoading && <TypingIndicator />}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Cinematic Floating Style */}
                        <div className="p-phi-md bg-white/30 dark:bg-black/10 border-t border-slate-200 dark:border-white/10">
                            <form onSubmit={sendMessage} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-kala-500 to-purple-500 rounded-phi-lg blur opacity-5 group-focus-within:opacity-20 transition-opacity duration-500" />
                                <div className="relative flex items-center bg-white dark:bg-surface-dark-200 rounded-phi-lg border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden group-focus-within:border-kala-500/50 transition-all">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-transparent border-none px-5 py-4 text-sm text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-white/20"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className="mr-2 p-2.5 rounded-phi bg-slate-950 dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg group-hover:shadow-kala-500/20"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="mt-2 text-[10px] text-center text-slate-400 dark:text-white/20 font-medium">
                                    Powered by Kala Intelligence v1.0
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
