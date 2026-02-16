import { Community, CommunityPost } from '../types';

export const getCommunityFromPost = (post: CommunityPost): Partial<Community> => ({
  id: post.communityName?.replace(/\s+/g, '-').toLowerCase() || 'tribe',
  title: post.communityName || 'Tribe',
  meta: "Community • Global Pulse",
});
