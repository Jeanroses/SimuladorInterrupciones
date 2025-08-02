import React from 'react';
import { Button, Card } from '../ui';
import type { Interrupt, SimulationStep } from '../../types';

interface SimulationProps {
  interrupts: Interrupt[];
  steps: SimulationStep[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  interruptStack: Interrupt[];
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onReset: () => void;
}

export const Simulation: React.FC<SimulationProps> = ({
  interrupts,
  steps,
  currentStep,
  isRunning,
  isPaused,
  interruptStack,
  onStartSimulation,
  onPauseSimulation,
  onNextStep,
  onPreviousStep,
  onReset
}) => {
  const getCurrentStep = () => {
    return steps[currentStep];
  };

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

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card title="Panel de Control">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onStartSimulation}
            disabled={interrupts.length === 0 || isRunning}
            variant="primary"
          >
            Iniciar Simulación
          </Button>
          <Button
            onClick={onPauseSimulation}
            disabled={!isRunning}
            variant="secondary"
          >
            {isPaused ? 'Reanudar' : 'Pausar'}
          </Button>
          <Button onClick={onReset} variant="secondary">
            Reiniciar
          </Button>
        </div>
        
        {interrupts.length === 0 && (
          <p className="text-orange-600 mt-3 text-sm">
            ⚠️ Necesitas configurar al menos una interrupción para iniciar la simulación
          </p>
        )}
      </Card>

      {/* Step Navigation */}
      {steps.length > 0 && (
        <Card title="Navegación de Pasos">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={onPreviousStep}
              disabled={currentStep <= 0}
              variant="secondary"
              className="text-sm"
            >
              ← Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <Button
              onClick={onNextStep}
              disabled={currentStep >= steps.length - 1}
              variant="secondary"
              className="text-sm"
            >
              Siguiente →
            </Button>
          </div>
        </Card>
      )}

      {/* Current Step Display */}
      {steps.length > 0 && getCurrentStep() && (
        <Card title="Paso Actual">
          <div className="space-y-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStepTypeColor(getCurrentStep().type)}`}>
              {getStepTypeLabel(getCurrentStep().type)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {getCurrentStep().interruptName}
              </h4>
              <p className="text-gray-600">{getCurrentStep().message}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Interrupt Stack Visualization */}
      <Card title="Pila de Interrupciones">
        {interruptStack.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            La pila de interrupciones está vacía
          </p>
        ) : (
          <div className="space-y-2">
            {interruptStack.slice().reverse().map((interrupt, index) => (
              <div
                key={interrupt.id}
                className={`p-3 rounded-lg border-2 ${
                  index === 0 ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {interrupt.name}
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        ACTIVO
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-600">
                    Prioridad: {interrupt.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Interrupts Overview */}
      <Card title="Interrupciones Configuradas">
        {interrupts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay interrupciones configuradas
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {interrupts.map((interrupt) => (
              <div
                key={interrupt.id}
                className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
              >
                <h4 className="font-semibold text-gray-800">{interrupt.name}</h4>
                <p className="text-sm text-gray-600">
                  Duración: {interrupt.duration}ms
                </p>
                <p className="text-sm text-gray-600">
                  Prioridad: {interrupt.priority}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};