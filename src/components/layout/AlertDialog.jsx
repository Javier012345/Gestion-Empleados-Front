import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AlertDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
            <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
            <div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-transform duration-300 w-full max-w-md m-4 ${
                    isOpen ? 'scale-100' : 'scale-95'
                }`}>
                <div className="p-8 text-center">
                    <div className="flex justify-center items-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
                        <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{message}</p>
                </div>
                <div className="flex gap-4 bg-gray-50 dark:bg-gray-700/50 px-8 py-5 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 font-semibold text-gray-800 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full px-4 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
