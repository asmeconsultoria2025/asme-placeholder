import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BlogPostClient from "./post-client";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap the promised params
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return notFound();

  return <BlogPostClient post={data} />;
}
