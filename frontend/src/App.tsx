import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Send, PieChart, LayoutDashboard, Database, GraduationCap, ChevronDown, User, Bell, Palette, Shield, UserCircle, FileText } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import FillSurvey from './pages/FillSurvey';
import Institutions from './pages/Institutions';
import Dispatch from './pages/Dispatch';
import SettingsPage from './pages/Settings';
import Reports from './pages/Reports';
import Trainings from './pages/Trainings';

const settingsTabs = [
  { id: 'profile', label: 'Profil Bilgileri', icon: <User size={15} /> },
  { id: 'notifications', label: 'Bildirimler', icon: <Bell size={15} /> },
  { id: 'appearance', label: 'Görünüm', icon: <Palette size={15} /> },
  { id: 'security', label: 'Güvenlik', icon: <Shield size={15} /> },
  { id: 'survey', label: 'Anket Varsayılanları', icon: <Database size={15} /> },
  { id: 'periods', label: 'Dönem Yönetimi', icon: <Database size={15} /> },
  { id: 'educators', label: 'Eğitimci Yönetimi', icon: <UserCircle size={15} /> },
];

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFillRoute = location.pathname.startsWith('/s/');
  const isSettingsRoute = location.pathname === '/settings';
  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute);

  if (isFillRoute) return null;

  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  return (
    <aside className="left-sidebar glass-panel">
      <div className="sidebar-header">
        <img src="/logo.png" alt="ZA Logo" className="logo" />
        <h2>Anket Yönetimi</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={24} strokeWidth={1.5} /> Kokpit
        </Link>
        <Link to="/trainings" className={`nav-item ${location.pathname === '/trainings' ? 'active' : ''}`}>
          <GraduationCap size={24} strokeWidth={1.5} /> Eğitimler
        </Link>
        <Link to="/institutions" className={`nav-item ${location.pathname === '/institutions' ? 'active' : ''}`}>
          <Building2 size={24} strokeWidth={1.5} /> Kurumlar
        </Link>
        <Link to="/dispatch" className={`nav-item ${location.pathname === '/dispatch' ? 'active' : ''}`}>
          <Send size={24} strokeWidth={1.5} /> Gönderim
        </Link>
        <Link to="/create" className={`nav-item ${location.pathname === '/create' ? 'active' : ''}`}>
          <FileText size={24} strokeWidth={1.5} /> Anketler
        </Link>
        <Link to="/reports" className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`}>
          <PieChart size={24} strokeWidth={1.5} /> Raporlar
        </Link>

        {/* Collapsible Ayarlar */}
        <button
          onClick={() => {
            setSettingsOpen(o => !o);
            if (!isSettingsRoute) navigate('/settings');
          }}
          className={`nav-item ${isSettingsRoute ? 'active' : ''}`}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: '0.75rem 1rem' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={24} strokeWidth={1.5} /> Ayarlar
          </span>
          <ChevronDown
            size={16}
            style={{
              transition: 'transform 0.2s',
              transform: settingsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#94a3b8'
            }}
          />
        </button>

        {/* Sub-items */}
        <div style={{
          overflow: 'hidden',
          maxHeight: settingsOpen ? `${settingsTabs.length * 44}px` : '0px',
          transition: 'max-height 0.3s ease',
        }}>
          {settingsTabs.map(tab => (
            <Link
              key={tab.id}
              to={`/settings?tab=${tab.id}`}
              onClick={() => setSettingsOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 1rem 0.55rem 2.5rem',
                fontSize: '0.85rem',
                color: isSettingsRoute && activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isSettingsRoute && activeTab === tab.id ? 600 : 400,
                background: isSettingsRoute && activeTab === tab.id ? 'rgba(99,102,241,0.06)' : 'transparent',
                borderLeft: isSettingsRoute && activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'all 0.15s',
              }}
            >
              {tab.icon} {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <LeftSidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/edit/:id" element={<CreateSurvey />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/s/:id" element={<FillSurvey />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
