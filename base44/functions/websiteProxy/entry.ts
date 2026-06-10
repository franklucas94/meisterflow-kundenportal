Deno.serve(async (req) => {
  const urlParams = new URL(req.url).searchParams;
  const targetUrl = urlParams.get("url");

  if (!targetUrl) {
    return new Response("Missing ?url= parameter", { status: 400 });
  }

  let parsedBase;
  try {
    parsedBase = new URL(targetUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
      },
    });

    const contentType = response.headers.get("content-type") || "text/html";

    // For non-HTML resources (CSS, images, JS) — proxy them directly
    if (!contentType.includes("text/html")) {
      const body = await response.arrayBuffer();
      return new Response(body, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    let html = await response.text();
    const base = `${parsedBase.protocol}//${parsedBase.host}`;

    // Rewrite relative URLs to absolute so assets load correctly
    html = html
      // href="/path" → href="https://domain.com/path"
      .replace(/(\s(?:href|src|action|data-src)=["'])\/(?!\/)/g, `$1${base}/`)
      // href="//domain" → href="https://domain"
      .replace(/(\s(?:href|src|action|data-src)=["'])\/\//g, `$1${parsedBase.protocol}//`)
      // CSS url(/path)
      .replace(/url\(["']?\/(?!\/)/g, `url(${base}/`)
      // Inject <base> tag so relative links work
      .replace(/<head([^>]*)>/i, `<head$1><base href="${base}/">`);

    // Remove any existing X-Frame-Options meta tags
    html = html.replace(/<meta[^>]*x-frame-options[^>]*>/gi, "");

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        // Explicitly do NOT set X-Frame-Options so the iframe can embed it
      },
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
});