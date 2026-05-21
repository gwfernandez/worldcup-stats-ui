const WORLD_CUP_DETAIL_PATH = /^\/worldcup\/[^/]+$/;

export function isWorldCupDetailPage(pathname: string): boolean {
  return WORLD_CUP_DETAIL_PATH.test(pathname);
}

export function isNavLinkActive(href: string, pathname: string): boolean {
  if (isWorldCupDetailPage(pathname)) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
