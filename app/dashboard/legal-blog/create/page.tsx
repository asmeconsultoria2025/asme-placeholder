'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { uploadToLegalBucket } from '@/app/lib/uploadLegalBlogMedia';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ---------------------- types ----------------------

interface LegalBlogForm {
  title: string;
  content: string;
  category: string;
  type: string;
  featuredImage: File | null;
  mediaFile: File | null;
}

interface ImageMeta {
  width: number;
  height: number;
  size: number;
}

// ---------------------- helpers ----------------------

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function formatFileSize(bytes: number) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

// ---------------------- component ----------------------

export default function CreateLegalBlogPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<LegalBlogForm>({
    title: '',
    content: '',
    category: '',
    type: '',
    featuredImage: null,
    mediaFile: null,
  });

  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [featuredMeta, setFeaturedMeta] = useState<ImageMeta | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const wordCount = countWords(form.content);

  // ------------ Auto-load draft from localStorage ------------

  useEffect(() => {
    try {
      const raw = localStorage.getItem('legal_blog_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((prev) => ({
          ...prev,
          ...parsed,
          featuredImage: null,
          mediaFile: null,
        }));
      }
    } catch {
      // Silently fail if no draft exists
    }
  }, []);

  // ------------ Auto-save draft every 10s ------------

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const draftToSave = {
          title: form.title,
          content: form.content,
          category: form.category,
          type: form.type,
        };
        localStorage.setItem('legal_blog_draft', JSON.stringify(draftToSave));
      } catch {
        // Silently fail if localStorage is unavailable
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [form.title, form.content, form.category, form.type]);

  // ------------ Save handler ------------

  const handleSave = useCallback(async (status: 'draft' | 'published') => {
    // Validate title is not empty
    if (!form.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    setLoading(true);

    let featuredImageUrl: string | null = null;
    let mediaUrl: string | null = null;

    if (form.featuredImage) {
      featuredImageUrl = await uploadToLegalBucket('legal-blog-images', form.featuredImage);
    }

    if (form.mediaFile) {
      mediaUrl = await uploadToLegalBucket('legal-blog-media', form.mediaFile);
    }

    // Generate unique slug with timestamp to prevent duplicates
    const baseSlug = slugify(form.title);
    const timestamp = Date.now();
    const slug = `${baseSlug}-${timestamp}`;

    const { error } = await supabase.from('legal_blogs').insert({
      title: form.title,
      content: form.content,
      category: form.category,
      type: form.type,
      featured_image: featuredImageUrl,
      media_url: mediaUrl,
      media_type: form.mediaFile?.type || null,
      slug,
      archived: false,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(`Error al guardar: ${error.message}`);
      return;
    }

    alert(
      `Post ${
        status === 'draft' ? 'guardado como borrador' : 'publicado'
      } correctamente`
    );

    // Clear draft after successful save
    try {
      localStorage.removeItem('legal_blog_draft');
    } catch {
      // Silently fail
    }

    // Clear form
    setForm({
      title: '',
      content: '',
      category: '',
      type: '',
      featuredImage: null,
      mediaFile: null,
    });
    setFeaturedPreview(null);
    setFeaturedMeta(null);
  }, [form, supabase]);

  // ------------ Featured image handler ------------

  const handleFeaturedImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, featuredImage: file }));

    if (file) {
      const url = URL.createObjectURL(file);
      setFeaturedPreview(url);

      const img = new window.Image();
      img.onload = () => {
        setFeaturedMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
        });
      };
      img.src = url;
    } else {
      setFeaturedPreview(null);
      setFeaturedMeta(null);
    }
  }, []);

  // ---------------------- UI ----------------------

  return (
    <div className="relative bg-white">

      {/* Chess pattern header */}
      <div className="mb-8 p-8 bg-black text-white border-4 border-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="chess" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="white"/>
                <rect x="20" y="20" width="20" height="20" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chess)"/>
          </svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">♟️ Crear Nuevo Post Legal</h1>
          <p className="text-neutral-300 mt-1">Añade contenido profesional al blog legal</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0">
        
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          <Card className="border-4 border-black shadow-none min-w-0">
            <CardHeader className="border-b-4 border-black bg-white">
              <CardTitle className="text-black">Contenido del Post</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 min-w-0 bg-white pt-6">

              {/* TITLE */}
              <div>
                <Label className="font-semibold text-black">Título</Label>
                <Input
                  className="mt-1 border-2 border-black rounded-none focus-visible:ring-black"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* BODY + PREVIEW */}
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-black">
                    Cuerpo (Markdown permitido)
                  </Label>
                  <div className="flex items-center gap-3 text-xs text-neutral-600">
                    <span>{wordCount} palabras</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs border-2 border-black rounded-none hover:bg-black hover:text-white"
                      onClick={() => setIsFullscreen(true)}
                    >
                      Pantalla completa
                    </Button>
                  </div>
                </div>

                <Textarea
                  className="min-h-[280px] mt-1 border-2 border-black rounded-none focus-visible:ring-black"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                />

                {/* PREVIEW */}
                <div className="mt-5 p-6 border-2 border-black bg-white prose prose-neutral max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || '*La vista previa aparecerá aquí…*'}
                  </ReactMarkdown>
                </div>
              </div>

              {/* BOTTOM ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
                
                <Button variant="outline" className="w-full sm:w-auto border-2 border-black rounded-none hover:bg-black hover:text-white" asChild>
                  <Link href="/dashboard/legal-blog">
                    Cancelar
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full sm:w-auto border-2 border-black rounded-none hover:bg-black hover:text-white"
                  onClick={() => handleSave('draft')}
                >
                  Guardar Borrador
                </Button>

                <Button
                  disabled={loading}
                  className="w-full sm:w-auto bg-black text-white rounded-none hover:bg-neutral-800"
                  onClick={() => handleSave('published')}
                >
                  Publicar
                </Button>

              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6 min-w-0">
          <Card className="border-4 border-black shadow-none">
            <CardHeader className="border-b-4 border-black bg-white">
              <CardTitle className="text-black">Detalles</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 bg-white pt-6">

              {/* CATEGORY */}
              <div>
                <Label className="font-semibold text-black">Categoría</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1 border-2 border-black rounded-none">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black rounded-none">
                    <SelectItem value="derecho-penal">Derecho Penal</SelectItem>
                    <SelectItem value="derecho-familiar">Derecho Familiar</SelectItem>
                    <SelectItem value="derecho-civil">Derecho Civil</SelectItem>
                    <SelectItem value="amparos">Amparos</SelectItem>
                    <SelectItem value="actualizaciones">Actualizaciones</SelectItem>
                    <SelectItem value="jurisprudencia">Jurisprudencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TYPE */}
              <div>
                <Label className="font-semibold text-black">Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger className="mt-1 border-2 border-black rounded-none">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black rounded-none">
                    <SelectItem value="articulo">Artículo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FEATURED IMAGE */}
              <div>
                <Label className="font-semibold text-black">Imagen Destacada</Label>

                <Input
                  type="file"
                  accept="image/*"
                  className="mt-1 border-2 border-black rounded-none file:!bg-transparent file:!border-none file:!cursor-pointer file:!text-xs"
                  onChange={handleFeaturedImageChange}
                />

                {featuredPreview && (
                  <div className="mt-3">
                    <div className="relative w-full h-48 border-2 border-black overflow-hidden bg-neutral-100">
                      <Image
                        src={featuredPreview}
                        alt="Vista previa"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    {featuredMeta && (
                      <div className="mt-2 text-xs space-y-1 text-neutral-700">
                        <p>
                          Resolución: {featuredMeta.width}×{featuredMeta.height}px
                        </p>
                        <p>Tamaño del archivo: {formatFileSize(featuredMeta.size)}</p>
                        {(featuredMeta.width < 1200 ||
                          featuredMeta.height < 675) && (
                          <p className="text-black font-semibold">
                            ⚠️ Recomendado: al menos 1200 × 675 px
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MEDIA FILE */}
              {form.type === 'video' && (
                <div>
                  <Label className="font-semibold text-black">Archivo de Video</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    className="mt-1 border-2 border-black rounded-none"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mediaFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              )}

              {form.type === 'audio' && (
                <div>
                  <Label className="font-semibold text-black">Archivo de Audio</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    className="mt-1 border-2 border-black rounded-none"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mediaFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FULLSCREEN EDITOR */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto bg-white border-4 border-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black bg-white">
              <span className="font-semibold text-sm text-black">♟️ Editor en pantalla completa</span>
              <Button size="sm" variant="outline" className="border-2 border-black rounded-none hover:bg-black hover:text-white" onClick={() => setIsFullscreen(false)}>
                Cerrar
              </Button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden bg-white">

              {/* EDITOR */}
              <div className="w-full md:w-1/2 flex flex-col min-w-0">
                <Label className="mb-1 font-semibold text-black">Contenido</Label>
                <Textarea
                  className="flex-1 border-2 border-black rounded-none"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
                <p className="mt-1 text-[11px] text-neutral-600">
                  {wordCount} palabras
                </p>
              </div>

              {/* PREVIEW */}
              <div className="w-full md:w-1/2 flex flex-col min-w-0">
                <Label className="mb-1 font-semibold text-black">Vista previa</Label>
                <div className="flex-1 overflow-auto border-2 border-black p-4 bg-white prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || '*La vista previa aparecerá aquí…*'}
                  </ReactMarkdown>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}