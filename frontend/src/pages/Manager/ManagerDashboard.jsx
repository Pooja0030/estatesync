import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, CheckCircle, Search, Filter, Activity, TrendingUp, History, Plus, X } from 'lucide-react';

export default function ManagerDashboard() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', agentId: '' });
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedLeadHistory, setSelectedLeadHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
      fetchData();
    } catch (err) {
      alert("Failed to assign agent");
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/lead', {
        ...newLeadForm,
        agentId: newLeadForm.agentId ? Number(newLeadForm.agentId) : null
      });
      setShowCreateModal(false);
      setNewLeadForm({ customerName: '', customerPhone: '', customerEmail: '', agentId: '' });
      fetchData();
    } catch (err) {
      alert("Failed to create lead");
    }
  };

  const openHistory = async (leadId) => {
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setSelectedLeadHistory([]);
    try {
      const res = await api.get(`/manager/lead/${leadId}/history`);
      setSelectedLeadHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Derived KPIs
  const totalLeads = leads.length;
  const unassignedLeads = leads.filter(l => !l.agent).length;
  const closedLeads = leads.filter(l => l.status === 'CLOSED').length;
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

  // Agent Performance
  const agentPerformance = agents.map(agent => {
    const agentLeads = leads.filter(l => l.agent && l.agent.id === agent.id);
    const agentClosed = agentLeads.filter(l => l.status === 'CLOSED').length;
    return {
      ...agent,
      totalAssigned: agentLeads.length,
      closed: agentClosed,
      conversion: agentLeads.length > 0 ? ((agentClosed / agentLeads.length) * 100).toFixed(1) : 0
    };
  });

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.customer?.phone?.includes(searchQuery);
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    const matchesAgent = agentFilter ? (lead.agent?.id?.toString() === agentFilter) : true;
    return matchesSearch && matchesStatus && matchesAgent;
  });

  // Helper for parsing date from spring boot if needed
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    if (Array.isArray(dateValue)) {
      // Jackson sometimes sends [yyyy, M, d, H, m, s]
      return new Date(dateValue[0], dateValue[1]-1, dateValue[2], dateValue[3]||0, dateValue[4]||0, dateValue[5]||0).toLocaleString();
    }
    return new Date(dateValue).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Users size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Unassigned Leads</p>
            <p className="text-2xl font-bold text-gray-900">{unassignedLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leads Table (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center"><Users className="mr-2 text-primary-600"/> Regional Leads</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
            >
              <Plus size={16} className="mr-2"/> Create Lead
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input 
                type="text" 
                placeholder="Search by name or phone..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="VISIT_SCHEDULED">Visit Scheduled</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-white"
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
              >
                <option value="">All Agents</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          
          {loading ? <p className="text-gray-500 py-4">Loading leads...</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.customer?.name}</div>
                        <div className="text-sm text-gray-500">{lead.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {lead.agent && <CheckCircle size={16} className="text-green-600" />}
                          <select 
                            className="border border-gray-300 rounded p-1 outline-none focus:border-primary-500 bg-white"
                            onChange={(e) => assignAgent(lead.id, e.target.value)}
                            value={lead.agent ? lead.agent.id : ""}
                          >
                            <option value="" disabled>Select Agent</option>
                            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onClick={() => openHistory(lead.id)} className="text-primary-600 hover:text-primary-800 flex items-center p-2 rounded-lg hover:bg-primary-50 transition-colors" title="View History">
                          <History size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">No leads found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Agent Performance (1/3 width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Activity className="mr-2 text-primary-600"/> Agent Performance</h2>
          <div className="space-y-4">
            {agentPerformance.map(agent => (
              <div key={agent.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex flex-col space-y-2 hover:border-primary-200 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{agent.name}</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 font-semibold text-primary-700 shadow-sm">{agent.conversion}% closed</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center"><Users size={14} className="mr-1"/> Assigned: {agent.totalAssigned}</span>
                  <span className="flex items-center"><CheckCircle size={14} className="mr-1"/> Won: {agent.closed}</span>
                </div>
              </div>
            ))}
            {agents.length === 0 && <p className="text-gray-500 text-sm py-4 text-center">No agents available.</p>}
          </div>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20}/>
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Lead</h2>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" 
                  value={newLeadForm.customerName} onChange={e => setNewLeadForm({...newLeadForm, customerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" 
                  value={newLeadForm.customerPhone} onChange={e => setNewLeadForm({...newLeadForm, customerPhone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" 
                  value={newLeadForm.customerEmail} onChange={e => setNewLeadForm({...newLeadForm, customerEmail: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Agent (Optional)</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow bg-white"
                  value={newLeadForm.agentId} onChange={e => setNewLeadForm({...newLeadForm, agentId: e.target.value})} >
                  <option value="">Do not assign yet</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg mt-6 transition-colors shadow-sm">
                Create Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative max-h-[80vh] overflow-y-auto shadow-xl">
            <button onClick={() => setShowHistoryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20}/>
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><History className="mr-2 text-primary-600"/> Lead History</h2>
            {historyLoading ? (
              <div className="py-8 text-center text-gray-500">Loading history...</div>
            ) : selectedLeadHistory.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No assignment history found for this lead.</div>
            ) : (
              <div className="space-y-6">
                {selectedLeadHistory.map((hist, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] last:before:bottom-0 before:w-0.5 before:bg-gray-200">
                    <div className="absolute left-1 top-2 w-2.5 h-2.5 bg-primary-500 rounded-full ring-4 ring-white"></div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {formatDate(hist.changedAt)}
                      </p>
                      <p className="text-gray-900 text-sm">
                        Assigned to <span className="font-semibold text-primary-700">{hist.newAgent?.name || 'Unassigned'}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Previous: {hist.prevAgent?.name || 'Unassigned'} • Changed by {hist.changedBy?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
