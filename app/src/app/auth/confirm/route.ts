import { NextResponse, type NextRequest } from "next/server";
import { getServerClient } from "@/lib/db/client";

/**
 * Supabase email links (sign-up confirmation, password recovery) redirect here with
 * a PKCE `code`. Exchanging it here is required for @supabase/ssr to set the session
 * cookie before the browser lands on `next` - there is no other place in this app
 * that completes this exchange, so without this route every email link just opens
 * a logged-out page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await getServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
