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

const ROLE_KEY = 'user_role';

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFillRoute = location.pathname.startsWith('/s/');
  const isSettingsRoute = location.pathname === '/settings';
  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ROLE_KEY) === 'admin');

  if (isFillRoute) return null;

  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  const toggleAdmin = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    localStorage.setItem(ROLE_KEY, next ? 'admin' : 'user');
  };

  return (
    <aside className="left-sidebar glass-panel">
      <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="ZA Logo" className="logo" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
              Kurum ve Eğitim Planlama
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '0.9rem', margin: 0, color: '#6366f1', fontWeight: 700 }}>Yönetimi</h2>
              {isAdmin && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#7c3aed',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  borderRadius: '6px',
                  padding: '0.15rem 0.5rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Anket Yönetimi
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Admin toggle - subtle, at bottom of header */}
        <button
          onClick={toggleAdmin}
          title={isAdmin ? 'Admin modundan çık' : 'Admin moduna geç'}
          style={{
            fontSize: '0.65rem',
            color: isAdmin ? '#7c3aed' : '#94a3b8',
            background: isAdmin ? 'rgba(124,58,237,0.08)' : 'transparent',
            border: `1px solid ${isAdmin ? 'rgba(124,58,237,0.2)' : 'transparent'}`,
            borderRadius: '4px',
            padding: '0.15rem 0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            letterSpacing: '0.03em',
            alignSelf: 'flex-start',
            transition: 'all 0.2s',
          }}
        >
          {isAdmin ? '👑 Sistem Yöneticisi' : '👤 Kullanıcı'}
        </button>
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
