import React from 'react';
import { Card } from '../ui';
import type { SimulationStep } from '../../types';

interface StepsListProps {
  steps: SimulationStep[];
  currentStep: number;
}

export const StepsList: React.FC<StepsListProps> = ({ steps, currentStep }) => {
  const getStepTypeColor = (type: SimulationStep['type']) => {
    switch (type) {
      case 'start': return 'bg-green-100 text-green-800 border-green-200';
      case 'interrupt': return 'bg-red-100 text-red-800 border-red-200';
      case 'resume': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'complete': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepTypeLabel = (type: SimulationStep['type']) => {
    switch (type) {
      case 'start': return 'INICIO';
      case 'interrupt': return 'INTERRUPCIÓN';
      case 'resume': return 'REANUDACIÓN';
      case 'complete': return 'COMPLETADO';
      default: return 'DESCONOCIDO';
    }
  };

  const getStepIcon = (type: SimulationStep['type']) => {
    switch (type) {
      case 'start': return '▶️';
      case 'interrupt': return '⚡';
      case 'resume': return '🔄';
      case 'complete': return '✅';
      default: return '❓';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <Card title="Lista Completa de Pasos de Ejecución">
        {steps.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">
              No hay pasos de simulación disponibles
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Ejecuta una simulación desde la página de Simulación para ver los pasos aquí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative p-4 rounded-lg border-l-4 transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-blue-50 border-l-blue-500 shadow-md'
                    : index < currentStep
                    ? 'bg-gray-50 border-l-gray-300'
                    : 'bg-white border-l-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step number and icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentStep
                        ? 'bg-blue-500 text-white'
                        : index < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getStepIcon(step.type)}</span>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStepTypeColor(step.type)}`}>
                        {getStepTypeLabel(step.type)}
                      </div>
                      {index === currentStep && (
                        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white">
                          ACTUAL
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-800">
                        {step.interruptName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {step.message}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Tiempo: {formatTimestamp(step.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <div className="text-green-500">✓</div>
                    ) : index === currentStep ? (
                      <div className="text-blue-500">●</div>
                    ) : (
                      <div className="text-gray-300">○</div>
                    )}
                  </div>
                </div>

                {/* Connection line to next step */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-12 w-px h-4 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary Statistics */}
      {steps.length > 0 && (
        <Card title="Resumen de la Simulación">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {steps.filter(s => s.type === 'start').length}
              </div>
              <div className="text-sm text-green-700">Inicios</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {steps.filter(s => s.type === 'interrupt').length}
              </div>
              <div className="text-sm text-red-700">Interrupciones</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {steps.filter(s => s.type === 'resume').length}
              </div>
              <div className="text-sm text-blue-700">Reanudaciones</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {steps.filter(s => s.type === 'complete').length}
              </div>
              <div className="text-sm text-gray-700">Completados</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};