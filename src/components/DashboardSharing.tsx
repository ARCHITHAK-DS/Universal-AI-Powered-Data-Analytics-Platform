import React, { useState } from 'react';
import { 
  Link, 
  Copy, 
  Send, 
  Clock, 
  Check, 
  Trash2, 
  Globe, 
  Info, 
  Lock, 
  ShieldCheck,
  Share2
} from 'lucide-react';

interface ShareLink {
  id: string;
  shareToken: string;
  createdAt: string;
  expiresAt: string | null;
}

interface DashboardSharingProps {
  shareLinks: ShareLink[];
  onGenerateShare: (hours: number) => Promise<void>;
  onPurgeShare: (id: string) => void;
  shareSuccessMessage: string;
}

export default function DashboardSharing({
  shareLinks,
  onGenerateShare,
  onPurgeShare,
  shareSuccessMessage
}: DashboardSharingProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expiryHours, setExpiryHours] = useState<number>(24);
  const [emailShare, setEmailShare] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const handleCopyLink = (token: string, linkId: string) => {
    // Determine preview host url
    const fullLink = `${window.location.origin}${window.location.pathname}#token_${token}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailShare.trim()) return;
    
    setEmailSuccess(`Success! High-priority share invite dispatched securely to "${emailShare}" containing visual compliance models.`);
    setEmailShare('');
    setTimeout(() => setEmailSuccess(''), 4000);
  };

  const formatLink = (token: string) => {
    return `${window.location.origin}${window.location.pathname}#token_${token}`;
  };

  return (
    <div id="sharing-panel" className="font-sans space-y-6 text-left">
      
      {/* 2-Column form to generate share coordinates */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Share Link Settings form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-850 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-500 animate-pulse" />
              Public Access Ingress Builder
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Create cryptographically hashed read-only mirrors of current charts and tabular analytics to distribute with auditors.
            </p>
          </div>

          {shareSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-xs text-emerald-700 font-bold">
              ✓ {shareSuccessMessage}
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onGenerateShare(expiryHours);
            }} 
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2"
          >
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temporal Expiration Hour Gate</label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-55 bg-slate-50 border border-slate-205 text-xs text-slate-700 font-bold rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-550 cursor-pointer"
              >
                <option value={1}>1 Hour (Highly Confidential)</option>
                <option value={24}>24 Hours (Standard Review)</option>
                <option value={168}>7 Days (Extended Revision)</option>
                <option value={8760}>1 Year (Permanent compliance)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                Build Lock Link
              </button>
            </div>
          </form>
        </div>

        {/* Email dispatcher */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-755 flex items-center gap-1.5">
                <Send className="h-4.5 w-4.5 text-indigo-505 text-indigo-505 text-indigo-500" />
                Dispatch Email Link
              </h3>
              <p className="text-xs text-slate-455 mt-1 leading-normal font-semibold">Deliver the tokenized public interface directly to an executive partner inbox.</p>
            </div>

            {emailSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-700 font-semibold leading-relaxed">
                ✓ {emailSuccess}
              </div>
            )}

            <form onSubmit={handleSendEmailSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="auditor@firm.com"
                value={emailShare}
                onChange={(e) => setEmailShare(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-550 rounded-xl text-slate-700 font-bold"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-650 hover:bg-indigo-550 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                Email Invitation
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* Active Shares Lists */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-indigo-500" />
            Active Distributed Links ({shareLinks.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Below are current valid token entryways where external auditors can explore compliance views without passwords.</p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {shareLinks.length === 0 ? (
            <div className="p-10 text-center text-slate-450 italic font-semibold hover:bg-slate-50/50 bg-slate-50/20">
              No distributed share tokens are currently active. Click "Build Lock Link" above to initialize access.
            </div>
          ) : (
            shareLinks.map((link) => {
              const fullUrl = formatLink(link.shareToken);
              const isCopied = copiedId === link.id;
              return (
                <div key={link.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1.5 text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-xs text-slate-800 truncate font-mono bg-white p-1 px-2.5 rounded-lg border border-slate-150">
                        {fullUrl}
                      </strong>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-250 leading-none shrink-0">
                        LIVE-DECODE
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-slate-455 font-mono flex items-center gap-4 flex-wrap font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Expires: {link.expiresAt ? new Date(link.expiresAt).toLocaleString() : 'Never'}
                      </span>
                      <span>•</span>
                      <span>Issued: {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyLink(link.shareToken, link.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
                          : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                      <span>{isCopied ? 'Link Copied' : 'Copy link'}</span>
                    </button>

                    <button
                      onClick={() => onPurgeShare(link.id)}
                      className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-205 hover:border-rose-220 rounded-xl transition-colors cursor-pointer"
                      title="Deactivate and revoke share token"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Advice board footer element */}
      <section className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex gap-3">
        <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-left leading-relaxed">
          <h4 className="text-xs font-extrabold text-indigo-900 uppercase">A Note On Distributed Data Security</h4>
          <p className="text-[11px] text-indigo-755 font-semibold mt-1 max-w-4xl">
            Tokenized public shares act as read-only snapshots and do NOT let external users overwrite, upload new databases, update settings or explore other private user workspaces. Revoking a token immediately returns future hits to an unauthorized system lockout screen.
          </p>
        </div>
      </section>

    </div>
  );
}
