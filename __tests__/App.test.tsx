import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { vi } from 'vitest';
import React from 'react';

// Mock contexts
vi.mock('../contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    profile: null,
    isLoading: false,
    joinedCommunityIds: [],
    bookedTripIds: [],
    communities: [],
    followingUsernames: [],
    conversations: [],
    messages: [],
    notifications: [],
    joinCommunity: vi.fn(),
    leaveCommunity: vi.fn(),
    createCommunity: vi.fn(),
    bookTrip: vi.fn(),
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    isFollowing: vi.fn(),
    sendMessage: vi.fn(),
    markAsRead: vi.fn(),
    getConversation: vi.fn(),
    getTotalUnreadCount: vi.fn(),
    isMember: vi.fn(),
    isBooked: vi.fn(),
    approveMember: vi.fn(),
    declineMember: vi.fn(),
    removeMember: vi.fn(),
    updateMemberRole: vi.fn(),
    updateCommunity: vi.fn(),
    addNotification: vi.fn(),
    markNotificationsAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    setTypingStatus: vi.fn(),
    updatePresence: vi.fn(),
    deleteCommunity: vi.fn(),
    debugLogin: vi.fn(),
  }),
}));

vi.mock('../contexts/ToastContext', () => ({
  useToast: () => ({
    toasts: [],
    addToast: vi.fn(),
    removeToast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in JSDOM
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
    h1: ({ children }: any) => <h1>{children}</h1>,
    h2: ({ children }: any) => <h2>{children}</h2>,
    p: ({ children }: any) => <p>{children}</p>,
    span: ({ children }: any) => <span>{children}</span>,
    img: ({ children }: any) => <img />,
    g: ({ children }: any) => <g>{children}</g>,
    path: ({ children }: any) => <path>{children}</path>,
    section: ({ children }: any) => <section>{children}</section>,
    button: ({ children }: any) => <button>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('App', () => {
  it('renders LandingPage on initial route /', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Verify presence of navigation (part of LandingPage)
    await waitFor(() => {
        expect(screen.getByText(/Our Story/i)).toBeInTheDocument();
    });

    // Verify main CTA button
    await waitFor(() => {
        expect(screen.getByText(/Start Your Adventure/i)).toBeInTheDocument();
    });
  });

  it('renders Login on /login', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/Magic Link Login/i)).toBeInTheDocument();
    });
  });
});
