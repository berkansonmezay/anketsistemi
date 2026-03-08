import { useState, useRef, useEffect } from 'react';
import { Trash2, Copy, CheckSquare, AlignLeft, Star, ToggleRight, ChevronDown, Grid3X3, CloudUpload, Plus, MoreVertical } from 'lucide-react';

export type QuestionType = 'rating' | 'text' | 'nps' | 'emoji' | 'boolean' | 'multiple_choice' | 'matrix' | 'linear_scale';

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options?: string[];
    required: boolean;
    conditional?: string | null;
}

const QUESTION_TYPES = [
    { id: 'rating', name: 'Yıldız Puanlama', icon: <Star size={18} className="qt-icon-star" /> },
    { id: 'text', name: 'Metin', icon: <AlignLeft size={18} className="qt-icon-text" /> },
    { id: 'nps', name: 'NPS', icon: <CloudUpload size={18} className="qt-icon-nps" /> },
    { id: 'emoji', name: 'Emoji', icon: <Star size={18} className="qt-icon-emoji" /> },
    { id: 'boolean', name: 'Evet/Hayır', icon: <ToggleRight size={18} className="qt-icon-check" /> },
    { id: 'multiple_choice', name: 'Çoklu Seçim', icon: <CheckSquare size={18} className="qt-icon-check" /> },
    { id: 'matrix', name: 'Matris', icon: <Grid3X3 size={18} className="qt-icon-grid" /> },
    { id: 'linear_scale', name: 'Ölçek', icon: <MoreVertical size={18} className="qt-icon-grid" /> },
];

interface Props {
    question: Question;
    updateQuestion: (id: string, updates: Partial<Question>) => void;
    removeQuestion: (id: string) => void;
    isActive: boolean;
    onClick: () => void;
    availableQuestions?: Question[];
}

export default function QuestionEditor({ question, updateQuestion, removeQuestion, isActive, onClick, availableQuestions = [] }: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedTypeObj = QUESTION_TYPES.find(qt => qt.id === question.type) || QUESTION_TYPES[0];

    return (
        <div
            className={`slide-up ${isActive ? 'question-active' : ''}`}
            onClick={onClick}
            style={{
                padding: isActive ? '2rem' : '1.5rem',
                transition: 'all 0.2s',
                marginBottom: '1rem',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'visible',
                position: 'relative',
                zIndex: isDropdownOpen ? 100 : (isActive ? 50 : 1),
                background: 'white',
                cursor: 'pointer',
            }}
        >
            <div className="flex-col gap-6">
                <div className="flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Plus size={20} className="text-primary" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{isActive ? 'Soru Editörü' : 'Soru'}</h3>
                    </div>

                    <div className="flex-col gap-2">
                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Soru Metni *</label>
                        <input
                            type="text"
                            className="input-base"
                            placeholder="Sorunuzu yazın..."
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {/* Soru Tipi */}
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Soru Tipi</label>
                            <div className="question-type-select" style={{ position: 'relative' }} ref={dropdownRef}>
                                <div
                                    className="input-base"
                                    onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                                    style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
                                >
                                    <div className="flex items-center" style={{ gap: '0.75rem' }}>
                                        <span style={{ display: 'flex' }}>{selectedTypeObj.icon}</span>
                                        <span style={{ fontSize: '0.9rem' }}>{selectedTypeObj.name}</span>
                                    </div>
                                    <ChevronDown size={16} className="text-muted" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, marginTop: '0.25rem', padding: '0.25rem 0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'white' }}>
                                        {QUESTION_TYPES.map((qt) => (
                                            <div
                                                key={qt.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuestion(question.id, { type: qt.id as QuestionType });
                                                    setIsDropdownOpen(false);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', cursor: 'pointer',
                                                    background: question.type === qt.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                                    color: question.type === qt.id ? 'var(--primary)' : 'var(--text-main)',
                                                    transition: 'background 0.1s'
                                                }}
                                            >
                                                <span style={{ display: 'flex' }}>{qt.icon}</span>
                                                <span style={{ fontSize: '0.85rem' }}>{qt.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Zorunlu mu? */}
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Zorunlu mu?</label>
                            <select
                                className="input-base"
                                style={{ padding: '0.6rem 0.75rem' }}
                                value={question.required ? 'true' : 'false'}
                                onChange={(e) => updateQuestion(question.id, { required: e.target.value === 'true' })}
                            >
                                <option value="false">Hayır (isteğe bağlı)</option>
                                <option value="true">Evet (zorunlu)</option>
                            </select>
                        </div>

                        {/* Koşullu Soru */}
                        <div className="flex-col gap-2">
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Koşullu Soru</label>
                            <select
                                className="input-base"
                                style={{ padding: '0.6rem 0.75rem' }}
                                value={question.conditional || ''}
                                onChange={(e) => updateQuestion(question.id, { conditional: e.target.value || null })}
                            >
                                <option value="">Koşul yok (her zaman göster)</option>
                                <option value="satisfaction">Neden memnun kalmadığınızı belirtir misiniz?</option>
                                <option value="presentation">Eğitmenin anlatımını nasıl buldunuz?</option>
                                <option value="content">Eğitim içeriği ihtiyaçlarınızı karşıladı mı?</option>
                                <option value="evaluation">Aşağıdaki konuları değerlendirin:</option>
                                <option value="recommendation">Bu eğitimi bir arkadaşınıza/meslektaşınıza tavsiye</option>
                                <option value="useful_topics">En faydalı bulduğunuz konular hangileri?</option>
                                <option value="feedback">Eklemek istediğiniz görüş ve öneriler:</option>
                                {availableQuestions
                                    .filter(q => q.id !== question.id) // Kendi kendine koşullu olmasın
                                    .map(q => (
                                        <option key={q.id} value={q.id}>
                                            {q.text || `İsimsiz Soru (${q.id.substring(0, 4)})`}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Question Preview/Options Area */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
                    {question.type === 'text' && (
                        <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '8px', padding: '0.75rem 1rem', background: 'white', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>Yanıtınızı buraya yazın...</div>
                    )}
                    {question.type === 'rating' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <span key={v} style={{ fontSize: '2.2rem', lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>⭐</span>
                                ))}
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>Mükemmel</span>
                        </div>
                    )}
                    {question.type === 'emoji' && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {[
                                { emoji: '😠', label: 'Çok Kötü' },
                                { emoji: '😐', label: 'Kötü' },
                                { emoji: '😑', label: 'Orta' },
                                { emoji: '🙂', label: 'İyi' },
                                { emoji: '🤩', label: 'Mükemmel' },
                            ].map(opt => (
                                <div key={opt.label} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    background: '#f8fafc', borderRadius: '12px', padding: '0.85rem 1rem',
                                    minWidth: '72px', border: '1px solid #e5e7eb', cursor: 'default', opacity: 0.8,
                                }}>
                                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{opt.emoji}</span>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#475569' }}>{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === 'boolean' && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#22c55e', color: 'white', fontWeight: 700, fontSize: '1.05rem', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'default', opacity: 0.9 }}>
                                <span style={{ fontSize: '1.3rem' }}>✅</span> Evet
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f1f5f9', color: '#374151', fontWeight: 700, fontSize: '1.05rem', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'default', opacity: 0.9 }}>
                                <span style={{ fontSize: '1.3rem' }}>❌</span> Hayır
                            </div>
                        </div>
                    )}
                    {(question.type === 'multiple_choice' || question.type === 'matrix') && (
                        <div className="flex-col gap-2">
                            {(question.options || []).map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--border-color)', flexShrink: 0 }}></div>
                                    <input
                                        type="text"
                                        className="input-ghost"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...(question.options || [])];
                                            newOpts[i] = e.target.value;
                                            updateQuestion(question.id, { options: newOpts });
                                        }}
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                    <button
                                        className="btn-ghost"
                                        style={{ color: '#ef4444', padding: 2 }}
                                        onClick={() => {
                                            const newOpts = (question.options || []).filter((_, idx) => idx !== i);
                                            updateQuestion(question.id, { options: newOpts });
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="btn-ghost"
                                style={{ color: 'var(--primary)', textAlign: 'left', padding: '0.5rem 0', fontSize: '0.9rem', fontWeight: 600 }}
                                onClick={() => updateQuestion(question.id, { options: [...(question.options || []), 'Yeni Seçenek'] })}
                            >
                                + Seçenek Ekle
                            </button>
                        </div>
                    )}
                    {question.type === 'linear_scale' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <div key={n} style={{ flex: 1, height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'default', opacity: 0.8 }}>{n}</div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                                <span>Hiç Memnun Değilim</span>
                                <span>Çok Memnunum</span>
                            </div>
                        </div>
                    )}
                    {question.type === 'nps' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                                    const bg = n <= 6 ? '#fef2f2' : n <= 8 ? '#fefce8' : '#f0fdf4';
                                    const color = n <= 6 ? '#ef4444' : n <= 8 ? '#ca8a04' : '#16a34a';
                                    return (
                                        <div key={n} style={{ flex: 1, height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `1.5px solid ${color}40`, borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color, cursor: 'default' }}>{n}</div>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                                <span>😟 Hiç Memnun Değilim</span>
                                <span>Çok Memnunum 😊</span>
                            </div>
                        </div>
                    )}
                </div>

                {isActive && (
                    <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>Soru ID: {question.id.substring(0, 8)}...</div>
                        <div className="flex gap-2">
                            <button className="btn btn-ghost btn-icon-only text-muted" onClick={(e) => { e.stopPropagation(); }} title="Kopyala"><Copy size={18} /></button>
                            <button className="btn btn-ghost btn-icon-only" style={{ color: '#ef4444' }} onClick={(e) => { e.stopPropagation(); removeQuestion(question.id); }} title="Sil"><Trash2 size={18} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
