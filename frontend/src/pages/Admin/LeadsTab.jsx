import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit, Trash2, X } from 'lucide-react';

export default function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [rawLeads, setRawLeads] = useState([]);
  const [regions, setRegions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [managers, setManagers] = useState([]);
  const [allSystemProperties, setAllSystemProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    isNew: false,
    id: null,
    status: 'NEW',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    regionId: '',
    agentId: '',
    managerId: '',
    properties: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, regionsRes, usersRes, propsRes] = await Promise.all([
        api.get('/admin/leads'),
        api.get('/admin/regions'),
        api.get('/admin/users'),
        api.get('/admin/properties')
      ]);
      const displayLeads = leadsRes.data.map(lead => ({
        id: lead.id,
        createdAt: lead.createdAt,
        customer: lead.customer,
        region: lead.region,
        agent: lead.agent,
        manager: lead.manager,
        status: lead.status,
        interestedPropertiesWithDates: lead.interestedProperties || []
      }));

      // Sort final display leads by most recent first
      displayLeads.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      setRawLeads(leadsRes.data);
      setLeads(displayLeads);
      setRegions(regionsRes.data);
      setAgents(usersRes.data.filter(u => u.role === 'AGENT'));
      setManagers(usersRes.data.filter(u => u.role === 'MANAGER'));
      setAllSystemProperties(propsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        status: formData.status,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone
        },
        region: formData.regionId ? { id: formData.regionId } : null,
        agent: formData.agentId ? { id: formData.agentId } : null,
        manager: formData.managerId ? { id: formData.managerId } : null,
        interestedProperties: formData.properties.map(p => ({ id: p.id }))
      };

      if (formData.isNew) {
        await api.post('/admin/leads', payload);
      } else if (formData.id) {
        await api.put(`/admin/leads/${formData.id}`, payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/admin/leads/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete leads.");
      }
    }
  };

  const openModal = (displayLead) => {
    if (displayLead) {
      setFormData({ 
        isNew: false,
        id: displayLead.id, 
        status: displayLead.status,
        customerName: displayLead.customer?.name || '',
        customerEmail: displayLead.customer?.email || '',
        customerPhone: displayLead.customer?.phone || '',
        regionId: displayLead.region?.id || '',
        agentId: displayLead.agent?.id || '',
        managerId: displayLead.manager?.id || '',
        properties: [...displayLead.interestedPropertiesWithDates]
      });
    } else {
      setFormData({ 
        isNew: true,
        id: null, 
        status: 'NEW',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        regionId: '',
        agentId: '',
        managerId: '',
        properties: []
      });
    }
    setShowModal(true);
  };

  const addProperty = (e) => {
    const propId = parseInt(e.target.value);
    if (!propId) return;
    const propObj = allSystemProperties.find(p => p.id === propId);
    if (propObj && !formData.properties.find(p => p.id === propId)) {
      setFormData({
        ...formData,
        properties: [...formData.properties, { ...propObj, sourceLeadId: null, dateOfInterest: new Date().toISOString() }]
      });
    }
    e.target.value = "";
  };

  const removeProperty = (propId) => {
    setFormData({
      ...formData,
      properties: formData.properties.filter(p => p.id !== propId)
    });
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert(`Copied location ID: ${text}`);
    } else {
      alert("Location ID not available.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Leads</h2>
        <button onClick={() => openModal()} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
          + Add Lead
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr> : 
             leads.map(l => (
              <tr key={l.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="max-w-[80px] truncate" title={l.id}>#{l.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {l.customer?.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {l.interestedPropertiesWithDates && l.interestedPropertiesWithDates.length > 0 ? (
                    <div className="flex flex-col gap-2 max-w-[250px]">
                      {l.interestedPropertiesWithDates.map(p => (
                        <div key={p.id} className="flex flex-col p-2 bg-gray-50 border border-gray-200 rounded">
                          <span className="text-xs font-medium text-gray-900 truncate" title={p.title}>
                            {p.title} {p.region?.name ? <span className="text-gray-500 font-normal">({p.region.name})</span> : ''}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-1 flex justify-between items-center">
                            <span>Added: {p.dateOfInterest ? new Date(p.dateOfInterest).toLocaleDateString() : 'N/A'}</span>
                            <button 
                              onClick={() => copyToClipboard(p.id)} 
                              className="text-blue-500 hover:text-blue-700 hover:underline"
                              title="Copy Location ID"
                            >
                              Copy Location ID
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{l.customer?.phone}</div>
                  <div className="text-xs">{l.customer?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{l.region?.name || 'No Region'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{l.manager?.name || 'Unassigned'}</div>
                  {l.manager?.region && <div className="text-xs text-gray-400">From: {l.manager.region.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-gray-900">{l.agent?.name || 'Unassigned'}</div>
                  {l.agent?.region && <div className="text-xs text-gray-400">From: {l.agent.region.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${l.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => openModal(l)} className="text-blue-600 hover:text-blue-900"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {!loading && leads.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-gray-500">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold mb-4">{formData.isNew ? 'Add New Lead' : 'Edit Lead Details'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" className="w-full border rounded p-2" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                  <input type="tel" className="w-full border rounded p-2" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <input type="email" className="w-full border rounded p-2" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                  <select className="w-full border rounded p-2" required value={formData.regionId} onChange={e => setFormData({...formData, regionId: e.target.value})}>
                    <option value="" disabled>-- Select Region --</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Agent</label>
                  <select className="w-full border rounded p-2" value={formData.agentId} onChange={e => setFormData({...formData, agentId: e.target.value})}>
                    <option value="">-- Unassigned --</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} {a.region ? `(${a.region.name})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Manager</label>
                  <select className="w-full border rounded p-2" value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}>
                    <option value="">-- Unassigned --</option>
                    {managers.map(m => <option key={m.id} value={m.id}>{m.name} {m.region ? `(${m.region.name})` : ''}</option>)}
                  </select>
                </div>
                <div className="col-span-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Status *</label>
                  <select className="w-full border rounded p-2 bg-gray-50 font-semibold" required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Interested Properties</label>
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border">
                  {formData.properties.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-white p-2 border rounded text-sm shadow-sm">
                      <span className="truncate pr-2">{p.title}</span>
                      <button type="button" onClick={() => removeProperty(p.id)} className="text-red-500 hover:text-red-700 font-bold px-2"><X size={16} /></button>
                    </div>
                  ))}
                  {formData.properties.length === 0 && <span className="text-gray-400 text-sm">No properties selected.</span>}
                </div>
                <select className="w-full border rounded p-2" onChange={addProperty} defaultValue="">
                  <option value="" disabled>+ Add Property...</option>
                  {allSystemProperties
                    .filter(p => !formData.properties.find(existing => existing.id === p.id))
                    .filter(p => !formData.regionId || p.region?.id == formData.regionId)
                    .map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
