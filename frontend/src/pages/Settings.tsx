import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Bell, Palette, Shield, Database, Save, UserCircle, Trash2, Plus } from 'lucide-react';
import { periodService } from '../utils/periodService';
import type { Period } from '../utils/periodService';

export default function SettingsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    // Profile
    const [profile, setProfile] = useState({ name: 'Admin Kullanıcı', email: 'admin@example.com', phone: '05551234567', role: 'Yönetici' });

    // Notifications
    const [notifications, setNotifications] = useState({ emailOnResponse: true, emailOnComplete: true, whatsappNotify: false, weeklyReport: true });

    // Appearance
    const [appearance, setAppearance] = useState({ primaryColor: '#6366f1', language: 'tr', fontSize: 'normal' });

    // Security
    const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '30' });

    // Survey defaults
    const [surveyDefaults, setSurveyDefaults] = useState({ defaultRequired: false, showProgressBar: true, allowAnonymous: true, responseLimit: '' });

    // Educators
    const [educators, setEducators] = useState([
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '05551112233', branch: 'Matematik' },
        { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', phone: '05554445566', branch: 'Fen Bilimleri' },
    ]);
    const [newEdu, setNewEdu] = useState({ name: '', email: '', phone: '', branch: '' });

    // Periods (Dönemler)
    const [periods, setPeriods] = useState<Period[]>(periodService.getPeriods());
    const [newPeriod, setNewPeriod] = useState<Omit<Period, 'id'>>({ name: '', startDate: '', endDate: '', isActive: false });
    const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);

    // Persist periods whenever they change
    useEffect(() => {
        periodService.savePeriods(periods);
    }, [periods]);

    const handleAddPeriod = () => {
        if (!newPeriod.name) return;
        const id = Math.max(0, ...periods.map(p => p.id)) + 1;

        // If the new period is set as active, deactivate others
        const updatedPeriods = newPeriod.isActive
            ? periods.map(p => ({ ...p, isActive: false }))
            : periods;

        setPeriods([...updatedPeriods, { ...newPeriod, id } as Period]);
        setNewPeriod({ name: '', startDate: '', endDate: '', isActive: false });
    };

    const handleUpdatePeriod = (id: number) => {
        const p = periods.find(p => p.id === id);
        if (p) {
            setEditingPeriodId(id);
            setNewPeriod({ name: p.name, startDate: p.startDate, endDate: p.endDate, isActive: p.isActive });
        }
    };

    const handleSaveUpdate = () => {
        if (editingPeriodId === null) return;

        // If the updated period is set as active, deactivate others
        const updatedPeriods = newPeriod.isActive
            ? periods.map(p => ({ ...p, isActive: false }))
            : periods;

        setPeriods(updatedPeriods.map(p => p.id === editingPeriodId ? { ...newPeriod, id: editingPeriodId } as Period : p));
        setEditingPeriodId(null);
        setNewPeriod({ name: '', startDate: '', endDate: '', isActive: false });
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="dash-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                    <h1 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Ayarlar</h1>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{
                    height: '2px',
                    flex: 1,
                    background: 'linear-gradient(90deg, #e2e8f0 0%, rgba(226, 232, 240, 0) 100%)',
                    borderRadius: '2px'
                }}></div>
            </div>


            {/* Content */}
            <div className="glass-panel slide-up" style={{ padding: '2rem' }}>

                {/* Profile */}
                {activeTab === 'profile' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={20} /> Profil Bilgileri</h2>
                        <div className="flex-col gap-4">
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Ad Soyad</label>
                                <input className="input-base" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                            </div>
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>E-posta</label>
                                    <input className="input-base" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Telefon</label>
                                    <input className="input-base" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Rol</label>
                                <input className="input-base" value={profile.role} disabled style={{ opacity: 0.6 }} />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Profil kaydedildi!')}><Save size={16} /> Kaydet</button>
                    </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} /> Bildirim Ayarları</h2>
                        <div className="flex-col gap-4">
                            {[
                                { key: 'emailOnResponse' as const, label: 'Yeni yanıt geldiğinde e-posta gönder', desc: 'Her yeni anket yanıtı için bildirim alın' },
                                { key: 'emailOnComplete' as const, label: 'Anket tamamlandığında e-posta gönder', desc: 'Anket yanıt hedefine ulaştığında bildirim alın' },
                                { key: 'whatsappNotify' as const, label: 'WhatsApp bildirimleri', desc: 'Önemli güncellemeler için WhatsApp bildirimi alın' },
                                { key: 'weeklyReport' as const, label: 'Haftalık rapor gönder', desc: 'Her Pazartesi özet rapor e-postası alın' },
                            ].map(item => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={notifications[item.key]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Appearance */}
                {activeTab === 'appearance' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={20} /> Görünüm Ayarları</h2>
                        <div className="flex-col gap-4">
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Ana Renk</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={appearance.primaryColor} onChange={e => setAppearance({ ...appearance, primaryColor: e.target.value })} style={{ width: 48, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }} />
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{appearance.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Dil</label>
                                <select className="input-base" style={{ width: 'auto' }} value={appearance.language} onChange={e => setAppearance({ ...appearance, language: e.target.value })}>
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Yazı Boyutu</label>
                                <select className="input-base" style={{ width: 'auto' }} value={appearance.fontSize} onChange={e => setAppearance({ ...appearance, fontSize: e.target.value })}>
                                    <option value="small">Küçük</option>
                                    <option value="normal">Normal</option>
                                    <option value="large">Büyük</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Görünüm ayarları kaydedildi!')}><Save size={16} /> Kaydet</button>
                    </div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={20} /> Güvenlik Ayarları</h2>
                        <div className="flex-col gap-4">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>İki Faktörlü Doğrulama</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hesabınıza ek güvenlik katmanı ekleyin</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={security.twoFactor} onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Oturum Zaman Aşımı (dakika)</label>
                                <select className="input-base" style={{ width: 'auto' }} value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })}>
                                    <option value="15">15 dakika</option>
                                    <option value="30">30 dakika</option>
                                    <option value="60">1 saat</option>
                                    <option value="120">2 saat</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Şifre Değiştir</label>
                                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                    <input className="input-base" type="password" placeholder="Mevcut şifre" style={{ flex: 1, minWidth: '160px' }} />
                                    <input className="input-base" type="password" placeholder="Yeni şifre" style={{ flex: 1, minWidth: '160px' }} />
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Güvenlik ayarları kaydedildi!')}><Save size={16} /> Kaydet</button>
                    </div>
                )}

                {/* Survey Defaults */}
                {activeTab === 'survey' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={20} /> Anket Varsayılanları</h2>
                        <div className="flex-col gap-4">
                            {[
                                { key: 'defaultRequired' as const, label: 'Soruları varsayılan olarak zorunlu yap', desc: 'Yeni eklenen sorular otomatik zorunlu olsun' },
                                { key: 'showProgressBar' as const, label: 'İlerleme çubuğu göster', desc: 'Anket doldururken ilerleme çubuğu gösterilsin' },
                                { key: 'allowAnonymous' as const, label: 'Anonim yanıtlara izin ver', desc: 'Katılımcılar kimlik bilgisi girmeden yanıt verebilsin' },
                            ].map(item => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.label}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={surveyDefaults[item.key]} onChange={() => setSurveyDefaults({ ...surveyDefaults, [item.key]: !surveyDefaults[item.key] })} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Maksimum Yanıt Limiti (boş = sınırsız)</label>
                                <input className="input-base" type="number" style={{ width: '200px' }} placeholder="Sınırsız" value={surveyDefaults.responseLimit} onChange={e => setSurveyDefaults({ ...surveyDefaults, responseLimit: e.target.value })} />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Anket ayarları kaydedildi!')}><Save size={16} /> Kaydet</button>
                    </div>
                )}

                {/* Period Management */}
                {activeTab === 'periods' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={20} /> Dönem Yönetimi</h2>

                        {/* Add/Edit Form */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'rgba(99,102,241,0.03)' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>{editingPeriodId ? 'Dönemi Düzenle' : 'Yeni Dönem Ekle'}</div>
                            <div className="flex-col gap-4">
                                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: '200px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dönem Adı *</label>
                                        <input className="input-base" placeholder="Örn: 2024-2025 Güz" value={newPeriod.name} onChange={e => setNewPeriod({ ...newPeriod, name: e.target.value })} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Başlangıç Tarihi</label>
                                        <input className="input-base" type="date" value={newPeriod.startDate} onChange={e => setNewPeriod({ ...newPeriod, startDate: e.target.value })} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bitiş Tarihi</label>
                                        <input className="input-base" type="date" value={newPeriod.endDate} onChange={e => setNewPeriod({ ...newPeriod, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <label className="toggle-switch sm">
                                        <input type="checkbox" checked={newPeriod.isActive} onChange={() => setNewPeriod({ ...newPeriod, isActive: !newPeriod.isActive })} />
                                        <span className="slider"></span>
                                    </label>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Aktif Dönem Olarak İşaretle</span>
                                </div>
                            </div>
                            <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                                {editingPeriodId ? (
                                    <>
                                        <button className="btn btn-primary" onClick={handleSaveUpdate}><Save size={16} /> Güncellemeyi Kaydet</button>
                                        <button className="btn btn-secondary" onClick={() => { setEditingPeriodId(null); setNewPeriod({ name: '', startDate: '', endDate: '', isActive: false }); }}>Vazgeç</button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleAddPeriod}><Plus size={16} /> Dönem Ekle</button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary)' }}>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>DÖNEM ADI</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>BAŞLANGIÇ</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>BİTİŞ</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>DURUM</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {periods.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                                            <td style={{ padding: '0.75rem' }}>{p.startDate || '-'}</td>
                                            <td style={{ padding: '0.75rem' }}>{p.endDate || '-'}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                {p.isActive ? (
                                                    <span className="badge badge-success">AKTİF</span>
                                                ) : (
                                                    <span className="badge" style={{ opacity: 0.5 }}>PASİF</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <div className="flex justify-center gap-1">
                                                    <button className="btn-ghost btn-icon-only" style={{ color: 'var(--primary)' }} onClick={() => handleUpdatePeriod(p.id)} title="Düzenle">
                                                        <Database size={16} />
                                                    </button>
                                                    <button className="btn-ghost btn-icon-only" style={{ color: '#ef4444' }} onClick={() => setPeriods(periods.filter(item => item.id !== p.id))} title="Sil">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Educators */}
                {activeTab === 'educators' && (
                    <div className="flex-col gap-6">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCircle size={20} /> Eğitimci Yönetimi</h2>

                        {/* Add Form */}
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'rgba(99,102,241,0.03)' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Yeni Eğitimci Ekle</div>
                            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                                <input className="input-base" placeholder="Ad Soyad *" style={{ flex: 1, minWidth: '160px' }} value={newEdu.name} onChange={e => setNewEdu({ ...newEdu, name: e.target.value })} />
                                <input className="input-base" placeholder="E-posta" style={{ flex: 1, minWidth: '160px' }} value={newEdu.email} onChange={e => setNewEdu({ ...newEdu, email: e.target.value })} />
                                <input className="input-base" placeholder="Telefon" style={{ flex: 1, minWidth: '140px' }} value={newEdu.phone} onChange={e => setNewEdu({ ...newEdu, phone: e.target.value })} />
                                <input className="input-base" placeholder="Branş" style={{ flex: 1, minWidth: '140px' }} value={newEdu.branch} onChange={e => setNewEdu({ ...newEdu, branch: e.target.value })} />
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => {
                                if (!newEdu.name.trim()) return;
                                setEducators([...educators, { id: Date.now(), ...newEdu }]);
                                setNewEdu({ name: '', email: '', phone: '', branch: '' });
                            }}><Plus size={16} /> Eğitimci Ekle</button>
                        </div>

                        {/* List */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--primary)' }}>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>AD SOYAD</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>E-POSTA</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>TELEFON</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>BRANŞ</th>
                                        <th style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>İŞLEM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {educators.map(edu => (
                                        <tr key={edu.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.75rem', fontWeight: 600 }}>{edu.name}</td>
                                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{edu.email}</td>
                                            <td style={{ padding: '0.75rem' }}>{edu.phone}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 500 }}>{edu.branch}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <button className="btn-ghost btn-icon-only" style={{ color: '#ef4444' }} onClick={() => setEducators(educators.filter(e => e.id !== edu.id))}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {educators.length === 0 && (
                                        <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz eğitimci eklenmemiş.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
