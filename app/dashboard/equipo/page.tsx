// app/dashboard/equipo/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Mail, Send } from 'lucide-react';
import Image from 'next/image';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadAndAddTeamMemberImage,
  deleteTeamMemberImage,
} from './actions';

interface TeamMemberImage {
  id: string;
  image_url: string;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  team_member_images?: TeamMemberImage[];
  linkedin_url?: string;
  email?: string;
  order: number;
  active: boolean;
}

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    email: '',
    order: 1,
    active: true,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await getAllTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
      alert('Error al cargar los miembros del equipo');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.name || !formData.position || !formData.bio) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      await createTeamMember(formData);
      setShowCreateModal(false);
      resetForm();
      await loadMembers();
      alert('Miembro agregado exitosamente');
    } catch (error) {
      console.error('Error creating member:', error);
      alert('Error al crear el miembro');
    }
  }

  async function handleUpdate(id: string) {
    try {
      await updateTeamMember(id, formData);
      setEditingId(null);
      resetForm();
      await loadMembers();
      alert('Miembro actualizado exitosamente');
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error al actualizar el miembro');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteTeamMember(id);
      await loadMembers();
      alert('Miembro eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error al eliminar el miembro');
    }
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      image_url: member.image_url,
      linkedin_url: member.linkedin_url || '',
      email: member.email || '',
      order: member.order,
      active: member.active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({
      name: '',
      position: '',
      bio: '',
      image_url: '',
      linkedin_url: '',
      email: '',
      order: members.length + 1,
      active: true,
    });
  }

  async function handlePrimaryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(true);
    try {
      const { uploadTeamImage } = await import('./actions');
      const imageUrl = await uploadTeamImage(file);
      setFormData({ ...formData, image_url: imageUrl });
      alert('Imagen principal subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  }

  // Handle multiple gallery images upload
  async function handleGalleryImagesUpload(memberId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} es mayor a 5MB`);
        return;
      }
    }

    setUploadingGallery(true);
    try {
      // Upload all files sequentially
      for (let i = 0; i < files.length; i++) {
        await uploadAndAddTeamMemberImage(memberId, files[i]);
      }
      
      await loadMembers();
      alert(`${files.length} imagen(es) agregada(s) exitosamente`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Error al subir las imágenes');
    } finally {
      setUploadingGallery(false);
    }
  }

  async function handleDeleteGalleryImage(imageId: string) {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      await deleteTeamMemberImage(imageId);
      await loadMembers();
      alert('Imagen eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipo</h1>
          <p className="text-gray-600 mt-2">Administra los miembros del equipo que aparecen en la página "Nosotros"</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail size={20} />
            Invitar Usuario
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Agregar Miembro
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              !member.active ? 'opacity-50' : ''
            }`}
          >
            {/* Primary Image */}
            <div className="relative h-64 bg-gray-200">
              {member.image_url ? (
                <Image
                  src={member.image_url}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Sin imagen
                </div>
              )}
              {!member.active && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">INACTIVO</span>
                </div>
              )}
              {/* Image count badge */}
              {member.team_member_images && member.team_member_images.length > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <ImageIcon size={12} />
                  {member.team_member_images.length + 1}
                </div>
              )}
            </div>

            {/* Content */}
            {editingId === member.id ? (
              // Edit Mode
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Nombre completo"
                />
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Cargo/Posición"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Descripción/Biografía"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Email"
                />
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="LinkedIn URL"
                />
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Orden"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Activo</span>
                </label>

                {/* Primary Image Upload */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-2">Imagen Principal</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryImageUpload}
                    className="w-full text-sm"
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-blue-600 mt-1">Subiendo...</p>}
                </div>

                {/* Gallery Images Upload */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-2">
                    Galería de Imágenes ({member.team_member_images?.length || 0})
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryImagesUpload(member.id, e)}
                    className="w-full text-sm mb-2"
                    disabled={uploadingGallery}
                  />
                  {uploadingGallery && (
                    <p className="text-sm text-blue-600 mb-2">Subiendo imágenes...</p>
                  )}
                  
                  {/* Gallery Thumbnails */}
                  {member.team_member_images && member.team_member_images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {member.team_member_images.map((img) => (
                        <div key={img.id} className="relative group">
                          <div className="relative h-20 rounded overflow-hidden">
                            <Image
                              src={img.image_url}
                              alt="Gallery"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleUpdate(member.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-red-600 text-sm font-semibold mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{member.bio}</p>
                {member.email && (
                  <p className="text-xs text-gray-500 mb-1">📧 {member.email}</p>
                )}
                {member.linkedin_url && (
                  <p className="text-xs text-gray-500 mb-3">🔗 LinkedIn</p>
                )}
                <p className="text-xs text-gray-400 mb-2">Orden: {member.order}</p>
                
                {/* Gallery preview */}
                {member.team_member_images && member.team_member_images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">
                      🖼️ {member.team_member_images.length} imagen(es) adicional(es)
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(member)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay miembros del equipo registrados</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar primer miembro
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Agregar Miembro del Equipo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ing. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cargo/Posición *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Director General"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción/Biografía *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Con más de 20 años de experiencia..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 150-250 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagen Principal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>}
                {formData.image_url && (
                  <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden">
                    <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Puedes agregar más imágenes después de crear el miembro
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@asme.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Orden de aparición</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número menor aparece primero (1, 2, 3...)
                </p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Activo (visible en la página)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Miembro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Invitar Usuario</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={inviting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se enviará un correo con un enlace para establecer la contraseña
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={inviting}
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!inviteEmail || !inviteEmail.includes('@')) {
                      alert('Por favor ingresa un correo válido');
                      return;
                    }

                    setInviting(true);
                    try {
                      const response = await fetch('/api/auth/invite-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: inviteEmail, role: 'team_member' })
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || 'Error al enviar invitación');
                      }

                      alert('Invitación enviada exitosamente. El usuario recibirá un correo para establecer su contraseña.');
                      setShowInviteModal(false);
                      setInviteEmail('');
                    } catch (error: any) {
                      console.error('Error inviting user:', error);
                      alert(error.message || 'Error al enviar la invitación');
                    } finally {
                      setInviting(false);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={inviting}
                >
                  {inviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar Invitación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}