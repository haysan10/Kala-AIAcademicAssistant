import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/Lib/utils';

export default function FileDropzone({
    onFileSelect,
    accept = {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize = 10 * 1024 * 1024, // 10MB
    className = '',
}) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setError(null);

        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large') {
                setError('File is too large. Max size is 10MB.');
            } else if (error.code === 'file-invalid-type') {
                setError('Invalid file type. Please upload PDF, TXT, or DOCX.');
            } else {
                setError('Failed to upload file.');
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            onFileSelect?.(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    const removeFile = () => {
        setFile(null);
        onFileSelect?.(null);
    };

    if (file) {
        return (
            <div className={cn('card p-4', className)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-phi bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-900 dark:text-white font-medium truncate">{file.name}</p>
                        <p className="text-sm text-slate-500 dark:text-white/40">
                            {(file.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-2 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                {...getRootProps()}
                className={cn(
                    'card p-10 border-2 border-dashed cursor-pointer transition-all duration-300',
                    isDragActive
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-white/5 scale-[0.99]'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
                )}
            >
                <input {...getInputProps()} />
                <div className="text-center">
                    <DocumentTextIcon className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-slate-900 dark:text-white font-display font-bold mb-2">
                        {isDragActive ? 'Drop your file here' : 'Select assignment document'}
                    </p>
                    <p className="text-slate-500 dark:text-white/40 text-sm">
                        PDF, TXT, or DOCX (Max 10MB)
                    </p>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
}
