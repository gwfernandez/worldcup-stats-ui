import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GroupsTab } from './tabs/GroupsTab';
import { MOCK_GROUPS, MOCK_ELIMINATION_PHASES } from '../mocks/worldcupDetail.mock';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabId = 'groups' | 'teams' | 'schedule' | 'stats' | 'standings';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TabIcon = ({ d, d2 }: { d: string; d2?: string }) => (
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
    <path d={d} />
    {d2 && <path d={d2} />}
  </svg>
);

const TABS: Tab[] = [
  {
    id: 'groups',
    label: 'Grupos y fixture',
    icon: <TabIcon d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
  },
  {
    id: 'teams',
    label: 'Selecciones',
    icon: (
      <TabIcon
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    ),
  },
  {
    id: 'schedule',
    label: 'Cronograma',
    icon: <TabIcon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  },
  { id: 'stats', label: 'Estadísticas', icon: <TabIcon d="M18 20V10M12 20V4M6 20v-6" /> },
  {
    id: 'standings',
    label: 'Clasificación',
    icon: (
      <TabIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    ),
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de detalle de un mundial.
 * Contiene el hero con metadata y las cinco solapas de contenido.
 */
export default function WorldCupDetailPage() {
  const { year } = useParams<{ year: string }>();
  const worldCupYear = year ? parseInt(year, 10) : 2022;
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
          {['Mundiales', 'Selecciones', 'Goleadores'].map((link, i) => (
            <a
              key={link}
              href="#"
              className={`text-xs transition-colors duration-150 ${i === 0 ? 'text-[#e8c84a]' : 'text-[#8a8fa8] hover:text-[#e8eaf0]'}`}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#161925] border-b border-[#2a2d3a] px-5 py-5 flex items-center gap-4">
        {/* Logo placeholder */}
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
          <h1 className="text-[17px] font-medium text-white mb-1">🇲🇽 México {worldCupYear}</h1>
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
        {activeTab === 'teams' && (
          <div className="text-sm text-[#8a8fa8]">Solapa Selecciones — próximamente</div>
        )}
        {activeTab === 'schedule' && (
          <div className="text-sm text-[#8a8fa8]">Solapa Cronograma — próximamente</div>
        )}
        {activeTab === 'stats' && (
          <div className="text-sm text-[#8a8fa8]">Solapa Estadísticas — próximamente</div>
        )}
        {activeTab === 'standings' && (
          <div className="text-sm text-[#8a8fa8]">Solapa Clasificación — próximamente</div>
        )}
      </main>
    </div>
  );
}
