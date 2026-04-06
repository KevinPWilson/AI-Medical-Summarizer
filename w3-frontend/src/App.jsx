import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import your modular components
import HistoryModal from './components/HistoryModal';
import RecordsPanel from './components/RecordsPanel';
import ChatPanel from './components/ChatPanel';

export default function App() {
  // Core Data States
  const [files, setFiles]       = useState([]);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  
  // Chat States
  const [history, setHistory]   = useState([]);
  const [question, setQuestion] = useState('');
  const [chatLoad, setChatLoad] = useState(false);
  
  // Layout & Feature States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Lazy initialize localStorage history
  const [savedSummaries, setSavedSummaries] = useState(() => {
    const saved = localStorage.getItem('medHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const inputRef = useRef(null);
  const endRef   = useRef(null);

  // Auto-scroll chat when history updates or chat opens
  useEffect(() => {
    if (isChatOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isChatOpen]);

  // Auto-save history to browser memory whenever it changes
  useEffect(() => {
    localStorage.setItem('medHistory', JSON.stringify(savedSummaries));
  }, [savedSummaries]);

  // --- Handlers ---

  const handleChange = e => {
    setFiles(Array.from(e.target.files || []));
    setError('');
  };

  const handleUpload = async () => {
    if (!files.length) return;
    const fd = new FormData();
    files.forEach(f => fd.append('documents', f));
    
    setLoading(true); 
    setError(''); 
    setSummary(null); 
    setHistory([]);
    setIsChatOpen(false); 
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (!data.isValid) {
        setError(data.errorMessage || 'Validation failed.');
      } else {
        setSummary(data.summary);
        setHistory([{ role: 'ai', text: '✓ Records verified. Ask me anything about this patient.' }]);
        
        // Save to History Log
        const newRecord = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          fileNames: files.map(f => f.name).join(', '),
          summary: data.summary
        };
        setSavedSummaries(prev => [newRecord, ...prev]);
      }
    } catch {
      setError('Server error — could not process documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const q = question; 
    setQuestion('');
    setHistory(h => [...h, { role: 'user', text: q }]);
    setChatLoad(true);
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/ask', { question: q });
      setHistory(h => [...h, { role: 'ai', text: data.answer }]);
    } catch {
      setHistory(h => [...h, { role: 'ai', text: 'Connection lost. Please retry.' }]);
    } finally {
      setChatLoad(false);
    }
  };

  // History Actions
  const handleLoadHistory = (item) => {
    setSummary(item.summary);
    setFiles([]); // Clear file inputs
    setHistory([{ role: 'ai', text: `✓ Loaded record from ${item.date}. Note: Follow-up chat is disabled for historical records.` }]);
    setIsHistoryModalOpen(false);
  };

  const handleDeleteHistory = (id) => {
    setSavedSummaries(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      <header className="global-header">
        <div className="header-brand">
          <h1>✨ Medical Record Summarizer</h1>
          <p>AI-Powered Clinical Extraction & Analysis Tool</p>
        </div>
        <button className="btn-history" onClick={() => setIsHistoryModalOpen(true)}>
          🕒 History Log <span className="badge">{savedSummaries.length}</span>
        </button>
      </header>

      <div className={`app ${isChatOpen ? 'chat-open' : 'chat-closed'}`}>
        
        <RecordsPanel
          files={files}
          onChange={handleChange}
          onUpload={handleUpload}
          loading={loading}
          error={error}
          inputRef={inputRef}
          summary={summary}
        />

        {isChatOpen && (
          <ChatPanel
            history={history}
            loading={chatLoad}
            question={question}
            setQuestion={setQuestion}
            onAsk={handleAsk}
            onSuggest={q => setQuestion(q)}
            endRef={endRef}
            active={!!summary}
            onClose={() => setIsChatOpen(false)}
          />
        )}

        {summary && !isChatOpen && (
          <button className="floating-chat-btn" onClick={() => setIsChatOpen(true)}>
            <div className="live-dot" style={{ boxShadow: 'none' }} />
            ✨ Ask MedAI
          </button>
        )}

      </div>

      {isHistoryModalOpen && (
        <HistoryModal 
          summaries={savedSummaries} 
          onClose={() => setIsHistoryModalOpen(false)} 
          onLoad={handleLoadHistory}
          onDelete={handleDeleteHistory}
        />
      )}
    </>
  );
}