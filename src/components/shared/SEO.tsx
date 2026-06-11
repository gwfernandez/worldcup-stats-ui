import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  type?: string;
}

const DEFAULT_TYPE = 'website';

function upsertMetaByName(name: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function SEO({ title, description, type = DEFAULT_TYPE }: SEOProps) {
  useEffect(() => {
    document.title = title;
    upsertMetaByName('description', description);
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:type', type);
  }, [description, title, type]);

  return null;
}
