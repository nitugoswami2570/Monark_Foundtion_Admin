import { useEffect, useState } from 'react';
import { Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { supabase, Volunteer } from '../lib/supabase';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    status: 'Pending',
  });

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('volunteers').insert([formData]);

      if (error) throw error;

      setFormData({
        name: '',
        email: '',
        phone: '',
        skills: '',
        availability: '',
        status: 'Pending',
      });
      setShowAddForm(false);
      loadVolunteers();
    } catch (error) {
      console.error('Error adding volunteer:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('volunteers').update({ status }).eq('id', id);
      if (error) throw error;
      loadVolunteers();
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      try {
        const { error } = await supabase.from('volunteers').delete().eq('id', id);
        if (error) throw error;
        loadVolunteers();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Volunteers</h2>
          <p className="text-gray-600 mt-1">Manage volunteer applications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Add Volunteer
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Volunteer</h3>
          <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Volunteer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {volunteer.name.charAt(0)}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  volunteer.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : volunteer.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {volunteer.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{volunteer.name}</h3>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <span className="font-medium">Email:</span> {volunteer.email}
              </p>
              {volunteer.phone && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="font-medium">Phone:</span> {volunteer.phone}
                </p>
              )}
              {volunteer.skills && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="font-medium">Skills:</span> {volunteer.skills}
                </p>
              )}
              {volunteer.availability && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="font-medium">Availability:</span> {volunteer.availability}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {volunteer.status !== 'Approved' && (
                <button
                  onClick={() => handleUpdateStatus(volunteer.id, 'Approved')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              )}
              {volunteer.status !== 'Rejected' && (
                <button
                  onClick={() => handleUpdateStatus(volunteer.id, 'Rejected')}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(volunteer.id)}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
