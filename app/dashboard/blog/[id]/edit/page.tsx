'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { uploadToBucket } from '@/app/lib/uploadBlogMedia';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('articulo');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [existingFeaturedImage, setExistingFeaturedImage] = useState('');
  const [existingMediaUrl, setExistingMediaUrl] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      setError('Post no encontrado');
      setLoading(false);
      return;
    }

    setTitle(data.title || '');
    setContent(data.content || '');
    setType(data.type || 'articulo');
    setExistingFeaturedImage(data.featured_image || '');
    setExistingMediaUrl(data.media_url || '');
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Título y contenido son obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let featuredImageUrl = existingFeaturedImage;
      let mediaUrl = existingMediaUrl;

      // Upload new featured image to DigitalOcean Spaces
      if (featuredImage) {
        featuredImageUrl = await uploadToBucket('blog-images', featuredImage);
      }

      // Upload new media to DigitalOcean Spaces
      if (mediaFile) {
        mediaUrl = await uploadToBucket('blog-media', mediaFile);
      }

      const { error: updateError } = await supabase
        .from('blogs')
        .update({
          title,
          content,
          type,
          featured_image: featuredImageUrl,
          media_url: mediaUrl,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/dashboard/blog');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/blog">Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-asmeBlue">Editar Post</h1>
      </div>

      <Card className="p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del post"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenido</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenido del post"
              rows={12}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="articulo">Artículo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Imagen destacada</label>
            {existingFeaturedImage && (
              <p className="text-xs text-muted-foreground">Actual: {existingFeaturedImage.split('/').pop()}</p>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Archivo multimedia</label>
            {existingMediaUrl && (
              <p className="text-xs text-muted-foreground">Actual: {existingMediaUrl.split('/').pop()}</p>
            )}
            <Input
              type="file"
              accept="video/*,audio/*"
              onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/blog">Cancelar</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
