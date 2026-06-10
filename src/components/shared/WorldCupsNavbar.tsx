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
import { Globe2, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

const DEFAULT_LINK_KEYS = [
  { labelKey: 'navigation.worldcups', href: '/' },
  { labelKey: 'navigation.champions', href: '/champions' },
  { labelKey: 'navigation.standings', href: '/standings' },
  { labelKey: 'navigation.scorers', href: '/scorers' },
];

export default function WorldCupsNavbar({
  logoText,
  links = DEFAULT_LINKS,
}: WorldCupsNavbarProps): React.ReactElement {
  const { i18n, t } = useTranslation('common');
  const translatedLinks =
    links === DEFAULT_LINKS
      ? DEFAULT_LINK_KEYS.map((link) => ({ href: link.href, label: t(link.labelKey) }))
      : links;
  const selectedLanguage = i18n.language.startsWith('en') ? 'en' : 'es';

  return (
    <>
      <nav
        className="font-mono flex items-center justify-between px-6 py-[14px] border-b border-wc-border-primary bg-wc-bg-primary"
        aria-label={t('navigation.ariaLabel')}
      >
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-wc-accent-gold" aria-hidden="true" />
          <NavLogo text={logoText ?? t('app.logo')} />
        </div>

        <div className="flex items-center gap-5">
          <ul className="flex gap-6 list-none m-0 p-0">
            {translatedLinks.map((link) => (
              <NavLinkItem key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>

          <div
            className="flex items-center gap-1 rounded-md border border-wc-border-primary px-1 py-1"
            aria-label={t('language.ariaLabel')}
          >
            <Globe2 size={13} className="text-wc-text-muted" aria-hidden="true" />
            {(['es', 'en'] as const).map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => void i18n.changeLanguage(language)}
                className={`h-6 px-2 text-[11px] rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-wc-accent-gold ${
                  selectedLanguage === language
                    ? 'bg-wc-success-surface text-wc-accent-gold'
                    : 'text-wc-text-muted hover:text-wc-text-primary'
                }`}
                aria-pressed={selectedLanguage === language}
                aria-label={t(`language.${language === 'es' ? 'spanish' : 'english'}`)}
              >
                {t(`language.${language}`)}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const DEFAULT_LINKS: NavLink[] = DEFAULT_LINK_KEYS.map((link) => ({
  href: link.href,
  label: link.labelKey,
}));
