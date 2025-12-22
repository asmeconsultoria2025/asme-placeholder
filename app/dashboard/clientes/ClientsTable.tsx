"use client";

import { useEffect, useState } from "react";
import { fetchPaginatedClients } from "./actions";
import { unarchiveClientAction } from "./[id]/actions";
import ClientStatusBadge from "./ClientStatusBadge";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { ClientFilters } from "./page";
import { toast } from "sonner";

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/app/components/ui/table";

import { Building2, Mail, User2, ArrowRight, Users, ArchiveRestore } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 20;

type Props = {
  filters: ClientFilters;
};

export default function ClientsTable({ filters }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unarchivingId, setUnarchivingId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
    setClients([]);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchPaginatedClients(filters, 1, PAGE_SIZE);

        if (!cancelled) {
          setClients(res.data);
          setTotal(res.total);
        }
      } catch (err) {
        console.error("Error loading clients:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  async function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const res = await fetchPaginatedClients(filters, nextPage, PAGE_SIZE);
      setClients((prev) => [...prev, ...res.data]);
      setTotal(res.total);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleUnarchive(clientId: string) {
    setUnarchivingId(clientId);
    
    try {
      const result = await unarchiveClientAction(clientId);
      
      if (result.success) {
        toast.success("Cliente recuperado exitosamente");
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        setTotal((prev) => prev - 1);
      } else {
        toast.error(result.error || "Error al recuperar cliente");
      }
    } catch (error) {
      console.error("Error unarchiving client:", error);
      toast.error("Error al recuperar cliente");
    } finally {
      setUnarchivingId(null);
    }
  }

  const hasMore = clients.length < total;

  if (loading) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        Cargando clientes…
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="py-20 flex flex-col items-center text-center gap-3 text-muted-foreground">
        <Users className="h-12 w-12 opacity-50" />
        <p className="font-medium text-lg">No hay clientes registrados</p>
        <p className="text-sm opacity-60 max-w-sm">
          Agrega un cliente nuevo usando el botón <b>Agregar Cliente</b> arriba
          a la derecha.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table className="rounded-lg overflow-hidden border">
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[26%]">Empresa</TableHead>
            <TableHead className="w-[20%]">Contacto</TableHead>
            <TableHead className="w-[28%]">Email</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="text-right w-[12%]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {clients.map((client: any) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="cursor-pointer transition hover:bg-muted/20"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-60" />
                    <span>{client.company_name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4 opacity-60" />
                    <span>{client.contact_name}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 opacity-60" />
                    <span>{client.contact_email}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <ClientStatusBadge status={client.status} />
                </TableCell>

                <TableCell className="text-right">
                  {client.status === "Archivado" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleUnarchive(client.id)}
                      disabled={unarchivingId === client.id}
                    >
                      <ArchiveRestore className="h-4 w-4" />
                      {unarchivingId === client.id ? "Recuperando..." : "Recuperar"}
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link href={`/dashboard/clientes/${client.id}`}>
                        Ver <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore} disabled={loadingMore} size="sm">
            {loadingMore ? "Cargando..." : "Cargar más"}
          </Button>
        </div>
      )}
    </>
  );
}