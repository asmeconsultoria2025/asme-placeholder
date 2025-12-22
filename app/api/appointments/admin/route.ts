import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Admin actions MUST use SERVICE ROLE KEY (server-only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { id, action, assigned_date, assigned_time, admin_notes } =
      await req.json();

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // ---------------------------------
    // 1. REJECT APPOINTMENT
    // ---------------------------------
    if (action === "reject") {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "rejected",
          admin_notes: admin_notes || null,
          assigned_date: null,   // CLEAR DATE
          assigned_time: null,   // CLEAR TIME
        })
        .eq("id", id);

      if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({ success: true });
    }

    // ---------------------------------
    // 2. APPROVE APPOINTMENT (w/ conflict check)
    // ---------------------------------
    if (action === "approve") {
      if (!assigned_date || !assigned_time) {
        return NextResponse.json(
          { error: "Fecha y hora requeridas para aprobar." },
          { status: 400 }
        );
      }

      // Check if another appointment already approved at same slot
      const { data: conflicts, error: conflictErr } = await supabase
        .from("appointments")
        .select("id")
        .eq("assigned_date", assigned_date)
        .eq("assigned_time", assigned_time)
        .eq("status", "approved")
        .neq("id", id);

      if (conflictErr)
        return NextResponse.json(
          { error: conflictErr.message },
          { status: 400 }
        );

      if (conflicts?.length)
        return NextResponse.json(
          { error: "Ya existe una cita aprobada en ese horario." },
          { status: 409 }
        );

      // Approve
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "approved",
          assigned_date,
          assigned_time,
          admin_notes: admin_notes || null,
        })
        .eq("id", id);

      if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("ADMIN ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
