import React from 'react';
import { ActivityLog } from './types';

interface ActivityLogItemProps {
  log: ActivityLog;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ log }) => {
  const actionConfig = {
    approved: { icon: 'check_circle', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    declined: { icon: 'cancel', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    removed: { icon: 'person_remove', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    roleChanged: { icon: 'swap_horiz', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    permissionUpdated: { icon: 'admin_panel_settings', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
  }[log.action];

  const diff = Date.now() - new Date(log.timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const timeAgo = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : minutes > 0 ? `${minutes}m ago` : 'Just now';

  return (
    <div className={`p-5 border rounded-[2rem] ${actionConfig.bg} ${actionConfig.border}`}>
      <div className="flex items-start gap-4">
        <div className={`size-12 rounded-xl flex items-center justify-center ${actionConfig.bg} ${actionConfig.border} border-2`}>
          <span className={`material-symbols-outlined ${actionConfig.color} text-xl`}>{actionConfig.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-black text-sm truncate">{log.target}</h4>
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${actionConfig.bg} ${actionConfig.color}`}>
              {log.action.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          {log.details && <p className="text-slate-400 text-xs mb-2">{log.details}</p>}
          <div className="flex items-center gap-3 text-[9px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">person</span>
              {log.actor}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
