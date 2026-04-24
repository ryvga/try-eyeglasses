export const CANONICAL_HOST = "tryeyeglasses.com";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

export const PUBLIC_ROUTES = [
  "/",
  "/try-on-glasses",
  "/virtual-glasses-try-on",
  "/ai-eyeglasses-try-on",
  "/faq",
  "/privacy",
  "/terms",
] as const;

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
]);

export function canonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_ORIGIN}${normalizedPath}`;
}

export function getCanonicalRedirectUrl(input: URL) {
  const output = new URL(input.pathname || "/", CANONICAL_ORIGIN);

  for (const [key, value] of input.searchParams.entries()) {
    if (TRACKING_PARAMS.has(key)) {
      output.searchParams.append(key, value);
    }
  }

  return output;
}

export function shouldRedirectToCanonical(host: string, protocol: string) {
  const normalizedHost = host.toLowerCase().replace(/:\d+$/, "");

  if (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "0.0.0.0" ||
    normalizedHost === "::1" ||
    normalizedHost === "[::1]" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(normalizedHost) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(normalizedHost) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(normalizedHost) ||
    normalizedHost.endsWith(".local")
  ) {
    return false;
  }

  return (
    normalizedHost !== CANONICAL_HOST ||
    protocol !== "https:" ||
    normalizedHost.startsWith("www.")
  );
}

export const defaultDescription =
  "Try on eyeglasses online with AI. Upload a face photo, choose a frame, and preview realistic glasses while preserving your background, lighting, and expression.";

export function jsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TryEyeglasses",
      url: CANONICAL_ORIGIN,
      logo: canonicalUrl("/opengraph-image"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TryEyeglasses",
      url: CANONICAL_ORIGIN,
      potentialAction: {
        "@type": "SearchAction",
        target: `${CANONICAL_ORIGIN}/try-on-glasses?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "TryEyeglasses",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "First AI glasses try-on generation is free.",
      },
    },
  ];
}
