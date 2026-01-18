import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import AssignmentCard from '@/Components/Assignment/AssignmentCard';
import Button from '@/Components/UI/Button';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Index({ auth, assignments = [] }) {
    useEffect(() => {
        console.log('Assignment Index Mounted', { auth, assignments });
    }, [auth, assignments]);

    const safeAssignments = Array.isArray(assignments) ? assignments : [];

    return (
        <AppLayout title="My Assignments">
            <Head title="My Assignments" />

            <div className="p-phi-lg max-w-7xl mx-auto space-y-phi-lg">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="font-display font-black text-4xl text-slate-900 dark:text-white mb-2">
                            My Assignments
                        </h1>
                        <p className="text-slate-600 dark:text-white/60">
                            Track and manage all your academic tasks in one place.
                        </p>
                    </motion.div>

                    <Link href="/assignments/create">
                        <Button variant="primary" className="gap-2">
                            <PlusIcon className="w-5 h-5" />
                            New Assignment
                        </Button>
                    </Link>
                </div>

                {safeAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-md">
                        {safeAssignments.map((assignment, index) => (
                            <AssignmentCard
                                key={assignment?.id || index}
                                assignment={assignment}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card p-phi-xl text-center"
                    >
                        <div className="max-w-md mx-auto space-y-phi">
                            <div className="w-20 h-20 mx-auto rounded-full bg-slate-950 dark:bg-white flex items-center justify-center shadow-xl shadow-black/20">
                                <SparklesIcon className="w-10 h-10 text-white dark:text-black" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
                                    No assignments yet
                                </h3>
                                <p className="text-slate-600 dark:text-white/60 mb-phi">
                                    Start by creating an assignment and let Kala help you manage it.
                                </p>
                            </div>
                            <Link href="/assignments/create">
                                <Button variant="primary" size="lg" className="gap-2">
                                    <PlusIcon className="w-5 h-5" />
                                    Create Your First Assignment
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
