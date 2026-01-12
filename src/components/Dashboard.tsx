import { useEffect, useState } from 'react';
import { DollarSign, Folder, Users, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalDonations: number;
  totalAmount: number;
  activeProjects: number;
  volunteers: number;
  pendingContacts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    volunteers: 0,
    pendingContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [donationsRes, projectsRes, volunteersRes, contactsRes] = await Promise.all([
        supabase.from('donations').select('amount'),
        supabase.from('projects').select('id').eq('status', 'Active'),
        supabase.from('volunteers').select('id'),
        supabase.from('contacts').select('id').eq('status', 'New'),
      ]);

      const totalAmount = donationsRes.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      setStats({
        totalDonations: donationsRes.data?.length || 0,
        totalAmount,
        activeProjects: projectsRes.data?.length || 0,
        volunteers: volunteersRes.data?.length || 0,
        pendingContacts: contactsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Folder,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
    },
    {
      title: 'Volunteers',
      value: stats.volunteers,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
    },
    {
      title: 'Pending Contacts',
      value: stats.pendingContacts,
      icon: Mail,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome to Monark Foundation Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-gray-700">New donation received from John Smith</p>
            <span className="text-gray-500 text-sm ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-gray-700">New volunteer application submitted</p>
            <span className="text-gray-500 text-sm ml-auto">5 hours ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-gray-700">Project "Education for All" updated</p>
            <span className="text-gray-500 text-sm ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
