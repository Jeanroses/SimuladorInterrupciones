import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import type { Interrupt, InterruptFormData } from '../../types';

interface ConfigurationProps {
  interrupts: Interrupt[];
  onAddInterrupt: (data: InterruptFormData) => void;
  onUpdateInterrupt: (id: string, data: InterruptFormData) => void;
  onRemoveInterrupt: (id: string) => void;
}

export const Configuration: React.FC<ConfigurationProps> = ({
  interrupts,
  onAddInterrupt,
  onUpdateInterrupt,
  onRemoveInterrupt
}) => {
  const [formData, setFormData] = useState<InterruptFormData>({
    name: '',
    duration: 100,
    priority: 1
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingId) {
        onUpdateInterrupt(editingId, formData);
        setEditingId(null);
      } else {
        onAddInterrupt(formData);
      }
      setFormData({ name: '', duration: 100, priority: 1 });
    }
  };

  const handleEdit = (interrupt: Interrupt) => {
    setFormData({
      name: interrupt.name,
      duration: interrupt.duration,
      priority: interrupt.priority
    });
    setEditingId(interrupt.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', duration: 100, priority: 1 });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card title="Configurar Interrupción">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la Interrupción"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value as string })}
            placeholder="Ej: Teclado, Mouse, Disco..."
            required
          />
          
          <Input
            label="Duración (ms)"
            type="number"
            value={formData.duration}
            onChange={(value) => setFormData({ ...formData, duration: value as number })}
            min={1}
            max={5000}
            required
          />
          
          <Input
            label="Prioridad"
            type="number"
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value as number })}
            min={1}
            max={10}
            required
          />
          
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              {editingId ? 'Actualizar' : 'Agregar'} Interrupción
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card title="Lista de Interrupciones">
        {interrupts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay interrupciones configuradas
          </p>
        ) : (
          <div className="space-y-3">
            {interrupts.map((interrupt) => (
              <div
                key={interrupt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{interrupt.name}</h4>
                  <p className="text-sm text-gray-600">
                    Duración: {interrupt.duration}ms | Prioridad: {interrupt.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(interrupt)}
                    className="text-sm px-3 py-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onRemoveInterrupt(interrupt.id)}
                    className="text-sm px-3 py-1"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};