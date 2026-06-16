import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, CheckCircle } from 'lucide-react';

export default function ManagerDashboard() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        api.get('/manager/leads'),
        api.get('/manager/agents')
      ]);
      setLeads(leadsRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const assignAgent = async (leadId, agentId) => {
    if (!agentId) return;
    try {
      await api.post('/manager/assign-lead', { leadId, agentId: Number(agentId) });
      fetchData(); // refresh the list
    } catch (err) {
      alert("Failed to assign agent");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Users className="mr-2 text-primary-600"/> Regional Lead Assignment</h2>
        <p className="text-gray-500 mb-6">Assign leads from your region to your available agents.</p>
        
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.agent ? (
                        <div className="flex items-center text-green-700 font-medium">
                          <CheckCircle size={16} className="mr-1" /> {lead.agent.name}
                        </div>
                      ) : (
                        <select 
                          className="border border-gray-300 rounded p-1 outline-none focus:border-primary-500"
                          onChange={(e) => assignAgent(lead.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Agent</option>
                          {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">No leads found for your region.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
