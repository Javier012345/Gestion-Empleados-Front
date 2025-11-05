import React from 'react';

const MarcarAsistenciaTab = () => {
    return (
        <div className="container text-center">
            <div className="mx-auto" style={{ maxWidth: '700px' }}>
                <h2 className="text-2xl font-bold mb-4">Marcar Asistencia</h2>
                <p className="text-gray-400">Por favor, ubique su rostro frente a la cámara.</p>
                <div className="camera-container border rounded bg-gray-900 mx-auto mt-4" style={{ width: '100%', maxWidth: '500px' }}>
                    {/* Video element will be handled later */}
                    <div id="video-mark" style={{width: '100%', height: 'auto', backgroundColor: 'black'}} ></div>
                    <canvas id="canvas-mark" style={{ display: 'none' }}></canvas>
                </div>
                <div id="status-mark" className="mt-3 text-lg">
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-700 text-gray-200">Esperando rostro...</span>
                </div>
            </div>
        </div>
    );
};

export default MarcarAsistenciaTab;