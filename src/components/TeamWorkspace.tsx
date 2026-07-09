import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  UserPlus, 
  Award, 
  Search,
  Settings,
  Layers,
  History
} from 'lucide-react';

interface WorkspaceMember {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status?: string; // e.g. 'Joined' or 'Pending'
}

interface Workspace {
  id: string;
  workspaceName: string;
  createdAt: string;
  members?: string[];
  membersDetails?: WorkspaceMember[];
}

interface TeamWorkspaceProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onSetActiveWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string) => Promise<void>;
  onAddMember: (workspaceId: string, emailOrUsername: string, role: string) => Promise<boolean>;
  currentUser: any;
}

export default function TeamWorkspace({
  workspaces,
  activeWorkspaceId,
  onSetActiveWorkspace,
  onCreateWorkspace,
  onAddMember,
  currentUser
}: TeamWorkspaceProps) {
  const [newWsName, setNewWsName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Analyst');
  
  const [wsMessage, setWsMessage] = useState({ text: '', type: 'success' });
  const [inviteMessage, setInviteMessage] = useState({ text: '', type: 'success' });

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Emulated default list if details are blank
  const defaultMembers: WorkspaceMember[] = [
    { id: '1', fullName: 'Jennifer Mercer', username: 'jennifer', email: 'jen@universal-ai.internal', role: 'Admin', status: 'Joined' },
    { id: '2', fullName: 'Standard Auditor', username: 'auditor', email: 'auditor@domain.com', role: 'Analyst', status: 'Joined' },
    { id: currentUser?.id || '3', fullName: currentUser?.fullName || 'Active User', username: currentUser?.username || 'user', email: currentUser?.email || 'user@mail.com', role: currentUser?.role || 'Analyst', status: 'Joined' }
  ];

  const workspaceMembersList = activeWorkspace?.membersDetails || defaultMembers;

  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWsMessage({ text: '', type: 'success' });
    if (!newWsName.trim()) return;

    try {
      await onCreateWorkspace(newWsName);
      setWsMessage({ text: `Workspace "${newWsName}" successfully initialized in relational memory.`, type: 'success' });
      setNewWsName('');
    } catch {
      setWsMessage({ text: 'Failed to complete database entry.', type: 'error' });
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMessage({ text: '', type: 'success' });
    if (!inviteEmail.trim()) return;

    if (!activeWorkspaceId) {
      setInviteMessage({ text: 'Please select or mount an active workspace snapshots container first.', type: 'error' });
      return;
    }

    try {
      const success = await onAddMember(activeWorkspaceId, inviteEmail, inviteRole);
      if (success) {
        setInviteMessage({ 
          text: `Invitation successfully dispatched! Invited "${inviteEmail}" as ${inviteRole}.`, 
          type: 'success' 
        });
        setInviteEmail('');
      } else {
        setInviteMessage({ text: 'Failed to invite. User profile might not exist in database.', type: 'error' });
      }
    } catch {
      setInviteMessage({ text: 'Internal transmission failure. Check sandbox backend logs.', type: 'error' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ANALYST':
        return 'bg-indigo-50 text-indigo-700 border-indigo-205';
      default:
        return 'bg-slate-50 text-slate-650 border-slate-200';
    }
  };

  return (
    <div id="team-workspaces" className="font-sans space-y-6 text-left">
      
      {/* 2-Column Split: Active Snapshots Selection & Creator Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Listings */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-indigo-500" />
              Connected Snapshots & Clusters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Initialize or mount isolated cloud storage containers containing unique team matrices.</p>
          </div>

          {wsMessage.text && (
            <div className={`p-3 rounded-xl text-xs font-semibold border ${
              wsMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                : 'bg-rose-50 border-rose-150 text-rose-700'
            }`}>
              {wsMessage.text}
            </div>
          )}

          <div className="divide-y divide-slate-150 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
            <div className="p-4 flex items-center justify-between text-xs bg-white">
              <div>
                <strong className="block text-slate-800 text-sm">Global Unified Sandbox (Default Workspace)</strong>
                <span className="text-[10px] text-slate-455 block mt-0.5 font-medium">Default workspace cluster seeded automatically matching preloaded indexes.</span>
              </div>
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded bg-emerald-50 text-emerald-700 border border-emerald-250 shrink-0">
                Active Cluster
              </span>
            </div>

            {workspaces.map((ws) => (
              <div key={ws.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-100/50 transition-all">
                <div>
                  <strong className="block text-slate-800 text-sm">{ws.workspaceName}</strong>
                  <span className="text-[10px] text-slate-450 font-mono">Created: {new Date(ws.createdAt).toLocaleDateString()}</span>
                </div>
                
                <button
                  onClick={() => onSetActiveWorkspace(ws.id)}
                  className={`px-4 py-1.5 font-bold text-xs rounded-xl cursor-pointer transition-all ${
                    activeWorkspaceId === ws.id
                      ? 'bg-indigo-600 text-white shadow-xs font-black'
                      : 'bg-white border border-slate-250 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {activeWorkspaceId === ws.id ? 'Mounted Cluster' : 'Mount Snapshot'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Form mini block */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 flex items-center gap-1.5">
                <Plus className="h-4.5 w-4.5 text-indigo-500" />
                Initialize Cluster
              </h3>
              <p className="text-xs text-slate-450 mt-1 leading-normal font-semibold">Form an isolated sub-space of tabular calculations and charts.</p>
            </div>

            <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Label Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pacific Sales Analytics Division"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-xl text-slate-705 font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                Assemble Cluster Snapshot
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* Member Management & Invitation Gate */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Collaborators Listing */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-indigo-505 text-indigo-500" />
                Active Collaborators in: <span className="text-indigo-600">"{activeWorkspace?.workspaceName || 'Global Unified Sandbox'}"</span>
              </h3>
              <p className="text-xs text-slate-450 mt-0.5">Control role hierarchies, read joining status checks, and query details.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-205">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-55 bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] font-mono text-slate-500">
                <tr>
                  <th className="p-3">User Ingress Details</th>
                  <th className="p-3">Role Authorization</th>
                  <th className="p-3">Secure UID Reference</th>
                  <th className="p-3">Network State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-750">
                {workspaceMembersList.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/40">
                    <td className="p-3">
                      <span className="font-extrabold text-slate-900 block text-xs">{member.fullName}</span>
                      <span className="text-[10px] text-slate-450 block truncate max-w-[200px]">@{member.username} • {member.email}</span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-mono font-bold text-[9px] uppercase border ${getRoleBadge(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-450">
                      usr_cluster_{member.id.substring(0, 6)}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[10px] text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {member.status || 'Joined'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Invitation form */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 flex items-center gap-1.5">
                <UserPlus className="h-4.5 w-4.5 text-indigo-500" />
                Invite Partner
              </h3>
              <p className="text-xs text-slate-450 mt-1 leading-normal font-semibold">Integrate standard collaborators seamlessly into mounted snap layers.</p>
            </div>

            {inviteMessage.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${
                inviteMessage.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                  : 'bg-rose-50 border-rose-150 text-rose-700'
              }`}>
                {inviteMessage.text}
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wilder block">Username or Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="partner@domain.com or partner"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-205 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-xl text-slate-705 font-bold animate-fade-in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned RBAC Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 text-xs text-slate-700 font-bold rounded-xl focus:outline-hidden focus:border-indigo-550 cursor-pointer"
                >
                  <option value="Viewer">Viewer (Read Only)</option>
                  <option value="Analyst">Analyst (Write, Print, Export)</option>
                  <option value="Admin">Admin Operator (All Rights)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                Send Secure Ingress Invite
              </button>
            </form>
          </div>
        </div>

      </section>

    </div>
  );
}
