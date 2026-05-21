import { useState } from 'react';
import { GroupsTab } from '@/features/championships/components/tabs/GroupsTab';
import { ScorersTab } from '@/features/championships/components/tabs/ScorersTab';
import {
  MOCK_GROUPS,
  MOCK_ELIMINATION_PHASES,
} from '@/features/championships/mocks/championshipDetail.mock';
import { MOCK_SCORERS } from '@/features/championships/mocks/scorers.mock';
import { TeamsTab } from '@/features/championships/components/tabs/TeamsTab';
import { MOCK_TEAMS } from '@/features/championships/mocks/teams.mock';
import { StadiumsTab } from '@/features/championships/components/tabs/StadiumsTab';
import { MOCK_STADIUMS } from '@/features/championships/mocks/stadiums.mock';
import { StandingsTab } from '@/features/championships/components/tabs/StandingsTab';
import { MOCK_STANDINGS } from '@/features/championships/mocks/standings.mock';
import HeroDetailSection from '../components/shared/HeroDetailSection';
import { Globe, House, Swords, Volleyball } from 'lucide-react';

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

export interface ChampionshipDetailPageProps {
  /** Año del mundial — en producción vendrá de useParams() */
  year?: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de detalle de un mundial.
 * Contiene el hero con metadata y las solapas de contenido.
 */
export default function ChampionshipDetailPage({ year = 1970 }: ChampionshipDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('groups');

  return (
    <>
      <HeroDetailSection
        badge="Historia de los mundiales de fútbol"
        title="Mexico"
        titleAccent={String(year)}
        description={`La Copa Mundial de la FIFA de ${year} se celebró desde el 31 de mayo hasta el 21 de junio.`}
        champion="Brasil"
        runnerUp="Italia"
        topScorer="Gerd Müller (10)"
        stats={[
          { icon: Globe, value: '16', label: 'Selecciones' },
          { icon: Swords, value: '32', label: 'Partidos' },
          { icon: Volleyball, value: '78', label: 'Goles' },
          { icon: House, value: '10', label: 'Estadios' },
        ]}
      />

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="font-mono border-b border-[#2a2d3a] bg-[#0f1117] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-3 border-b-2 whitespace-nowrap transition-colors duration-150 focus:outline-none ${
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
      </div>

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-5">
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
    </>
  );
}
