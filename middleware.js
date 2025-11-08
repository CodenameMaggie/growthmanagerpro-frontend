import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for:
  // - API routes (backend handles these)
  // - Static files
  // - Public pages (login, signup)
  const publicPaths = ['/login.html', '/signup-saas.html', '/signup-consultant.html', '/signup-invited.html'];
  const isPublicPath = publicPaths.some(path => url.pathname === path || url.pathname.startsWith(path));
  
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) ||
    isPublicPath
  ) {
    return NextResponse.next();
  }
  
  // Parse subdomain
  const subdomain = hostname.split('.')[0];
  const isSubdomain = hostname.includes('.growthmanagerpro.com') && 
                      subdomain !== 'www' && 
                      subdomain !== 'growthmanagerpro';
  
  // If on main domain (no subdomain), allow access
  // Auth-helper.js will handle authentication
  if (!isSubdomain) {
    return NextResponse.next();
  }
  
  // If on subdomain, verify tenant exists (lightweight check)
  // Auth-helper.js will handle full tenant context + authentication
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[Middleware] Missing Supabase credentials');
      return NextResponse.next(); // Allow through, auth-helper will catch it
    }
    
    // Quick tenant existence check
    const response = await fetch(`${supabaseUrl}/rest/v1/tenants?subdomain=eq.${subdomain}&select=id,status`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const tenants = await response.json();
    
    // If tenant doesn't exist, redirect to signup
    if (!tenants || tenants.length === 0) {
      return NextResponse.redirect(new URL('https://growthmanagerpro.com/signup-saas.html', request.url));
    }
    
    const tenant = tenants[0];
    
    // If tenant is inactive, redirect to error page
    if (tenant.status !== 'active') {
      return NextResponse.redirect(new URL('https://growthmanagerpro.com/tenant-inactive.html', request.url));
    }
    
    // Tenant exists and is active - allow through
    // Auth-helper.js will handle full context + authentication
    return NextResponse.next();
    
  } catch (error) {
    console.error('[Middleware] Error checking tenant:', error);
    // On error, allow through - auth-helper will handle it
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
