import { useState } from 'react';
import { BarChart3, PieChart, Users, Clock, Star, ArrowLeft, Download, Search, LayoutGrid, List as ListIcon, Calendar, ArrowRight, MessageSquare } from 'lucide-react';

interface SurveyStats {
    id: string;
    title: string;
    description: string;
    responseCount: number;
    lastActivity: string;
    completionRate: number;
    avgTime: string;
    nps: number;
    questions: {
        id: string;
        text: string;
        type: string;
        data: { label: string; value: number }[] | string[];
    }[];
}

// Mock complex data for reports
const mockReports: SurveyStats[] = [
    {
        id: '1',
        title: 'Eğitmen Memnuniyet Anketi',
        description: 'Genel eğitim kalitesi ve eğitmen performansı değerlendirmesi.',
        responseCount: 156,
        lastActivity: 'Bugün, 14:30',
        completionRate: 94,
        avgTime: '3dk 12sn',
        nps: 82,
        questions: [
            {
                id: 'q1',
                text: 'Eğitmenin ders anlatımı ne kadar net?',
                type: 'rating',
                data: [
                    { label: '5 Yıldız', value: 85 },
                    { label: '4 Yıldız', value: 45 },
                    { label: '3 Yıldız', value: 15 },
                    { label: '2 Yıldız', value: 8 },
                    { label: '1 Yıldız', value: 3 },
                ]
            },
            {
                id: 'q2',
                text: 'Eğitimi başkalarına tavsiye eder misiniz?',
                type: 'boolean',
                data: [
                    { label: 'Evet', value: 142 },
                    { label: 'Hayır', value: 14 },
                ]
            },
            {
                id: 'q3',
                text: 'Eklemek istediğiniz görüşleriniz nelerdir?',
                type: 'text',
                data: [
                    'Harika bir eğitimdi, teşekkürler!',
                    'Eğitmen çok bilgiliydi fakat zaman yönetimi daha iyi olabilirdi.',
                    'Ders notları çok yardımcı oldu.',
                    'Uygulamalı örnekler biraz daha artırılabilir.',
                    'Kesinlikle tavsiye ediyorum.'
                ]
            }
        ]
    },
    {
        id: '2',
        title: 'Kurumsal Eğitim İhtiyaç Analizi',
        description: 'Yeni dönem eğitim programı öncesi ihtiyaç belirleme.',
        responseCount: 42,
        lastActivity: 'Dün, 11:20',
        completionRate: 88,
        avgTime: '5dk 45sn',
        nps: 65,
        questions: [
            {
                id: 'qa1',
                text: 'En çok hangi alanda kendinizi geliştirmek istersiniz?',
                type: 'multiple_choice',
                data: [
                    { label: 'Yazılım Geliştirme', value: 18 },
                    { label: 'Liderlik ve Yönetim', value: 12 },
                    { label: 'Veri Analizi', value: 8 },
                    { label: 'Pazarlama', value: 4 },
                ]
            }
        ]
    }
];

export default function Reports() {
    const [selectedSurvey, setSelectedSurvey] = useState<SurveyStats | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredSurveys = mockReports.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSurvey) {
        return (
            <div className="animate-fade-in slide-up flex-col gap-6">
                <header className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-4">
                        <button
                            className="btn btn-ghost btn-icon-only"
                            onClick={() => setSelectedSurvey(null)}
                            style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{selectedSurvey.title}</h1>
                            <p className="text-muted">{selectedSurvey.description}</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary">
                        <Download size={18} /> Raporu İndir
                    </button>
                </header>

                {/* Summary Stats */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div className="glass-panel p-6">
                        <div style={{ color: '#3b82f6', marginBottom: '0.5rem' }}><Users size={20} /></div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{selectedSurvey.responseCount}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Toplam Yanıt</div>
                    </div>
                    <div className="glass-panel p-6">
                        <div style={{ color: '#10b981', marginBottom: '0.5rem' }}><Star size={20} /></div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>%{selectedSurvey.completionRate}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Tamamlama Oranı</div>
                    </div>
                    <div className="glass-panel p-6">
                        <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}><Clock size={20} /></div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{selectedSurvey.avgTime}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Ort. Süre</div>
                    </div>
                    <div className="glass-panel p-6">
                        <div style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}><BarChart3 size={20} /></div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{selectedSurvey.nps}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>NPS Skoru</div>
                    </div>
                </div>

                {/* Question Details */}
                <div className="flex-col gap-6">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '1rem' }}>Soru Analizi</h2>

                    {selectedSurvey.questions.map((q, i) => (
                        <div key={q.id} className="glass-panel p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-col gap-1">
                                    <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>Soru {i + 1}</span>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{q.text}</h3>
                                </div>
                                <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                    {q.type.replace('_', ' ')}
                                </div>
                            </div>

                            {Array.isArray(q.data) && typeof q.data[0] === 'object' ? (
                                <div className="flex-col gap-4">
                                    {(q.data as { label: string; value: number }[]).map((item, idx) => (
                                        <div key={idx} className="flex-col gap-1.5">
                                            <div className="flex justify-between" style={{ fontSize: '0.9rem' }}>
                                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                                                <span style={{ fontWeight: 800 }}>{item.value} Yanıt</span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '10px',
                                                background: '#f1f5f9',
                                                borderRadius: 'var(--radius-full)',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${(item.value / selectedSurvey.responseCount) * 100}%`,
                                                    height: '100%',
                                                    background: 'var(--gradient-primary)',
                                                    borderRadius: 'inherit'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-col gap-3">
                                    {(q.data as string[]).map((resp, idx) => (
                                        <div key={idx} className="p-4" style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#4b5563', fontStyle: 'italic' }}>
                                            "{resp}"
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex-col gap-6">
            <header className="dash-header mb-8">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.25rem' }}>📈</span>
                    <h1 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Anket Raporları</h1>
                </div>
            </header>

            {/* Filters */}
            <div className="flex justify-between items-center gap-4">
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                        type="text"
                        placeholder="Anketlerde ara..."
                        className="input-base w-full"
                        style={{ paddingLeft: '40px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex glass-panel p-1" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <button
                        className={`btn btn-icon-only ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setViewMode('grid')}
                        style={{ padding: '0.5rem', borderRadius: 'calc(var(--radius-lg) - 4px)' }}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`btn btn-icon-only ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setViewMode('list')}
                        style={{ padding: '0.5rem', borderRadius: 'calc(var(--radius-lg) - 4px)' }}
                    >
                        <ListIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Survey List */}
            {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredSurveys.map(survey => (
                        <div
                            key={survey.id}
                            className="glass-panel hover-card"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => setSelectedSurvey(survey)}
                        >
                            <div className="flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div style={{
                                        padding: '0.75rem',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: '#6366f1',
                                        borderRadius: 'var(--radius-lg)'
                                    }}>
                                        <PieChart size={24} />
                                    </div>
                                    <div className="badge badge-success">{survey.responseCount} Yanıt</div>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>{survey.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', flex: 1 }}>{survey.description}</p>

                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        <Calendar size={14} /> {survey.lastActivity}
                                    </div>
                                    <div className="text-primary flex items-center gap-1" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                        İncele <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                                <th style={{ padding: '1.25rem', fontWeight: 700 }}>Anket Adı</th>
                                <th style={{ padding: '1.25rem', fontWeight: 700 }}>Yanıt Sayısı</th>
                                <th style={{ padding: '1.25rem', fontWeight: 700 }}>Son Etkinlik</th>
                                <th style={{ padding: '1.25rem', fontWeight: 700 }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSurveys.map(survey => (
                                <tr key={survey.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: 700 }}>{survey.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{survey.id}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={16} className="text-muted" /> {survey.responseCount}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: '#64748b' }}>{survey.lastActivity}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <button className="btn btn-ghost" onClick={() => setSelectedSurvey(survey)}>Raporu Gör</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-xl);
                    border-color: #6366f1;
                }
            `}</style>
        </div>
    );
}
