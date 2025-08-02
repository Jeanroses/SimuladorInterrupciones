import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Configuration, Simulation, StepsList } from './components/pages';
import { useInterruptSimulator } from './hooks/useInterruptSimulator';

function App() {
  const simulator = useInterruptSimulator();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <Router basename="/SimuladorInterrupciones">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Simulador de Interrupciones
              </h1>
              <p className="text-sm text-gray-600">
                Fundamentos de Sistemas Operativos
              </p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-3">
              <NavLink to="/" className={navLinkClass}>
                📝 Configuración
              </NavLink>
              <NavLink to="/simulation" className={navLinkClass}>
                🎯 Simulación
              </NavLink>
              <NavLink to="/steps" className={navLinkClass}>
                📋 Lista de Pasos
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <Configuration
                  interrupts={simulator.interrupts}
                  onAddInterrupt={simulator.addInterrupt}
                  onUpdateInterrupt={simulator.updateInterrupt}
                  onRemoveInterrupt={simulator.removeInterrupt}
                />
              }
            />
            <Route
              path="/simulation"
              element={
                <Simulation
                  interrupts={simulator.interrupts}
                  steps={simulator.steps}
                  currentStep={simulator.currentStep}
                  isRunning={simulator.isRunning}
                  isPaused={simulator.isPaused}
                  interruptStack={simulator.interruptStack}
                  onStartSimulation={simulator.startSimulation}
                  onPauseSimulation={simulator.pauseSimulation}
                  onNextStep={simulator.nextStep}
                  onPreviousStep={simulator.previousStep}
                  onReset={simulator.reset}
                />
              }
            />
            <Route
              path="/steps"
              element={
                <StepsList
                  steps={simulator.steps}
                  currentStep={simulator.currentStep}
                />
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              Simulador de Interrupciones - Sistemas Operativos
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
