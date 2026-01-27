'use client';

import { useEffect, useState, useRef, type TouchEvent } from "react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';
import { deleteFromSpaces } from "@/app/lib/deleteFromSpaces";

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

export default function LegalBlogManagementPage() {
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
      .from("legal_blogs")
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
      .from("legal_blogs")
      .update({ archived: !post.archived })
      .eq("id", post.id);

    await fetchPosts();
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
  };

  const deletePost = async (post: any) => {
    if (!confirm("¿Eliminar este post permanentemente?")) return;

    // Delete files from DigitalOcean Spaces
    if (post.featured_image) {
      await deleteFromSpaces(post.featured_image);
    }
    if (post.media_url) {
      await deleteFromSpaces(post.media_url);
    }

    await supabase.from("legal_blogs").delete().eq("id", post.id);
    await fetchPosts();
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
  };

  const bulkArchive = async () => {
    if (!selectedIds.length) return;

    const newArchivedValue = view === "active";

    await supabase
      .from("legal_blogs")
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

    // Delete files from DigitalOcean Spaces
    for (const post of toDelete) {
      if (post.featured_image) {
        await deleteFromSpaces(post.featured_image);
      }
      if (post.media_url) {
        await deleteFromSpaces(post.media_url);
      }
    }

    await supabase.from("legal_blogs").delete().in("id", selectedIds);
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
    const deltaX = touch.clientX - startX;

    if (deltaX < 0) {
      const clamped = Math.max(deltaX, -80);
      setSwipeOffsets((prev) => ({ ...prev, [id]: clamped }));
    }
  };

  const handleTouchEnd = (post: any) => {
    const id = post.id;
    const offset = swipeOffsets[id] ?? 0;

    if (offset <= -60) {
      setSwipeOffsets((prev) => ({ ...prev, [id]: -80 }));
      deletePost(post);
    } else {
      setSwipeOffsets((prev) => ({ ...prev, [id]: 0 }));
    }

    delete touchStartXRef.current[id];
  };

  const bulkArchiveLabel =
    view === "active" ? "Archivar seleccionados" : "Restaurar seleccionados";

  return (
    <div className="w-full">
      {/* CHESS PATTERN HEADER */}
      <div className="relative mb-8 p-8 bg-gradient-to-r from-black to-neutral-900 text-white rounded-lg border-2 border-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
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
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">♟️ Blog Legal</h1>
            <p className="text-neutral-300 mt-1">Gestión de contenido legal profesional</p>
          </div>

          <Button asChild className="w-full sm:w-auto bg-white text-black hover:bg-neutral-100">
            <Link href="/dashboard/legal-blog/create">
              <PenSquare className="mr-2 h-4 w-4" />
              Crear Post
            </Link>
          </Button>
        </div>
      </div>

      <Card className="w-full border-2 border-black">
        <CardHeader className="border-b-2 border-black bg-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-black">Entradas del Blog Legal</CardTitle>
              <CardDescription className="text-neutral-600">
                Administra todas las entradas legales desde aquí.
              </CardDescription>
            </div>

            {/* VIEW TOGGLE - Chess theme */}
            <div className="inline-flex rounded-none border-2 border-black p-1 text-xs bg-white">
              <button
                type="button"
                onClick={() => {
                  setView("active");
                  setPage(0);
                  setSelectedIds([]);
                  setSwipeOffsets({});
                }}
                className={`px-3 py-1 font-medium transition-colors ${
                  view === "active"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-neutral-100"
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
                className={`px-3 py-1 font-medium transition-colors ${
                  view === "archived"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-neutral-100"
                }`}
              >
                Archivados
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="bg-white">
          {loading && (
            <p className="text-neutral-600 mb-4">Cargando...</p>
          )}

          {/* FILTER BAR */}
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between pt-6">
            <div className="flex flex-col gap-3 md:flex-row md:flex-1 md:items-center">
              <Input
                placeholder="Buscar por título o contenido..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full md:max-w-xs border-2 border-black rounded-none focus-visible:ring-black"
              />

              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v === "all" ? "" : v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full md:w-40 border-2 border-black rounded-none">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black rounded-none">
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
                <SelectTrigger className="w-full md:w-48 border-2 border-black rounded-none">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black rounded-none">
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
            <p className="text-xs text-neutral-600">
              {pagePosts.length} de {sorted.length} resultados mostrados
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedIds.length}
                onClick={bulkArchive}
                className="border-2 border-black rounded-none hover:bg-black hover:text-white"
              >
                <Archive className="w-4 h-4 mr-1" />
                {bulkArchiveLabel}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                disabled={!selectedIds.length}
                onClick={bulkDelete}
                className="bg-black text-white border-2 border-black rounded-none hover:bg-neutral-800"
              >
                <Trash className="w-4 h-4 mr-1" />
                Eliminar seleccionados
              </Button>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto border-2 border-black">
            <Table className="min-w-[780px]">
              <TableHeader className="bg-black text-white">
                <TableRow className="hover:bg-black border-white">
                  <TableHead className="w-10 text-white">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={allSelectedOnPage}
                      onChange={toggleSelectAllOnPage}
                    />
                  </TableHead>
                  <TableHead className="text-white">Título</TableHead>
                  <TableHead className="text-white">Fecha</TableHead>
                  <TableHead className="text-white">Tipo</TableHead>
                  <TableHead className="text-white">Estado</TableHead>
                  <TableHead className="text-right text-white">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagePosts.map((post) => (
                  <TableRow key={post.id} className="border-black">
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
                      <Badge variant="outline" className="border-black rounded-none">
                        {post.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant={post.archived ? "secondary" : "default"}
                        className={post.archived ? "bg-neutral-300 text-black border-black rounded-none" : "bg-black text-white border-black rounded-none"}
                      >
                        {post.archived ? "Archivado" : "Publicado"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" className="border-black rounded-none hover:bg-black hover:text-white" asChild>
                        <Link href={`/dashboard/legal-blog/${post.id}/edit`}>
                          Editar
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" className="border-black rounded-none hover:bg-black hover:text-white" onClick={() => archivePost(post)}>
                        <Archive className="w-4 h-4"/>
                      </Button>

                      <Button variant="destructive" size="sm" className="bg-black text-white rounded-none hover:bg-neutral-800" onClick={() => deletePost(post)}>
                        <Trash className="w-4 h-4"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && pagePosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-neutral-600">
                      No hay posts en esta vista.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden mt-4 space-y-4">
            {pagePosts.map((post) => (
              <div key={post.id} className="relative overflow-hidden border-2 border-black">
                <div className="absolute inset-y-0 right-0 w-24 bg-black text-white flex items-center justify-center text-xs font-semibold">
                  Eliminar
                </div>

                <div
                  className="relative bg-white p-4"
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

                  <p className="text-xs text-neutral-600 mt-1">
                    {new Date(post.created_at).toLocaleDateString("es-MX")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-black rounded-none">{post.type}</Badge>
                    <Badge 
                      variant={post.archived ? "secondary" : "default"}
                      className={post.archived ? "bg-neutral-300 text-black rounded-none" : "bg-black text-white rounded-none"}
                    >
                      {post.archived ? "Archivado" : "Publicado"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild className="flex-1 border-black rounded-none">
                      <Link href={`/dashboard/legal-blog/${post.id}/edit`}>Editar</Link>
                    </Button>

                    <Button variant="outline" size="sm" className="flex-1 border-black rounded-none" onClick={() => archivePost(post)}>
                      <Archive className="w-4 h-4" />
                    </Button>

                    <Button variant="destructive" size="sm" className="flex-1 bg-black rounded-none" onClick={() => deletePost(post)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="mt-2 text-[11px] text-neutral-600">
                    Desliza hacia la izquierda para eliminar rápidamente.
                  </p>
                </div>
              </div>
            ))}

            {!loading && pagePosts.length === 0 && (
              <p className="text-center text-neutral-600 py-6">
                No hay posts en esta vista.
              </p>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 items-center">
            <span className="text-xs text-neutral-600">
              Página {safePage + 1} de {totalPages}
            </span>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                disabled={safePage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="w-full sm:w-auto border-2 border-black rounded-none hover:bg-black hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>

              <Button
                variant="outline"
                disabled={safePage >= totalPages - 1}
                onClick={() =>
                  setPage((p) => (p < totalPages - 1 ? p + 1 : p))
                }
                className="w-full sm:w-auto border-2 border-black rounded-none hover:bg-black hover:text-white"
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