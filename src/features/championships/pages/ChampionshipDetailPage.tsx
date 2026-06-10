import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { GroupsTab } from '@/features/championships/components/tabs/GroupsTab';
import { ScorersTab } from '@/features/championships/components/tabs/ScorersTab';
import { TeamsTab } from '@/features/championships/components/tabs/TeamsTab';
import { StadiumsTab } from '@/features/championships/components/tabs/StadiumsTab';
import { StandingsTab } from '@/features/championships/components/tabs/StandingsTab';
import { GroupsTabSkeleton } from '@/features/championships/components/tabs/GroupsTabSkeleton';
import { useChampionshipDetail } from '@/features/championships/hooks/useChampionshipDetail';
import HeroDetailSection from '../components/shared/HeroDetailSection';
import { TableSkeleton } from '@/components/shared';
import { Skeleton } from '@/components/ui/Skeleton';
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

// ─── Skeleton de la página completa ───────────────────────────────────────────

function ChampionshipDetailSkeleton({ activeTab }: { activeTab: TabId }) {
  return (
    <>
      {/* Hero skeleton */}
      <section className="font-mono bg-[#161925] border-b border-[#2a2d3a]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center gap-8">
          <div className="flex-1 flex flex-col gap-3">
            <Skeleton className="h-5 w-48 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
            <div className="flex gap-2 mt-1">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="flex gap-6 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                  <Skeleton className="h-5 w-6" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
          {/* Image placeholder */}
          <Skeleton className="w-48 h-36 rounded-xl shrink-0" />
        </div>
      </section>

      {/* Tabs skeleton */}
      <div className="font-mono border-b border-[#2a2d3a] bg-[#0f1117] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {TABS.map((tab) => (
              <div
                key={tab.id}
                className="flex items-center gap-1.5 text-xs px-3 py-3 border-b-2 whitespace-nowrap border-transparent"
              >
                <Skeleton className="w-3 h-3 rounded-sm" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content skeleton */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-5" role="status">
        <span className="sr-only">Cargando mundial...</span>
        {activeTab === 'groups' ? (
          <GroupsTabSkeleton />
        ) : (
          <TableSkeleton
            cols={activeTab === 'standings' ? 7 : activeTab === 'stadiums' ? 5 : 5}
            rows={8}
          />
        )}
      </main>
    </>
  );
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
  const { detail, isLoading, isError } = useChampionshipDetail(year ?? 0, year !== null);

  if (year === null) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || detail === null) {
    return <ChampionshipDetailSkeleton activeTab={activeTab} />;
  }

  if (isError) {
    return (
      <p className="font-mono text-sm text-[#d06060] px-6 py-5">
        No se pudo cargar el detalle del mundial.
      </p>
    );
  }

  return (
    <>
      <HeroDetailSection
        badge="Historia de los mundiales de fútbol"
        title={detail.country}
        titleAccent={String(detail.year)}
        description={`La Copa Mundial de la FIFA de ${detail.year} se celebró desde el 31 de mayo hasta el 21 de junio.`}
        champion={detail.champion}
        runnerUp={detail.runnerUp}
        topScorer={`${detail.topScorer} (${detail.topScorerGoals})`}
        stats={[
          { icon: Globe, value: String(detail.totalTeams), label: 'Selecciones' },
          { icon: Swords, value: String(detail.totalMatches), label: 'Partidos' },
          { icon: Volleyball, value: String(detail.totalGoals), label: 'Goles' },
          { icon: House, value: String(detail.totalStadiums), label: 'Estadios' },
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
          <GroupsTab groups={detail.groups} eliminationPhases={detail.eliminationPhases} />
        )}
        {activeTab === 'scorers' && <ScorersTab scorers={detail.scorers} />}
        {activeTab === 'teams' && <TeamsTab teams={detail.teams} />}
        {activeTab === 'stadiums' && <StadiumsTab stadiums={detail.stadiums} />}
        {activeTab === 'standings' && <StandingsTab standings={detail.standings} />}
        {activeTab === 'stats' && (
          <p className="text-sm text-[#8a8fa8]">Solapa Estadísticas — próximamente</p>
        )}
      </main>
    </>
  );
}
