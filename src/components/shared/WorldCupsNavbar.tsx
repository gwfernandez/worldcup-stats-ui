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
    <a
      href="/"
      className="flex items-center gap-2 text-[15px] font-medium text-[#e8eaf0] tracking-wide no-underline"
    >
      <i className="ti ti-trophy text-[#e8c84a] text-[18px]" aria-hidden="true" />
      {text}
    </a>
  );
}

interface NavLinkItemProps {
  href: string;
  label: string;
  active?: boolean;
}

function NavLinkItem({ href, label, active = false }: NavLinkItemProps): React.ReactElement {
  return (
    <li>
      <a
        href={href}
        className={`text-[13px] no-underline transition-colors duration-150 hover:text-[#c8cad8] ${
          active ? 'text-[#e8c84a]' : 'text-[#8a8fa8]'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        {label}
      </a>
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
