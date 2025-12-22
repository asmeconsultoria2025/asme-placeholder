'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { useParams, useRouter } from 'next/navigation';
import BlogsChessBackground from '@/app/components/legal/BlogsChessBackground';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Video, Headphones, Calendar, ArrowLeft, Share2, AlertCircle } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: 'articulo' | 'video' | 'audio';
  featured_image: string | null;
  media_url: string | null;
  created_at: string;
  archived: boolean;
};

const typeIcons = {
  articulo: FileText,
  video: Video,
  audio: Headphones,
};

const typeLabels = {
  articulo: 'Artículo',
  video: 'Video',
  audio: 'Audio',
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [mediaError, setMediaError] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('legal_blogs')
        .select('*')
        .eq('id', params.id)
        .eq('archived', false)
        .single();

      if (error || !data) {
        router.push('/legal/blog');
        return;
      }

      setPost(data);

      const { data: related } = await supabase
        .from('legal_blogs')
        .select('*')
        .eq('type', data.type)
        .eq('archived', false)
        .neq('id', params.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (related) {
        setRelatedPosts(related);
      }

      setLoading(false);
    };

    fetchPost();
  }, [params.id, supabase, router]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.content.substring(0, 150),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <BlogsChessBackground />
        <div className="relative flex items-center justify-center min-h-screen">
          <Card className="border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-12">
            <p className="text-xl text-white">Cargando artículo...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const Icon = typeIcons[post.type];

  return (
    <div className="relative min-h-screen">
      <BlogsChessBackground />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-5xl px-4 pt-24"
        >
          <Button
            asChild
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
          >
            <Link href="/legal/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-5xl px-4 py-12"
        >
          <Card className="border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl overflow-hidden">
            {post.featured_image && (
              <div className="relative h-96 w-full">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-white/90 text-black backdrop-blur-sm border-0">
                  <Icon className="h-3 w-3 mr-1" />
                  {typeLabels[post.type]}
                </Badge>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <Button
                  onClick={handleShare}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

              {post.type === 'video' && post.media_url && (
                <div className="mb-8">
                  {!mediaError ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        className="w-full h-full"
                        onError={() => setMediaError(true)}
                      >
                        <source src={post.media_url} type="video/mp4" />
                        <source src={post.media_url} type="video/webm" />
                        <source src={post.media_url} type="video/ogg" />
                        Tu navegador no soporta la reproducción de video.
                      </video>
                    </div>
                  ) : (
                    <Card className="border-0 bg-red-500/10 backdrop-blur-sm p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 font-semibold mb-2">
                            Error al cargar el video
                          </p>
                          <p className="text-red-200 text-sm mb-3">
                            El video no se pudo reproducir. Intenta descargar el archivo directamente:
                          </p>
                          <Button
                            asChild
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white"
                          >
                            <a href={post.media_url} target="_blank" rel="noopener noreferrer" download>
                              Descargar Video
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {post.type === 'audio' && post.media_url && (
                <div className="mb-8">
                  {!mediaError ? (
                    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
                      <audio
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        className="w-full"
                        onError={() => setMediaError(true)}
                      >
                        <source src={post.media_url} type="audio/mpeg" />
                        <source src={post.media_url} type="audio/ogg" />
                        <source src={post.media_url} type="audio/wav" />
                        Tu navegador no soporta la reproducción de audio.
                      </audio>
                    </div>
                  ) : (
                    <Card className="border-0 bg-red-500/10 backdrop-blur-sm p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 font-semibold mb-2">
                            Error al cargar el audio
                          </p>
                          <p className="text-red-200 text-sm mb-3">
                            El audio no se pudo reproducir. Intenta descargar el archivo directamente:
                          </p>
                          <Button
                            asChild
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white"
                          >
                            <a href={post.media_url} target="_blank" rel="noopener noreferrer" download>
                              Descargar Audio
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              <div 
                className="prose prose-invert prose-lg max-w-none"
                style={{ color: '#e5e7eb' }}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                />
              </div>
            </div>
          </Card>
        </motion.section>

        {relatedPosts.length > 0 && (
          <section className="container mx-auto max-w-5xl px-4 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Artículos Relacionados
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const RelatedIcon = typeIcons[relatedPost.type];
                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/legal/blog/${relatedPost.id}`}
                      className="group"
                    >
                      <Card className="h-full border-0 bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-gray-950/70 backdrop-blur-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                        {relatedPost.featured_image && (
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <Badge className="bg-white/90 text-black backdrop-blur-sm border-0 mb-3">
                            <RelatedIcon className="h-3 w-3 mr-1" />
                            {typeLabels[relatedPost.type]}
                          </Badge>
                          
                          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-gray-300 transition-colors">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}