import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar as CalendarIcon, Phone, MapPin } from 'lucide-react';

export default function AgentDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/agent/leads');
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/agent/leads/${id}/status`, { status });
      fetchLeads();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="mr-2 text-primary-600" /> My Active Leads
          </h2>
          
          {loading ? <p>Loading leads...</p> : (
            <div className="space-y-4">
              {leads.length === 0 && <p className="text-gray-500">No leads assigned to you right now.</p>}
              
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{lead.customer?.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1"><span className="font-medium">Phone:</span> {lead.customer?.phone}</p>
                  <p className="text-sm text-gray-500 mb-3"><span className="font-medium">Region:</span> {lead.region?.name}</p>
                  
                  <div className="flex space-x-2">
                    {lead.status !== 'CONTACTED' && (
                      <button onClick={() => updateStatus(lead.id, 'CONTACTED')} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded border border-primary-200 hover:bg-primary-100">
                        Mark Contacted
                      </button>
                    )}
                    {lead.status !== 'CLOSED' && (
                      <button onClick={() => updateStatus(lead.id, 'CLOSED')} className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded border border-gray-200 hover:bg-gray-100">
                        Close Lead
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="mr-2 text-primary-600" /> Visit Planner (Mock)
          </h2>
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="font-medium text-gray-500">{d}</div>)}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`p-2 rounded-full ${i === 14 ? 'bg-primary-600 text-white font-bold' : i === 18 ? 'bg-primary-100 text-primary-800 font-bold cursor-pointer' : 'text-gray-700 hover:bg-gray-100'}`}>
                {i + 1}
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500">Calendar integration coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
