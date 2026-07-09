import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Clock, 
  FolderOpen, 
  Database, 
  FileText, 
  Sparkles, 
  Link, 
  ShieldAlert, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Activity, 
  Info,
  Laptop,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface MyAccountProps {
  currentUser: CurrentUser | null;
  statsSummary: {
    datasets: number;
    projects: number;
    reports: number;
    insights: number;
    shares: number;
  };
  onUpdateMe: (fullName: string, email: string, avatarUrl: string) => Promise<boolean>;
  onChangePassword: (oldP: string, newP: string) => Promise<{ success: boolean; message: string }>;
}

const AVATAR_TEMPLATES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
];

export default function MyAccount({
  currentUser,
  statsSummary,
  onUpdateMe,
  onChangePassword
}: MyAccountProps) {
  // Edit Profile States
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.profilePicture || AVATAR_TEMPLATES[0]);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: 'success' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: 'success' });

  // Sync edits when current user changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      if (currentUser.profilePicture) {
        setSelectedAvatar(currentUser.profilePicture);
      }
    }
  }, [currentUser]);

  // Validations checklist
  const validationRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(validationRules).every(Boolean);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ text: '', type: 'success' });
    if (!fullName || !email) {
      setProfileMessage({ text: 'Please complete all required fields.', type: 'error' });
      return;
    }
    setIsUpdating(true);
    try {
      const success = await onUpdateMe(fullName, email, selectedAvatar);
      if (success) {
        setProfileMessage({ text: 'Your physical profile has been updated and synchronized.', type: 'success' });
      } else {
        setProfileMessage({ text: 'Profile update failed. Check constraints.', type: 'error' });
      }
    } catch {
      setProfileMessage({ text: 'Failed to dispatch network request.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: 'success' });

    if (!isPasswordValid) {
      setPwdMessage({ text: 'Your new access key must satisfy all 5 complexity guidelines.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMessage({ text: 'The new passwords do not match.', type: 'error' });
      return;
    }

    try {
      const res = await onChangePassword(currentPassword, newPassword);
      if (res.success) {
        setPwdMessage({ text: res.message || 'Key rotated successfully.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdMessage({ text: res.message || 'Invalid key check.', type: 'error' });
      }
    } catch {
      setPwdMessage({ text: 'Failed to access authentication router gateway.', type: 'error' });
    }
  };

  return (
    <div id="account-portal" className="font-sans space-y-6 text-left">
      
      {/* Upper overview card */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl shadow-md p-6 text-white relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-505 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
          <img
            src={selectedAvatar}
            alt="User Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-550 border-indigo-550/40 shadow-sm"
          />
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-xl font-bold font-serif">{currentUser?.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                {currentUser?.role || 'Viewer'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1">
              <Mail className="h-3.5 w-3.5" />
              {currentUser?.email} • @{currentUser?.username}
            </p>
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created: June 01, 2026
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Last Login: {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Just Now'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical statistics grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Ingested Datasets', count: statsSummary.datasets, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Database },
          { label: 'Saved Projects', count: statsSummary.projects, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: FolderOpen },
          { label: 'PDF Audit Briefs', count: statsSummary.reports, color: 'text-amber-600', bg: 'bg-amber-50', icon: FileText },
          { label: 'Consultative Insights', count: statsSummary.insights, color: 'text-purple-650 text-indigo-650', bg: 'bg-purple-50 bg-indigo-50', icon: Sparkles },
          { label: 'Connected Shares', count: statsSummary.shares, color: 'text-pink-600', bg: 'bg-pink-50', icon: Link },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-slate-250 p-4 rounded-2xl shadow-2xs flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl ${item.bg}`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="text-left font-sans">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{item.label}</span>
                <strong className="text-lg font-black text-slate-900 leading-none mt-1.5 block">{item.count}</strong>
              </div>
            </div>
          );
        })}
      </section>

      {/* Input settings section split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Modification & Password Rotation */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
          
          {/* Box 1: Profile Edits */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-indigo-500" />
                Configure Profile Metadata
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Modify workspace identification and default avatar indicators.</p>
            </div>

            {profileMessage.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${
                profileMessage.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                  : 'bg-rose-50 border-rose-150 text-rose-700'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 pt-1">
              {/* Select Avatar Image */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Avatar Profile Picture:</span>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_TEMPLATES.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAvatar === url 
                          ? 'border-indigo-650 scale-[1.05] ring-2 ring-indigo-200 shadow-sm' 
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={url} alt={`Avatar option ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <div className="text-xs text-slate-450 border border-slate-150 rounded-xl px-3 py-1 bg-slate-50 font-bold max-w-xs">
                    ← Pick one of our high-definition enterprise templates
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Human Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-lg text-slate-700 font-bold"
                    placeholder="Enter your real full name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-lg text-slate-700 font-bold"
                    placeholder="Enter work email"
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Synchronizing...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Box 2: Password Mutation */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Key className="h-4.5 w-4.5 text-indigo-500" />
                Rotate Security Key
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Enforce cryptographic complexity guidelines onto your account password.</p>
            </div>

            {pwdMessage.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold border ${
                pwdMessage.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                  : 'bg-rose-50 border-rose-150 text-rose-700'
              }`}>
                {pwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password or guest passphrase"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-lg text-slate-700 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Access Key</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Type strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-lg text-slate-700 font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm New Access Key</label>
                  <input
                    type="password"
                    placeholder="Confirm secure code"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-lg text-slate-700 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Password Guidelines Indicators */}
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Key Validation Guidelines checklist:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono font-semibold">
                  <div className="flex items-center gap-1.5">
                    {validationRules.length ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-350" />}
                    <span className={validationRules.length ? 'text-emerald-700 font-bold' : 'text-slate-450'}>Min 8 Characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validationRules.uppercase ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-350" />}
                    <span className={validationRules.uppercase ? 'text-emerald-700 font-bold' : 'text-slate-450'}>1 Uppercase Letter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validationRules.lowercase ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-350" />}
                    <span className={validationRules.lowercase ? 'text-emerald-700 font-bold' : 'text-slate-450'}>1 Lowercase Letter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validationRules.number ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-350" />}
                    <span className={validationRules.number ? 'text-emerald-700 font-bold' : 'text-slate-450'}>1 Numeric Digit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validationRules.special ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-350" />}
                    <span className={validationRules.special ? 'text-emerald-700 font-bold' : 'text-slate-450'}>1 Special Character</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  Confirm Cryptographic Rotation
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Security Center & Device Ingress */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
              Ingress Security Center
            </h3>
            <p className="text-xs text-slate-400">Review credential authorizations. We maintain active monitoring on each login node.</p>

            <div className="space-y-3 font-mono text-[10px] text-slate-500">
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="font-bold text-emerald-600 uppercase border border-emerald-200 bg-emerald-50 px-1.5 rounded">AUTHENTICATED-SUCCESS</span>
                  <span className="text-slate-450 font-bold">Just Now</span>
                </div>
                <p className="text-slate-700 font-bold">IP Ingress Node: 168.91.45.105 (San Jose, CA)</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <Laptop className="h-3.5 w-3.5" />
                  <span>React Sandbox Platform Container</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="font-bold text-indigo-600 uppercase border border-indigo-200 bg-indigo-50 px-1.5 rounded">AUTHORIZED-RESTORED</span>
                  <span className="text-slate-455 font-bold">2 hours ago</span>
                </div>
                <p className="text-slate-700 font-bold">IP Ingress Node: 168.91.45.105 (San Jose, CA)</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-455">
                  <Laptop className="h-3.5 w-3.5" />
                  <span>React Sandbox Platform Container</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-2">
              <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-indigo-750 font-semibold leading-normal">
                Multi-layer security is emulated over a simulated SQLite transaction manager using SHA256 hashes inside your sandboxed browser. No real external credentials are leaked.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
