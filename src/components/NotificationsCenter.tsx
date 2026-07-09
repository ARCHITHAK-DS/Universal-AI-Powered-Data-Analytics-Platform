import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertCircle, 
  Inbox, 
  Upload, 
  Users, 
  Link, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

interface ClientNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsCenterProps {
  notifications: ClientNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export default function NotificationsCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete
}: NotificationsCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = notifications.filter(n => {
    const matchesRead = filter === 'all' || !n.read;
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    return matchesRead && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'dataset_upload':
        return <Upload className="h-4 w-4 text-indigo-500" />;
      case 'workspace_invite':
        return <Users className="h-4 w-4 text-emerald-500" />;
      case 'dashboard_share':
        return <Link className="h-4 w-4 text-pink-500" />;
      case 'report_generation':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-slate-500" />;
    }
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  return (
    <div id="notifications-panel" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            Notification Alerts Hub
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time event logging and workspace invites synchronizing across your account.
          </p>
        </div>
        
        {getUnreadCount() > 0 && (
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center justify-center gap-1.5 px-4 id-mark-all-read py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl shadow-xs cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-800 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm font-bold border border-indigo-100/55'
                : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            Unread Alerts ({getUnreadCount()})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter Channel:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="dataset_upload">Dataset Uploads</option>
            <option value="report_generation">Reports Generated</option>
            <option value="workspace_invite">Workspace Actions</option>
            <option value="dashboard_share">Dashboard Shares</option>
            <option value="user_activity">Security Alerts</option>
          </select>
        </div>
      </div>

      {/* Notification Stream */}
      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-205">
            <Inbox className="h-9 w-9 text-slate-300 mb-2.5" />
            <h4 className="text-sm font-bold text-slate-700">All caught up!</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              There are no {filter === 'unread' ? 'unread' : ''} alerts on this filter layer. Enjoy your clean workspace!
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${
                item.read 
                  ? 'bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-50' 
                  : 'bg-indigo-50/30 border-indigo-105 hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex gap-3 text-left">
                <div className={`mt-0.5 p-2 rounded-lg border ${
                  item.read
                    ? 'bg-white border-slate-200'
                    : 'bg-indigo-50/80 border-indigo-200'
                }`}>
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800 leading-snug">{item.title}</span>
                    {!item.read && (
                      <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase font-mono bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-sm">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 font-medium">{item.message}</p>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!item.read && (
                  <button
                    onClick={() => onMarkRead(item.id)}
                    className="p-1.5 hover:bg-indigo-100/55 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Mark as Read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 hover:bg-rose-100/55 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove Notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
