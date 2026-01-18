import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    ArrowRightIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: 'bg-red-500' },
            { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
            { strength: 3, label: 'Good', color: 'bg-emerald-500' },
            { strength: 4, label: 'Strong', color: 'bg-emerald-600' },
        ];
        return levels[strength];
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <GuestLayout>
            <Head title="Create Account" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                    Create Your Account
                </h2>
                <p className="text-sm text-slate-600 dark:text-white/50">
                    Start mastering your assignments with AI
                </p>
            </motion.div>

            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
            >
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400 dark:text-white/30" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="input pl-12"
                            placeholder="John Doe"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

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
                            placeholder="you@university.edu"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
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

                    {/* Password Strength Indicator */}
                    {data.password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3"
                        >
                            <div className="flex gap-1.5 mb-1.5">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                            ? passwordStrength.color
                                            : 'bg-slate-200 dark:bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className={`text-xs ${passwordStrength.strength < 2
                                ? 'text-red-500'
                                : passwordStrength.strength < 3
                                    ? 'text-yellow-500'
                                    : 'text-emerald-500'
                                }`}>
                                {passwordStrength.label}
                            </p>
                        </motion.div>
                    )}

                    {errors.password && (
                        <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-slate-400 dark:text-white/30" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="input pl-12 pr-12"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>

                        {/* Password Match Indicator */}
                        {data.password_confirmation && data.password === data.password_confirmation && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-y-0 right-12 flex items-center"
                            >
                                <CheckIcon className="h-5 w-5 text-emerald-500" />
                            </motion.div>
                        )}
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Terms Notice */}
                <p className="text-xs text-slate-500 dark:text-white/40 text-center">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-slate-700 dark:text-white/60 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-slate-700 dark:text-white/60 hover:underline">Privacy Policy</a>
                </p>

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
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                Create Account
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
                        Already have an account?
                    </span>
                </div>
            </div>

            {/* Login Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    href={route('login')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-slate-200 dark:border-white/10 rounded-phi-lg text-sm font-medium text-slate-700 dark:text-white/70 hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                    Sign in instead
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </motion.div>
        </GuestLayout>
    );
}
