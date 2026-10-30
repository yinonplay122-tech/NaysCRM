import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

/** Handle PKCE email-confirmation redirects from Supabase Auth. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const origin = request.nextUrl.origin;
  if (!code) return NextResponse.redirect(new URL('/login?error=confirmation', origin));
  const supabase = await db();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?error=confirmation', origin));
  return NextResponse.redirect(new URL('/dashboard', origin));
}
