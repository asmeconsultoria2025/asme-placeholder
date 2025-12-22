// app/dashboard/clientes/PIPC-BC/[projectId]/sections/Occupancy.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { upsertOccupancy } from '../../actions';

interface Props {
  projectId: string;
  data: any;
  onSave: () => void;
}

export default function OccupancySection({ projectId, data, onSave }: Props) {
  const [formData, setFormData] = useState({
    poblacion_fija: data?.poblacion_fija || 0,
    poblacion_flotante: data?.poblacion_flotante || 0,
    edificios: data?.edificios || 0,
    niveles: data?.niveles || 0,
  });

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(data || {})) {
        handleSave();
      }
    }, 1000);

    setSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [formData]);

  async function handleSave() {
    try {
      await upsertOccupancy(projectId, formData);
      onSave();
    } catch (error) {
      console.error('Error saving occupancy:', error);
    }
  }

  function handleChange(field: string, value: number) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Users className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Ocupación del Inmueble</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Población Fija
            </label>
            <input
              type="number"
              min="0"
              value={formData.poblacion_fija}
              onChange={(e) => handleChange('poblacion_fija', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Personal que labora permanentemente</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Población Flotante
            </label>
            <input
              type="number"
              min="0"
              value={formData.poblacion_flotante}
              onChange={(e) => handleChange('poblacion_flotante', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Visitantes, clientes, proveedores</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Edificios
            </label>
            <input
              type="number"
              min="0"
              value={formData.edificios}
              onChange={(e) => handleChange('edificios', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Niveles
            </label>
            <input
              type="number"
              min="0"
              value={formData.niveles}
              onChange={(e) => handleChange('niveles', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Pisos o plantas del inmueble</p>
          </div>
        </div>
      </div>
    </div>
  );
}