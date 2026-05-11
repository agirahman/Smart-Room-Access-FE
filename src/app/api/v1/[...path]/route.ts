import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const runtime = 'edge'

type Context = { params: Promise<{ path?: string[] }> }

export async function GET(req: NextRequest, context: Context) {
  const params = await context.params
  return proxyRequest(req, params)
}

export async function POST(req: NextRequest, context: Context) {
  const params = await context.params
  return proxyRequest(req, params)
}

export async function PUT(req: NextRequest, context: Context) {
  const params = await context.params
  return proxyRequest(req, params)
}

export async function DELETE(req: NextRequest, context: Context) {
  const params = await context.params
  return proxyRequest(req, params)
}

async function proxyRequest(req: NextRequest, params: { path?: string[] }) {
  try {
    const path = params.path ? params.path.join('/') : ''
    const baseTarget = `${API_BASE.replace(/\/$/, '')}/api/v1`
    const url = `${baseTarget}/${path}${req.nextUrl.search}`

    // If no path provided (caller requested /api/v1/), return a clear JSON error
    // instead of proxying to the backend root which responds with HTML.
    if (!path) {
      return NextResponse.json(
        { success: false, message: 'No API path provided to proxy' },
        { status: 400, headers: { 'x-proxy-target': `${baseTarget}/`, 'x-proxy-token-present': '0' } }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const headers: Record<string, string> = {}
    // Copy allowed headers from original request except host/cookie
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'host' || key.toLowerCase() === 'cookie') return
      headers[key] = value
    })

    if (token) headers['authorization'] = `Bearer ${token}`

    const method = req.method
    let body: BodyInit | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      body = await req.arrayBuffer()
    }

    const backendRes = await fetch(url, { method, headers, body })

    const resHeaders: Record<string, string> = {}
    backendRes.headers.forEach((v, k) => { resHeaders[k] = v })

    // Add debugging headers to help identify proxied URL and token presence
    resHeaders['x-proxy-target'] = url
    resHeaders['x-proxy-token-present'] = token ? '1' : '0'

    if (!backendRes.ok) {
      const text = await backendRes.text()
      return NextResponse.json({ success: false, message: text || backendRes.statusText }, { status: backendRes.status, headers: resHeaders })
    }

    const buffer = await backendRes.arrayBuffer()
    // Edge runtime may not have Node Buffer; return raw ArrayBuffer/Uint8Array
    const uint8 = new Uint8Array(buffer)
    return new NextResponse(uint8, { status: backendRes.status, headers: resHeaders })
  } catch {
    return NextResponse.json({ success: false, message: 'Proxy error' }, { status: 500 })
  }
}
