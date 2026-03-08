import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, Eye, Share2, LayoutTemplate, Trash2, Copy, Clock, Power, BarChart3 } from 'lucide-react';
import QuestionEditor, { type Question } from '../components/QuestionEditor';

interface SavedSurvey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    isTemplate: boolean;
    isActive: boolean;
    createdAt: string;
    welcomeMessage?: string;
    thankYouMessage?: string;
    expiryDate?: string | null;
}

// Helper to load surveys from localStorage
function loadSurveys(): SavedSurvey[] {
    try {
        const data = localStorage.getItem('savedSurveys');
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function saveSurveysToStorage(surveys: SavedSurvey[]) {
    localStorage.setItem('savedSurveys', JSON.stringify(surveys));
}

export default function CreateSurvey() {
    const [savedSurveys, setSavedSurveys] = useState<SavedSurvey[]>(loadSurveys());
    const [activeSurvey, setActiveSurvey] = useState<SavedSurvey | null>(null);
    const [editingQuestions, setEditingQuestions] = useState<Question[]>([]);
    const [surveyTitle, setSurveyTitle] = useState('Anket Başlığı');
    const [surveyDesc, setSurveyDesc] = useState('Anket açıklaması buraya gelecek...');
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [thankYouMessage, setThankYouMessage] = useState('');
    const [expiryDate, setExpiryDate] = useState<string | null>(null);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

    // New Template Form State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTemplateData, setNewTemplateData] = useState({
        title: '',
        description: '',
        welcomeMessage: '',
        thankYouMessage: '',
        expiryDate: ''
    });

    // Sync localStorage
    useEffect(() => {
        saveSurveysToStorage(savedSurveys);
    }, [savedSurveys]);

    const createNewSurvey = () => {
        setNewTemplateData({
            title: '',
            description: '',
            welcomeMessage: '',
            thankYouMessage: '',
            expiryDate: ''
        });
        setShowCreateModal(true);
    };

    const confirmCreateSurvey = () => {
        if (!newTemplateData.title) {
            alert('Lütfen şablon adını giriniz.');
            return;
        }

        const newSurvey: SavedSurvey = {
            id: uuidv4(),
            title: newTemplateData.title,
            description: newTemplateData.description || 'Anket açıklaması buraya gelecek...',
            questions: [
                { id: uuidv4(), type: 'rating', text: 'Eğitimi nasıl buldunuz?', required: true }
            ],
            isTemplate: true,
            isActive: false,
            createdAt: new Date().toISOString(),
            welcomeMessage: newTemplateData.welcomeMessage,
            thankYouMessage: newTemplateData.thankYouMessage,
            expiryDate: newTemplateData.expiryDate || null
        };
        setSavedSurveys([newSurvey, ...savedSurveys]);
        loadSurveyToEditor(newSurvey);
        setShowCreateModal(false);
    };

    const loadSurveyToEditor = (survey: SavedSurvey) => {
        setActiveSurvey(survey);
        setSurveyTitle(survey.title);
        setSurveyDesc(survey.description);
        setEditingQuestions(survey.questions);
        setWelcomeMessage(survey.welcomeMessage || '');
        setThankYouMessage(survey.thankYouMessage || '');
        setExpiryDate(survey.expiryDate || null);
        if (survey.questions.length > 0) {
            setActiveQuestionId(survey.questions[0].id);
        }
    };

    const addQuestion = () => {
        const newQ: Question = {
            id: uuidv4(),
            type: 'text',
            text: '',
            required: false
        };
        setEditingQuestions([...editingQuestions, newQ]);
        setActiveQuestionId(newQ.id);
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setEditingQuestions(editingQuestions.map(q => q.id === id ? { ...q, ...updates } : q));
    };

    const removeQuestion = (id: string) => {
        setEditingQuestions(editingQuestions.filter(q => q.id !== id));
    };

    const saveCurrentChanges = () => {
        if (!activeSurvey) return;

        const updatedSurveys = savedSurveys.map(s => {
            if (s.id === activeSurvey.id) {
                return {
                    ...s,
                    title: surveyTitle,
                    description: surveyDesc,
                    questions: editingQuestions,
                    welcomeMessage: welcomeMessage,
                    thankYouMessage: thankYouMessage,
                    expiryDate: expiryDate
                };
            }
            return s;
        });
        setSavedSurveys(updatedSurveys);
        alert('Anket kaydedildi!');
    };

    const toggleActive = (id: string) => {
        const target = savedSurveys.find(s => s.id === id);
        if (!target) return;
        if (!target.isActive) {
            // Activating: deactivate all others first
            setSavedSurveys(savedSurveys.map(s => ({ ...s, isActive: s.id === id })));
        } else {
            // Deactivating: just toggle off
            setSavedSurveys(savedSurveys.map(s => s.id === id ? { ...s, isActive: false } : s));
        }
    };

    const copySurvey = (survey: SavedSurvey) => {
        const newSurvey: SavedSurvey = {
            ...survey,
            id: uuidv4(),
            title: `${survey.title} (Kopya)`,
            createdAt: new Date().toISOString(),
            isActive: false
        };
        setSavedSurveys([newSurvey, ...savedSurveys]);
        alert('Anket kopyalandı.');
    };

    const deleteSurvey = (id: string) => {
        if (confirm('Bu anketi silmek istediğinize emin misiniz?')) {
            setSavedSurveys(savedSurveys.filter(s => s.id !== id));
            if (activeSurvey?.id === id) {
                setActiveSurvey(null);
                setEditingQuestions([]);
            }
        }
    };

    return (
        <div className="flex-col gap-6 animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>

            {/* Top Header Section */}
            <div className="flex justify-between items-center">
                <div className="dash-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '1.25rem' }}>📝</span>
                        <h1 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Anket Tasarlama</h1>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={createNewSurvey} style={{ borderRadius: '12px', fontWeight: 600 }}>
                    <Plus size={18} /> Yeni Şablon
                </button>
            </div>

            <div className="flex gap-6" style={{ height: '100%', overflow: 'hidden' }}>

                {/* Left Sidebar: Template Cards */}
                <div style={{ width: '310px', overflowY: 'auto', paddingRight: '0.4rem' }} className="flex-col gap-4">
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                        <BarChart3 size={18} className="text-gray-800" />
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                            Şablonlar ({savedSurveys.length})
                        </span>
                    </div>

                    {savedSurveys.map(s => (
                        <div
                            key={s.id}
                            className={`template-card ${s.isActive ? 'active-status' : ''} ${activeSurvey?.id === s.id ? 'selected' : ''}`}
                            onClick={() => loadSurveyToEditor(s)}
                            style={{
                                padding: '1.25rem',
                                border: s.isActive ? '2px solid #10b981' : '2px solid #ef4444',
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', flex: 1 }}>{s.title}</div>
                                {s.isActive && (
                                    <span style={{
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        color: '#10b981',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        marginLeft: '0.4rem'
                                    }}>
                                        AKTİF
                                    </span>
                                )}
                            </div>
                            <div className="text-muted mb-4" style={{ fontSize: '0.8rem', lineHeight: '1.5', color: '#64748b' }}>
                                {s.description.substring(0, 60)}{s.description.length > 60 ? '...' : ''}
                            </div>
                            <div className="flex-col" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', gap: '0.6rem' }}>
                                <div className="flex" style={{ gap: '0.75rem' }}>
                                    <button
                                        className={`action-btn ${s.isActive ? 'action-btn-red' : 'action-btn-green'}`}
                                        onClick={(e) => { e.stopPropagation(); toggleActive(s.id); }}
                                    >
                                        <Power size={12} /> {s.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                                    </button>

                                    <button
                                        className="action-btn action-btn-blue"
                                        onClick={(e) => { e.stopPropagation(); copySurvey(s); }}
                                    >
                                        <Copy size={12} /> Kopyala
                                    </button>

                                    <button
                                        className="action-btn action-btn-red"
                                        onClick={(e) => { e.stopPropagation(); deleteSurvey(s.id); }}
                                    >
                                        <Trash2 size={12} /> Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {savedSurveys.length === 0 && (
                        <div className="text-center p-8 text-muted" style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                            Henüz şablon yok. "+ Yeni Şablon" butonuyla başlayın.
                        </div>
                    )}
                </div>

                {/* Main Content: Survey Editor */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 4rem 1rem' }} className="flex-col gap-6">
                    {activeSurvey ? (
                        <>
                            {/* Survey Header Info */}
                            <div className="glass-panel p-8 rounded-2xl" style={{ background: 'white', borderTop: '8px solid var(--primary)' }}>
                                <input
                                    type="text"
                                    className="input-ghost"
                                    value={surveyTitle}
                                    onChange={e => setSurveyTitle(e.target.value)}
                                    style={{ fontSize: '1.75rem', fontWeight: 800, width: '100%', marginBottom: '0.5rem' }}
                                />
                                <textarea
                                    className="input-ghost"
                                    value={surveyDesc}
                                    onChange={e => setSurveyDesc(e.target.value)}
                                    style={{ width: '100%', color: 'var(--text-muted)', fontSize: '1rem' }}
                                    rows={1}
                                />

                                {/* Karşılama ve Teşekkür Alanları */}
                                <div className="flex-col gap-4 mt-6">
                                    <div className="karşılama-box flex-col gap-2" style={{ borderLeft: '4px solid #3b82f6' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.4rem', borderRadius: '50%' }}>
                                                <Share2 size={16} />
                                            </span>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Karşılama Mesajı</span>
                                        </div>
                                        <textarea
                                            className="input-ghost w-full"
                                            placeholder="Ankete başlangıç mesajı..."
                                            value={welcomeMessage}
                                            onChange={e => setWelcomeMessage(e.target.value)}
                                            style={{ fontSize: '0.9rem', color: '#475569' }}
                                        />
                                    </div>

                                    <div className="karşılama-box flex-col gap-2" style={{ borderLeft: '4px solid #10b981' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem', borderRadius: '50%' }}>
                                                <Plus size={16} />
                                            </span>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Teşekkür Mesajı</span>
                                        </div>
                                        <textarea
                                            className="input-ghost w-full"
                                            placeholder="Anketi tamamlama mesajı..."
                                            value={thankYouMessage}
                                            onChange={e => setThankYouMessage(e.target.value)}
                                            style={{ fontSize: '0.9rem', color: '#475569' }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-muted" style={{ minWidth: '150px' }}>
                                            <Clock size={18} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Son Tarih:</span>
                                        </div>
                                        <input
                                            type="datetime-local"
                                            className="input-ghost"
                                            value={expiryDate || ''}
                                            onChange={e => setExpiryDate(e.target.value || null)}
                                            style={{ fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Questions List */}
                            <div className="flex-col gap-4">
                                {editingQuestions.map((q) => (
                                    <QuestionEditor
                                        key={q.id}
                                        question={q}
                                        isActive={activeQuestionId === q.id}
                                        onClick={() => setActiveQuestionId(q.id)}
                                        updateQuestion={updateQuestion}
                                        removeQuestion={removeQuestion}
                                        availableQuestions={editingQuestions}
                                    />
                                ))}

                                <button
                                    className="btn btn-ghost w-full py-4 text-primary"
                                    style={{ border: '2px dashed var(--primary)', background: 'rgba(99, 102, 241, 0.02)', fontSize: '1rem', fontWeight: 700 }}
                                    onClick={addQuestion}
                                >
                                    <Plus size={20} /> Yeni Soru Ekle
                                </button>
                            </div>

                            {/* Floating Save Button Area */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        // Write current editor state (including unsaved changes) to localStorage
                                        const previewData = {
                                            title: surveyTitle,
                                            description: surveyDesc,
                                            sections: [{
                                                title: surveyTitle,
                                                description: surveyDesc,
                                                questions: editingQuestions.map(q => ({
                                                    id: q.id,
                                                    type: q.type === 'rating' ? 'rating'
                                                        : q.type === 'text' ? 'short'
                                                            : q.type === 'multiple_choice' ? 'multiple_choice'
                                                                : q.type === 'linear_scale' ? 'linear_scale'
                                                                    : 'short',
                                                    text: q.text,
                                                    options: q.options,
                                                    required: q.required,
                                                }))
                                            }]
                                        };
                                        localStorage.setItem('previewSurvey', JSON.stringify(previewData));
                                        window.open('/s/preview', '_blank');
                                    }}
                                >
                                    <Eye size={18} /> Ön İzleme
                                </button>
                                <button className="btn btn-primary px-8" onClick={saveCurrentChanges}>
                                    <Save size={18} /> Değişiklikleri Kaydet
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-col items-center justify-center p-12 text-center" style={{ minHeight: '400px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                            <LayoutTemplate size={60} className="text-muted mb-4" style={{ opacity: 0.2 }} />
                            <h2 className="text-muted">Düzenlemek için bir şablon seçin</h2>
                            <p className="text-muted max-w-sm">Sol taraftaki şablonlardan birine tıklayarak düzenlemeye başlayabilir veya yeni bir şablon oluşturabilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* NEW TEMPLATE MODAL */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>Yeni Anket Şablonu Oluştur</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Şablon Adı *</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Ör: Eğitim Memnuniyet Anketi"
                                    value={newTemplateData.title}
                                    onChange={e => setNewTemplateData({ ...newTemplateData, title: e.target.value })}
                                />
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Açıklama</label>
                                <input
                                    type="text"
                                    className="input-base"
                                    placeholder="Kısa açıklama"
                                    value={newTemplateData.description}
                                    onChange={e => setNewTemplateData({ ...newTemplateData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Karşılama Mesajı</label>
                                <textarea
                                    className="input-base"
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Ankete başlangıç mesajı..."
                                    value={newTemplateData.welcomeMessage}
                                    onChange={e => setNewTemplateData({ ...newTemplateData, welcomeMessage: e.target.value })}
                                />
                            </div>
                            <div className="flex-col gap-2">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Teşekkür Mesajı</label>
                                <textarea
                                    className="input-base"
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Anketi tamamlama mesajı..."
                                    value={newTemplateData.thankYouMessage}
                                    onChange={e => setNewTemplateData({ ...newTemplateData, thankYouMessage: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex-col gap-2" style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Son Tarih (Opsiyonel)</label>
                            <input
                                type="datetime-local"
                                className="input-base"
                                value={newTemplateData.expiryDate}
                                onChange={e => setNewTemplateData({ ...newTemplateData, expiryDate: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button className="btn btn-primary px-8" onClick={confirmCreateSurvey}>Oluştur</button>
                            <button className="btn btn-ghost px-8" onClick={() => setShowCreateModal(false)}>İptal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
