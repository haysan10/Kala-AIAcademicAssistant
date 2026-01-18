import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Merge class names utility
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}


/**
 * Format a date string to a readable format
 */
export function formatDate(dateString, formatStr = 'MMM d, yyyy') {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
}

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format minutes to human readable duration
 */
export function formatDuration(minutes) {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
    const colors = {
        pending: 'badge-pending',
        in_progress: 'badge-in-progress',
        at_risk: 'badge-at-risk',
        completed: 'badge-completed',
    };
    return colors[status] || 'badge-pending';
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
    const labels = {
        pending: 'Pending',
        in_progress: 'In Progress',
        at_risk: 'At Risk',
        completed: 'Completed',
    };
    return labels[status] || 'Unknown';
}
