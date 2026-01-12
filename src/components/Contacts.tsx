import { useEffect, useState } from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import { supabase, Contact } from '../lib/supabase';

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
      if (error) throw error;
      loadContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        const { error } = await supabase.from('contacts').delete().eq('id', id);
        if (error) throw error;
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
        loadContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
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
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Contacts & Inquiries</h2>
        <p className="text-gray-600 mt-1">Manage contact messages and inquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">All Messages</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-6 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? 'bg-emerald-50 border-l-4 border-emerald-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{contact.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'New'
                        ? 'bg-blue-100 text-blue-700'
                        : contact.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{contact.subject}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{contact.email}</span>
                  <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Message Details</h3>
          </div>
          {selectedContact ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-800 font-semibold">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{selectedContact.email}</p>
              </div>
              {selectedContact.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-800">{selectedContact.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-gray-800 font-semibold">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Received</label>
                <p className="text-gray-800">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>
              <div className="pt-4 flex gap-3">
                {selectedContact.status !== 'Resolved' && (
                  <>
                    {selectedContact.status === 'New' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedContact.id, 'In Progress')}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(selectedContact.id, 'Resolved')}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Mark Resolved
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center h-96 text-gray-500">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
