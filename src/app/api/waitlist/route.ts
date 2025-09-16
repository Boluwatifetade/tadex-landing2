import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // No Resend – just return success
} catch (err: unknown) {
  console.error("API error:", err);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
