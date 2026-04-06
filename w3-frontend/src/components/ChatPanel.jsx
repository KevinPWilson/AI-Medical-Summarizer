// ══════════════════════════════════
// RIGHT — CHAT PANEL
// ══════════════════════════════════

const SUGGESTED = [
  'What medications were prescribed?',
  'When is the follow-up?',
  'Any drug interactions?',
  'Explain the diagnosis simply',
];


export default function ChatPanel({ history, loading, question, setQuestion, onAsk, onSuggest, endRef, active, onClose }) {
  return (
    <div className="panel panel-right">
      <div className="panel-hdr">
        <span className="panel-title">AI Follow-Up</span>
        <button className="btn-close-chat" onClick={onClose} title="Close AI">✕</button>
      </div>

      <div className="chat-status">
        <div className="live-grp">
          <div className="live-dot" />
          {active ? 'Session active' : 'Awaiting records'}
        </div>
        <div className="sec-note">🔒 Contextual only</div>
      </div>

      <div className="chat-msgs">
        {history.length === 0 ? (
          <div className="chat-empty">
            <div className="ce-ic">🤖</div>
            <div className="ce-h">MedAI Assistant</div>
            <div className="ce-sub">Ask me anything about the extracted records</div>
            {active && (
              <div className="sq-row">
                {SUGGESTED.map((q, i) => (
                  <div key={i} className="sq" onClick={() => onSuggest(q)}>{q}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {history.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="msg-who">{m.role === 'user' ? 'You' : 'MedAI'}</div>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg ai">
                <div className="msg-who">MedAI</div>
                <div className="bubble">
                  <div className="tdots"><span/><span/><span/></div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat-inp-row">
        <input
          className="chat-inp"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAsk()}
          placeholder={active ? 'Ask about the records…' : 'Upload records first…'}
          disabled={!active || loading}
        />
        <button
          className="btn-send"
          onClick={onAsk}
          disabled={!active || loading || !question.trim()}
        >
          Send ↑
        </button>
      </div>
    </div>
  );
}