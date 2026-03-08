import { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface Survey {
    Id: string;
    Title: string;
}

interface Institution {
    Id: string;
    Name: string;
    Phone: string;
}

export default function Dispatch() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [selectedSurvey, setSelectedSurvey] = useState<string>('');
    const [selectedInst, setSelectedInst] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [survRes, instRes] = await Promise.all([
                    fetch('http://localhost:5001/api/surveys'),
                    fetch('http://localhost:5001/api/institutions')
                ]);
                const survData = await survRes.json();
                const instData = await instRes.json();
                setSurveys(survData);
                setInstitutions(instData);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const getSelectedSurveyTitle = () => surveys.find(s => s.Id === selectedSurvey)?.Title || '';
    const getSelectedInstData = () => institutions.find(i => i.Id === selectedInst);

    const generateWhatsAppLink = () => {
        const inst = getSelectedInstData();
        if (!inst || !selectedSurvey) return '';

        const surveyUrl = `http://localhost:5173/s/${selectedSurvey}`;
        const message = `Merhaba ${inst.Name},\n\nSizin için hazırladığımız "${getSelectedSurveyTitle()}" anketini aşağıdaki bağlantıdan doldurabilirsiniz:\n\n${surveyUrl}\n\nTeşekkürler.`;

        // Clean phone number (simple version)
        const phone = inst.Phone.replace(/\D/g, '');
        const cleanPhone = phone.startsWith('0') ? '90' + phone.substring(1) : phone;

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    };

    const whatsappLink = generateWhatsAppLink();

    return (
        <div className="animate-fade-in slide-up">
            <div className="dash-header mb-8">
                <div className="flex items-center gap-3">
                    <div className="btn-icon-only" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 48, height: 48 }}>
                        <Send size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Anket Gönder</h1>
                        <p className="text-muted">Kurumlara anket bağlantısını WhatsApp üzerinden gönderin.</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Form Side */}
                    <div className="flex-col gap-6">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Gönderim Bilgileri</h2>

                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Anket Seçin</label>
                            <select
                                className="input-base"
                                value={selectedSurvey}
                                onChange={(e) => setSelectedSurvey(e.target.value)}
                            >
                                <option value="">-- Anket Seçin --</option>
                                {surveys.map(s => (
                                    <option key={s.Id} value={s.Id}>{s.Title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Kurum Seçin</label>
                            <select
                                className="input-base"
                                value={selectedInst}
                                onChange={(e) => setSelectedInst(e.target.value)}
                            >
                                <option value="">-- Kurum Seçin --</option>
                                {institutions.map(i => (
                                    <option key={i.Id} value={i.Id}>{i.Name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preview Side */}
                    <div className="flex-col gap-6">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Önizleme ve Gönderim</h2>

                        <div
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                padding: '2rem',
                                minHeight: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.01)',
                                textAlign: 'center'
                            }}
                        >
                            {selectedSurvey && selectedInst ? (
                                <div className="flex-col gap-4 items-center">
                                    <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left', maxWidth: '300px' }}>
                                        <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                                            {`Merhaba ${getSelectedInstData()?.Name},\n\n"${getSelectedSurveyTitle()}" anketini doldurabilirsiniz...`}
                                        </p>
                                    </div>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ background: '#25D366', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
                                    >
                                        <MessageCircle size={20} /> WhatsApp ile Gönder
                                    </a>
                                </div>
                            ) : (
                                <p className="text-muted">Lütfen anket ve kurum seçin.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
