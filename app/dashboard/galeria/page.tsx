'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, Trash2 } from 'lucide-react';

type GalleryImage = {
  name: string;
  publicUrl: string;
};

export default function AdminGalleryPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
    const { data, error } = await supabase.storage
      .from('gallery')
      .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    if (error || !data) return;

    const mapped = data
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((file) => ({
        name: file.name,
        publicUrl: supabase.storage
          .from('gallery')
          .getPublicUrl(file.name).data.publicUrl,
      }));

    setImages(mapped);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (!error) {
      await loadImages();
    }

    setUploading(false);
  };

  const handleDelete = async (name: string) => {
    await supabase.storage.from('gallery').remove([name]);
    await loadImages();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold">Galería</h1>
            <p className="text-gray-400 mt-2">
              Administra las imágenes públicas del sitio
            </p>
          </div>

          <label className="inline-flex items-center gap-3 cursor-pointer bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-semibold">
            <Upload className="w-5 h-5" />
            {uploading ? 'Subiendo…' : 'Subir imagen'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((img) => (
            <div
              key={img.name}
              className="relative group rounded-xl overflow-hidden border border-gray-800 bg-black"
            >
              <Image
                src={img.publicUrl}
                alt=""
                width={400}
                height={400}
                className="object-cover w-full h-48"
              />

              <button
                onClick={() => handleDelete(img.name)}
                className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 transition p-2 rounded-md opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-center text-gray-500">
            No hay imágenes aún.
          </p>
        )}
      </div>
    </div>
  );
}
