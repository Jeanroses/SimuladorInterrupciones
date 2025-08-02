import { useState, useCallback } from 'react';
import { InterruptSimulator } from '../logic/InterruptSimulator';
import type { InterruptFormData } from '../types';

export const useInterruptSimulator = () => {
  const [simulator] = useState(() => new InterruptSimulator());
  const [, forceUpdate] = useState({});

  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  const addInterrupt = useCallback((data: InterruptFormData): string => {
    const id = simulator.addInterrupt(data.name, data.duration, data.priority);
    refresh();
    return id;
  }, [simulator, refresh]);

  const removeInterrupt = useCallback((id: string): void => {
    simulator.removeInterrupt(id);
    refresh();
  }, [simulator, refresh]);

  const updateInterrupt = useCallback((id: string, data: InterruptFormData): void => {
    simulator.updateInterrupt(id, data.name, data.duration, data.priority);
    refresh();
  }, [simulator, refresh]);

  const startSimulation = useCallback((): void => {
    simulator.startSimulation();
    refresh();
  }, [simulator, refresh]);

  const pauseSimulation = useCallback((): void => {
    simulator.pauseSimulation();
    refresh();
  }, [simulator, refresh]);

  const nextStep = useCallback((): void => {
    simulator.nextStep();
    refresh();
  }, [simulator, refresh]);

  const previousStep = useCallback((): void => {
    simulator.previousStep();
    refresh();
  }, [simulator, refresh]);

  const reset = useCallback((): void => {
    simulator.reset();
    refresh();
  }, [simulator, refresh]);

  const state = simulator.getState();

  return {
    interrupts: state.interrupts,
    steps: state.steps,
    currentStep: state.currentStep,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    interruptStack: state.interruptStack,
    addInterrupt,
    removeInterrupt,
    updateInterrupt,
    startSimulation,
    pauseSimulation,
    nextStep,
    previousStep,
    reset
  };
};