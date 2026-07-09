import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  FolderDown, 
  Database,
  Briefcase
} from 'lucide-react';

interface DatasetHistoryItem {
  id: string;
  filename: string;
  sizeBytes: number;
  rowCount: number;
  uploadedAt: string;
  domain?: string;
}

interface DatasetHistoryProps {
  datasets: DatasetHistoryItem[];
  activeFilename: string | null;
  onLoadDataset: (filename: string) => void;
  onDeleteDataset: (id: string) => void;
}

export default function DatasetHistory({
  datasets,
  activeFilename,
  onLoadDataset,
  onDeleteDataset
}: DatasetHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback seed values if db is dynamic or shallow on sandbox
  const defaultHistory: DatasetHistoryItem[] = [
    {
      id: 'h1',
      filename: 'healthcare_patient_outcomes.csv',
      sizeBytes: 154200,
      rowCount: 1250,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      domain: 'Healthcare'
    },
    {
      id: 'h2',
      filename: 'retail_sales_kpi.xlsx',
      sizeBytes: 245000,
      rowCount: 3200,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      domain: 'Retail'
    },
    {
      id: 'h3',
      filename: 'banking_loan_risk.csv',
      sizeBytes: 98100,
      rowCount: 850,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      domain: 'Banking'
    }
  ];

  const historicalDatasets = datasets && datasets.length > 0 ? datasets : defaultHistory;

  const filtered = historicalDatasets.filter(d => 
    d.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.domain && d.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div id="dataset-history-panel" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-500" />
            Dataset Ingestion History
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access past dataset snapshots previously uploaded to your secure division pipeline.
          </p>
        </div>
      </div>

      <div className="relative mt-5">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search historical databases by file index, name, or domain class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-xl text-slate-700 font-semibold"
        />
      </div>

      <div className="mt-5 overflow-hidden border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-mono">
              <th className="p-3.5">Sheet filename</th>
              <th className="p-3.5">Analytical Domain</th>
              <th className="p-3.5">Row Index</th>
              <th className="p-3.5">File size</th>
              <th className="p-3.5">Upload stamp</th>
              <th className="p-3.5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-450 italic bg-slate-50/25">
                  No historical datasets found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((ds) => {
                const isActive = activeFilename === ds.filename;
                return (
                  <tr key={ds.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-[240px]" title={ds.filename}>
                            {ds.filename}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-150 px-1.5 py-0.2 rounded-sm leading-none">
                              <CheckCircle2 className="h-3 w-3" />
                              Currently Mounted
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {ds.domain || 'Generic Data'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-650">
                      {ds.rowCount.toLocaleString()} units
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-650">
                      {formatBytes(ds.sizeBytes)}
                    </td>
                    <td className="p-3.5 text-xs text-slate-500">
                      {new Date(ds.uploadedAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => onLoadDataset(ds.filename)}
                          disabled={isActive}
                          className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed opacity-80'
                              : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-2xs'
                          }`}
                        >
                          {isActive ? 'Mounted' : 'Mount File'}
                        </button>

                        <button
                          onClick={() => onDeleteDataset(ds.id)}
                          className="p-1 px-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                          title="Purge completely"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
