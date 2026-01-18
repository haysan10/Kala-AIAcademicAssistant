import { create } from 'zustand';

// UI Store for global UI state
export const useUIStore = create((set) => ({
    sidebarOpen: false,
    tutorOpen: false,
    currentTask: null,

    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setTutorOpen: (open) => set({ tutorOpen: open }),
    setCurrentTask: (task) => set({ currentTask: task }),

    openTutorWithTask: (task) => set({ tutorOpen: true, currentTask: task }),
    closeTutor: () => set({ tutorOpen: false, currentTask: null }),
}));

// Assignment Store for caching assignment data
export const useAssignmentStore = create((set, get) => ({
    assignments: [],
    currentAssignment: null,
    isLoading: false,

    setAssignments: (assignments) => set({ assignments }),
    setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
    setLoading: (loading) => set({ isLoading: loading }),

    updateTaskCompletion: (taskId, isCompleted, progress) => {
        const { currentAssignment } = get();
        if (!currentAssignment) return;

        const updatedMilestones = currentAssignment.milestones.map((milestone) => ({
            ...milestone,
            tasks: milestone.tasks.map((task) =>
                task.id === taskId ? { ...task, is_completed: isCompleted } : task
            ),
        }));

        set({
            currentAssignment: {
                ...currentAssignment,
                milestones: updatedMilestones,
                progress_percent: progress?.assignment_progress ?? currentAssignment.progress_percent,
            },
        });
    },
}));
