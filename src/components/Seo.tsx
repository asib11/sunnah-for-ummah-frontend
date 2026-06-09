"use client";

import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const upsertMeta = (
  attr: "name" | "property",
  key: string,
  content: string
) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const Seo = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    document.title = title;

    upsertMeta("name", "description", description);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    if (image) upsertMeta("property", "og:image", image);
    if (canonical) upsertMeta("property", "og:url", canonical);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) upsertMeta("name", "twitter:image", image);

    const url =
      canonical ??
      (typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : undefined);
    if (url) upsertLink("canonical", url);

    let ldEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.text = JSON.stringify(jsonLd);
      ldEl.dataset.seo = "true";
      document.head.appendChild(ldEl);
    }
    return () => {
      if (ldEl) ldEl.remove();
    };
  }, [title, description, canonical, image, type, jsonLd]);

  return null;
};

export default Seo;


