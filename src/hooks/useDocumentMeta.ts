import { useEffect } from 'react';

/** Upserts a <meta> tag by name or property, returning the previous content. */
function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface MetaInput {
  title: string;
  description: string;
}

/**
 * Keeps the document title and key share-preview meta tags in sync with the
 * couple's details so the browser tab and (JS-capable) crawlers reflect the
 * actual invitation rather than the generic default.
 */
export function useDocumentMeta({ title, description }: MetaInput) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
