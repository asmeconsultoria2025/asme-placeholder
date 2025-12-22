// app/dashboard/clientes/pipc-bc/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, Calendar } from 'lucide-react';
import { createPIPCClient, getAllPIPCClients, deletePIPCClient } from './actions';

interface PIPCClientWithProject {
  id: string;
  razon_social: string;
  rfc?: string;
  created_at: string;
  pipc_projects: Array<{
    id: string;
    status: string;
    updated_at: string;
  }>;
}

export default function PIPCListPage() {
  const router = useRouter();
  const [clients, setClients] = useState<PIPCClientWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ razon_social: '', rfc: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getAllPIPCClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.razon_social.trim()) {
      alert('La razón social es obligatoria');
      return;
    }

    setCreating(true);
    try {
      const { project } = await createPIPCClient(formData);
      setShowCreateModal(false);
      setFormData({ razon_social: '', rfc: '' });
      router.push(`/dashboard/clientes/pipc-bc/${project.id}`);
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error al crear cliente');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(clientId: string, razonSocial: string) {
    if (!confirm(`¿Eliminar PIPC de "${razonSocial}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deletePIPCClient(clientId);
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error al eliminar cliente');
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800',
      generated: 'bg-green-100 text-green-800',
    };
    const labels = {
      draft: 'Borrador',
      ready: 'Listo',
      generated: 'Generado',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando PIPCs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programas Internos de Protección Civil</h1>
          <p className="text-gray-600 mt-2">Gestiona los PIPCs de tus clientes en Baja California</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo PIPC
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Borrador</p>
              <p className="text-2xl font-bold text-yellow-600">
                {clients.filter(c => c.pipc_projects?.[0]?.status === 'draft').length}
              </p>
            </div>
            <FileText className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Generados</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.pipc_projects?.[0]?.status === 'generated').length}
              </p>
            </div>
            <FileText className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay PIPCs registrados</h3>
          <p className="text-gray-600 mb-6">Comienza creando tu primer Programa Interno de Protección Civil</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear primer PIPC
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RFC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última actualización
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => {
                const project = client.pipc_projects?.[0];
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="text-blue-600 mr-3" size={20} />
                        <div className="text-sm font-medium text-gray-900">{client.razon_social}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.rfc || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project ? getStatusBadge(project.status) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {project ? new Date(project.updated_at).toLocaleDateString('es-MX') : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/clientes/pipc-bc/${project?.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.razon_social)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Crear nuevo PIPC</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón Social *
                </label>
                <input
                  type="text"
                  value={formData.razon_social}
                  onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFC (opcional)
                </label>
                <input
                  type="text"
                  value={formData.rfc}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="RFC del cliente"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ razon_social: '', rfc: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={creating}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear PIPC'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}