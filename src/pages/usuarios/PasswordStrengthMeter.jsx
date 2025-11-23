import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
    const requirements = useMemo(() => [
        { regex: /.{8,}/, text: 'Al menos 8 caracteres' },
        { regex: /[a-z]/, text: 'Al menos una letra minúscula' },
        { regex: /[A-Z]/, text: 'Al menos una letra mayúscula' },
        { regex: /[0-9]/, text: 'Al menos un número' },
    ], []);

    const evaluatedRequirements = useMemo(() => {
        return requirements.map(req => ({
            ...req,
            met: req.regex.test(password)
        }));
    }, [password, requirements]);

    const strength = useMemo(() => {
        return evaluatedRequirements.filter(req => req.met).length;
    }, [evaluatedRequirements]);

    const strengthColors = [
        'bg-red-500',       // 1/4
        'bg-orange-500',    // 2/4
        'bg-yellow-500',    // 3/4
        'bg-green-500'      // 4/4
    ];

    const barWidth = strength > 0 ? `${(strength / requirements.length) * 100}%` : '0%';

    return (
        <div className="space-y-3 transition-all duration-300">
            {/* Barra de Progreso */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${strength > 0 ? strengthColors[strength - 1] : 'bg-transparent'}`}
                    style={{ width: barWidth }}
                ></div>
            </div>

            {/* Lista de Requisitos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {evaluatedRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 transition-colors" />
                        ) : (
                            <XCircle className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'} transition-colors`}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;