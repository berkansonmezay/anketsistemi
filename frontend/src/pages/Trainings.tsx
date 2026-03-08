import { useState, useEffect } from 'react';
import { ChevronRight, UserCircle, Send, CheckCircle2, MoreVertical, X, MessageCircle } from 'lucide-react';
import { periodService } from '../utils/periodService';
import type { Period } from '../utils/periodService';

interface TrainingPlan {
    id: number;
    institutionName: string;
    responsible: string;
    phone: string;
    date: string;
    time: string;
    educator: { name: string; color: string };
    program: { name: string; color: string };
    content: { name: string; color: string }[];
    status: 'Yapıldı' | 'İptal' | 'Planlandı';
    statusColor: string;
    details?: string;
}

const mockTrainingPlans: TrainingPlan[] = [
    {
        id: 1, institutionName: 'TFR OKULU', responsible: 'AHMET HOCA', phone: '05321021010',
        date: '13.03.2026', time: '15:00',
        educator: { name: 'Berkan Bey', color: '#8b4513' },
        program: { name: 'ALPEMIX', color: '#ec4899' },
        content: [{ name: 'KAYIT MODÜLÜ', color: '#6366f1' }, { name: 'SINAV MODÜLÜ', color: '#ec4899' }],
        status: 'Yapıldı', statusColor: '#10b981'
    },
    {
        id: 2, institutionName: 'KÖŞK İYİ DERSLER', responsible: '-', phone: '(501) 036 20 62',
        date: '07.03.2026', time: '11:00',
        educator: { name: 'Berkan Bey', color: '#8b4513' },
        program: { name: 'ALPEMIX', color: '#ec4899' },
        content: [{ name: 'KAYIT MODÜLÜ', color: '#6366f1' }, { name: 'SINAV MODÜLÜ', color: '#ec4899' }],
        status: 'İptal', statusColor: '#ef4444',
        details: 'detaylı anlatım.'
    },
    {
        id: 3, institutionName: 'QAZ KOLEJİ', responsible: 'AYSE', phone: '-',
        date: '07.03.2026', time: '10:00',
        educator: { name: 'Ahmet Bey', color: '#84cc16' },
        program: { name: 'ZOOM', color: '#3b82f6' },
        content: [{ name: 'KAYIT MODÜLÜ', color: '#6366f1' }, { name: 'SINAV MODÜLÜ', color: '#ec4899' }, { name: 'ANALİZ MODÜLÜ', color: '#10b981' }],
        status: 'Planlandı', statusColor: '#f59e0b'
    },
    {
        id: 4, institutionName: 'ATAFEN LİSESİ', responsible: 'Ayça Var', phone: '05452012010',
        date: '05.03.2026', time: '17:28',
        educator: { name: 'Berkan Bey', color: '#8b4513' },
        program: { name: 'GOOGLE MEET', color: '#10b981' },
        content: [{ name: 'KAYIT MODÜLÜ', color: '#6366f1' }, { name: 'SINAV MODÜLÜ', color: '#ec4899' }, { name: 'ANALİZ MODÜLÜ', color: '#10b981' }],
        status: 'Yapıldı', statusColor: '#10b981'
    }
];

export default function Trainings() {
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(mockTrainingPlans);
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

    // Filters
    const [tpFilterInst, setTpFilterInst] = useState('');
    const [tpFilterEdu, setTpFilterEdu] = useState('');
    const [tpFilterProg, setTpFilterProg] = useState('');
    const [tpFilterStatus, setTpFilterStatus] = useState('');

    const filteredTPs = trainingPlans.filter(tp => {
        if (tpFilterInst && !tp.institutionName.toLowerCase().includes(tpFilterInst.toLowerCase())) return false;
        if (tpFilterEdu && tp.educator.name !== tpFilterEdu) return false;
        if (tpFilterProg && tp.program.name !== tpFilterProg) return false;
        if (tpFilterStatus && tp.status !== tpFilterStatus) return false;
        return true;
    });

    return (
        <div className="animate-fade-in flex-col gap-6" style={{ paddingBottom: '3rem' }}>
            {/* Header Area */}
            <header className="dash-header flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.4rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.25rem' }}>🎓</span>
                    <h1 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Eğitimler</h1>
                </div>

                <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
                    <div className="flex items-center gap-3">
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748b' }}>DÖNEM:</span>
                        <div style={{ position: 'relative' }}>
                            <select className="input-base" style={{ padding: '0.5rem 2.5rem 0.5rem 1rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px', background: 'white', border: '1px solid #e5e7eb', appearance: 'none' }} value={period} onChange={e => setPeriod(e.target.value)}>
                                {periods.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                            <ChevronRight size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', color: '#64748b' }} />
                        </div>
                    </div>
                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem', textDecoration: 'underline', color: 'var(--primary)', fontWeight: 600 }}>Şablonu İndir</button>
                    <button className="btn" style={{ background: '#e0e7ff', color: '#4f46e5', fontWeight: 600, border: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px' }}>Excel'den İçe Aktar</button>
                    <button className="btn" style={{ background: '#dcfce7', color: '#166534', fontWeight: 600, border: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px' }}>Excel'e Aktar</button>
                    <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: 600 }}>Eğitim Planla</button>
                </div>
            </header>

            {/* Filter Section */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '35px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', color: '#1f2937' }}>Hızlı Filtrele</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <input className="input-base" placeholder="Kurum Ara..." value={tpFilterInst} onChange={e => setTpFilterInst(e.target.value)} style={{ borderRadius: '12px' }} />
                    <select className="input-base" value={tpFilterEdu} onChange={e => setTpFilterEdu(e.target.value)} style={{ borderRadius: '12px' }}>
                        <option value="">Tüm Eğitimciler</option>
                        <option value="Berkan Bey">Berkan Bey</option>
                        <option value="Ahmet Bey">Ahmet Bey</option>
                    </select>
                    <select className="input-base" value={tpFilterProg} onChange={e => setTpFilterProg(e.target.value)} style={{ borderRadius: '12px' }}>
                        <option value="">Tüm Programlar</option>
                        <option value="ALPEMIX">ALPEMIX</option>
                        <option value="ZOOM">ZOOM</option>
                        <option value="GOOGLE MEET">GOOGLE MEET</option>
                    </select>
                    <select className="input-base" value={tpFilterStatus} onChange={e => setTpFilterStatus(e.target.value)} style={{ borderRadius: '12px' }}>
                        <option value="">Tüm Süreçler</option>
                        <option value="Yapıldı">Yapıldı</option>
                        <option value="İptal">İptal</option>
                        <option value="Planlandı">Planlandı</option>
                    </select>
                    <input className="input-base" type="date" placeholder="Başlangıç Tarihi" style={{ borderRadius: '12px' }} />
                    <input className="input-base" type="date" placeholder="Bitiş Tarihi" style={{ borderRadius: '12px' }} />
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '20px' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['KURUM ADI / SORUMLU', 'TARİH / SAAT v', 'EĞİTİMCİ', 'PROGRAM', 'EĞİTİM İÇERİĞİ', 'SÜREÇ DURUMU', 'İŞLEMLER'].map((h, i) => (
                                    <th key={h} style={{ padding: '1.25rem 1rem', fontWeight: 800, color: '#334155', fontSize: '0.8rem', letterSpacing: '0.025em', textAlign: i >= 5 ? 'center' : 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTPs.map((tp) => (
                                <tr key={tp.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                                    <td style={{ padding: '1.25rem 1rem', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#b45309' }}></div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', textTransform: 'uppercase' }}>{tp.institutionName}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                                <UserCircle size={14} /> {tp.responsible}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                                <Send size={14} style={{ transform: 'rotate(-45deg)', opacity: 0.6 }} /> {tp.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{tp.date}</div>
                                        <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{tp.time}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#1e293b' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: tp.educator.color }}></div>
                                            {tp.educator.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '12px', background: tp.program.color + '20', color: tp.program.color,
                                            fontSize: '0.65rem', fontWeight: 800, border: `1px solid ${tp.program.color}40`, textTransform: 'uppercase'
                                        }}>
                                            {tp.program.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                {tp.content.map((c, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '0.2rem 0.6rem', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1',
                                                        fontSize: '0.65rem', fontWeight: 800, border: '1px solid #bae6fd'
                                                    }}>
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                            {tp.details && (
                                                <div style={{
                                                    background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem',
                                                    color: '#64748b', borderLeft: '3px solid #e2e8f0', width: 'fit-content'
                                                }}>
                                                    {tp.details}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                        <span style={{
                                            background: tp.statusColor + '15',
                                            color: tp.statusColor,
                                            padding: '0.3rem 0.8rem',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            borderRadius: '12px'
                                        }}>{tp.status}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                            <button style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }} title="Tamamlandı"><CheckCircle2 size={20} /></button>
                                            <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} title="İptal Et"><X size={20} /></button>
                                            <button style={{ color: '#25D366', background: 'none', border: 'none', cursor: 'pointer' }} title="WhatsApp"><MessageCircle size={20} /></button>
                                            <button style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }} title="Diğer"><MoreVertical size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
