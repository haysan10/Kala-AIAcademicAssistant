import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ArrowRightIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                    Welcome Back
                </h2>
                <p className="text-sm text-slate-600 dark:text-white/50">
                    Sign in to continue your academic journey
                </p>
            </motion.div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-phi bg-emerald-500/10 border border-emerald-500/20"
                >
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center">
                        {status}
                    </p>
                </motion.div>
            )}

            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
            >
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-slate-400 dark:text-white/30" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="input pl-12"
                            placeholder="you@example.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-slate-400 dark:text-white/30" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="input pl-12 pr-12"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 transition-colors"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-slate-300 dark:border-white/20 rounded-md peer-checked:bg-slate-900 dark:peer-checked:bg-white peer-checked:border-slate-900 dark:peer-checked:border-white transition-all" />
                            <svg
                                className="absolute top-0.5 left-0.5 w-4 h-4 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-white/50 group-hover:text-slate-900 dark:group-hover:text-white/70 transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full justify-center gap-2"
                        size="lg"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRightIcon className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-surface-dark-100 text-slate-400 dark:text-white/30">
                        New to Kala?
                    </span>
                </div>
            </div>

            {/* Register Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    href={route('register')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-slate-200 dark:border-white/10 rounded-phi-lg text-sm font-medium text-slate-700 dark:text-white/70 hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Create an account
                </Link>
            </motion.div>
        </GuestLayout>
    );
}
