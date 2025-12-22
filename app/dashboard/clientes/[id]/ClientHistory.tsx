"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { getClientHistory } from "@/app/lib/clientHistory";
import { 
  Clock, 
  UserPlus, 
  Archive, 
  ArchiveRestore, 
  FileEdit, 
  Mail,
  AlertCircle,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type HistoryEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  metadata?: any;
};

export default function ClientHistory({ clientId }: { clientId: string }) {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getClientHistory(clientId);
        setHistory(data);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [clientId]);

  function getEventIcon(eventType: string) {
    switch (eventType) {
      case "created":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "status_changed":
        return <Activity className="h-4 w-4 text-purple-600" />;
      case "archived":
        return <Archive className="h-4 w-4 text-orange-600" />;
      case "unarchived":
        return <ArchiveRestore className="h-4 w-4 text-green-600" />;
      case "notes_updated":
        return <FileEdit className="h-4 w-4 text-amber-600" />;
      case "campaign_sent":
        return <Mail className="h-4 w-4 text-indigo-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  }

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Cargando historial...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial
        </CardTitle>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm opacity-70">
            No hay actividad registrada todavía.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((event, index) => (
              <div key={event.id} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getEventIcon(event.event_type)}
                  </div>
                  {index < history.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>

                {/* Event details */}
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}