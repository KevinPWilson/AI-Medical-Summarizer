import { useState } from 'react';
import { jsPDF } from 'jspdf';

function fileExt(name) {
  const e = name.split('.').pop().toLowerCase();
  if (e === 'pdf')                         return '📄';
  if (['png','jpg','jpeg','webp'].includes(e)) return '🖼️';
  return '📝';
}


export default function RecordsPanel({ files, onChange, onUpload, loading, error, inputRef, summary }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);
    onChange({ target: { files: e.dataTransfer.files } });
  };

  const handleClear = () => {
    onChange({ target: { files: [] } });
    if (inputRef.current) inputRef.current.value = '';
  };

  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Grab the patient name from the file
    const patientName = files.length > 0 
      ? files[0].name.split('.')[0].replace(/_/g, ' ') 
      : 'Unknown Patient';

    // 1. Add Title
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Medical Record Summary', 20, 20);

    // 2. Add Patient Name
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Patient: ${patientName}`, 20, 30);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Helper variables for spacing
    let currentY = 45;
    const margin = 20;
    const maxWidth = 170; // Page width minus margins

    // 3. Add Diagnosis
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DIAGNOSIS', margin, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 7;
    const diagLines = doc.splitTextToSize(summary.diagnosis, maxWidth);
    doc.text(diagLines, margin, currentY);
    currentY += (diagLines.length * 6) + 10;

    // 4. Add Medications
    doc.setFont(undefined, 'bold');
    doc.text('MEDICATIONS', margin, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 7;
    const medLines = doc.splitTextToSize(summary.medications, maxWidth);
    doc.text(medLines, margin, currentY);
    currentY += (medLines.length * 6) + 10;

    // 5. Add Follow-Up Plan
    doc.setFont(undefined, 'bold');
    doc.text('FOLLOW-UP PLAN', margin, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 7;
    const folLines = doc.splitTextToSize(summary.followUp, maxWidth);
    doc.text(folLines, margin, currentY);

    // 6. Save the file
    doc.save(`${patientName.replace(/\s+/g, '_')}_Summary.pdf`);
  };

  return (
    <div className="panel panel-left">
      <div className="upload-section">
        <div className="panel-hdr">
          <span className="panel-title">Upload Records</span>
        </div>
        <div className="upload-body">
          <input
            ref={inputRef}
            type="file" multiple
            accept=".pdf,.txt,.png,.jpg,.jpeg,.docx,.doc"
            style={{ display: 'none' }}
            onChange={onChange}
          />
          <div
            className={`drop-zone${dragging ? ' dz-on' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <span className="dz-ic">{files.length > 0 ? '📂' : '📁'}</span>
            <p className="dz-h">
              {dragging
                ? 'Drop to upload'
                : files.length > 0
                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                : 'Drag files or click to browse'}
            </p>
            <p className="dz-sub">
              Supports&nbsp;<strong>PDF</strong>&nbsp;<strong>Word</strong>&nbsp;<strong>TXT</strong>&nbsp;<strong>Images</strong>
            </p>
          </div>

          {files.length > 0 && (
            <div className="file-pills">
              {files.map((f, i) => (
                <div key={i} className="f-pill">
                  <div className="f-dot"/>
                  {fileExt(f.name)}&nbsp;
                  <span style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="action-row">
            <button
              className="btn-analyse"
              onClick={onUpload}
              disabled={loading || files.length === 0}
            >
              {loading ? <><span className="sp"/> Analysing…</> : '▶ Summarise'}
            </button>
            {files.length > 0 && (
              <button className="btn-clear" onClick={handleClear}>✕</button>
            )}
          </div>

          {loading && <div className="prog-track"><div className="prog-fill"/></div>}
          {error   && <div className="err-strip">⚠&nbsp;{error}</div>}
        </div>
      </div>

      <div className="results-section">
        <div className="panel-hdr">
          <span className="panel-title">Extraction Results</span>
          {summary && (
             <button className="btn-download" onClick={handleDownloadPDF} title="Download as PDF">
               📥 Export PDF
             </button>
          )}
        </div>

        <div className="results-scroll">
          {!summary ? (
            <div className="res-empty">
              <div className="re-ic">🩺</div>
              <div className="re-tx">Analyse a record to see extracted data here</div>
            </div>
          ) : (
            <div className="screen-view">
              <div className="ex-row">
                <div className="ex-icon gi">🩺</div>
                <div className="ex-body">
                  <div className="ex-type gt">Diagnosis</div>
                  <div className="ex-text">{summary.diagnosis}</div>
                </div>
              </div>

              <div className="ex-row">
                <div className="ex-icon oi">💊</div>
                <div className="ex-body">
                  <div className="ex-type ot">Medications</div>
                  <div className="ex-text">{summary.medications}</div>
                </div>
              </div>

              <div className="ex-row">
                <div className="ex-icon wi">📅</div>
                <div className="ex-body">
                  <div className="ex-type wt">Follow-Up Plan</div>
                  <div className="ex-text">{summary.followUp}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
