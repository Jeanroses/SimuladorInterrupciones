import type { Interrupt, SimulationStep, SimulationState } from '../types';

export class InterruptSimulator {
  private state: SimulationState;

  constructor() {
    this.state = {
      interrupts: [],
      currentStep: 0,
      steps: [],
      isRunning: false,
      isPaused: false,
      interruptStack: []
    };
  }

  addInterrupt(name: string, duration: number, priority: number): string {
    const interrupt: Interrupt = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      duration,
      priority,
      createdAt: Date.now()
    };
    
    this.state.interrupts.push(interrupt);
    this.sortInterruptsByPriority();
    return interrupt.id;
  }

  removeInterrupt(id: string): void {
    this.state.interrupts = this.state.interrupts.filter(int => int.id !== id);
  }

  updateInterrupt(id: string, name: string, duration: number, priority: number): void {
    const interrupt = this.state.interrupts.find(int => int.id === id);
    if (interrupt) {
      interrupt.name = name;
      interrupt.duration = duration;
      interrupt.priority = priority;
      this.sortInterruptsByPriority();
    }
  }

  private sortInterruptsByPriority(): void {
    this.state.interrupts.sort((a, b) => b.priority - a.priority);
  }

  private createStep(
    type: SimulationStep['type'],
    interruptId: string,
    interruptName: string,
    message: string
  ): SimulationStep {
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      interruptId,
      interruptName,
      message
    };
  }

  simulate(): SimulationStep[] {
    const steps: SimulationStep[] = [];
    const interruptStack: Interrupt[] = [];
    const sortedInterrupts = [...this.state.interrupts].sort((a, b) => b.priority - a.priority);

    // Simulate main process start
    steps.push(this.createStep('start', 'main', 'Proceso Principal', 'Iniciando proceso principal'));

    // Process interrupts based on priority
    for (let i = 0; i < sortedInterrupts.length; i++) {
      const interrupt = sortedInterrupts[i];
      
      // Check if this interrupt should preempt others
      if (interruptStack.length > 0) {
        const currentInterrupt = interruptStack[interruptStack.length - 1];
        if (interrupt.priority > currentInterrupt.priority) {
          // Higher priority - interrupt current process
          steps.push(this.createStep(
            'interrupt',
            currentInterrupt.id,
            currentInterrupt.name,
            `Interrumpiendo ${currentInterrupt.name} (prioridad ${currentInterrupt.priority})`
          ));
        }
      }

      // Start the new interrupt
      interruptStack.push(interrupt);
      steps.push(this.createStep(
        'start',
        interrupt.id,
        interrupt.name,
        `Iniciando ${interrupt.name} (prioridad ${interrupt.priority}, duración ${interrupt.duration}ms)`
      ));

      // Simulate interrupt execution time
      setTimeout(() => {
        steps.push(this.createStep(
          'complete',
          interrupt.id,
          interrupt.name,
          `Completando ${interrupt.name}`
        ));
      }, interrupt.duration * 10); // Scale down for demo

      // Resume previous interrupt if any
      interruptStack.pop();
      if (interruptStack.length > 0) {
        const previousInterrupt = interruptStack[interruptStack.length - 1];
        steps.push(this.createStep(
          'resume',
          previousInterrupt.id,
          previousInterrupt.name,
          `Resumiendo ${previousInterrupt.name}`
        ));
      }
    }

    // Complete main process
    steps.push(this.createStep('complete', 'main', 'Proceso Principal', 'Proceso principal completado'));

    this.state.steps = steps;
    return steps;
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  reset(): void {
    this.state.steps = [];
    this.state.currentStep = 0;
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.interruptStack = [];
  }

  startSimulation(): void {
    this.reset();
    this.state.isRunning = true;
    this.simulate();
  }

  pauseSimulation(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  nextStep(): void {
    if (this.state.currentStep < this.state.steps.length - 1) {
      this.state.currentStep++;
    }
  }

  previousStep(): void {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
    }
  }
}