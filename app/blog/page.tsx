'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(
          data.map((p: any) => ({
            title: p.title,
            slug: p.slug,
            excerpt: p.content?.substring(0, 180) + '...',
            date: new Date(p.created_at).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            category: p.category,
            type:
              p.type === 'video'
                ? 'Video'
                : p.type === 'audio'
                ? 'Audio'
                : 'Artículo',
            media: p.type === 'articulo' ? p.featured_image : p.media_url,
          }))
        );
      }

      setLoading(false);
    };

    loadPosts();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-28 md:py-36 text-center">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white font-headline">
            Blog de
            <span className="block text-red-600">Seguridad y Prevención</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Artículos, noticias y recursos para mantener su empresa segura.
          </p>
        </div>

        {/* POSTS */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {loading && (
            <p className="col-span-full text-gray-500">Cargando…</p>
          )}

          {!loading && posts.length === 0 && (
            <p className="col-span-full text-gray-500">
              No hay artículos publicados aún.
            </p>
          )}

          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(220,38,38,0.25)]">

                  {/* IMAGE */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={post.media || '/images/fallback.jpeg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <CardHeader>
                    <div className="mb-3 flex gap-2 flex-wrap">

                      {/* CATEGORY PILL */}
                      <Badge className="bg-gray-800 text-gray-300 border border-gray-600">
                        {post.category}
                      </Badge>

                      {/* TYPE PILL */}
                      <Badge
                        className={
                          post.type === 'Video'
                            ? 'bg-red-900 text-red-100 border border-red-700'
                            : post.type === 'Audio'
                            ? 'bg-blue-900 text-blue-100 border border-blue-700'
                            : 'bg-purple-900 text-purple-100 border border-purple-700'
                        }
                      >
                        {post.type}
                      </Badge>

                    </div>

                    <CardTitle className="text-xl text-white transition-colors group-hover:text-red-500">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-gray-400">{post.excerpt}</p>
                  </CardContent>

                  <CardFooter>
                    <div className="flex w-full items-center justify-between text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span className="flex items-center font-semibold text-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Leer más <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </CardFooter>

                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
