import React from 'react';
import { LogOut } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, employeeName, title, message, confirmText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4 text-center" onClick={e => e.stopPropagation()}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold mt-4">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {message.replace('{employeeName}', employeeName)}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 w-full">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
