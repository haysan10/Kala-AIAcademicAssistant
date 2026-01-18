import { cn } from '@/Lib/cn';
import { getStatusLabel } from '@/Lib/utils';

export default function StatusBadge({ status, isAtRisk = false }) {
    const displayStatus = isAtRisk ? 'at_risk' : status;

    const styles = {
        pending: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10',
        in_progress: 'bg-kala-500/10 text-kala-600 dark:text-kala-400 border-kala-500/20',
        at_risk: 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent',
        completed: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/20',
    };

    const icons = {
        pending: '•',
        in_progress: '•',
        at_risk: '!',
        completed: '✓',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                styles[displayStatus] || styles.pending
            )}
        >
            <span>{icons[displayStatus] || icons.pending}</span>
            <span>{getStatusLabel(displayStatus)}</span>
        </span>
    );
}
