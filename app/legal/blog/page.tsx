'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import BlogsChessBackground from '@/app/components/legal/BlogsChessBackground';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Video, Headphones, Search, Calendar, ArrowRight } from 'lucide-react';

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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const Icon = typeIcons[post.type];
  const excerpt = post.excerpt || post.content?.substring(0, 150) + '...' || '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <Card className="relative h-full border-0 bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-gray-950/70 backdrop-blur-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {post.featured_image && (
          <div className="relative h-56 overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-black backdrop-blur-sm border-0">
                <Icon className="h-3 w-3 mr-1" />
                {typeLabels[post.type]}
              </Badge>
            </div>
          </div>
        )}
        
        <CardContent className="p-8 relative z-10">
          {!post.featured_image && (
            <div className="mb-6 inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Icon className="h-10 w-10 text-white" />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Calendar className="h-4 w-4" />
            {new Date(post.created_at).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>

          <Button
            asChild
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm group/btn"
          >
            <Link href={`/legal/blog/${post.id}`} className="flex items-center justify-center gap-2">
              Leer más
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LegalBlogsPage() {
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('legal_blogs')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
        setFilteredPosts(data);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [supabase]);

  useEffect(() => {
    let filtered = posts;

    if (selectedType !== 'all') {
      filtered = filtered.filter(post => post.type === selectedType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedType, posts]);

  useEffect(() => {
    if (!headerRef.current) return;

    const text = headerRef.current.innerText.trim();
    const words = text.split(' ');

    headerRef.current.innerHTML = words
      .map((word) => `<span class="blog-word inline-block mr-2">${word}</span>`)
      .join(' ');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.onload = () => {
      const anime = (window as any).anime;
      anime({
        targets: '.blog-word',
        opacity: [0, 1],
        translateY: ['2rem', '0rem'],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(80),
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative min-h-screen">
      <BlogsChessBackground />

      <div ref={containerRef} className="relative">
        <motion.section 
          className="relative overflow-hidden pt-32 pb-24 text-center"
          style={{ opacity, scale }}
        >
          <div className="relative mx-auto max-w-5xl px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 inline-block"
            >
              <FileText className="h-20 w-20 text-white/90 mx-auto" />
            </motion.div>

            <h1
              ref={headerRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-8"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Blog Legal
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Artículos, análisis y recursos legales para mantenerte informado sobre tus derechos y las últimas actualizaciones jurídicas.
            </motion.p>
          </div>
        </motion.section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
            >
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 backdrop-blur-sm"
                />
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  onClick={() => setSelectedType('all')}
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  className={
                    selectedType === 'all'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }
                >
                  Todos
                </Button>
                <Button
                  onClick={() => setSelectedType('articulo')}
                  variant={selectedType === 'articulo' ? 'default' : 'outline'}
                  className={
                    selectedType === 'articulo'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Artículos
                </Button>
                <Button
                  onClick={() => setSelectedType('video')}
                  variant={selectedType === 'video' ? 'default' : 'outline'}
                  className={
                    selectedType === 'video'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }
                >
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </Button>
                <Button
                  onClick={() => setSelectedType('audio')}
                  variant={selectedType === 'audio' ? 'default' : 'outline'}
                  className={
                    selectedType === 'audio'
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Audio
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <p className="text-gray-400">
                {loading ? 'Cargando...' : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'resultado' : 'resultados'}`}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 px-4 pb-32">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="text-center text-white">
                <p className="text-xl">Cargando artículos...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Card className="border-0 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-950/60 backdrop-blur-xl p-12">
                  <p className="text-xl text-gray-300">
                    No se encontraron artículos con los criterios seleccionados.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}