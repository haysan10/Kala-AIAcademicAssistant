import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Cog6ToothIcon,
    UserIcon,
    KeyIcon,
    SparklesIcon,
    BellIcon,
    TrashIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    LockClosedIcon,
    AcademicCapIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';
import AppLayout from '@/Components/Layout/AppLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import { AnimatePresence } from 'framer-motion';

export default function Settings({ auth }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('account');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        grok_api_key: auth.user?.grok_api_key || '',
        ai_language: auth.user?.ai_language || 'id',
        ai_persona: auth.user?.ai_persona || 'academic',
        ai_custom_instructions: auth.user?.ai_custom_instructions || '',
    });

    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const tabs = [
        { id: 'account', label: 'Account', icon: UserIcon },
        { id: 'ai', label: 'AI Tutor', icon: SparklesIcon },
        { id: 'api', label: 'AI API Key', icon: KeyIcon },
        { id: 'security', label: 'Security', icon: LockClosedIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
    ];

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        patch(route('settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus(null), 3000);
            },
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                setSaveStatus('password_updated');
                setTimeout(() => setSaveStatus(null), 3000);
            },
        });
    };

    const handleDeleteAccount = () => {
        router.delete(route('profile.destroy'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <div className="max-w-5xl mx-auto p-phi-md lg:p-phi-lg">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Cog6ToothIcon className="w-8 h-8" />
                        Settings
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-white/60">
                        Manage your account settings and preferences
                    </p>
                </motion.div>

                {/* Success Toast */}
                {(saveStatus || flash?.success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 rounded-phi bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
                    >
                        <CheckIcon className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">
                            {flash?.success || (saveStatus === 'saved' && 'Settings saved successfully!') || (saveStatus === 'password_updated' && 'Password updated successfully!')}
                        </span>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-[240px,1fr] gap-6">
                    {/* Sidebar Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-phi-md text-left transition-all ${activeTab === tab.id
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                                        : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Danger Zone */}
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Danger Zone</h3>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-phi-md text-left text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <span className="font-medium">Delete Account</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-6">
                                    Account Information
                                </h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-5">
                                    <Input
                                        label="Full Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={errors.email}
                                    />
                                    <div className="pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {/* AI Tutor Tab */}
                        {activeTab === 'ai' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-2">
                                    AI Tutor Personalization
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-white/50 mb-6">
                                    Customize how Kala's AI Tutor interacts with you.
                                </p>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-white/70 flex items-center gap-2">
                                                <LanguageIcon className="w-4 h-4" />
                                                Primary Language
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'id', label: 'Indonesian' },
                                                    { id: 'en', label: 'English' },
                                                ].map((lang) => (
                                                    <button
                                                        key={lang.id}
                                                        type="button"
                                                        onClick={() => setData('ai_language', lang.id)}
                                                        className={`px-4 py-2 rounded-phi border transition-all text-sm font-medium ${data.ai_language === lang.id
                                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent'
                                                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-slate-300 dark:hover:border-white/20'
                                                            }`}
                                                    >
                                                        {lang.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.ai_language && <p className="text-xs text-red-500 mt-1">{errors.ai_language}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-white/70 flex items-center gap-2">
                                                <AcademicCapIcon className="w-4 h-4" />
                                                Tutor Persona
                                            </label>
                                            <select
                                                value={data.ai_persona}
                                                onChange={(e) => setData('ai_persona', e.target.value)}
                                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-phi px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-kala-500/50 outline-none transition-all"
                                            >
                                                <option value="academic">Academic (Serious & Thorough)</option>
                                                <option value="motivational">Motivational (Encouraging & Energetic)</option>
                                                <option value="casual">Casual (Friendly & Relatable)</option>
                                                <option value="professional">Professional (Direct & Efficient)</option>
                                            </select>
                                            {errors.ai_persona && <p className="text-xs text-red-500 mt-1">{errors.ai_persona}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                                            Custom Instructions
                                        </label>
                                        <textarea
                                            value={data.ai_custom_instructions}
                                            onChange={(e) => setData('ai_custom_instructions', e.target.value)}
                                            placeholder="Example: Always explain complex terms with real-world analogies. Highlight key formulas. Be very strict about deadlines."
                                            className="w-full h-32 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-phi px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-kala-500/50 outline-none transition-all resize-none"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-white/40">
                                            These instructions will be given to the AI across all tasks and chat sessions.
                                        </p>
                                        {errors.ai_custom_instructions && <p className="text-xs text-red-500 mt-1">{errors.ai_custom_instructions}</p>}
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save AI Preferences'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* API Key Tab */}
                        {activeTab === 'api' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-2">
                                    AI API Key
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-white/50 mb-6">
                                    Configure your GROQ API key for AI features. Get your API key from{' '}
                                    <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-kala-500 hover:underline">
                                        console.groq.com
                                    </a>
                                </p>
                                <form onSubmit={handleUpdateProfile} className="space-y-5">
                                    <Input
                                        label="GROQ API Key"
                                        type="password"
                                        value={data.grok_api_key}
                                        onChange={(e) => setData('grok_api_key', e.target.value)}
                                        error={errors.grok_api_key}
                                        placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                        helperText="Your API key will be validated and encrypted before saving"
                                    />
                                    {errors.grok_api_key && (
                                        <div className="p-3 rounded-phi bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
                                            {errors.grok_api_key}
                                        </div>
                                    )}
                                    <div className="pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Validating API key...' : 'Save API Key'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-6">
                                    Change Password
                                </h2>
                                <form onSubmit={handleUpdatePassword} className="space-y-5">
                                    <Input
                                        label="Current Password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        error={passwordErrors.current_password}
                                    />
                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        error={passwordErrors.password}
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        error={passwordErrors.password_confirmation}
                                    />
                                    <div className="pt-4">
                                        <Button type="submit" disabled={passwordProcessing}>
                                            {passwordProcessing ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-6">
                                    Notification Preferences
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email notifications for deadlines', description: 'Get reminded about upcoming deadlines' },
                                        { label: 'Daily progress summary', description: 'Receive a daily summary of your progress' },
                                        { label: 'AI suggestions', description: 'Get AI-powered suggestions for your assignments' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start justify-between p-4 rounded-phi bg-slate-50 dark:bg-white/5">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                                                <p className="text-sm text-slate-600 dark:text-white/50">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-kala-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm text-slate-500 dark:text-white/40 italic">
                                    Note: Email notifications will be available in a future update.
                                </p>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div>
                                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white mb-6">
                                    Appearance
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-3">
                                            Theme
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['light', 'dark', 'system'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    className={`p-4 rounded-phi border-2 transition-all ${theme === 'dark'
                                                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white/10'
                                                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className={`w-full h-16 rounded-phi mb-3 ${theme === 'light' ? 'bg-white border border-slate-200' :
                                                        theme === 'dark' ? 'bg-slate-800' :
                                                            'bg-gradient-to-r from-white to-slate-800'
                                                        }`} />
                                                    <span className={`text-sm font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-700 dark:text-white/70'
                                                        }`}>
                                                        {theme}
                                                    </span>
                                                    {theme === 'dark' && (
                                                        <span className="ml-2 text-xs text-emerald-500">(Active)</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-white/40 italic">
                                        Note: Light mode and system preference will be available in a future update.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <ConfirmationModal
                            isOpen={showDeleteConfirm}
                            onClose={() => setShowDeleteConfirm(false)}
                            onConfirm={handleDeleteAccount}
                            title="Delete Account"
                            message="Are you sure you want to delete your account? All of your data including assignments, milestones, and chat history will be permanently removed. This action cannot be undone."
                            confirmText="Delete Account"
                        />
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
