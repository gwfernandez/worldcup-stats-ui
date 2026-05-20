/**
 * WorldCupsNavbar — Componente presentacional
 *
 * Props:
 *   - links: NavLink[]  — ítems de navegación; el padre controla cuál está activo
 *   - logoText: string  — texto junto al ícono del logo (default "World Cups")
 *
 * Requiere Tabler Icons en el <head>:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
 */

import React from 'react';
import { Trophy } from 'lucide-react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface WorldCupsNavbarProps {
  logoText?: string;
  links?: NavLink[];
}

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

interface NavLogoProps {
  text: string;
}

function NavLogo({ text }: NavLogoProps): React.ReactElement {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-[15px] font-medium text-[#e8eaf0] tracking-wide no-underline"
    >
      <i className="ti ti-trophy text-[#e8c84a] text-[18px]" aria-hidden="true" />
      {text}
    </Link>
  );
}

interface NavLinkItemProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavLinkItem({ href, label, active }: NavLinkItemProps): React.ReactElement {
  const location = useLocation();
  const pathname = location.pathname;

  const isMundialesActive = href === '/' && (pathname === '/' || pathname.startsWith('/worldcup'));
  const isLinkActive =
    isMundialesActive || (href !== '/' && pathname.startsWith(href)) || (active ?? false);

  return (
    <li>
      <RouterNavLink
        to={href}
        className={`text-[13px] no-underline transition-colors duration-150 hover:text-[#c8cad8] ${
          isLinkActive ? 'text-[#e8c84a]' : 'text-[#8a8fa8]'
        }`}
        aria-current={isLinkActive ? 'page' : undefined}
      >
        {label}
      </RouterNavLink>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Mundiales', href: '/', active: true },
  { label: 'Campeones', href: '/champions', active: false },
  { label: 'Posiciones', href: '/standings', active: false },
  { label: 'Goleadores', href: '/scorers', active: false },
];

export default function WorldCupsNavbar({
  logoText = 'World Cups History',
  links = DEFAULT_LINKS,
}: WorldCupsNavbarProps): React.ReactElement {
  return (
    <>
      <nav
        className="font-mono flex items-center justify-between px-6 py-[14px] border-b border-[#2a2d3a] bg-[#0f1117]"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#e8c84a]" aria-hidden="true" />
          <NavLogo text={logoText} />
        </div>

        <ul className="flex gap-6 list-none m-0 p-0">
          {links.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} active={link.active} />
          ))}
        </ul>
      </nav>
    </>
  );
}
