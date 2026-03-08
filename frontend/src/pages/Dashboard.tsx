import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Copy, Share2, UserCircle, Building2, MessageCircle, CheckCircle2, Circle, Star, MessageSquare, ClipboardList, TrendingUp } from 'lucide-react';
import { periodService } from '../utils/periodService';
import type { Period } from '../utils/periodService';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line } from 'recharts';

// Analytics mock data
const monthlyTrendData = [
    { month: 'Oct', yanitSayisi: 0, ortPuan: 0 },
    { month: 'Nov', yanitSayisi: 0, ortPuan: 0 },
    { month: 'Dec', yanitSayisi: 0, ortPuan: 0 },
    { month: 'Jan', yanitSayisi: 1, ortPuan: 0.5 },
    { month: 'Feb', yanitSayisi: 5, ortPuan: 2 },
    { month: 'Mar', yanitSayisi: 4, ortPuan: 2.5 },
];

const performanceMockEducators = [
    { rank: 1, name: 'HASAN BEY', responses: 3, avgScore: 4.7, nps: 67, medal: '🥇' },
    { rank: 2, name: 'AHMET YILMAZ', responses: 8, avgScore: 4.5, nps: 55, medal: '🥈' },
    { rank: 3, name: 'AYŞE DEMİR', responses: 5, avgScore: 4.2, nps: 42, medal: '🥉' },
];

const performanceMockInstitutions = [
    { rank: 1, name: 'ABC KOLEJİ', responses: 12, avgScore: 4.8, nps: 72, medal: '🥇' },
    { rank: 2, name: 'XYZ LİSESİ', responses: 7, avgScore: 4.4, nps: 50, medal: '🥈' },
    { rank: 3, name: 'TFR OKULU', responses: 3, avgScore: 4.1, nps: 38, medal: '🥉' },
];

const sorularData = [
    { id: 1, soru: 'Eğitimi genel olarak nasıl değerlendirirsiniz?', yanitSayisi: 0 },
    { id: 2, soru: 'Neden memnun kalmadığınızı belirtir misiniz?', yanitSayisi: 0 },
    { id: 3, soru: 'Eğitimciyi tavsiye eder misiniz?', yanitSayisi: 2 },
];

const kurumMemnuniyetiData = [
    { avatar: '3', name: '365 gün eğitim kurumları', yanitSayisi: 0, avgScore: null },
    { avatar: 'A', name: 'ARTVİN 15 TEMMUZ ŞEHİTLERİ ANAD...', yanitSayisi: 0, avgScore: null },
    { avatar: 'B', name: 'BOLU ÇAYBAŞI KULÜBÜ', yanitSayisi: 3, avgScore: 4.7 },
];

const sonYanitlarData = [
    { avatar: 'A', respondent: 'Anonim', educator: 'HASAN BEY', institution: 'PERA EĞİTİM KURUMLARI', score: 4, maxScore: 5, date: '05.03.2026' },
    { avatar: 'A', respondent: 'Anonim', educator: 'HASAN BEY', institution: 'PERA EĞİTİM KURUMLARI', score: 5, maxScore: 5, date: '05.03.2026' },
    { avatar: 'A', respondent: 'Anonim', educator: 'HASAN BEY', institution: 'RB AKADEMİ', score: 5, maxScore: 5, date: '09.02.2026' },
];

function NpsGauge({ nps }: { nps: number }) {
    const radius = 54;
    const stroke = 10;
    const circumference = 2 * Math.PI * radius;
    // NPS is -100 to 100, normalize to 0-1 for display
    const normalized = Math.max(0, Math.min(100, (nps + 100) / 2)) / 100;
    const dash = circumference * normalized;
    const color = nps >= 50 ? '#10b981' : nps >= 0 ? '#f59e0b' : '#ef4444';
    const label = nps >= 70 ? '🚀 Mükemmel' : nps >= 50 ? '👍 İyi' : nps >= 30 ? '😐 Orta' : '😟 Zayıf';
    return (
        <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
            <svg width={140} height={140}>
                <circle cx={70} cy={70} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
                <circle cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{nps}</span>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.2rem' }}>NPS Skoru</span>
                <span style={{ fontSize: '0.65rem', color, fontWeight: 600, marginTop: '0.15rem' }}>{label}</span>
            </div>
        </div>
    );
}

// Mock data matching the requested schema
const mockSurveys = [
    { id: '1', title: 'Müşteri Memnuniyeti', status: true, responses: 124, created: '2023-10-15' },
    { id: '2', title: 'Çalışan Geri Bildirimi Q3', status: false, responses: 45, created: '2023-09-02' },
    { id: '3', title: 'Eğitimci ve Kurum Değerlendirmesi', status: true, responses: 890, created: '2023-11-20' },
];

const mockEducators = [
    { id: 'e1', name: 'Ahmet Yılmaz', nps: 75.4 }, // NPS typically ranges from -100 to 100
    { id: 'e2', name: 'Ayşe Demir', nps: 82.1 },
];

interface DashboardInstitution {
    id: string;
    name: string;
    educatorId: string;
    surveyId: string;
    status: string;
    phone: string;
}

const mockInstitutions: DashboardInstitution[] = [
    { id: 'i1', name: 'ABC Koleji', educatorId: 'e1', surveyId: '3', status: 'cevaplanmadi', phone: '905551112233' },
    { id: 'i2', name: 'XYZ Özel Başarı Lisesi', educatorId: 'e2', surveyId: '3', status: 'cevaplandi', phone: '905554445566' },
];


export default function Dashboard() {
    const [surveys, setSurveys] = useState(mockSurveys);
    const [educators, setEducators] = useState(mockEducators);
    const [institutions, setInstitutions] = useState<DashboardInstitution[]>(mockInstitutions);
    const [periods, setPeriods] = useState<Period[]>(periodService.getPeriods());
    const [period, setPeriod] = useState<string>(periodService.getActivePeriod()?.name || (periods[0]?.name || ''));

    // Listen for global updates
    useEffect(() => {
        const handleUpdate = () => {
            const newPeriods = periodService.getPeriods();
            setPeriods(newPeriods);
            // If current period no longer exists, reset to active or first
            if (!newPeriods.find(p => p.name === period)) {
                setPeriod(periodService.getActivePeriod()?.name || (newPeriods[0]?.name || ''));
            }
        };
        window.addEventListener('periodsUpdated', handleUpdate);
        return () => window.removeEventListener('periodsUpdated', handleUpdate);
    }, [period]);

    // Form states
    const [newEducatorName, setNewEducatorName] = useState('');
    const [newInst, setNewInst] = useState({ name: '', educatorId: '', surveyId: '', phone: '' });

    const toggleStatus = (id: string) => {
        setSurveys(surveys.map(s => s.id === id ? { ...s, status: !s.status } : s));
    };

    const handleAddEducator = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEducatorName.trim()) return;
        setEducators([...educators, { id: 'e' + Date.now(), name: newEducatorName, nps: 0 }]); // New educators start with 0 NPS until surveys are filled
        setNewEducatorName('');
    };

    const handleAddInstitution = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInst.name || !newInst.educatorId || !newInst.surveyId) return;
        setInstitutions([...institutions, {
            id: 'i' + Date.now(),
            name: newInst.name,
            educatorId: newInst.educatorId,
            surveyId: newInst.surveyId,
            phone: newInst.phone,
            status: 'cevaplanmadi' // Default status when sent
        }]);
        setNewInst({ name: '', educatorId: '', surveyId: '', phone: '' });
    };

    return (
        <div className="animate-fade-in flex-col gap-6">
            <header className="dash-header flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.4rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.25rem' }}>📊</span>
                    <h1 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Kokpit</h1>
                </div>

                <p className="text-muted m-0" style={{ flex: 1, marginLeft: '2rem' }}>Anketlerinizi yönetin, eğitimci ve kurum raporlarını analiz edin.</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>DÖNEM:</span>
                        <select className="input-base" style={{ width: 'auto', padding: '0.5rem 1rem' }} value={period} onChange={e => setPeriod(e.target.value)}>
                            {periods.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <Link to="/create" className="btn btn-primary">
                        <Plus size={20} /> Yeni Anket Oluştur
                    </Link>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}>
                {[
                    { icon: <Users size={24} />, value: educators.length, label: 'Toplam Eğitmen' },
                    { icon: <Building2 size={24} />, value: institutions.length, label: 'Toplam Kurum' },
                    { icon: <ClipboardList size={24} />, value: surveys.length, label: 'Toplam Anket' },
                    { icon: <MessageSquare size={24} />, value: surveys.reduce((s, sv) => s + sv.responses, 0), label: 'Toplam Yanıt' },
                    { icon: <Star size={24} />, value: '4.7 / 5', label: 'Ortalama Puan' },
                ].map((card, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 40, height: 40, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                            {card.icon}
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1 }}>{card.value}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Educators Matrix */}
                <div className="glass-panel slide-up" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <UserCircle className="text-primary" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Eğitimciler ve NPS Puanları</h2>
                    </div>

                    {/* Add Educator */}
                    <form onSubmit={handleAddEducator} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Yeni Eğitimci Adı"
                            className="input-base"
                            value={newEducatorName}
                            onChange={e => setNewEducatorName(e.target.value)}
                        />
                        <button type="submit" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Ekle</button>
                    </form>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Eğitimci</th>
                                <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>NPS Skoru</th>
                            </tr>
                        </thead>
                        <tbody>
                            {educators.map(edu => (
                                <tr key={edu.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{edu.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ flex: 1, background: 'var(--border-color)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                                                {/* Simulated NPS bar (NPS can be -100 to 100, normalize it for width: basic mapping for visual) */}
                                                <div style={{ width: `${Math.max(0, edu.nps)}%`, height: '100%', background: edu.nps > 50 ? '#10b981' : (edu.nps > 0 ? '#f59e0b' : '#ef4444') }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{edu.nps}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Institutions and Surveys */}
                <div className="glass-panel slide-up" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Building2 className="text-primary" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Kurumlar ve Gönderimler</h2>
                    </div>

                    {/* Add Institution */}
                    <form onSubmit={handleAddInstitution} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Kurum Adı"
                            className="input-base"
                            style={{ flex: 1, minWidth: '150px' }}
                            value={newInst.name}
                            onChange={e => setNewInst({ ...newInst, name: e.target.value })}
                        />
                        <select
                            className="input-base"
                            style={{ flex: 1, minWidth: '150px' }}
                            value={newInst.educatorId}
                            onChange={e => setNewInst({ ...newInst, educatorId: e.target.value })}
                        >
                            <option value="">Eğitimci Seç...</option>
                            {educators.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <select
                            className="input-base"
                            style={{ flex: 1, minWidth: '150px' }}
                            value={newInst.surveyId}
                            onChange={e => setNewInst({ ...newInst, surveyId: e.target.value })}
                        >
                            <option value="">Anket Seç...</option>
                            {surveys.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Telefon (WhatsApp)"
                            className="input-base"
                            style={{ flex: 1, minWidth: '150px' }}
                            value={newInst.phone}
                            onChange={e => setNewInst({ ...newInst, phone: e.target.value })}
                        />
                        <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Kurum Ekle & Gönderime Hazırla</button>
                    </form>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Kurum</th>
                                    <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Eğitimci</th>
                                    <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Durum</th>
                                    <th style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center' }}>WhatsApp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {institutions.map(inst => {
                                    const educator = educators.find(e => e.id === inst.educatorId);

                                    return (
                                        <tr key={inst.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-row">
                                            <td style={{ padding: '0.75rem', fontWeight: 600 }}>{inst.name}</td>
                                            <td style={{ padding: '0.75rem' }}>{educator?.name || '-'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {inst.status === 'cevaplandi' ? (
                                                    <div className="badge badge-success flex items-center gap-2" style={{ display: 'inline-flex' }}>
                                                        <CheckCircle2 size={14} /> Cevaplandı
                                                    </div>
                                                ) : (
                                                    <div className="badge" style={{ background: 'var(--border-color)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Circle size={14} /> Cevaplanmadı
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <button
                                                    className="btn-ghost btn-icon-only"
                                                    style={{ color: '#25D366', margin: '0 auto' }}
                                                    title="WhatsApp ile Gönder"
                                                    onClick={() => {
                                                        const link = `${window.location.origin}/s/${inst.surveyId}?inst=${inst.id}`;
                                                        const text = encodeURIComponent(`Merhaba ${inst.name} yetkilisi. ${educator?.name} adlı eğitimcimiz hakkındaki anketi doldurmak için tıklayınız: ${link}`);
                                                        window.open(`https://wa.me/${inst.phone}?text=${text}`, '_blank');
                                                    }}
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Surveys List Old Layout */}
            <div className="glass-panel slide-up" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Tüm Anketler</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Anket Başlığı</th>
                                <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Katılımcı</th>
                                <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Oluşturulma</th>
                                <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Yayında</th>
                                <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Genel Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {surveys.map(survey => (
                                <tr key={survey.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }} className="hover-row">
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{survey.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {survey.id}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={16} className="text-muted" /> {survey.responses}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{survey.created}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={survey.status} onChange={() => toggleStatus(survey.id)} />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-icon-only" title="Linki Kopyala" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/s/${survey.id}`)}>
                                                <Copy size={18} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon-only" title="WhatsApp'ta Paylaş" onClick={() => window.open(`https://wa.me/?text=Anketimize katılmak için tıklayın: ${window.location.origin}/s/${survey.id}`)}>
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── ANALYTICS SECTION ── */}

            {/* Row 1: NPS Skoru + Aylık Trend */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

                {/* NPS Skoru */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
                            <TrendingUp size={18} color="#10b981" /> NPS Skoru
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Net Promoter Score</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <NpsGauge nps={67} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            {[
                                { label: 'Promoter (9-10)', count: 2, pct: 66.7, color: '#10b981', emoji: '😊' },
                                { label: 'Passive (7-8)', count: 1, pct: 33.3, color: '#f59e0b', emoji: '😐' },
                                { label: 'Detractor (0-6)', count: 0, pct: 0, color: '#ef4444', emoji: '😟' },
                            ].map(r => (
                                <div key={r.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                        <span style={{ color: r.color, fontWeight: 600 }}>{r.emoji} {r.label}</span>
                                        <span style={{ fontWeight: 700 }}>{r.count} ({r.pct}%)</span>
                                    </div>
                                    <div style={{ height: '6px', borderRadius: '4px', background: '#e5e7eb', overflow: 'hidden' }}>
                                        <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>Toplam 3 yanıt</div>
                        </div>
                    </div>
                </div>

                {/* Aylık Trend */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
                            📈 Aylık Trend
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Yanıt sayısı ve ortalama puan</span>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={monthlyTrendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorYanit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.8rem', border: '1px solid #e2e8f0' }} />
                            <Area type="monotone" dataKey="yanitSayisi" name="Yanıt Sayısı" stroke="#10b981" strokeWidth={2} fill="url(#colorYanit)" dot={{ r: 3, fill: '#10b981' }} />
                            <Line type="monotone" dataKey="ortPuan" name="Ort. Puan" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Performans Sıralaması (full width) */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                {(() => {
                    const [perfView, setPerfView] = useState<'egitmen' | 'kurum'>('egitmen');
                    const data = perfView === 'egitmen' ? performanceMockEducators : performanceMockInstitutions;
                    return (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
                                    ⭐ Performans Sıralaması
                                </div>
                                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    {(['egitmen', 'kurum'] as const).map(v => (
                                        <button key={v} onClick={() => setPerfView(v)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: perfView === v ? '#10b981' : 'white', color: perfView === v ? 'white' : '#64748b', transition: 'all 0.15s' }}>
                                            {v === 'egitmen' ? 'Eğitmen' : 'Kurum'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {data.map(item => (
                                    <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '10px', background: '#f8fafc' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{item.medal}</span>
                                        <span style={{ fontWeight: 700, flex: 1 }}>{item.name}</span>
                                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item.responses} yanıt</span>
                                        <span style={{ fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>⭐ {item.avgScore}</span>
                                        <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>NPS: {item.nps}</span>
                                        <div style={{ width: '120px', height: '6px', borderRadius: '4px', background: '#e5e7eb', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.max(0, (item.nps + 100) / 2)}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    );
                })()}
            </div>

            {/* Row 3: Soru Bazlı Analiz + Kurum Memnuniyeti */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

                {/* Soru Bazlı Analiz */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
                        📋 Soru Bazlı Analiz
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {sorularData.map(s => (
                            <div key={s.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                                    ⭐ {s.id}. {s.soru}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.yanitSayisi} yanıt</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kurum Memnuniyeti */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
                        🏢 Kurum Memnuniyeti
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {kurumMemnuniyetiData.map((k, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>{k.avatar}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{k.yanitSayisi} yanıt</div>
                                </div>
                                {k.avgScore !== null
                                    ? <span style={{ fontWeight: 700, color: '#f59e0b', whiteSpace: 'nowrap' }}>⭐ {k.avgScore}</span>
                                    : <span style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>⭐ – Yanıt Yok</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 4: Eğitmen Performansı + Son Yanıtlar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

                {/* Eğitmen Performansı */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
                        <Users size={18} color="#10b981" /> Eğitmen Performansı
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {performanceMockEducators.map(item => (
                            <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.medal}</span>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', flexShrink: 0 }}>
                                    {item.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.responses} yanıt</div>
                                </div>
                                <span style={{ fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>⭐ {item.avgScore}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Son Yanıtlar */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
                            💬 Son Yanıtlar
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#94a3b8' }}>🕐 Canlı</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {sonYanitlarData.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(251,146,60,0.15)', color: '#f97316', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
                                    {r.avatar}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.respondent}</div>
                                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.educator} · {r.institution}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.88rem', background: r.score >= 5 ? '#dcfce7' : '#fef9c3', color: r.score >= 5 ? '#16a34a' : '#b45309', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>😊 {r.score}/{r.maxScore}</span>
                                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{r.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .hover-row:hover {
          background: rgba(0,0,0,0.02);
        }
      `}</style>
        </div>
    );
}
