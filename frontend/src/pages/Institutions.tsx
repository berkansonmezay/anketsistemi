import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, MoreVertical, Upload, FileSpreadsheet } from 'lucide-react';
import { periodService } from '../utils/periodService';
import type { Period } from '../utils/periodService';

interface Institution {
    id: number;
    name: string;
    contact: string;
    phone: string;
    reference: string;
    package: string;
    packageColor: string;
    modules: { name: string; color: string }[];
    processStatus: string;
    processColor: string;
    training: boolean;
    notes: string;
}

const mockInstitutions: Institution[] = [
    {
        id: 1, name: 'ABC KURUMU', contact: 'AHMET VATANSEVER', phone: '5401201002',
        reference: 'ŞÜKRÜ BEY', package: 'PREMİUM PAKET', packageColor: '#10b981',
        modules: [
            { name: 'KAYIT MODÜLÜ', color: '#6366f1' },
            { name: 'SINAV MODÜLÜ', color: '#f59e0b' },
        ],
        processStatus: 'DEMO SÜRÜMÜ', processColor: '#6366f1', training: false, notes: ''
    },
    {
        id: 2, name: 'ALİ İHSAN HAYIRLIOĞLU ORTAOKULU', contact: 'VELİ HOCA', phone: '5456021024',
        reference: 'ALİ BEY', package: 'PREMİUM PAKET', packageColor: '#10b981',
        modules: [],
        processStatus: 'DEMO SÜRÜMÜ', processColor: '#6366f1', training: false, notes: ''
    },
    {
        id: 3, name: 'ATA LİSESİ', contact: 'MEHMET KAYA', phone: '05051234567',
        reference: 'ALİ RIZA BEY', package: 'PREMİUM PAKET', packageColor: '#10b981',
        modules: [
            { name: 'KAYIT MODÜLÜ', color: '#6366f1' },
            { name: 'SINAV MODÜLÜ', color: '#f59e0b' },
            { name: 'ANALİZ MODÜLÜ', color: '#ef4444' },
            { name: 'ÖDEV MODÜLÜ', color: '#10b981' },
            { name: 'DERS PLANLAMA MODÜLÜ', color: '#8b5cf6' },
            { name: 'SORU HAVUZU MODÜLÜ', color: '#06b6d4' },
        ],
        processStatus: 'YENİ KURUM', processColor: '#10b981', training: false, notes: 'test test test test test\ntest test test'
    },
    {
        id: 4, name: 'ATAFEN LİSESİ', contact: 'MEHMET KAYA', phone: '05051234567',
        reference: 'ALİ RIZA BEY', package: 'ANALİZ PAKET', packageColor: '#3b82f6',
        modules: [
            { name: 'KAYIT MODÜLÜ', color: '#6366f1' },
            { name: 'SINAV MODÜLÜ', color: '#f59e0b' },
            { name: 'ANALİZ MODÜLÜ', color: '#ef4444' },
            { name: 'ÖDEV MODÜLÜ', color: '#10b981' },
            { name: 'DERS PLANLAMA MODÜLÜ', color: '#8b5cf6' },
            { name: 'SORU HAVUZU MODÜLÜ', color: '#06b6d4' },
        ],
        processStatus: 'DEMO SÜRÜMÜ', processColor: '#6366f1', training: false, notes: 'test test test test test\ntest test test'
    },
];

const PACKAGE_OPTIONS = ['PREMİUM PAKET', 'ANALİZ PAKET', 'BAŞLANGIÇ PAKET'];
const PROCESS_OPTIONS = ['DEMO SÜRÜMÜ', 'YENİ KURUM', 'AKTİF', 'PASİF'];

export default function Institutions() {
    const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions);
    const [periods, setPeriods] = useState<Period[]>(periodService.getPeriods());
    const [period, setPeriod] = useState(periodService.getActivePeriod()?.name || (periods[0]?.name || ''));

    // Listen for global updates
    useEffect(() => {
        const handleUpdate = () => {
            const newPeriods = periodService.getPeriods();
            setPeriods(newPeriods);
            if (!newPeriods.find(p => p.name === period)) {
                setPeriod(periodService.getActivePeriod()?.name || (newPeriods[0]?.name || ''));
            }
        };
        window.addEventListener('periodsUpdated', handleUpdate);
        return () => window.removeEventListener('periodsUpdated', handleUpdate);
    }, [period]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Filters for Institutions
    const [filterName, setFilterName] = useState('');
    const [filterContact, setFilterContact] = useState('');
    const [filterRef, setFilterRef] = useState('');
    const [filterPackage, setFilterPackage] = useState('');
    const [filterProcess, setFilterProcess] = useState('');

    // New institution form
    const [newInst, setNewInst] = useState({
        name: '', contact: '', phone: '', reference: '', package: 'PREMİUM PAKET',
        processStatus: 'YENİ KURUM', notes: ''
    });

    const filteredInstitutions = institutions.filter(inst => {
        if (filterName && !inst.name.toLowerCase().includes(filterName.toLowerCase())) return false;
        if (filterContact && !inst.contact.toLowerCase().includes(filterContact.toLowerCase())) return false;
        if (filterRef && !inst.reference.toLowerCase().includes(filterRef.toLowerCase())) return false;
        if (filterPackage && inst.package !== filterPackage) return false;
        if (filterProcess && inst.processStatus !== filterProcess) return false;
        return true;
    });

    const handleAdd = () => {
        if (!newInst.name.trim()) return;
        const processColorMap: Record<string, string> = {
            'DEMO SÜRÜMÜ': '#6366f1', 'YENİ KURUM': '#10b981', 'AKTİF': '#3b82f6', 'PASİF': '#9ca3af'
        };
        const packageColorMap: Record<string, string> = {
            'PREMİUM PAKET': '#10b981', 'ANALİZ PAKET': '#3b82f6', 'BAŞLANGIÇ PAKET': '#f59e0b'
        };
        setInstitutions([...institutions, {
            id: institutions.length + 1,
            name: newInst.name.toUpperCase(),
            contact: newInst.contact.toUpperCase(),
            phone: newInst.phone,
            reference: newInst.reference.toUpperCase(),
            package: newInst.package,
            packageColor: packageColorMap[newInst.package] || '#6366f1',
            modules: [],
            processStatus: newInst.processStatus,
            processColor: processColorMap[newInst.processStatus] || '#6366f1',
            training: false,
            notes: newInst.notes
        }]);
        setNewInst({ name: '', contact: '', phone: '', reference: '', package: 'PREMİUM PAKET', processStatus: 'YENİ KURUM', notes: '' });
        setShowAddModal(false);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
            {/* --- INSTITUTIONS SECTION --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="dash-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏢</span>
                        <h1 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Kurumlar</h1>
                    </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-1rem">
                    <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', marginLeft: 'auto' }}>
                        <div className="flex items-center gap-2">
                            <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>DÖNEM:</span>
                            <select className="input-base" style={{ width: 'auto', padding: '0.5rem 1rem' }} value={period} onChange={e => setPeriod(e.target.value)}>
                                {periods.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
                            <Download size={16} /> Şablonu İndir
                        </button>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
                            <Upload size={16} /> Excel'den İçe Aktar
                        </button>
                        <button className="btn btn-secondary" style={{ color: '#10b981', borderColor: '#10b981' }}>
                            <FileSpreadsheet size={16} /> Excel'e Aktar
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} /> Yeni Kurum Ekle
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                        <Filter size={18} className="text-muted" />
                        <span style={{ fontWeight: 600 }}>Hızlı Filtrele</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input className="input-base" placeholder="Kurum Adı..." style={{ flex: 1, minWidth: '140px' }} value={filterName} onChange={e => setFilterName(e.target.value)} />
                        <input className="input-base" placeholder="Yetkili Adı..." style={{ flex: 1, minWidth: '140px' }} value={filterContact} onChange={e => setFilterContact(e.target.value)} />
                        <select className="input-base" style={{ flex: 1, minWidth: '160px' }} value={filterRef} onChange={e => setFilterRef(e.target.value)}>
                            <option value="">Tüm Referanslar</option>
                            {[...new Set(institutions.map(i => i.reference))].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select className="input-base" style={{ flex: 1, minWidth: '150px' }} value={filterPackage} onChange={e => setFilterPackage(e.target.value)}>
                            <option value="">Tüm Paketler</option>
                            {PACKAGE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select className="input-base" style={{ flex: 1, minWidth: '150px' }} value={filterProcess} onChange={e => setFilterProcess(e.target.value)}>
                            <option value="">Tüm Süreçler</option>
                            {PROCESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: 'rgba(99, 102, 241, 0.08)' }}>
                                    {['NO', 'KURUM ADI', 'YETKİLİ', 'TELEFON', 'REFERANS', 'SATIN ALINAN PAKET', 'AKTİF KULLANILAN MODÜLLER', 'SÜREÇ DURUMU', 'EĞİTİM', 'NOTLAR', 'İŞLEMLER'].map(h => (
                                        <th key={h} style={{ padding: '1rem 0.75rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: '2px solid var(--primary)', fontSize: '0.75rem', letterSpacing: '0.03em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInstitutions.map((inst) => (
                                    <tr key={inst.id} className="hover-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{inst.id}</td>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: 700, minWidth: '140px' }}>{inst.name}</td>
                                        <td style={{ padding: '1rem 0.75rem', minWidth: '130px' }}>{inst.contact}</td>
                                        <td style={{ padding: '1rem 0.75rem', whiteSpace: 'nowrap' }}>{inst.phone}</td>
                                        <td style={{ padding: '1rem 0.75rem', color: 'var(--primary)', fontWeight: 500 }}>{inst.reference}</td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                                                background: inst.packageColor + '18', color: inst.packageColor, fontWeight: 700, fontSize: '0.7rem',
                                                letterSpacing: '0.02em', border: `1px solid ${inst.packageColor}40`, whiteSpace: 'nowrap'
                                            }}>
                                                {inst.package}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', maxWidth: '260px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {inst.modules.map((m, i) => (
                                                    <span key={i} style={{
                                                        display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)',
                                                        background: m.color + '18', color: m.color, fontWeight: 600, fontSize: '0.65rem',
                                                        border: `1px solid ${m.color}40`, whiteSpace: 'nowrap'
                                                    }}>
                                                        {m.name}
                                                    </span>
                                                ))}
                                                {inst.modules.length === 0 && <span className="text-muted" style={{ fontSize: '0.75rem' }}>—</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                                                background: inst.processColor + '15', color: inst.processColor, fontWeight: 700, fontSize: '0.7rem',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {inst.processStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                                            <input type="checkbox" checked={inst.training} onChange={() => {
                                                setInstitutions(institutions.map(i => i.id === inst.id ? { ...i, training: !i.training } : i));
                                            }} style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }} />
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', maxWidth: '180px', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
                                            {inst.notes || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                                            <button className="btn-ghost btn-icon-only">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInstitutions.length === 0 && (
                                    <tr>
                                        <td colSpan={11} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <Search size={32} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
                                            <div>Filtrelerinize uygun kurum bulunamadı.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAddModal(false)}>
                    <div className="glass-panel slide-up" style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: 'white' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Yeni Kurum Ekle</h2>
                        <div className="flex-col gap-4">
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <input className="input-base" placeholder="Kurum Adı *" style={{ flex: 1, minWidth: '200px' }} value={newInst.name} onChange={e => setNewInst({ ...newInst, name: e.target.value })} />
                                <input className="input-base" placeholder="Yetkili Adı" style={{ flex: 1, minWidth: '200px' }} value={newInst.contact} onChange={e => setNewInst({ ...newInst, contact: e.target.value })} />
                            </div>
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <input className="input-base" placeholder="Telefon" style={{ flex: 1, minWidth: '200px' }} value={newInst.phone} onChange={e => setNewInst({ ...newInst, phone: e.target.value })} />
                                <input className="input-base" placeholder="Referans" style={{ flex: 1, minWidth: '200px' }} value={newInst.reference} onChange={e => setNewInst({ ...newInst, reference: e.target.value })} />
                            </div>
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <select className="input-base" style={{ flex: 1 }} value={newInst.package} onChange={e => setNewInst({ ...newInst, package: e.target.value })}>
                                    {PACKAGE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <select className="input-base" style={{ flex: 1 }} value={newInst.processStatus} onChange={e => setNewInst({ ...newInst, processStatus: e.target.value })}>
                                    {PROCESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <textarea className="input-base" placeholder="Notlar" rows={3} value={newInst.notes} onChange={e => setNewInst({ ...newInst, notes: e.target.value })} />
                            <div className="flex gap-4" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>İptal</button>
                                <button className="btn btn-primary" onClick={handleAdd}>Kaydet</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .hover-row:hover { background: rgba(0, 0, 0, 0.02); }
                .dash-header h1 { font-family: 'Inter', sans-serif; letter-spacing: -0.01em; }
            `}</style>
        </div>
    );
}
