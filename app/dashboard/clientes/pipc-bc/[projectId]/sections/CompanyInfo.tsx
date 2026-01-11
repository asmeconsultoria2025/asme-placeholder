// app/dashboard/clientes/pipc-bc/[projectId]/sections/CompanyInfo.tsx
'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, Loader2 } from 'lucide-react';
import { upsertCompanyInfo } from '../../actions';

interface Props {
  projectId: string;
  data: any;
  onSave: () => void;
}

export default function CompanyInfoSection({ projectId, data, onSave }: Props) {
  const [formData, setFormData] = useState({
    domicilio: data?.domicilio || '',
    colonia: data?.colonia || '',
    municipio: data?.municipio || '',
    estado: data?.estado || 'Baja California',
    telefono: data?.telefono || '',
    representante_legal: data?.representante_legal || '',
    email: data?.email || '',
  });

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Autosave on change (debounced)
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
    setSaving(true);
    try {
      await upsertCompanyInfo(projectId, formData);
      onSave();
    } catch (error) {
      console.error('Error saving company info:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleManualSave() {
    setSaving(true);
    try {
      await upsertCompanyInfo(projectId, formData);
      onSave();
    } catch (error) {
      console.error('Error saving company info:', error);
      alert('Error al guardar datos de la empresa');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Datos de la Empresa</h2>
          </div>
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domicilio
            </label>
            <input
              type="text"
              value={formData.domicilio}
              onChange={(e) => handleChange('domicilio', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Calle y número"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colonia
            </label>
            <input
              type="text"
              value={formData.colonia}
              onChange={(e) => handleChange('colonia', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Colonia o fraccionamiento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio
            </label>
            <input
              type="text"
              value={formData.municipio}
              onChange={(e) => handleChange('municipio', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tijuana, Mexicali, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(664) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contacto@empresa.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Representante Legal
            </label>
            <input
              type="text"
              value={formData.representante_legal}
              onChange={(e) => handleChange('representante_legal', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre completo del representante legal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}