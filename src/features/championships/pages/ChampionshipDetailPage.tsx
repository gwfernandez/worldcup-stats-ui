import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
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
import {
  Globe,
  House,
  Swords,
  Volleyball,
  LayoutGrid,
  Users,
  Clock,
  Layers,
  List,
  BarChart2,
} from 'lucide-react';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabId = 'groups' | 'teams' | 'scorers' | 'stadiums' | 'standings' | 'stats';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  {
    id: 'groups',
    label: 'Grupos y fixture',
    icon: <LayoutGrid size={13} />,
  },
  {
    id: 'teams',
    label: 'Selecciones',
    icon: <Users size={13} />,
  },
  {
    id: 'scorers',
    label: 'Goleadores',
    icon: <Clock size={13} />,
  },
  {
    id: 'stadiums',
    label: 'Estadios',
    icon: <Layers size={13} />,
  },
  {
    id: 'standings',
    label: 'Posiciones',
    icon: <List size={13} />,
  },
  {
    id: 'stats',
    label: 'Estadísticas',
    icon: <BarChart2 size={13} />,
  },
];

function parseYearParam(yearParam: string | undefined): number | null {
  if (!yearParam) return null;
  const year = parseInt(yearParam, 10);
  if (Number.isNaN(year) || year <= 0) return null;
  return year;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de detalle de un mundial.
 * Contiene el hero con metadata y las solapas de contenido.
 */
export default function ChampionshipDetailPage() {
  const { year: yearParam } = useParams<{ year: string }>();
  const year = parseYearParam(yearParam);
  const [activeTab, setActiveTab] = useState<TabId>('groups');

  if (year === null) {
    return <Navigate to="/" replace />;
  }

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
