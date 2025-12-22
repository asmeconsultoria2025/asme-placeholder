// app/admin/service-cards/page.tsx (FIXED)
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  content_type: string;
  page_slug: string | null;
  section: string | null;
  service_slug: string | null;
  order_index: number;
  is_active: boolean;
}

const CONTENT_TYPES = [
  { value: 'service', label: 'Servicio Carousel' },
  { value: 'gallery', label: 'Galería' },
  { value: 'legal_service', label: 'Abogados' },
];

const PAGES = [
  { value: 'main', label: 'Main/ASME' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'instalaciones', label: 'Instalaciones' },
  { value: 'nosotros', label: 'Nosotros' },
  { value: 'galeria', label: 'Galería' },
  { value: 'legal', label: 'Legal' },
  { value: 'legal-familiar', label: 'Legal - Familiar' },
  { value: 'legal-penal', label: 'Legal - Penal' },
  { value: 'legal-civil', label: 'Legal - Civil' },
  { value: 'legal-amparos', label: 'Legal - Amparos' },
];

const ITEMS_PER_PAGE = 10;

export default function ServiceCardsAdmin() {
  const [cards, setCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadCards();
  }, [filterType, filterPage, currentPage]);

  async function loadCards() {
    setLoading(true);

    // Build query
    let query = supabase
      .from('service_cards')
      .select('*', { count: 'exact' });

    if (filterType !== 'all') {
      query = query.eq('content_type', filterType);
    }

    if (filterPage !== 'all') {
      query = query.eq('page_slug', filterPage);
    }

    // Get total count
    const { count } = await query;
    setTotalCount(count || 0);

    // Get paginated results
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data } = await query
      .order('page_slug', { ascending: true })
      .order('content_type', { ascending: true })
      .order('section', { ascending: true })
      .order('order_index', { ascending: true })
      .range(from, to);

    if (data) setCards(data);
    setLoading(false);
  }

  async function handleImageUpload(
    cardId: string, 
    oldImageUrl: string, 
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(cardId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cardId', cardId);

      // ← FIXED: Correct API route path
      const response = await fetch('/api/service-cards/upload-image', {
        method: 'POST',
        body: formData,
      });

      // ← FIXED: Better error handling
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Upload error response:', errorData);
        alert(`Upload failed: ${errorData.error || response.statusText}`);
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      await loadCards();
      alert('Imagen actualizada exitosamente!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir imagen: ' + (error as Error).message);
    } finally {
      setUploading(null);
    }
  }

  async function toggleActive(cardId: string, currentStatus: boolean) {
    await supabase
      .from('service_cards')
      .update({ is_active: !currentStatus })
      .eq('id', cardId);
    
    loadCards();
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && cards.length === 0) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Administrar contenido ASME</h1>
        
        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Contenido</label>
            <select 
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-4 py-2"
            >
              <option value="all">Todos</option>
              {CONTENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pagina</label>
            <select 
              value={filterPage}
              onChange={(e) => {
                setFilterPage(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-4 py-2"
            >
              <option value="all">Todas las Paginas</option>
              {PAGES.map(page => (
                <option key={page.value} value={page.value}>{page.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando {cards.length} de {totalCount} artículos (Página {currentPage} de {totalPages})
          </div>

          {/* Pagination Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              anterior
            </button>
            
            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 border rounded ${
                      currentPage === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white border rounded-lg p-6 shadow">
            <div className="flex gap-6">
              {/* Image Preview */}
              <div className="w-48 h-32 flex-shrink-0">
                <img 
                  src={card.image_url} 
                  alt={card.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Card Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-2">{card.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <span><strong>Tipo:</strong> {card.content_type}</span>
                  <span><strong>Pagina:</strong> {card.page_slug || 'All'}</span>
                  <span><strong>Seccion:</strong> {card.section || 'Default'}</span>
                  <span><strong>Orden:</strong> {card.order_index}</span>
                  {card.service_slug && (
                    <span className="col-span-2">
                      <strong>Servicio:</strong> {card.service_slug}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(card.id, card.image_url, e)}
                    disabled={uploading === card.id}
                    className="hidden"
                  />
                  <div className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center whitespace-nowrap">
                    {uploading === card.id ? 'Uploading...' : 'Cambiar Imagen'}
                  </div>
                </label>

                <button
                  onClick={() => toggleActive(card.id, card.is_active)}
                  className={`px-4 py-2 rounded ${
                    card.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {card.is_active ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No se encontró contenido. Intenta ajustar tus filtros.
        </div>
      )}
    </div>
  );
}