"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { updateNotesAction } from "./actions";
import { Check, Loader2, StickyNote } from "lucide-react";

export default function ClientNotes({ 
  clientId, 
  initialNotes 
}: { 
  clientId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isEditing, setIsEditing] = useState(false);

  // Auto-save with debounce
  useEffect(() => {
    if (!isEditing) return; // Don't save if not editing
    if (notes === (initialNotes || "")) return; // Don't save if unchanged

    setSaveStatus("saving");

    const timeoutId = setTimeout(async () => {
      try {
        await updateNotesAction(clientId, notes);
        setSaveStatus("saved");
        
        // Hide "saved" indicator after 2 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } catch (error) {
        console.error("Error saving notes:", error);
        setSaveStatus("idle");
      }
    }, 1500); // Save 1.5 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [notes, clientId, initialNotes, isEditing]);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Notas
          </CardTitle>
          
          {/* Save Status Indicator */}
          {saveStatus !== "idle" && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-green-600">Guardado</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder="Haz clic para agregar notas sobre este cliente..."
          className="min-h-[150px] resize-none"
        />
        
        {!notes && !isEditing && (
          <p className="text-xs text-muted-foreground mt-2 opacity-60">
            Las notas se guardan automáticamente mientras escribes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}