import { Sidebar } from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 w-full bg-bg min-h-screen p-4 sm:p-6 ml-16 sm:ml-20 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
