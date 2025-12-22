import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ASME_SERVICES = [
  "Protección Civil",
  "Capacitación",
  "Defensa Legal",
];

const ABOGADOS_SERVICES = [
  "Litigio Familiar",
  "Litigio Penal",
  "Litigio Civil",
  "Amparos",
  
];

// -----------------------------------------------------
// CREATE APPOINTMENT
// -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { source, service_label } = payload;

    if (!source || !service_label) {
      return NextResponse.json(
        { error: "Missing source or service_label" },
        { status: 400 }
      );
    }

    if (source === "asme" && !ASME_SERVICES.includes(service_label)) {
      return NextResponse.json(
        { error: `Servicio no válido para ASME Consultoría.` },
        { status: 400 }
      );
    }

    if (source === "asme_abogados" && !ABOGADOS_SERVICES.includes(service_label)) {
      return NextResponse.json(
        { error: `Servicio no válido para ASME Abogados.` },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("appointments").insert([payload]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// -----------------------------------------------------
// GET — FULL LIST IF all=true
// -----------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("all") === "true") {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        data,
        page: 1,
        totalPages: 1,
        limit: data.length,
      });
    }

    // -----------------------------------------------------
    // GET — PAGINATED (Default)
    // -----------------------------------------------------
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true });

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      data,
      totalPages,
      page,
      limit,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
