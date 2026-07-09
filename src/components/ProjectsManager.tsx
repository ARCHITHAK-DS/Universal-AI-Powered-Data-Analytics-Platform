import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Calendar, 
  ChevronRight, 
  Database, 
  Sparkles,
  RefreshCw,
  FolderSync
} from 'lucide-react';

interface Project {
  id: string;
  projectName: string;
  datasetId: string;
  createdAt: string;
  rawRows?: any[];
  cleanRows?: any[];
  datasetInfo?: any;
}

interface ProjectsManagerProps {
  projects: Project[];
  activeProjectId: string | null;
  onLoadProject: (proj: Project) => void;
  onDeleteProject: (id: string) => void;
  currentDatasetLoaded: boolean;
  onSaveCurrentAsProject: (projectName: string) => Promise<void>;
}

export default function ProjectsManager({
  projects,
  activeProjectId,
  onLoadProject,
  onDeleteProject,
  currentDatasetLoaded,
  onSaveCurrentAsProject
}: ProjectsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const filtered = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.datasetId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await onSaveCurrentAsProject(newProjectName);
      setNewProjectName('');
      setIsCreating(false);
      setSaveMessage('Project snap successfully created from active workbook context.');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      setSaveMessage('Failed to trigger database transaction.');
    }
  };

  return (
    <div id="projects-panel" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-indigo-500" />
            Projects Workspace Library
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Store state snapshots of fully-cleaned tabular models, AI recommendations, and custom reports.
          </p>
        </div>

        {currentDatasetLoaded && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Snap Active Workbook
          </button>
        )}
      </div>

      {saveMessage && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-700 font-bold">
          ✓ {saveMessage}
        </div>
      )}

      {/* Snap creating form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Save Current Workbook State</h4>
            <p className="text-[10px] text-slate-400">Specify an enterprise label. This logs data qualities, schemas and calculations.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Q2 Compliance Medical Trial Revision"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-650 rounded-xl text-slate-700 font-bold"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Create Snap
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Research Filters */}
      <div className="relative mt-5">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects by index labels or associated dataset filenames..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-xl text-slate-700 font-semibold"
        />
      </div>

      {/* Grid of Projects */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FolderSync className="h-10 w-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Projects Found</h4>
            <p className="text-xs text-slate-450 mt-1 max-w-sm">
              {searchTerm 
                ? 'No saved projects match your search keywords.' 
                : 'Upload a spreadsheet, analyze features, and snap your workbook to save historical records.'}
            </p>
          </div>
        ) : (
          filtered.map((proj) => {
            const isMounted = activeProjectId === proj.id;
            return (
              <div 
                key={proj.id}
                className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  isMounted 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.01]' 
                    : 'bg-slate-50/50 border-slate-200 text-slate-705 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-3 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shrink-0">
                      <FolderOpen className={`h-5 w-5 ${isMounted ? 'text-indigo-400' : 'text-indigo-500'}`} />
                    </div>
                    
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className={`p-1.5 rounded-lg border hover:scale-105 transition-all cursor-pointer ${
                        isMounted 
                          ? 'border-white/10 text-slate-400 hover:text-rose-400 hover:bg-white/10' 
                          : 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                      }`}
                      title="Permanently remove snapshot"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black tracking-tight leading-snug truncate">{proj.projectName}</h4>
                    <span className={`text-[10px] font-mono leading-none flex items-center gap-1 ${isMounted ? 'text-indigo-300' : 'text-slate-500'}`}>
                      <Database className="h-3 w-3 shrink-0" />
                      Dataset: {proj.datasetId}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-dashed border-slate-200/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-450">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => onLoadProject(proj)}
                    className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      isMounted
                        ? 'bg-indigo-600 text-white shadow-sm font-black'
                        : 'bg-slate-900 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    <span>{isMounted ? 'Mounted / Active' : 'Load Project'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
