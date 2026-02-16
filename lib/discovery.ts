import { Community } from '../types';

export function filterCommunities(
  communities: Community[],
  activeFilter: string,
  searchQuery: string,
  isMemberFn: (id: string) => boolean
): Community[] {
  let result = communities;

  if (activeFilter === 'my-tribes') {
    result = result.filter(c => isMemberFn(c.id));
  } else if (activeFilter !== 'all') {
    result = result.filter(c => c.category === activeFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(comm =>
      comm.title.toLowerCase().includes(q) ||
      comm.description.toLowerCase().includes(q)
    );
  }

  return result;
}
