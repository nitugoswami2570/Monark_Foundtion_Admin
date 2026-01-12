import { Home, DollarSign, Folder, Users, Mail, Settings } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-300 to-blue-800 from-emerald-900 to-emerald-800 text-white min-h-screen shadow-xl">
      <div className="p-6 border-b border-emerald-700">
        <h1 className="text-2xl font-bold">Monark Foundation</h1>
        <p className="text-emerald-200 text-sm mt-1">Admin Dashboard</p>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-emerald-700 hover:translate-x-1'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
