import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function FillSurvey() {
    const { id } = useParams();
    const [currentSection, setCurrentSection] = useState(0);

    // Load preview data if navigating to /s/preview, otherwise use mock data
    const [survey] = useState(() => {
        if (id === 'preview') {
            const saved = localStorage.getItem('previewSurvey');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return {
            title: 'Müşteri Memnuniyeti Anketi',
            description: 'Değerli müşterimiz, hizmetlerimizi iyileştirmek için lütfen bu kısa anketi doldurun.',
            sections: [
                {
                    title: 'Kişisel Bilgiler',
                    description: 'Size daha iyi hitap edebilmek için iletişim bilgileriniz.',
                    questions: [
                        { id: 'q1', type: 'short', text: 'Adınız Soyadınız', required: true },
                        { id: 'q2', type: 'multiple_choice', text: 'Yaş Aralığınız', options: ['18-24', '25-34', '35-44', '45+'], required: true },
                        { id: 'q3', type: 'date', text: 'Doğum Tarihiniz', required: false },
                    ]
                },
                {
                    title: 'Hizmet Değerlendirmesi',
                    description: 'Lütfen aldığınız hizmeti değerlendirin.',
                    questions: [
                        { id: 'q4', type: 'rating', text: 'Genel Memnuniyet Puanınız', required: true },
                        { id: 'q5', type: 'paragraph', text: 'Eklemek istediğiniz görüş/önerileriniz', required: false },
                    ]
                }
            ]
        };
    });

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);

    const section = survey.sections[currentSection];

    const handleNext = () => {
        // Validate required fields here normally
        if (currentSection < survey.sections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            setSubmitted(true);
        }
    };

    const handlePrev = () => {
        if (currentSection > 0) setCurrentSection(currentSection - 1);
    };

    if (submitted) {
        return (
            <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel slide-up">
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Yanıtınız kaydedildi</h1>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Anketimize katıldığınız için teşekkür ederiz.</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Yeni Yanıt Gönder</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '768px', margin: '2rem auto', padding: '0 1rem' }} className="animate-fade-in">
            <div className="glass-panel" style={{ borderTop: '10px solid var(--primary)', padding: '2.5rem', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{survey.title}</h1>
                <p className="text-muted" style={{ fontSize: '1rem' }}>{survey.description}</p>
                <div style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    * Gerekli alanları gösterir
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, background: 'var(--border-color)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${((currentSection + 1) / survey.sections.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>
                <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sayfa {currentSection + 1} / {survey.sections.length}</span>
            </div>

            {survey.sections.length > 1 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{section.title}</h2>
                    {section.description && <p className="text-muted">{section.description}</p>}
                </div>
            )}

            {section.questions.map((q: any) => (
                <div key={q.id} className="glass-panel slide-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.5rem' }}>
                        {q.text} {q.required && <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>*</span>}
                    </div>

                    {q.type === 'short' && (
                        <input
                            type="text"
                            className="input-base"
                            placeholder="Yanıtınız"
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        />
                    )}

                    {q.type === 'paragraph' && (
                        <textarea
                            className="input-base"
                            placeholder="Uzun yanıtınız"
                            rows={4}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        />
                    )}

                    {q.type === 'multiple_choice' && (
                        <div className="flex-col gap-4">
                            {q.options?.map((opt: string, i: number) => (
                                <label key={i} className="flex items-center gap-3" style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}>
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                                    />
                                    <span style={{ fontSize: '1rem' }}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === 'date' && (
                        <input
                            type="date"
                            className="input-base"
                            style={{ width: 'auto' }}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        />
                    )}

                    {q.type === 'rating' && (() => {
                        const labels = ['', 'Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Mükemmel'];
                        const val = answers[q.id] || 0;
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setAnswers({ ...answers, [q.id]: star })}
                                            style={{
                                                fontSize: '2.4rem', lineHeight: 1, cursor: 'pointer',
                                                filter: val >= star
                                                    ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))'
                                                    : 'grayscale(1) opacity(0.3)',
                                                transform: val >= star ? 'scale(1.1)' : 'scale(1)',
                                                transition: 'all 0.15s',
                                            }}
                                        >⭐</span>
                                    ))}
                                </div>
                                {val > 0 && (
                                    <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>{labels[val]}</span>
                                )}
                            </div>
                        );
                    })()}

                    {q.type === 'linear_scale' && (
                        <div className="flex items-center gap-6 mt-4" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                            {q.options?.[2] && (
                                <span className="text-muted" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{q.options[2]}</span>
                            )}
                            <div className="flex gap-4">
                                {Array.from({ length: (parseInt(q.options?.[1] || '5') - parseInt(q.options?.[0] || '1')) + 1 }, (_, i) => i + parseInt(q.options?.[0] || '1')).map(val => (
                                    <label key={val} className="flex-col items-center gap-2" style={{ cursor: 'pointer', minWidth: '40px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 500, color: answers[q.id] === String(val) ? 'var(--primary)' : 'var(--text-main)' }}>{val}</span>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={String(val)}
                                            checked={answers[q.id] === String(val)}
                                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                            style={{ width: 18, height: 18, accentColor: 'var(--primary)', margin: 0 }}
                                        />
                                    </label>
                                ))}
                            </div>
                            {q.options?.[3] && (
                                <span className="text-muted" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{q.options[3]}</span>
                            )}
                        </div>
                    )}

                    {/* Other types omitted for brevity, logic follows the same pattern */}

                    {q.type === 'emoji' && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {[
                                { value: 1, emoji: '😠', label: 'Çok Kötü' },
                                { value: 2, emoji: '😐', label: 'Kötü' },
                                { value: 3, emoji: '😑', label: 'Orta' },
                                { value: 4, emoji: '🙂', label: 'İyi' },
                                { value: 5, emoji: '🤩', label: 'Mükemmel' },
                            ].map(opt => {
                                const selected = answers[q.id] === opt.value;
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                            background: selected ? 'rgba(99,102,241,0.08)' : '#f8fafc',
                                            borderRadius: '12px', padding: '0.85rem 1rem',
                                            minWidth: '72px', cursor: 'pointer',
                                            border: selected ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <span style={{ fontSize: '2rem', lineHeight: 1 }}>{opt.emoji}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: selected ? 700 : 500, color: selected ? 'var(--primary)' : '#475569' }}>{opt.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginBottom: '4rem' }}>
                <div style={{ flex: 1 }}>
                    {currentSection > 0 && (
                        <button className="btn btn-secondary" onClick={handlePrev}>Geri</button>
                    )}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button className="btn btn-ghost" onClick={() => setAnswers({})}>Formu Temizle</button>
                    <button className="btn btn-primary" onClick={handleNext}>
                        {currentSection === survey.sections.length - 1 ? 'Gönder' : 'İleri'}
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Bu form <strong>SurveyFlow</strong> sisteminde oluşturulmuştur. Kötüye kullanım bildirin.
            </div>
        </div>
    );
}
