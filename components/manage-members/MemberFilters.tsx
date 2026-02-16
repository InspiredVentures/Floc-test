import React from 'react';
import { UserRole } from './types';

interface MemberFiltersProps {
  activeTab: 'joined' | 'pending' | 'declined' | 'invites' | 'activity';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRole: UserRole | 'All';
  setFilterRole: (role: UserRole | 'All') => void;
  filterJoinDate: 'all' | '7days' | '30days';
  setFilterJoinDate: (date: 'all' | '7days' | '30days') => void;
  sortBy: 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'role';
  setSortBy: (sort: 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'role') => void;
}

export const MemberFilters: React.FC<MemberFiltersProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  filterRole,
  setFilterRole,
  filterJoinDate,
  setFilterJoinDate,
  sortBy,
  setSortBy
}) => {
  return (
    <>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roster..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-slate-600 shadow-inner"
        />
      </div>

      {/* Filter & Sort Controls - Only show for joined tab */}
      {activeTab === 'joined' && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="All">All Roles</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Co-Leader">Co-Leader</option>
            <option value="Member">Member</option>
          </select>

          {/* Join Date Filter */}
          <select
            value={filterJoinDate}
            onChange={(e) => setFilterJoinDate(e.target.value as 'all' | '7days' | '30days')}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-newest">Newest First</option>
            <option value="date-oldest">Oldest First</option>
            <option value="role">By Authority</option>
          </select>

          {/* Active Filter Indicator */}
          {(filterRole !== 'All' || filterJoinDate !== 'all' || sortBy !== 'name-asc') && (
            <button
              onClick={() => {
                setFilterRole('All');
                setFilterJoinDate('all');
                setSortBy('name-asc');
              }}
              className="bg-primary/20 text-primary border border-primary/30 rounded-xl px-3 py-2 text-xs font-black uppercase flex items-center gap-1 hover:bg-primary/30 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Clear
            </button>
          )}
        </div>
      )}
    </>
  );
};
