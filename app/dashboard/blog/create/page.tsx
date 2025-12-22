'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { uploadToBucket } from '@/app/lib/uploadBlogMedia';

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

interface BlogForm {
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
  const cleaned = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // If empty or just dashes, use a fallback
  if (!cleaned || cleaned === '-') {
    return `post-${Date.now()}`;
  }
  
  // Add timestamp to make it unique
  return `${cleaned}-${Date.now()}`;
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

export default function CreateBlogPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<BlogForm>({
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
      const raw = localStorage.getItem('asme_blog_draft');
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
        localStorage.setItem('asme_blog_draft', JSON.stringify(draftToSave));
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
      featuredImageUrl = await uploadToBucket('blog-images', form.featuredImage);
    }

    if (form.mediaFile) {
      mediaUrl = await uploadToBucket('blog-media', form.mediaFile);
    }

    // Generate unique slug with timestamp to prevent duplicates
    const baseSlug = slugify(form.title);
    const timestamp = Date.now();
    const slug = `${baseSlug}-${timestamp}`;

    const { error } = await supabase.from('blogs').insert({
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
      localStorage.removeItem('asme_blog_draft');
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
    <div className="relative">

      {/* background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.08),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.05),transparent_70%)]"
      />

      {/* MAIN GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0">
        
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          <Card className="border-border/40 shadow-[0_4px_18px_rgba(0,0,0,0.07)] min-w-0">
            <CardHeader>
              <CardTitle className="font-headline text-asmeBlue">
                Crear Nuevo Post
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 min-w-0">

              {/* TITLE */}
              <div>
                <Label className="font-semibold">Título</Label>
                <Input
                  className="mt-1"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* BODY + PREVIEW */}
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">
                    Cuerpo (Markdown permitido)
                  </Label>
                  <div className="flex items-center gap-3 text-xs text-foreground/60">
                    <span>{wordCount} palabras</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => setIsFullscreen(true)}
                    >
                      Pantalla completa
                    </Button>
                  </div>
                </div>

                <Textarea
                  className="min-h-[280px] mt-1"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                />

                {/* PREVIEW */}
                <div
                  className="mt-5 p-6 border rounded-xl bg-white shadow-sm 
                  prose prose-neutral max-w-none
                  prose-headings:font-headline"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || '*La vista previa aparecerá aquí…*'}
                  </ReactMarkdown>
                </div>
              </div>

              {/* -------------- BOTTOM ACTION BUTTONS -------------- */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
                
                <Button variant="ghost" className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard/blog">
                    Cancelar
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full sm:w-auto"
                  onClick={() => handleSave('draft')}
                >
                  Guardar Borrador
                </Button>

                <Button
                  disabled={loading}
                  className="w-full sm:w-auto bg-asmeBlue text-white hover:bg-asmeBlue/90"
                  onClick={() => handleSave('published')}
                >
                  Publicar
                </Button>

              </div>
              {/* ----------------------------------------------------- */}

            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE ----------------------------------------- */}
        <div className="space-y-6 min-w-0">
          <Card className="border-border/40 shadow-[0_4px_18px_rgba(0,0,0,0.07)]">
            <CardHeader>
              <CardTitle className="font-headline text-asmeBlue">
                Detalles
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* CATEGORY */}
              <div>
                <Label className="font-semibold">Categoría</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="proteccion-civil">
                      Protección Civil
                    </SelectItem>
                    <SelectItem value="seguridad-incendios">
                      Seguridad contra Incendios
                    </SelectItem>
                    <SelectItem value="normatividad">Normatividad</SelectItem>
                    <SelectItem value="noticias">Noticias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TYPE */}
              <div>
                <Label className="font-semibold">Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="articulo">Artículo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FEATURED IMAGE */}
              <div>
                <Label className="font-semibold">Imagen Destacada</Label>

                <Input
                  type="file"
                  accept="image/*"
                  className="mt-1 file:!bg-transparent file:!border-none file:!cursor-pointer file:!text-xs"
                  onChange={handleFeaturedImageChange}
                />

                {featuredPreview && (
                  <div className="mt-3">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border/40 shadow-sm bg-muted">
                      <Image
                        src={featuredPreview}
                        alt="Vista previa"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    {featuredMeta && (
                      <div className="mt-2 text-xs space-y-1">
                        <p>
                          Resolución: {featuredMeta.width}×{featuredMeta.height}px
                        </p>
                        <p>Tamaño del archivo: {formatFileSize(featuredMeta.size)}</p>
                        {(featuredMeta.width < 1200 ||
                          featuredMeta.height < 675) && (
                          <p className="text-red-500 font-medium">
                            Recomendado: al menos 1200 × 675 px para que se vea bien
                            en las tarjetas del blog.
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
                  <Label className="font-semibold">Archivo de Video</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    className="mt-1"
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
                  <Label className="font-semibold">Archivo de Audio</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    className="mt-1"
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
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <span className="font-semibold text-sm">Editor en pantalla completa</span>
              <Button size="sm" variant="outline" onClick={() => setIsFullscreen(false)}>
                Cerrar
              </Button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">

              {/* EDITOR */}
              <div className="w-full md:w-1/2 flex flex-col min-w-0">
                <Label className="mb-1 font-semibold">Contenido</Label>
                <Textarea
                  className="flex-1"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {wordCount} palabras
                </p>
              </div>

              {/* PREVIEW */}
              <div className="w-full md:w-1/2 flex flex-col min-w-0">
                <Label className="mb-1 font-semibold">Vista previa</Label>
                <div
                  className="flex-1 overflow-auto border rounded-xl p-4 bg-white prose max-w-none
                    prose-headings:font-headline"
                >
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