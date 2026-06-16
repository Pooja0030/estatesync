import React, { useState } from 'react';
import AnalyticsTab from './AnalyticsTab';
import PropertiesTab from './PropertiesTab';
import EmployeesTab from './EmployeesTab';
import CustomersTab from './CustomersTab';
import RegionsTab from './RegionsTab';
import LeadsTab from './LeadsTab';
import { Building2, Users, Briefcase, Map, ClipboardList, PieChart } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${activeTab === 'analytics' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <PieChart className="mr-2" size={18} /> Analytics
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`${activeTab === 'regions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Map className="mr-2" size={18} /> Regions
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`${activeTab === 'properties' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Building2 className="mr-2" size={18} /> Properties
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`${activeTab === 'employees' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Briefcase className="mr-2" size={18} /> Employees
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`${activeTab === 'customers' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Users className="mr-2" size={18} /> Customers
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`${activeTab === 'leads' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ClipboardList className="mr-2" size={18} /> Leads
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'regions' && <RegionsTab />}
        {activeTab === 'properties' && <PropertiesTab />}
        {activeTab === 'employees' && <EmployeesTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'leads' && <LeadsTab />}
      </div>
    </div>
  );
}
