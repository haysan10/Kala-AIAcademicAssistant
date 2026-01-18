import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    AcademicCapIcon,
    ChartBarIcon,
    BoltIcon,
    ArrowRightIcon,
    ClockIcon,
    CheckCircleIcon,
    LightBulbIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Button from '@/Components/UI/Button';

export default function Welcome({ auth }) {
    const features = [
        {
            icon: SparklesIcon,
            title: 'AI-Powered Analysis',
            description: 'Automatically break down complex assignments into manageable tasks with intelligent AI parsing.',
        },
        {
            icon: AcademicCapIcon,
            title: 'Smart Tutor System',
            description: 'Get contextual help and guidance from an AI tutor that understands your assignments.',
        },
        {
            icon: ChartBarIcon,
            title: 'Progress Tracking',
            description: 'Monitor your progress with beautiful visualizations and stay on top of deadlines.',
        },
        {
            icon: CalendarDaysIcon,
            title: 'Smart Scheduling',
            description: 'AI creates optimized milestone schedules based on your assignment deadlines.',
        },
    ];

    const steps = [
        {
            step: '01',
            icon: AcademicCapIcon,
            title: 'Upload Assignment',
            description: 'Simply paste your assignment text or upload instructions. Kala handles the rest.',
        },
        {
            step: '02',
            icon: LightBulbIcon,
            title: 'AI Analyzes & Plans',
            description: 'Our AI breaks down your assignment into milestones and actionable tasks.',
        },
        {
            step: '03',
            icon: CheckCircleIcon,
            title: 'Execute & Succeed',
            description: 'Follow your personalized plan, get AI tutor help, and submit with confidence.',
        },
    ];

    const stats = [
        { value: '10x', label: 'Faster Planning' },
        { value: '95%', label: 'Task Completion' },
        { value: '24/7', label: 'AI Assistance' },
    ];

    return (
        <>
            <Head title="Kala - AI Assignment Manager" />

            <div className="min-h-screen bg-surface-light-300 dark:bg-surface-dark-300 text-slate-900 dark:text-white relative overflow-hidden">

                {/* Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                            backgroundSize: '80px 80px',
                        }}
                    />

                    {/* Gradient Orbs - Monochrome */}
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-slate-200/40 to-transparent dark:from-white/5 dark:to-transparent rounded-full blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-slate-300/30 to-transparent dark:from-white/5 dark:to-transparent rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">

                    {/* Navigation */}
                    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface-light-100/80 dark:bg-surface-dark-100/80 border-b border-slate-200/50 dark:border-white/5">
                        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/5">
                                    <SparklesIcon className="w-5 h-5 text-white dark:text-slate-900" />
                                </div>
                                <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">Kala</span>
                            </div>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button variant="primary" className="gap-2">
                                            Go to Dashboard
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="ghost">Log in</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button variant="primary">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
                        <div className="max-w-5xl mx-auto text-center">

                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex mb-8"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                    <SparklesIcon className="w-4 h-4 text-slate-600 dark:text-white/60" />
                                    <span className="text-sm font-medium text-slate-600 dark:text-white/60">Powered by xAI Grok</span>
                                </div>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] mb-8"
                            >
                                <span className="text-slate-900 dark:text-white">Master Your</span>
                                <br />
                                <span className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-700 dark:from-white dark:via-white/80 dark:to-white/60 bg-clip-text text-transparent">
                                    Academic Journey
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-lg sm:text-xl text-slate-600 dark:text-white/60 max-w-2xl mx-auto leading-relaxed mb-12"
                            >
                                Transform complex assignments into manageable tasks with AI-powered analysis.
                                Stay organized, track progress, and ace your studies with intelligent assistance.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                            >
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-800 dark:hover:bg-white/90 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
                                            Open Dashboard
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/register">
                                            <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-800 dark:hover:bg-white/90 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
                                                Start Free Trial
                                            </button>
                                        </Link>
                                        <Link href="/login">
                                            <button className="px-8 py-4 border-2 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white/80 rounded-xl font-semibold text-lg hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/30 transition-all">
                                                Sign In
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="flex items-center justify-center gap-12 sm:gap-16"
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                        <div className="text-sm text-slate-500 dark:text-white/40">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="relative py-24 sm:py-32 px-6">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16 sm:mb-20"
                            >
                                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-4 sm:mb-6">
                                    How Kala Works
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
                                    Three simple steps to transform your academic experience
                                </p>
                            </motion.div>

                            {/* Steps */}
                            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                                {steps.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 }}
                                        className="relative"
                                    >
                                        <div className="card p-6 sm:p-8 h-full group">
                                            {/* Step Number */}
                                            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-lg shadow-slate-900/20 dark:shadow-white/10">
                                                {item.step}
                                            </div>

                                            {/* Icon */}
                                            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors mt-4">
                                                <item.icon className="w-7 h-7 text-slate-600 dark:text-white/70" />
                                            </div>

                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-white/50 leading-relaxed">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="relative py-24 sm:py-32 px-6 bg-slate-50 dark:bg-surface-dark-200">
                        <div className="max-w-6xl mx-auto">

                            {/* Section Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16 sm:mb-20"
                            >
                                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-4 sm:mb-6">
                                    Everything you need to succeed
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
                                    Kala combines cutting-edge AI with intuitive design to help you manage your academic workload effortlessly.
                                </p>
                            </motion.div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                            ease: [0.16, 1, 0.3, 1]
                                        }}
                                    >
                                        <div className="card p-6 sm:p-8 h-full group">
                                            <div className="flex items-start gap-5">
                                                <div className="w-14 h-14 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg shadow-slate-900/10 dark:shadow-white/5 flex-shrink-0">
                                                    <feature.icon className="w-7 h-7 text-white dark:text-slate-900" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-2">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-white/50 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    </section>

                    {/* AI Tutor Highlight Section */}
                    <section className="relative py-24 sm:py-32 px-6">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid lg:grid-cols-2 gap-12 items-center"
                            >
                                {/* Text Content */}
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-slate-600 dark:text-white/60" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-white/60">AI Tutor</span>
                                    </div>
                                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-6">
                                        Your Personal Academic Assistant
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-white/60 mb-8 leading-relaxed">
                                        Get instant help understanding complex concepts. Our AI tutor guides you through your assignments
                                        without doing the work for you—helping you learn while staying on track.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            'Contextual explanations based on your assignment',
                                            'Ask questions anytime, get instant responses',
                                            'Hints and guidance, not direct answers',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-white/70">
                                                <CheckCircleIcon className="w-5 h-5 text-slate-500 dark:text-white/50 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Visual Mockup */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="relative"
                                >
                                    <div className="card p-6 sm:p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
                                                <SparklesIcon className="w-5 h-5 text-white dark:text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">Kala Tutor</p>
                                                <p className="text-xs text-slate-500 dark:text-white/40">AI Academic Assistant</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {/* User Message */}
                                            <div className="flex justify-end">
                                                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                                                    <p className="text-sm">How do I start with this essay about climate change?</p>
                                                </div>
                                            </div>
                                            {/* AI Response */}
                                            <div className="flex justify-start">
                                                <div className="bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                                                    <p className="text-sm leading-relaxed">
                                                        Great question! Let's break it down. First, identify your thesis—what's your main argument?
                                                        Consider recent climate events you can reference as evidence. Would you like to brainstorm some thesis options?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="relative py-24 sm:py-32 px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="card p-10 sm:p-16 overflow-hidden relative">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-50">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(0,0,0,0.02), transparent 50%),
                                                              radial-gradient(circle at 70% 70%, rgba(0,0,0,0.02), transparent 50%)`,
                                        }}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-xl shadow-slate-900/20 dark:shadow-white/10 mb-8">
                                        <SparklesIcon className="w-8 h-8 text-white dark:text-slate-900" />
                                    </div>
                                    <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-6">
                                        Ready to ace your academics?
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-white/60 mb-10 max-w-xl mx-auto">
                                        Join students who are already using Kala to manage their assignments smarter, not harder.
                                    </p>
                                    <Link href="/register">
                                        <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-800 dark:hover:bg-white/90 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]">
                                            Get Started for Free
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Footer */}
                    <footer className="relative border-t border-slate-200 dark:border-white/5 py-12">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
                                        <SparklesIcon className="w-4 h-4 text-white dark:text-slate-900" />
                                    </div>
                                    <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Kala</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-white/40 text-center">
                                    © 2026 Kala. Built with ❤️ for students everywhere.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-white/40">
                                    <span>Powered by AI</span>
                                </div>
                            </div>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}
