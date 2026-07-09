import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';

// €€€ Types €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
type FileStatus = 'pending' | 'processing' | 'done' | 'error';
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: FileStatus;
  progress: number;
  message?: string;
}

const acceptedTypes = ['.csv', '.xlsx', '.xls', '.pdf'];
const maxSizeMb = 10;

// €€€ Helpers €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const getFileType = (name: string) => {
  if (name.endsWith('.csv')) return 'CSV';
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'Excel';
  if (name.endsWith('.pdf')) return 'PDF';
  return 'Unknown';
};
const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// €€€ Status Icon €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const StatusIcon = ({ status }: { status: FileStatus }) => {
  if (status === 'done') return <CheckCircle size={18} className="text-success" />;
  if (status === 'error') return <XCircle size={18} className="text-danger" />;
  if (status === 'processing') return (
    <div className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
  );
  return <AlertCircle size={18} className="text-textMuted" />;
};

// €€€ Document Type Selector €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const docTypes = ['Salary Slip', 'Bank Statement', 'Income Tax Return', 'GST Document', 'Loan Application', 'Other'];

// €€€ Main Page €€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€
const DataUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [docType, setDocType] = useState('Bank Statement');
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (newFiles: File[]) => {
    const entries: UploadedFile[] = newFiles.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: formatSize(f.size),
      type: getFileType(f.name),
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...entries]);

    // Simulate progress for each file
    entries.forEach((entry) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const isValid = entry.type !== 'Unknown';
          setFiles(prev => prev.map(f =>
            f.id === entry.id
              ? { ...f, status: isValid ? 'done' : 'error', progress: 100, message: isValid ? 'Validated & Processed' : 'Unsupported file type' }
              : f
          ));
        } else {
          setFiles(prev => prev.map(f =>
            f.id === entry.id ? { ...f, status: 'processing', progress } : f
          ));
        }
      }, 350);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    simulateUpload(Array.from(e.dataTransfer.files));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) simulateUpload(Array.from(e.target.files));
  };
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-textMain tracking-tight">Data Upload</h1>
        <p className="text-sm text-textMuted mt-1">Upload customer financial documents for AI processing</p>
      </div>

      {/* Config Row */}
      <div className="glass-panel p-5 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Document Type</label>
          <select value={docType} onChange={e => setDocType(e.target.value)}
            className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-3 py-2 text-sm text-textMain focus:outline-none focus:border-primary/50">
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Supported Formats</label>
          <div className="flex gap-2">
            {['.csv', '.xlsx', '.pdf'].map(f => (
              <span key={f} className="px-2.5 py-1 rounded bg-surfaceHighlight text-xs font-mono text-textMuted border border-white/10">{f}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold uppercase tracking-widest text-textMuted block mb-2">Max File Size</label>
          <p className="text-sm font-semibold text-textMain">{maxSizeMb} MB per file</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-14 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-white/15 bg-surfaceHighlight/20 hover:border-primary/40 hover:bg-surfaceHighlight/40'}`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isDragging ? 'bg-primary/20' : 'bg-surfaceHighlight'}`}>
          <UploadCloud size={32} className={isDragging ? 'text-primary' : 'text-textMuted'} />
        </div>
        <h3 className="text-lg font-bold text-textMain mb-1">
          {isDragging ? 'Release to upload' : 'Drag & drop files here'}
        </h3>
        <p className="text-sm text-textMuted">or <span className="text-primary font-semibold underline underline-offset-2">browse files</span> from your computer</p>
        <p className="text-xs text-textMuted mt-3">CSV, XLSX, PDF · Max {maxSizeMb}MB each</p>
        <input ref={inputRef} type="file" multiple accept={acceptedTypes.join(',')} className="hidden" onChange={handleFileChange} />
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="glass-panel overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-textMuted">Upload Queue ({files.length})</h3>
            <button onClick={() => setFiles([])} className="text-xs text-danger hover:underline">Clear All</button>
          </div>
          <div className="divide-y divide-white/5">
            {files.map(file => (
              <div key={file.id} className="px-5 py-4 flex items-center gap-4">
                {/* File Type Badge */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-primary" />
                </div>

                {/* File Info + Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-textMain truncate">{file.name}</p>
                    <span className="text-xs text-textMuted ml-3 flex-shrink-0">{file.size}</span>
                  </div>
                  {file.status === 'processing' && (
                    <div className="w-full h-1.5 bg-surfaceHighlight rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }} />
                    </div>
                  )}
                  {(file.status === 'done' || file.status === 'error') && (
                    <p className={`text-xs font-medium ${file.status === 'done' ? 'text-success' : 'text-danger'}`}>
                      {file.message}
                    </p>
                  )}
                  {file.status === 'pending' && <p className="text-xs text-textMuted">Queued for upload</p>}
                </div>

                {/* Status + Remove */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusIcon status={file.status} />
                  <button onClick={() => removeFile(file.id)} className="text-textMuted hover:text-danger transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-white/10 flex justify-end">
            <button className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
              Submit All for AI Processing
            </button>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="glass-card border border-primary/20 bg-primary/5">
        <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <AlertCircle size={16} /> Upload Guidelines
        </h4>
        <ul className="text-xs text-textMuted space-y-1.5 list-disc list-inside">
          <li>Ensure all data is accurate and belongs to the correct customer</li>
          <li>PDFs must be machine-readable (not scanned images without OCR)</li>
          <li>CSV files must include column headers in the first row</li>
          <li>Do not upload password-protected files</li>
          <li>Data uploaded is processed securely and encrypted at rest</li>
        </ul>
      </div>
    </div>
  );
};

export default DataUpload;

