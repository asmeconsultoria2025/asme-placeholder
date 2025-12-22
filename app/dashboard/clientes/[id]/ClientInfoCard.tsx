"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Building2, User2, Mail, Briefcase, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { deleteClientAction } from "./actions";

export default function ClientInfoCard({ client }: { client: any }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteClientAction(client.id);
      
      if (result.success) {
        alert("Cliente archivado correctamente");
        router.push("/dashboard/clientes");
      } else {
        alert(result.error || "Error al archivar cliente");
      }
    } catch (error) {
      alert("Error al archivar cliente");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Información del Cliente</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/clientes")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 opacity-70" />
            <span>{client.company_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <User2 className="h-5 w-5 opacity-70" />
            <span>{client.contact_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 opacity-70" />
            <span>{client.contact_email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 opacity-70" />
            <span>{client.sector || "No especificado"}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Archivar este cliente?</DialogTitle>
            <DialogDescription>
              El cliente <strong>{client.company_name}</strong> será archivado, no eliminado permanentemente. 
              Podrás restaurarlo más tarde si fue un accidente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Archivando..." : "Archivar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}