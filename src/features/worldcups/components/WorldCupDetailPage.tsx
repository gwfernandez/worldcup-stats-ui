import { useState } from 'react';
import { GroupsTab } from './tabs/GroupsTab';
import { ScorersTab } from './tabs/ScorersTab';
import { MOCK_GROUPS, MOCK_ELIMINATION_PHASES } from '../mocks/worldcupDetail.mock';
import { MOCK_SCORERS } from '../mocks/scorers.mock';
import { TeamsTab } from './tabs/TeamsTab';
import { MOCK_TEAMS } from '../mocks/teams.mock';
import { StadiumsTab } from './tabs/StadiumsTab';
import { MOCK_STADIUMS } from '../mocks/stadiums.mock';
import { StandingsTab } from './tabs/StandingsTab';
import { MOCK_STANDINGS } from '../mocks/standings.mock';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabId = 'groups' | 'teams' | 'scorers' | 'stadiums' | 'standings' | 'stats';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const TABS: Tab[] = [
  {
    id: 'groups',
    label: 'Grupos y fixture',
    icon: (
      <Icon>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </Icon>
    ),
  },
  {
    id: 'teams',
    label: 'Selecciones',
    icon: (
      <Icon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Icon>
    ),
  },
  {
    id: 'scorers',
    label: 'Goleadores',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </Icon>
    ),
  },
  {
    id: 'stadiums',
    label: 'Estadios',
    icon: (
      <Icon>
        <path d="M12 2L2 7l10 5 10-5L12 2z" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </Icon>
    ),
  },
  {
    id: 'standings',
    label: 'Posiciones',
    icon: (
      <Icon>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </Icon>
    ),
  },
  {
    id: 'stats',
    label: 'Estadísticas',
    icon: (
      <Icon>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </Icon>
    ),
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface WorldCupDetailPageProps {
  /** Año del mundial — en producción vendrá de useParams() */
  year?: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de detalle de un mundial.
 * Contiene el hero con metadata y las solapas de contenido.
 */
export default function WorldCupDetailPage({ year = 1970 }: WorldCupDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('groups');

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2d3a] bg-[#0f1117] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e8c84a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
          <span className="text-sm font-medium tracking-wide">World Cups</span>
        </div>
        <div className="flex gap-5">
          {[
            { label: 'Mundiales', href: '/', active: false },
            { label: 'Campeones', href: '#', active: false },
            { label: 'Posiciones', href: '/standings', active: false },
            { label: 'Goleadores', href: '#', active: false },
          ].map(({ label, href, active }) => (
            <a
              key={label}
              href={href}
              className={`text-xs transition-colors duration-150 ${
                active ? 'text-[#e8c84a]' : 'text-[#8a8fa8] hover:text-[#e8eaf0]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#161925] border-b border-[#2a2d3a] px-5 py-5 flex items-center gap-4">
        <div
          className="w-14 h-14 shrink-0 bg-[#1e2233] border border-[#2a2d3a] rounded-xl flex items-center justify-center"
          aria-label="Logo del mundial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e8c84a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
            aria-hidden="true"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-[17px] font-medium text-white mb-1">🇲🇽 México {year}</h1>
          <div className="flex gap-4 text-xs text-[#8a8fa8] mb-2">
            <span>16 selecciones</span>
            <span>32 partidos</span>
            <span>31 May – 21 Jun 1970</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] px-2 py-0.5 bg-[#1e2a14] text-[#8fc44a] border border-[#3a5a1a] rounded-full">
              🏆 Campeón: Brasil
            </span>
            <span className="text-[11px] px-2 py-0.5 bg-[#1e2233] text-[#8a8fa8] border border-[#2a2d3a] rounded-full">
              Subcampeón: Italia
            </span>
            <span className="text-[11px] px-2 py-0.5 bg-[#1e2233] text-[#8a8fa8] border border-[#2a2d3a] rounded-full">
              Goleador: Müller (10)
            </span>
          </div>
        </div>
      </section>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="border-b border-[#2a2d3a] bg-[#0f1117] px-5 overflow-x-auto">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors duration-150 focus:outline-none ${
                activeTab === tab.id
                  ? 'text-[#e8c84a] border-[#e8c84a]'
                  : 'text-[#8a8fa8] border-transparent hover:text-[#e8eaf0]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="px-5 py-5">
        {activeTab === 'groups' && (
          <GroupsTab groups={MOCK_GROUPS} eliminationPhases={MOCK_ELIMINATION_PHASES} />
        )}
        {activeTab === 'scorers' && <ScorersTab scorers={MOCK_SCORERS} />}
        {activeTab === 'teams' && <TeamsTab teams={MOCK_TEAMS} />}
        {activeTab === 'stadiums' && <StadiumsTab stadiums={MOCK_STADIUMS} />}
        {activeTab === 'standings' && <StandingsTab standings={MOCK_STANDINGS} />}
        {activeTab === 'stats' && (
          <p className="text-sm text-[#8a8fa8]">Solapa Estadísticas — próximamente</p>
        )}
      </main>
    </div>
  );
}
