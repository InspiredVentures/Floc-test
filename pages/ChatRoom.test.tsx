import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatRoom from './ChatRoom';
import { useUser } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the UserContext
vi.mock('../contexts/UserContext', () => ({
  useUser: vi.fn(),
}));

describe('ChatRoom Performance', () => {
  beforeEach(() => {
    // Mock offsetHeight/Width for JSDOM so Virtuoso renders items
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 });
  });

  it('renders a virtualized list (significantly fewer DOM nodes than total messages)', async () => {
    // Generate 1000 messages
    const messages = Array.from({ length: 1000 }, (_, i) => ({
      id: `msg-${i}`,
      conversationId: 'community-1',
      senderId: i % 2 === 0 ? 'alex-sterling' : 'other-user',
      senderName: i % 2 === 0 ? 'Alex Sterling' : 'Other User',
      senderAvatar: 'avatar.png',
      content: `Message ${i}`,
      timestamp: Date.now() - (1000 - i) * 60000,
      read: true,
    }));

    const mockConversations = [
      {
        id: 'community-1',
        participants: ['alex-sterling', 'other-user'],
        participantDetails: [],
        unreadCount: 0,
        type: 'group',
      },
    ];

    (useUser as any).mockReturnValue({
      messages,
      conversations: mockConversations,
      sendMessage: vi.fn(),
      markAsRead: vi.fn(),
      setTypingStatus: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ChatRoom
          id="community-1"
          title="Test Community"
          subtitle="1000 members"
          onBack={vi.fn()}
        />
      </MemoryRouter>
    );

    // Wait for Virtuoso to render
    // We check that we have SOME messages, but not ALL.
    // Virtuoso usually renders enough to fill the viewport + overscan.
    // With 500px height and messages being small, maybe 20-50 messages.

    // Check if any messages are rendered
    const messageElements = await screen.findAllByText(/Message \d+/);

    // Assert that we have some messages (it's working)
    expect(messageElements.length).toBeGreaterThan(0);

    // Assert that we don't have all 1000 messages (virtualization working)
    expect(messageElements.length).toBeLessThan(100);
  });
});
