// Alice's Photo Frame — Cloudflare Worker
// Architecture: Static asset serving via env.ASSETS
// All routes → serve static files (index.html, sw.js, manifest.json, icons)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets; force no-cache for HTML to prevent stale page issues
    const assetResp = await env.ASSETS.fetch(request);
    const ct = assetResp.headers.get('Content-Type') || '';
    if (ct.includes('text/html')) {
      const newHeaders = new Headers(assetResp.headers);
      newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      newHeaders.set('Pragma', 'no-cache');
      return new Response(assetResp.body, { status: assetResp.status, headers: newHeaders });
    }
    return assetResp;
  },
};
