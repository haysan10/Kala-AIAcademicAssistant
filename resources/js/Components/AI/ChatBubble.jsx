import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { cn } from '@/Lib/utils';

export default function ChatBubble({ message, isLatest = false }) {
    const isUser = message.role === 'user';
    const isError = message.isError;

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}
        >
            <div
                className={cn(
                    'max-w-[90%] rounded-2xl px-phi py-3 shadow-sm transition-all',
                    isUser
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-black rounded-tr-none font-medium'
                        : isError
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-tl-none'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white/90 border border-slate-200 dark:border-white/10 rounded-tl-none'
                )}
            >
                {isUser ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/5 dark:prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="pl-1">{children}</li>,
                                code: ({ children }) => (
                                    <code className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-kala-700 dark:text-kala-300">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="p-4 rounded-phi-md overflow-x-auto my-3 border border-slate-200 dark:border-white/5 shadow-inner">
                                        {children}
                                    </pre>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Timestamp or Status - optional subtle detail */}
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/20 mt-1.5 px-1">
                {isUser ? 'Sent' : 'Kala Bot'}
            </span>
        </motion.div>
    );
}
