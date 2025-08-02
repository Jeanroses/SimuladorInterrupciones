export interface Interrupt {
  id: string;
  name: string;
  duration: number;
  priority: number;
  createdAt: number;
}

export interface SimulationStep {
  id: string;
  timestamp: number;
  type: 'start' | 'interrupt' | 'resume' | 'complete';
  interruptId: string;
  interruptName: string;
  message: string;
}

export interface SimulationState {
  interrupts: Interrupt[];
  currentStep: number;
  steps: SimulationStep[];
  isRunning: boolean;
  isPaused: boolean;
  interruptStack: Interrupt[];
}

export interface InterruptFormData {
  name: string;
  duration: number;
  priority: number;
}