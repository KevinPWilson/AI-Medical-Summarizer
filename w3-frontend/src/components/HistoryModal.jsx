// ══════════════════════════════════
// HISTORY MODAL COMPONENT
// ══════════════════════════════════
export default function HistoryModal({ summaries, onClose, onLoad, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h2>🕒 Patient History Log</h2>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {summaries.length === 0 ? (
            <div className="empty-history">No previous summaries saved yet.</div>
          ) : (
            summaries.map((item) => (
              <div key={item.id} className="history-card">
                <div className="hist-info" onClick={() => onLoad(item)}>
                  <div className="hist-date">{item.date}</div>
                  <div className="hist-files">📄 {item.fileNames}</div>
                  <div className="hist-preview"><strong>Dx:</strong> {item.summary.diagnosis.substring(0, 60)}...</div>
                </div>
                <button className="btn-delete" onClick={() => onDelete(item.id)} title="Delete Record">
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}