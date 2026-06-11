import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SEO } from './SEO';

function getMetaByName(name: string): HTMLMetaElement | null {
  return document.head.querySelector(`meta[name="${name}"]`);
}

function getMetaByProperty(property: string): HTMLMetaElement | null {
  return document.head.querySelector(`meta[property="${property}"]`);
}

describe('SEO', () => {
  beforeEach(() => {
    document.title = '';
    document
      .querySelectorAll(
        'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[property="og:type"]',
      )
      .forEach((element) => element.remove());
  });

  it('actualiza el titulo del documento', () => {
    render(<SEO title="Mundial Qatar 2022 - worldcup-stats" description="Detalle del mundial." />);

    expect(document.title).toBe('Mundial Qatar 2022 - worldcup-stats');
  });

  it('crea la meta description cuando no existe', () => {
    render(<SEO title="World Cups" description="Listado historico de mundiales." />);

    expect(getMetaByName('description')).toHaveAttribute(
      'content',
      'Listado historico de mundiales.',
    );
  });

  it('actualiza la meta description existente', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Descripcion anterior.');
    document.head.appendChild(meta);

    render(<SEO title="Campeones" description="Tabla historica de campeones." />);

    expect(getMetaByName('description')).toHaveAttribute(
      'content',
      'Tabla historica de campeones.',
    );
  });

  it('crea las etiquetas Open Graph basicas', () => {
    render(
      <SEO
        title="Goleadores historicos - worldcup-stats"
        description="Maximos goleadores de los mundiales."
      />,
    );

    expect(getMetaByProperty('og:title')).toHaveAttribute(
      'content',
      'Goleadores historicos - worldcup-stats',
    );
    expect(getMetaByProperty('og:description')).toHaveAttribute(
      'content',
      'Maximos goleadores de los mundiales.',
    );
    expect(getMetaByProperty('og:type')).toHaveAttribute('content', 'website');
  });

  it('actualiza las etiquetas cuando cambian las props', () => {
    const { rerender } = render(<SEO title="Inicio" description="Descripcion inicial." />);

    rerender(<SEO title="Posiciones historicas" description="Ranking acumulado." type="article" />);

    expect(document.title).toBe('Posiciones historicas');
    expect(getMetaByName('description')).toHaveAttribute('content', 'Ranking acumulado.');
    expect(getMetaByProperty('og:title')).toHaveAttribute('content', 'Posiciones historicas');
    expect(getMetaByProperty('og:description')).toHaveAttribute('content', 'Ranking acumulado.');
    expect(getMetaByProperty('og:type')).toHaveAttribute('content', 'article');
  });
});
