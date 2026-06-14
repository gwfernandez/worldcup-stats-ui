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
import { Globe2, Menu, Trophy, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { isNavLinkActive } from './worldCupsNavbar.utils';
import { useUIStore, type SupportedLanguage } from '@/store/ui.store';

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
  onClick?: () => void;
  variant?: 'desktop' | 'mobile';
}

function NavLinkItem({
  href,
  label,
  onClick,
  variant = 'desktop',
}: NavLinkItemProps): React.ReactElement {
  const { pathname } = useLocation();
  const isLinkActive = isNavLinkActive(href, pathname);
  const className =
    variant === 'mobile'
      ? `block w-full rounded-md px-3 py-2 text-sm no-underline transition-colors duration-150 hover:bg-wc-surface-secondary hover:text-wc-text-soft ${
          isLinkActive ? ACTIVE_LINK_CLASS : INACTIVE_LINK_CLASS
        }`
      : `text-[13px] no-underline transition-colors duration-150 hover:text-wc-text-soft ${
          isLinkActive ? ACTIVE_LINK_CLASS : INACTIVE_LINK_CLASS
        }`;

  return (
    <li>
      <RouterNavLink
        to={href}
        end={href === '/'}
        className={className}
        aria-current={isLinkActive ? 'page' : undefined}
        onClick={onClick}
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
  const { pathname } = useLocation();
  const [mobileMenuState, setMobileMenuState] = React.useState({
    isOpen: false,
    pathname,
  });
  const isMobileMenuOpen = mobileMenuState.pathname === pathname && mobileMenuState.isOpen;
  const selectedLanguage = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);
  const translatedLinks =
    links === DEFAULT_LINKS
      ? DEFAULT_LINK_KEYS.map((link) => ({ href: link.href, label: t(link.labelKey) }))
      : links;

  React.useEffect(() => {
    if (!i18n.language.startsWith(selectedLanguage)) {
      void i18n.changeLanguage(selectedLanguage);
    }
  }, [i18n, selectedLanguage]);

  const handleLanguageChange = (language: SupportedLanguage): void => {
    setLanguage(language);
    void i18n.changeLanguage(language);
  };

  return (
    <>
      <nav
        className="relative z-40 font-mono border-b border-wc-border-primary bg-wc-bg-primary"
        aria-label={t('navigation.ariaLabel')}
      >
        <div className="flex items-center justify-between px-6 py-[14px]">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-wc-accent-gold" aria-hidden="true" />
            <NavLogo text={logoText ?? t('app.logo')} />
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <ul className="hidden md:flex gap-6 list-none m-0 p-0">
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
                  onClick={() => handleLanguageChange(language)}
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

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-wc-border-primary text-wc-text-muted transition-colors hover:border-wc-border-muted hover:text-wc-text-primary focus:outline-none focus:ring-2 focus:ring-wc-accent-gold focus:ring-offset-1 focus:ring-offset-wc-bg-primary md:hidden"
              aria-controls="mobile-navigation-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={t(isMobileMenuOpen ? 'navigation.closeMenu' : 'navigation.openMenu')}
              onClick={() =>
                setMobileMenuState({
                  isOpen: !isMobileMenuOpen,
                  pathname,
                })
              }
            >
              {isMobileMenuOpen ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Menu size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div
            id="mobile-navigation-menu"
            className="absolute left-0 right-0 top-full z-50 border-t border-b border-wc-border-primary bg-wc-bg-primary px-4 py-3 shadow-lg md:hidden"
          >
            <ul className="flex list-none flex-col gap-1 m-0 p-0">
              {translatedLinks.map((link) => (
                <NavLinkItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  variant="mobile"
                  onClick={() => setMobileMenuState({ isOpen: false, pathname })}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div id="mobile-navigation-menu" hidden />
        )}
      </nav>
    </>
  );
}

const DEFAULT_LINKS: NavLink[] = DEFAULT_LINK_KEYS.map((link) => ({
  href: link.href,
  label: link.labelKey,
}));
