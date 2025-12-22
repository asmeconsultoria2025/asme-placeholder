// app/dashboard/clientes/PIPC-BC/[projectId]/sections/UIPC.tsx
'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { upsertUIPC } from '../../actions';

interface Props {
  projectId: string;
  data: any;
  onSave: () => void;
}

export default function UIFCSection({ projectId, data, onSave }: Props) {
  const [formData, setFormData] = useState({
    responsable: data?.responsable || '',
    coordinador: data?.coordinador || '',
    brigadas: data?.brigadas || {
      evacuacion: [],
      primeros_auxilios: [],
      prevencion_combate_incendios: [],
      comunicacion: [],
      busqueda_rescate: [],
    },
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
      await upsertUIPC(projectId, formData);
      onSave();
    } catch (error) {
      console.error('Error saving UIPC:', error);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">
            Unidad Interna de Protección Civil (UIPC)
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable de la UIPC
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => handleChange('responsable', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre completo"
              />
              <p className="mt-1 text-xs text-gray-500">
                Persona a cargo de la Unidad Interna de Protección Civil
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordinador General
              </label>
              <input
                type="text"
                value={formData.coordinador}
                onChange={(e) => handleChange('coordinador', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre completo"
              />
              <p className="mt-1 text-xs text-gray-500">
                Coordinador de brigadas y operaciones
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Estructura de Brigadas</h3>
            <p className="text-sm text-blue-700">
              Las brigadas se configurarán según las necesidades específicas del inmueble.
              Esta información será detallada en el documento final del PIPC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}