'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";

export default function BlogPostClient({ post }: { post: any }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ---- AUTO ORIENTATION DETECTION ----
  const width = post.media_width || 0;
  const height = post.media_height || 0;

  let aspectClass = "aspect-video"; // landscape fallback
  if (width < height) aspectClass = "aspect-[9/16]"; // portrait
  if (width === height) aspectClass = "aspect-square"; // square

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-[hsl(var(--asmeBlue)/0.07)] via-white to-white">

      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32"
      >
        {/* Title */}
        <h1 className="font-headline text-4xl font-bold tracking-tight mb-3 text-center">
          {post.title}
        </h1>

        {/* Date */}
        <p className="text-foreground/60 mb-10 text-center">{formattedDate}</p>

        {/* ---- MEDIA BLOCK ---- */}
        <div className="relative mb-12 w-full flex justify-center">
          <div
            className={`
              relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]
              bg-black
              w-full
              max-w-[380px]      /* mobile */
              sm:max-w-[460px]
              md:max-w-[520px]
              lg:max-w-[600px]   /* desktop lock */
              xl:max-w-[620px]
              ${aspectClass}      /* portrait / landscape auto */
            `}
          >
            {post.type === "video" ? (
              <video
                src={post.media_url}
                controls
                className="w-full h-full object-cover"
              />
            ) : post.type === "audio" ? (
              <audio controls className="w-full">
                <source src={post.media_url} />
              </audio>
            ) : (
              <Image
                src={post.featured_image || "/images/fallback.jpeg"}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* ---- CONTENT ---- */}
        <div
          className="prose prose-neutral max-w-none text-foreground/90"
          dangerouslySetInnerHTML={{
            __html: post.content?.replace(/\n/g, "<br/>") || "",
          }}
        />

        {/* ---- BACK BUTTON ---- */}
        <div className="mt-16 text-center">
          <Link href="/blog">
            <Button variant="outline">← Regresar al Blog</Button>
          </Link>
        </div>
      </motion.article>

    </div>
  );
}
