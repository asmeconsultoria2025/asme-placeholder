'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryImage = {
  name: string;
  publicUrl: string;
  category: string;
};

const CATEGORIES = [
  { id: 'capacitaciones', label: 'Capacitaciones' },
  { id: 'abogados', label: 'Abogados' },
  { id: 'otros', label: 'Otros' },
];

const IMAGES_PER_PAGE = 12;

export default function GaleriaPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadImages = async () => {
      const allImages: GalleryImage[] = [];

      // Load images from each category folder
      for (const category of CATEGORIES) {
        const { data, error } = await supabase.storage
          .from('gallery')
          .list(category.id, { 
            limit: 200, 
            sortBy: { column: 'created_at', order: 'desc' } 
          });

        if (!error && data) {
          const mapped = data
            .filter((f) => f.name && !f.name.startsWith('.'))
            .map((file) => ({
              name: file.name,
              publicUrl: supabase.storage
                .from('gallery')
                .getPublicUrl(`${category.id}/${file.name}`).data.publicUrl,
              category: category.id,
            }));

          allImages.push(...mapped);
        }
      }

      setImages(allImages);
      setLoading(false);
    };

    loadImages();
  }, []);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 px-4 py-24 sm:px-8 md:px-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
          Galería
          <span className="block text-red-600">ASME</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Evidencia visual de nuestro trabajo en campo
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mb-12 max-w-4xl"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {loading && (
        <p className="text-center text-gray-500">Cargando imágenes…</p>
      )}

      {!loading && filteredImages.length === 0 && (
        <p className="text-center text-gray-500">
          {selectedCategory === 'all'
            ? 'No hay imágenes publicadas aún.'
            : 'No hay imágenes en esta categoría.'}
        </p>
      )}

      {/* Images Grid */}
      {!loading && currentImages.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentImages.map((img, i) => (
              <motion.div
                key={`${img.category}-${img.name}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-black"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={img.publicUrl}
                    alt={`Imagen de ${CATEGORIES.find(c => c.id === img.category)?.label || img.category}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 flex flex-col items-center gap-6"
            >
              {/* Page Info */}
              <p className="text-sm text-gray-400">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredImages.length)} de {filteredImages.length} imágenes
              </p>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-red-600 border border-gray-800'
                  }`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      disabled={page === '...'}
                      className={`flex items-center justify-center min-w-[40px] h-10 rounded-lg font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                          : page === '...'
                          ? 'bg-transparent text-gray-600 cursor-default'
                          : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-red-600 border border-gray-800'
                  }`}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}