import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Add CSRF token to all requests
api.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

export default api;

// API helpers
export const taskApi = {
    toggle: (taskId) => api.patch(`/tasks/${taskId}/toggle`),
    update: (taskId, data) => api.patch(`/tasks/${taskId}`, data),
    delete: (taskId) => api.delete(`/tasks/${taskId}`),
};

export const chatApi = {
    send: (assignmentId, message, taskId = null) =>
        api.post(`/assignments/${assignmentId}/chat`, { message, task_id: taskId }),
    history: (assignmentId) =>
        api.get(`/assignments/${assignmentId}/chat/history`),
    generateChecklist: (taskId) =>
        api.post(`/tasks/${taskId}/checklist`),
};
