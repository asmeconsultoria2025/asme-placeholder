import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ FIXED: params is now async in Next.js 15+
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ MUST await params
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}