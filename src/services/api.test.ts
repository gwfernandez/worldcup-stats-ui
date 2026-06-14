import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { useUIStore } from '@/store/ui.store';
import { api } from './api';

describe('api', () => {
  it('envia Accept-Language con el idioma inicial seleccionado', async () => {
    let acceptLanguage: string | null = null;

    server.use(
      http.get('*/language-test', ({ request }) => {
        acceptLanguage = request.headers.get('Accept-Language');
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get('/language-test');

    expect(acceptLanguage).toBe('es');
  });

  it('envia Accept-Language con el idioma actualizado', async () => {
    let acceptLanguage: string | null = null;
    useUIStore.getState().setLanguage('en');

    server.use(
      http.get('*/language-test', ({ request }) => {
        acceptLanguage = request.headers.get('Accept-Language');
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get('/language-test');

    expect(acceptLanguage).toBe('en');
  });
});
