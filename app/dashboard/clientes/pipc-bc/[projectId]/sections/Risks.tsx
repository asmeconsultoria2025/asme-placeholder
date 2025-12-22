// app/dashboard/clientes/pipc-bc/[projectId]/sections/Risks.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { addRisk, deleteRisk } from '../../actions';

interface Risk {
  id: string;
  tipo: string;
  categoria: 'interno' | 'externo';
  nivel: string;
}

interface Props {
  projectId: string;
  risks: Risk[];
  onSave: () => void;
}

const RISK_PRESETS = [
  { tipo: 'Incendio', categoria: 'interno' as const, nivel: 'Alto' },
  { tipo: 'Sismo', categoria: 'externo' as const, nivel: 'Alto' },
  { tipo: 'Inundación', categoria: 'externo' as const, nivel: 'Medio' },
  { tipo: 'Fuga de gas', categoria: 'interno' as const, nivel: 'Alto' },
  { tipo: 'Corto circuito', categoria: 'interno' as const, nivel: 'Medio' },
  { tipo: 'Explosión', categoria: 'interno' as const, nivel: 'Alto' },
  { tipo: 'Accidente laboral', categoria: 'interno' as const, nivel: 'Medio' },
  { tipo: 'Huracán', categoria: 'externo' as const, nivel: 'Medio' },
];

export default function RisksSection({ projectId, risks, onSave }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    categoria: 'interno' as 'interno' | 'externo',
    nivel: 'Medio',
  });
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!formData.tipo.trim()) {
      alert('El tipo de riesgo es obligatorio');
      return;
    }

    setAdding(true);
    try {
      await addRisk(projectId, formData);
      setFormData({ tipo: '', categoria: 'interno', nivel: 'Medio' });
      setShowForm(false);
      onSave();
    } catch (error) {
      console.error('Error adding risk:', error);
      alert('Error al agregar riesgo');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(riskId: string) {
    if (!confirm('¿Eliminar este riesgo?')) return;

    try {
      await deleteRisk(projectId, riskId);
      onSave();
    } catch (error) {
      console.error('Error deleting risk:', error);
      alert('Error al eliminar riesgo');
    }
  }

  function handlePresetSelect(preset: typeof RISK_PRESETS[0]) {
    setFormData(preset);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Análisis de Riesgos</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus size={20} />
            Agregar Riesgo
          </button>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="mb-6 p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
            <h3 className="font-semibold mb-4">Nuevo Riesgo</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Riesgos comunes:</p>
              <div className="flex flex-wrap gap-2">
                {RISK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className="px-3 py-1 text-sm bg-white border rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    {preset.tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Riesgo
                </label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ej: Incendio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as 'interno' | 'externo' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="interno">Interno</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel
                </label>
                <select
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={adding}
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                disabled={adding}
              >
                {adding ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </div>
        )}

        {risks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay riesgos registrados</p>
            <p className="text-sm mt-2">Agrega riesgos identificados en el inmueble</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de Riesgo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoría</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nivel</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {risks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{risk.tipo}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        risk.categoria === 'interno' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {risk.categoria === 'interno' ? 'Interno' : 'Externo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        risk.nivel === 'Alto' 
                          ? 'bg-red-100 text-red-800' 
                          : risk.nivel === 'Medio'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {risk.nivel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(risk.id)}
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