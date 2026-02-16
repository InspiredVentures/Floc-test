import React from 'react';

export const MemberActivityEmptyState: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
        <span className="material-symbols-outlined text-slate-500 text-4xl">history</span>
      </div>
      <h4 className="text-white font-black text-xl mb-2">No Activity Yet</h4>
      <p className="text-slate-500 text-sm">Member management actions will appear here</p>
    </div>
  );
};
