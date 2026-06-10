/**
 * WorldCupsNavbar — Componente presentacional
 *
 * Props:
 *   - links: NavLink[]  — ítems de navegación (el activo se deriva de la ruta actual)
 *   - logoText: string  — texto junto al ícono del logo (default "World Cups")
 *
 * Requiere Tabler Icons en el <head>:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
 */

import React from 'react';
import { Trophy } from 'lucide-react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { isNavLinkActive } from './worldCupsNavbar.utils';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
}

export interface WorldCupsNavbarProps {
  logoText?: string;
  links?: NavLink[];
}

const ACTIVE_LINK_CLASS = 'text-wc-accent-gold';
const INACTIVE_LINK_CLASS = 'text-wc-text-muted';

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
      className="flex items-center gap-2 text-[15px] font-medium text-wc-text-primary tracking-wide no-underline"
    >
      <i className="ti ti-trophy text-wc-accent-gold text-[18px]" aria-hidden="true" />
      {text}
    </Link>
  );
}

interface NavLinkItemProps {
  href: string;
  label: string;
}

function NavLinkItem({ href, label }: NavLinkItemProps): React.ReactElement {
  const { pathname } = useLocation();
  const isLinkActive = isNavLinkActive(href, pathname);

  return (
    <li>
      <RouterNavLink
        to={href}
        end={href === '/'}
        className={`text-[13px] no-underline transition-colors duration-150 hover:text-wc-text-soft ${
          isLinkActive ? ACTIVE_LINK_CLASS : INACTIVE_LINK_CLASS
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
  { label: 'Mundiales', href: '/' },
  { label: 'Campeones', href: '/champions' },
  { label: 'Posiciones', href: '/standings' },
  { label: 'Goleadores', href: '/scorers' },
];

export default function WorldCupsNavbar({
  logoText = 'World Cups History',
  links = DEFAULT_LINKS,
}: WorldCupsNavbarProps): React.ReactElement {
  return (
    <>
      <nav
        className="font-mono flex items-center justify-between px-6 py-[14px] border-b border-wc-border-primary bg-wc-bg-primary"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-wc-accent-gold" aria-hidden="true" />
          <NavLogo text={logoText} />
        </div>

        <ul className="flex gap-6 list-none m-0 p-0">
          {links.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} />
          ))}
        </ul>
      </nav>
    </>
  );
}
