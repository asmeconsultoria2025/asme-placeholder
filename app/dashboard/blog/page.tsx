'use client';

import { useEffect, useState, useRef, type TouchEvent } from "react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import {
  PenSquare,
  Trash,
  Archive,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const PAGE_SIZE = 10;

type SortOption = "date_desc" | "date_asc" | "type_asc" | "type_desc";
type ViewOption = "active" | "archived";

export default function BlogManagementPage() {
  // Initialize supabase client ONCE at the top
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState<ViewOption>("active");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Swipe state for mobile
  const [swipeOffsets, setSwipeOffsets] = useState<Record<string, number>>({});
  const touchStartXRef = useRef<Record<string, number>>({});

  // ---------- DATA FETCH ----------

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- FILTERING / SORTING / PAGINATION ----------

  const normalizedSearch = search.trim().toLowerCase();

  let filtered = posts.filter((post) =>
    view === "archived" ? post.archived : !post.archived
  );

  if (normalizedSearch) {
    filtered = filtered.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      return (
        title.includes(normalizedSearch) || content.includes(normalizedSearch)
      );
    });
  }

  if (typeFilter) {
    filtered = filtered.filter((post) => post.type === typeFilter);
  }

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date_asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "date_desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "type_asc":
        return String(a.type || "").localeCompare(String(b.type || ""));
      case "type_desc":
        return String(b.type || "").localeCompare(String(a.type || ""));
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const pagePosts = sorted.slice(start, start + PAGE_SIZE);

  const allSelectedOnPage =
    pagePosts.length > 0 &&
    pagePosts.every((p) => selectedIds.includes(p.id));

  // ---------- SELECTION / BULK ACTIONS ----------

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllOnPage = () => {
    const idsOnPage = pagePosts.map((p) => p.id);
    if (allSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...idsOnPage]))
      );
    }
  };

  const archivePost = async (post: any) => {
    await supabase
      .from("blogs")
      .update({ archived: !post.archived })
      .eq("id", post.id);

    await fetchPosts();
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
  };

  const deletePost = async (post: any) => {
    if (!confirm("¿Eliminar este post permanentemente?")) return;

    if (post.featured_image) {
      const file = post.featured_image.split("/").pop();
      if (file) {
        await supabase.storage.from("blog-images").remove([file]);
      }
    }

    if (post.media_url) {
      const file = post.media_url.split("/").pop();
      if (file) {
        await supabase.storage.from("blog-media").remove([file]);
      }
    }

    await supabase.from("blogs").delete().eq("id", post.id);
    await fetchPosts();
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
  };

  const bulkArchive = async () => {
    if (!selectedIds.length) return;

    const newArchivedValue = view === "active";

    await supabase
      .from("blogs")
      .update({ archived: newArchivedValue })
      .in("id", selectedIds);

    await fetchPosts();
    setSelectedIds([]);
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;

    if (
      !confirm(
        `¿Eliminar permanentemente ${selectedIds.length} post(s)? Esta acción no se puede deshacer.`
      )
    )
      return;

    const toDelete = posts.filter((p) => selectedIds.includes(p.id));

    for (const post of toDelete) {
      if (post.featured_image) {
        const file = post.featured_image.split("/").pop();
        if (file) {
          await supabase.storage.from("blog-images").remove([file]);
        }
      }

      if (post.media_url) {
        const file = post.media_url.split("/").pop();
        if (file) {
          await supabase.storage.from("blog-media").remove([file]);
        }
      }
    }

    await supabase.from("blogs").delete().in("id", selectedIds);
    await fetchPosts();
    setSelectedIds([]);
  };

  // ---------- SWIPE HANDLERS (MOBILE) ----------

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>, id: string) => {
    const touch = e.touches[0];
    touchStartXRef.current[id] = touch.clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>, id: string) => {
    const startX = touchStartXRef.current[id];
    if (startX == null) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX; // negative when swiping left

    if (deltaX < 0) {
      const clamped = Math.max(deltaX, -80); // limit to -80px
      setSwipeOffsets((prev) => ({ ...prev, [id]: clamped }));
    }
  };

  const handleTouchEnd = (post: any) => {
    const id = post.id;
    const offset = swipeOffsets[id] ?? 0;

    if (offset <= -60) {
      // trigger delete
      setSwipeOffsets((prev) => ({ ...prev, [id]: -80 }));
      deletePost(post);
    } else {
      // snap back
      setSwipeOffsets((prev) => ({ ...prev, [id]: 0 }));
    }

    delete touchStartXRef.current[id];
  };

  // ---------- RENDER ----------

  const bulkArchiveLabel =
    view === "active" ? "Archivar seleccionados" : "Restaurar seleccionados";

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-headline text-3xl font-bold text-asmeBlue">
          Gestión del Blog
        </h1>

        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/blog/create">
            <PenSquare className="mr-2 h-4 w-4" />
            Crear Post
          </Link>
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Entradas del Blog</CardTitle>
              <CardDescription>
                Administra todas las entradas de tu blog desde aquí.
              </CardDescription>
            </div>

            {/* VIEW TOGGLE */}
            <div className="inline-flex rounded-full bg-muted p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setView("active");
                  setPage(0);
                  setSelectedIds([]);
                  setSwipeOffsets({});
                }}
                className={`px-3 py-1 rounded-full font-medium ${
                  view === "active"
                    ? "bg-neutral-50 shadow-sm text-asmeBlue"
                    : "text-foreground/70"
                }`}
              >
                Publicados
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("archived");
                  setPage(0);
                  setSelectedIds([]);
                  setSwipeOffsets({});
                }}
                className={`px-3 py-1 rounded-full font-medium ${
                  view === "archived"
                    ? "bg-white shadow-sm text-[#000033]"
                    : "text-foreground/70"
                }`}
              >
                Archivados
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <p className="text-muted-foreground mb-4">Cargando...</p>
          )}

          {/* FILTER BAR */}
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:flex-1 md:items-center">
              <Input
                placeholder="Buscar por título o contenido..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full md:max-w-xs"
              />

              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v === "all" ? "" : v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="articulo">Artículo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(v: SortOption) => {
                  setSortBy(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="date_desc">Fecha (más reciente)</SelectItem>
                  <SelectItem value="date_asc">Fecha (más antiguo)</SelectItem>
                  <SelectItem value="type_asc">Tipo (A-Z)</SelectItem>
                  <SelectItem value="type_desc">Tipo (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BULK ACTIONS */}
          <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {pagePosts.length} de {sorted.length} resultados mostrados
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedIds.length}
                onClick={bulkArchive}
              >
                <Archive className="w-4 h-4 mr-1" />
                {bulkArchiveLabel}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                disabled={!selectedIds.length}
                onClick={bulkDelete}
              >
                <Trash className="w-4 h-4 mr-1 text-red-500" />
                Eliminar seleccionados
              </Button>
            </div>
          </div>

          {/* ---------- DESKTOP TABLE (md+) ---------- */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-border/40">
            <Table className="min-w-[780px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={allSelectedOnPage}
                      onChange={toggleSelectAllOnPage}
                    />
                  </TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right ">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagePosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedIds.includes(post.id)}
                        onChange={() => toggleSelect(post.id)}
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {post.title}
                    </TableCell>

                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString("es-MX")}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{post.type}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={post.archived ? "secondary" : "default"}>
                        {post.archived ? "Archivado" : "Publicado"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" className="text-[hsl(267, 86%, 40%)]" asChild>
                        <Link href={`/dashboard/blog/${post.id}/edit`}>
                          Editar
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" onClick={() => archivePost(post)}>
                        <Archive className="w-4 h-4 text-[hsl(26, 6%, 45%)]"/>
                      </Button>

                      <Button variant="destructive" size="sm" onClick={() => deletePost(post)}>
                        <Trash className="w-4 h-4 text-red-500"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && pagePosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No hay posts en esta vista.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ---------- MOBILE CARD VIEW (sm-) ---------- */}
          <div className="md:hidden mt-4 space-y-4">
            {pagePosts.map((post) => (
              <div key={post.id} className="relative overflow-hidden rounded-xl">

                {/* Delete background */}
                <div className="absolute inset-y-0 right-0 w-24 bg-red-500 text-red flex items-center justify-center text-xs font-semibold">
                  Eliminar
                </div>

                {/* Swipeable card */}
                <div
                  className="relative bg-white border rounded-xl p-4 shadow-sm"
                  style={{
                    transform: `translateX(${swipeOffsets[post.id] ?? 0}px)`,
                    transition: "transform 0.15s ease-out",
                  }}
                  onTouchStart={(e) => handleTouchStart(e, post.id)}
                  onTouchMove={(e) => handleTouchMove(e, post.id)}
                  onTouchEnd={() => handleTouchEnd(post)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-base">{post.title}</h2>
                    <input
                      type="checkbox"
                      className="h-4 w-4 mt-1"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.created_at).toLocaleDateString("es-MX")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline">{post.type}</Badge>
                    <Badge variant={post.archived ? "secondary" : "default"}>
                      {post.archived ? "Archivado" : "Publicado"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/blog/${post.id}/edit`}>Editar</Link>
                    </Button>

                    <Button variant="outline" size="sm" className="flex-1" onClick={() => archivePost(post)}>
                      <Archive className="w-4 h-4" />
                    </Button>

                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => deletePost(post)}>
                      <Trash className="w-4 h-4 " />
                    </Button>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Desliza hacia la izquierda para eliminar rápidamente.
                  </p>
                </div>
              </div>
            ))}

            {!loading && pagePosts.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                No hay posts en esta vista.
              </p>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 items-center">
            <span className="text-xs text-muted-foreground">
              Página {safePage + 1} de {totalPages}
            </span>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                disabled={safePage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>

              <Button
                variant="outline"
                disabled={safePage >= totalPages - 1}
                onClick={() =>
                  setPage((p) => (p < totalPages - 1 ? p + 1 : p))
                }
                className="w-full sm:w-auto"
              >
                Siguiente <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}