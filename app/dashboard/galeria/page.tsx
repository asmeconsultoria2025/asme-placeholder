'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, Trash2, FolderOpen } from 'lucide-react';

type GalleryImage = {
  name: string;
  publicUrl: string;
  category: string;
};

const CATEGORIES = [
  { id: 'capacitaciones', label: 'Capacitaciones' },
  { id: 'abogados', label: 'Abogados' },
  { id: 'simulacros', label: 'Simulacros' },
  { id: 'otros', label: 'Otros' },
];

export default function AdminGalleryPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [filterCategory, setFilterCategory] = useState<string>('all');

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
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const filesArray = Array.from(files);
    setUploadProgress({ current: 0, total: filesArray.length });

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const filePath = `${selectedCategory}/${fileName}`;

      await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      setUploadProgress({ current: i + 1, total: filesArray.length });
    }

    await loadImages();
    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleDelete = async (category: string, name: string) => {
    await supabase.storage.from('gallery').remove([`${category}/${name}`]);
    await loadImages();
  };

  const filteredImages = filterCategory === 'all' 
    ? images 
    : images.filter(img => img.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-extrabold">Galería</h1>
            <p className="text-gray-400 mt-2">
              Administra las imágenes públicas del sitio
            </p>
          </div>

          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría para subir
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-3 cursor-pointer bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-semibold whitespace-nowrap">
              <Upload className="w-5 h-5" />
              {uploading 
                ? `Subiendo ${uploadProgress.current}/${uploadProgress.total}…` 
                : 'Subir imágenes'}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleUpload(files);
                  }
                }}
              />
            </label>
          </div>

          {/* Filter Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por categoría
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterCategory === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                Todas ({images.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = images.filter(img => img.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterCategory === cat.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredImages.map((img) => {
            const categoryLabel = CATEGORIES.find(c => c.id === img.category)?.label || img.category;
            return (
              <div
                key={`${img.category}-${img.name}`}
                className="relative group rounded-xl overflow-hidden border border-gray-800 bg-black"
              >
                <Image
                  src={img.publicUrl}
                  alt=""
                  width={400}
                  height={400}
                  className="object-cover w-full h-48"
                />

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md flex items-center gap-1">
                  <FolderOpen className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-white">{categoryLabel}</span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(img.category, img.name)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 transition p-2 rounded-md opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredImages.length === 0 && (
          <p className="text-center text-gray-500">
            {filterCategory === 'all' 
              ? 'No hay imágenes aún.' 
              : 'No hay imágenes en esta categoría.'}
          </p>
        )}
      </div>
    </div>
  );
}