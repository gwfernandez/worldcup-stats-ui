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
// Estilos
// ---------------------------------------------------------------------------

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  .wc-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 0.5px solid #2a2d3a;
    background: #0f1117;
    font-family: 'DM Mono', monospace;
  }

  .wc-nav__logo {
    font-size: 15px;
    font-weight: 500;
    color: #e8eaf0;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .wc-nav__logo-icon {
    color: #e8c84a;
    font-size: 18px;
  }

  .wc-nav__links {
    display: flex;
    gap: 24px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .wc-nav__link {
    font-size: 13px;
    color: #8a8fa8;
    text-decoration: none;
    transition: color 0.15s;
  }

  .wc-nav__link:hover {
    color: #c8cad8;
  }

  .wc-nav__link--active {
    color: #e8c84a;
  }
`;

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

interface NavLogoProps {
  text: string;
}

function NavLogo({ text }: NavLogoProps): React.ReactElement {
  return (
    <a href="/" className="wc-nav__logo">
      <i className="ti ti-trophy wc-nav__logo-icon" aria-hidden="true" />
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
        className={`wc-nav__link${active ? ' wc-nav__link--active' : ''}`}
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
      <style>{styles}</style>
      <nav className="wc-nav" aria-label="Navegación principal">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#e8c84a]" aria-hidden="true" />
          <NavLogo text={logoText} />
        </div>

        <ul className="wc-nav__links">
          {links.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} active={link.active} />
          ))}
        </ul>
      </nav>
    </>
  );
}
