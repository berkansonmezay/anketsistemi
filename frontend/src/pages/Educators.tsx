import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Phone, Mail, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';

interface Educator {
    Id: string;
    Name: string;
    Email: string;
    Phone: string | null;
    Branch: string | null;
    CreatedAt: string;
    IsActive?: boolean;
    HasAccount?: boolean;
}

export default function Educators() {
    const [educators, setEducators] = useState<Educator[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Password: '',
        IsActive: true
    });

    const fetchEducators = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/educators');
            const data = await response.json();
            setEducators(data);
        } catch (error) {
            console.error('Error fetching educators:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/educators', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({ Name: '', Email: '', Phone: '', Password: '', IsActive: true });
                fetchEducators();
                alert('Eğitmen ve hesap başarıyla oluşturuldu.');
            } else {
                alert('Bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error saving educator:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu eğitimciyi silmek istediğinize emin misiniz?')) return;
        try {
            const response = await fetch(`http://localhost:5001/api/educators/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchEducators();
            } else {
                alert('Silinirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Error deleting educator:', error);
        }
    };

    useEffect(() => {
        fetchEducators();
    }, []);

    return (
        <div className="animate-fade-in slide-up flex-col gap-8">
            {/* Inline Add Form Section */}
            <div className="glass-panel p-8">
                <div className="mb-6">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Yeni Eğitmen Ekle</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Sisteme yeni bir eğitmen kaydı oluşturun. Otomatik olarak giriş hesabı da açılır.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-col gap-6">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Ad Soyad *</label>
                            <input
                                required
                                type="text"
                                className="input-base"
                                placeholder="Eğitmen adı"
                                value={formData.Name}
                                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                            />
                        </div>
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>E-posta (Giriş İçin) *</label>
                            <input
                                required
                                type="email"
                                className="input-base"
                                placeholder="egitmen@edesis.com"
                                value={formData.Email}
                                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                            />
                        </div>
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Telefon</label>
                            <input
                                type="text"
                                className="input-base"
                                placeholder="05XX XXX XX XX"
                                value={formData.Phone}
                                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                            />
                        </div>
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>Şifre</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-base w-full"
                                    placeholder="••••••••••"
                                    value={formData.Password}
                                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Eğitmen bu şifre ile giriş yapacak. Sonra Ayarlar'dan değiştirebilir.</span>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="btn" style={{ background: '#0d9488', color: 'white', padding: '0.75rem 2rem' }}>
                            Eğitmen + Hesap Oluştur
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="flex-col gap-4">
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Eğitmenler</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Kayıtlı eğitmenlerin listesi</p>
                </div>

                <div className="flex-col gap-3">
                    {loading ? (
                        <div className="glass-panel p-8 text-center text-muted">Yükleniyor...</div>
                    ) : educators.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-muted">Henüz eğitimci bulunmuyor.</div>
                    ) : (
                        educators.map((edu) => (
                            <div key={edu.Id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="flex-col gap-1">
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', textTransform: 'uppercase' }}>{edu.Name}</div>
                                    <div style={{ display: 'flex', gap: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} /> {edu.Email}
                                        </div>
                                        {edu.Phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} /> {edu.Phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <span style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3b82f6',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <UserCheck size={14} /> Hesap Var
                                        </span>
                                        <span style={{
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10b981',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <ShieldCheck size={14} /> Aktif
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="action-btn action-btn-blue"
                                            onClick={() => alert('Düzenleme özelliği yakında eklenecek.')}
                                        >
                                            <Edit2 size={14} /> Düzenle
                                        </button>
                                        <button
                                            className="action-btn action-btn-red"
                                            onClick={() => handleDelete(edu.Id)}
                                            title="Sil"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
