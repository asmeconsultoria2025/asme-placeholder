'use client';

import { useState, useTransition } from 'react';
import { GraduationCap, Plus, Trash2, Calendar } from 'lucide-react';
import { addTraining, deleteTraining } from '../../actions';

interface Training {
  id: string;
  curso: string;
  fecha: string;
  duracion: string;
}

interface Props {
  projectId: string;
  training: Training[];
  onSave: () => void;
}

const TRAINING_PRESETS = [
  'Uso y manejo de extintores',
  'Primeros auxilios básicos',
  'Evacuación de inmuebles',
  'Búsqueda y rescate',
  'Prevención de incendios',
  'Soporte vital básico (SVB)',
  'Sistema de Comando de Incidentes (SCI)',
  'Manejo de materiales peligrosos',
];

export default function TrainingSection({ projectId, training, onSave }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    curso: '',
    fecha: '',
    duracion: '',
  });
  const [adding, setAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleAdd() {
    if (!formData.curso.trim()) {
      alert('El nombre del curso es obligatorio');
      return;
    }

    setAdding(true);
    try {
      startTransition(async () => {
        await addTraining(projectId, formData);
      });

      setFormData({ curso: '', fecha: '', duracion: '' });
      setShowForm(false);
      onSave();
    } catch (error) {
      console.error('Error adding training:', error);
      alert('Error al agregar capacitación');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(trainingId: string) {
    if (!confirm('¿Eliminar esta capacitación?')) return;

    try {
      startTransition(async () => {
        await deleteTraining(trainingId, projectId);
      });

      onSave();
    } catch (error) {
      console.error('Error deleting training:', error);
      alert('Error al eliminar capacitación');
    }
  }

  function handlePresetSelect(curso: string) {
    setFormData({ ...formData, curso });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Programa de Capacitación
            </h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Agregar Capacitación
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Add Form */}
        {showForm && (
          <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
            <h3 className="font-semibold mb-4">Nueva Capacitación</h3>

            {/* Presets */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Cursos comunes:</p>
              <div className="flex flex-wrap gap-2">
                {TRAINING_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className="px-3 py-1 text-sm bg-white border rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  value={formData.curso}
                  onChange={(e) =>
                    setFormData({ ...formData, curso: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Uso y manejo de extintores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración
                </label>
                <input
                  type="text"
                  value={formData.duracion}
                  onChange={(e) =>
                    setFormData({ ...formData, duracion: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 4 horas, 2 días"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={adding || isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={adding || isPending}
              >
                {adding || isPending ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </div>
        )}

        {/* Training Table */}
        {training.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <GraduationCap size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay capacitaciones registradas</p>
            <p className="text-sm mt-2">
              Agrega los cursos de capacitación del personal
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Curso
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Duración
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {training.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.curso}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.fecha ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(item.fecha).toLocaleDateString('es-MX')}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.duracion || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
