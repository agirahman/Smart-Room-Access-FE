import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to decode JWT payload without verification
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Token parsing failed in proxy: ${error.message}`);
    } else {
      console.error(`An unknown error occurred during token parsing in proxy: ${error}`)
    }
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // If no tokens exist, redirect to login
    if (!token && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    let isTokenExpired = true;

    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp) {
        // Check if token expires within the next 30 seconds
        const currentTime = Math.floor(Date.now() / 1000);
        isTokenExpired = payload.exp < currentTime + 30;
      }
    }

    if (isTokenExpired && refreshToken) {
      // Try to refresh the token
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
          method: 'GET',
          headers: {
            'Cookie': `refreshToken=${refreshToken}`
          }
        });

        if (refreshRes.ok) {
          const body = await refreshRes.json();
          if (body.success && body.data?.accessToken) {
            const newAccessToken = body.data.accessToken;

            // Forward the request
            const response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });

            // Pass the new token to Server Components via request cookies
            response.cookies.set('token', newAccessToken);

            // Set the new token in the browser
            response.cookies.set({
              name: 'token',
              value: newAccessToken,
              path: '/',
              maxAge: 86400, // 1 day
              httpOnly: true,
              sameSite: 'strict',
              secure: process.env.NODE_ENV === "production",
            });

            return response;
          }
        }
      } catch (error) {
        console.error("Token refresh failed in middleware:", error);
      }

      // If refresh fails or returns not OK, force logout
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {
    if (token || refreshToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
