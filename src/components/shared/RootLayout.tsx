import { Outlet } from 'react-router-dom';
import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      <WorldCupsNavbar />
      <Outlet />
    </div>
  );
}
