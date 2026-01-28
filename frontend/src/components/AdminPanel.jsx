import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, ShoppingBag, Trash2, LogOut, 
  ShieldCheck, Activity, Search, Bell, Menu, BarChart3, Sprout, X 
} from 'lucide-react';
import axios from 'axios';

 const API_BASE_URL = 'https://krishi-predict-exlq.onrender.com';

const AdminPanel = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Tabs & Data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ users: 0, reports: 0, listings: 0, recentActivity: [] });
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  // --- RESPONSIVE STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- AUTH ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { 
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert("Access Denied: Wrong Password");
    }
  };

  // --- DATA FETCHING ---
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(res.data);
    } catch(e) { console.error(e); }
  };

  const loadTab = async (tabName, endpoint) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); // Mobile: Click ke baad menu band karo
    try {
      const res = await axios.get(`${API_URL}${endpoint}`);
      setDataList(res.data);
    } catch(e) { console.error(e); }
  };

  // --- ACTIONS ---
  const handleDelete = async (id, type) => {
    if(!window.confirm("Are you sure? This action is permanent.")) return;
    
    let endpoint = '';
    if(type === 'user') endpoint = `/api/admin/user/${id}`;
    if(type === 'report') endpoint = `/api/admin/report/${id}`;
    if(type === 'listing') endpoint = `/api/admin/listing/${id}`;

    try {
      await axios.delete(`${API_URL}${endpoint}`);
      setDataList(dataList.filter(item => item._id !== id));
      fetchStats(); 
    } catch(e) { alert("Delete failed"); }
  };

  const handleBroadcast = async () => {
    if(!broadcastMsg) return;
    try {
        await axios.post(`${API_URL}/api/admin/broadcast`, { message: broadcastMsg });
        alert(`📢 Message sent to ${stats.users} farmers!`);
        setBroadcastMsg('');
    } catch(e) { alert("Broadcast failed"); }
  };

  const filteredData = dataList.filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIN SCREEN (PREMIUM UI) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center relative z-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={40} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 mb-8 text-sm font-medium">Authentication Required</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <input 
                type="password" 
                placeholder="Enter Access Key" 
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-center tracking-widest group-hover:bg-slate-800/80"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 transform active:scale-95 transition-all duration-200">
              UNLOCK DASHBOARD
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <button onClick={onLogout} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 mx-auto">
              <LogOut size={12} /> Return to Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT (PREMIUM UI) ---
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      
      {/* 1. MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* 2. SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/20">
                <ShieldCheck size={24} className="text-white" />
             </div>
             <div>
               <h1 className="font-bold text-xl tracking-wide leading-none text-white">Krishi<span className="text-emerald-500">Admin</span></h1>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Panel v2.0</span>
             </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          <NavItem icon={<Activity size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
          
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Management</p>
          <NavItem icon={<Users size={20} />} label="Farmers Data" active={activeTab === 'users'} onClick={() => loadTab('users', '/api/admin/users')} />
          <NavItem icon={<AlertTriangle size={20} />} label="Disease Alerts" active={activeTab === 'reports'} onClick={() => loadTab('reports', '/api/admin/reports')} />
          <NavItem icon={<ShoppingBag size={20} />} label="Market Listings" active={activeTab === 'listings'} onClick={() => loadTab('listings', '/api/admin/listings')} />
          
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Tools</p>
          <NavItem icon={<Bell size={20} />} label="Broadcast" active={activeTab === 'broadcast'} onClick={() => { setActiveTab('broadcast'); setIsMobileMenuOpen(false); }} />
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 bg-slate-950/30 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full p-3 rounded-xl border border-transparent hover:border-red-500/20 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
        
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between md:hidden z-30 sticky top-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-700 uppercase text-sm tracking-wide">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</span>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">A</div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 scroll-smooth">
          
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Stats */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h2>
                    <p className="text-slate-500 mt-1">Real-time platform insights and activity.</p>
                  </div>
                  <div className="hidden md:block text-sm text-slate-400 font-medium">
                     Last updated: Just now
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={<Users size={24} />} title="Total Farmers" value={stats.users} color="blue" />
                  <StatCard icon={<AlertTriangle size={24} />} title="Active Alerts" value={stats.reports} color="red" />
                  <StatCard icon={<ShoppingBag size={24} />} title="Live Listings" value={stats.listings} color="emerald" />
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 rounded text-indigo-600"><BarChart3 size={18}/></div>
                      Recent Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                       stats.recentActivity.map((act, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors group">
                          <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                          <div className="flex-1">
                             <p className="text-slate-700 text-sm font-medium group-hover:text-emerald-700 transition-colors">{act.text}</p>
                             <span className="text-xs text-slate-400 mt-1 block">{act.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">No recent activity detected.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* List Views (Tables) */}
            {(activeTab === 'users' || activeTab === 'reports' || activeTab === 'listings') && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] h-[calc(100vh-140px)] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab} Management</h2>
                    <p className="text-slate-500 text-sm">Manage and monitor all system entries.</p>
                  </div>
                  
                  <div className="flex gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-auto">
                    <div className="flex-1 flex items-center bg-transparent px-3">
                      <Search size={18} className="text-slate-400" />
                      <input 
                        className="bg-transparent border-none outline-none p-2 w-full text-sm text-slate-700 placeholder-slate-400" 
                        placeholder={`Search ${activeTab}...`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button onClick={() => loadTab(activeTab, `/api/admin/${activeTab}`)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 flex flex-col overflow-hidden">
                  <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-5 whitespace-nowrap">Primary Info</th>
                          <th className="p-5 whitespace-nowrap">Details</th>
                          <th className="p-5 whitespace-nowrap">Timestamp</th>
                          <th className="p-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredData.map((item) => (
                          <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="p-5">
                              <div className="font-semibold text-slate-800 text-sm md:text-base">
                                {item.name || item.disease || (
                                  <span className="flex items-center gap-2">
                                    <div className="bg-emerald-100 p-1.5 rounded-md text-emerald-600"><Sprout size={16}/></div>
                                    {item.crop} 
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 uppercase">{item.variety}</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-1 hidden md:block">ID: {item._id}</div>
                            </td>
                            <td className="p-5 text-sm text-slate-600">
                              <div className="space-y-1">
                                {item.phone && <div className="flex items-center gap-2"><span className="text-slate-400 text-xs">Ph:</span> {item.phone}</div>}
                                {item.district && <div className="flex items-center gap-2"><span className="text-slate-400 text-xs">Loc:</span> {item.district}</div>}
                                {item.expectedPrice && <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-100">₹{item.expectedPrice}/Q</div>}
                              </div>
                            </td>
                            <td className="p-5 text-xs text-slate-500 whitespace-nowrap">
                              {item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </td>
                            <td className="p-5 text-right">
                              <button 
                                onClick={() => handleDelete(item._id, activeTab === 'users' ? 'user' : activeTab === 'reports' ? 'report' : 'listing')}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all transform hover:scale-110"
                                title="Delete Item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredData.length === 0 && (
                          <tr><td colSpan="4" className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                            <Search size={32} className="opacity-20"/>
                            No matching records found
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Broadcast View */}
            {activeTab === 'broadcast' && (
              <div className="flex items-center justify-center h-full min-h-[500px] animate-[fadeIn_0.3s_ease-out]">
                <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-purple-900/5 border border-purple-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                     <Bell size={120} className="text-purple-600" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2 text-purple-700">
                      <div className="p-3 bg-purple-100 rounded-xl"><Bell size={28} /></div>
                      <h2 className="text-3xl font-bold">Broadcast Center</h2>
                    </div>
                    <p className="text-slate-500 mb-8 ml-1">Send an instant alert to all <span className="font-bold text-slate-800">{stats.users}</span> registered users.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Message Content</label>
                        <textarea 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 h-40 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none resize-none text-slate-700 transition-all shadow-inner"
                          placeholder="Type your important announcement here..."
                          value={broadcastMsg}
                          onChange={(e) => setBroadcastMsg(e.target.value)}
                        />
                      </div>
                      
                      <button 
                        onClick={handleBroadcast}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex justify-center items-center gap-3 text-lg transform hover:-translate-y-1"
                      >
                        <Bell size={20} /> SEND BROADCAST
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-4 w-full p-3.5 mx-auto rounded-xl transition-all duration-300 group relative overflow-hidden ${
      active 
        ? 'bg-emerald-600/10 text-emerald-400 font-semibold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"></div>}
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className="tracking-wide">{label}</span>
  </button>
);

const StatCard = ({ icon, title, value, color }) => {
  const styles = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
    red: { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
  }[color] || { bg: "bg-gray-500", text: "text-gray-600", light: "bg-gray-50" };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 flex items-center justify-between group cursor-default transform hover:-translate-y-1">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className={`text-4xl font-extrabold text-slate-800 tracking-tight`}>{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${styles.bg} shadow-${color}-500/30 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
};

export default AdminPanel;