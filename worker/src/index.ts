export interface Env {
  COUNTER: KVNamespace;
}

const ALLOWED_ORIGINS = new Set([
  'https://theopenfield.org',
  'https://www.theopenfield.org',
]);

const COUNTER_KEY = 'hits';

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Cache-Control': 'no-store',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    if (url.pathname !== '/api/hits' || request.method !== 'GET') {
      return new Response('Not found', { status: 404 });
    }

    const current = parseInt((await env.COUNTER.get(COUNTER_KEY)) ?? '0', 10);
    const next = Number.isFinite(current) ? current + 1 : 1;
    await env.COUNTER.put(COUNTER_KEY, String(next));

    return new Response(JSON.stringify({ count: next }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  },
} satisfies ExportedHandler<Env>;
