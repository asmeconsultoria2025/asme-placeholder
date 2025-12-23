'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

interface ServiceCard {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  content_type: string;
  page_slug: string | null;
  section: string | null;
  service_slug: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

const CONTENT_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'service', label: 'Service Carousel' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'legal_service', label: 'Legal Service' },
];

const PAGES = [
  { value: '', label: 'Todas las páginas' },
  { value: 'instalaciones', label: 'Instalaciones' },
  { value: 'nosotros', label: 'Nosotros' },
  { value: 'main', label: 'Homepage (Main)' },
  { value: 'servicios', label: 'Servicios Detail' },
  { value: 'legal-familiar', label: 'Legal - Familiar' },
  { value: 'legal-penal', label: 'Legal - Penal' },
  { value: 'legal-civil', label: 'Legal - Civil' },
  { value: 'legal-amparos', label: 'Legal - Amparos' },
];

export default function ServiceCardsAdmin() {
  const [cards, setCards] = useState<ServiceCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cards, contentTypeFilter, pageFilter]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCards.length / ITEMS_PER_PAGE));
  }, [filteredCards]);

  async function loadCards() {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('service_cards')
        .select('*')
        .order('page_slug', { ascending: true })
        .order('section', { ascending: true })
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      
      setCards(data || []);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Error al cargar las tarjetas');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...cards];

    if (contentTypeFilter) {
      filtered = filtered.filter(card => card.content_type === contentTypeFilter);
    }

    if (pageFilter) {
      filtered = filtered.filter(card => card.page_slug === pageFilter);
    }

    setFilteredCards(filtered);
    setCurrentPage(1);
  }

  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  async function handleImageUpload(cardId: string, oldImageUrl: string, file: File) {
    setUploading(cardId);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cardId', cardId);
      formData.append('oldImageUrl', oldImageUrl);

      const response = await fetch('/api/service-cards/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, image_url: result.imageUrl, updated_at: new Date().toISOString() }
            : card
        )
      );

      setTimeout(() => {
        if (fileInputRefs.current[cardId]) {
          fileInputRefs.current[cardId]!.value = '';
        }
      }, 1000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Upload error:', err);
      setError(errorMessage);
    } finally {
      setUploading(null);
    }
  }

  async function toggleActive(card: ServiceCard) {
    try {
      const { error: updateError } = await supabase
        .from('service_cards')
        .update({ is_active: !card.is_active })
        .eq('id', card.id);

      if (updateError) throw updateError;

      setCards(prevCards =>
        prevCards.map(c =>
          c.id === card.id ? { ...c, is_active: !c.is_active } : c
        )
      );
    } catch (err) {
      console.error('Error toggling active:', err);
      setError('Error al actualizar el estado');
    }
  }

  function handleFileChange(cardId: string, oldImageUrl: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(cardId, oldImageUrl, file);
    }
  }

  function goToPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando tarjetas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Administrador de <span className="text-red-500">Tarjetas de Servicio</span>
          </h1>
          <p className="text-gray-400">
            Gestiona las imágenes de las tarjetas en todas las páginas
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-300 hover:text-red-100"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Total</div>
            <div className="text-2xl font-bold text-white">{cards.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Filtradas</div>
            <div className="text-2xl font-bold text-blue-400">{filteredCards.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Activas</div>
            <div className="text-2xl font-bold text-green-400">
              {cards.filter(c => c.is_active).length}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Página</div>
            <div className="text-2xl font-bold text-red-400">
              {currentPage} / {totalPages}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Contenido
            </label>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {CONTENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Página
            </label>
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {PAGES.map(page => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-6 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}

        {paginatedCards.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-lg">No hay tarjetas que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {paginatedCards.map((card) => (
              <div
                key={card.id}
                className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
              >
                <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                  <div className="space-y-4">
                    <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={card.image_url}
                        alt={card.title}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    </div>

                    <input
                      ref={(el) => {
                        fileInputRefs.current[card.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(card.id, card.image_url, e)}
                      disabled={uploading === card.id}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRefs.current[card.id]?.click()}
                      disabled={uploading === card.id}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                      {uploading === card.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subiendo...
                        </span>
                      ) : (
                        'Cambiar Imagen'
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="text-gray-400 text-sm">{card.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="text-gray-300 mt-1 font-medium">
                          {CONTENT_TYPES.find(t => t.value === card.content_type)?.label || card.content_type}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500">Página:</span>
                        <p className="text-gray-300 mt-1 font-medium">
                          {PAGES.find(p => p.value === card.page_slug)?.label || card.page_slug || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500">Sección:</span>
                        <p className="text-gray-300 mt-1 font-medium">
                          {card.section || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-500">Orden:</span>
                        <p className="text-gray-300 mt-1 font-medium">
                          {card.order_index}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="text-xs text-gray-500">
                        Actualizado: {new Date(card.updated_at).toLocaleDateString('es-MX')}
                      </div>

                      <button
                        onClick={() => toggleActive(card)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          card.is_active
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {card.is_active ? '✓ Activa' : '✗ Inactiva'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && paginatedCards.length > 0 && (
          <div className="flex items-center justify-between mt-8 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <div className="text-gray-400 text-sm">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCards.length)} de {filteredCards.length}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}