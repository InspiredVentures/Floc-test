import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { useUser } from '../contexts/UserContext';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../contexts/UserContext', () => ({
  useUser: vi.fn(),
}));

vi.mock('../components/Skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

// Mock Data
const mockProfile = {
  id: 'user-1',
  display_name: 'Test User',
  bio: 'Test Bio',
  avatar_url: 'http://example.com/avatar.jpg',
};

const mockCommunity = {
  id: 'c1',
  title: 'Test Community',
  image: 'http://example.com/community.jpg',
  memberCount: '10',
  category: 'Test Category',
};

const mockTrip = {
  id: 't1',
  title: 'Test Trip',
  destination: 'Test Destination',
  image: 'http://example.com/trip.jpg',
  status: 'CONFIRMED',
};

// We need to mock the MOCK_TRIPS constant since it is imported directly in Profile.tsx
// However, in Vite/Vitest, mocking modules that export constants can be tricky if not done carefully.
// Instead of mocking the module, we can rely on the fact that Profile.tsx filters MOCK_TRIPS based on bookedTripIds.
// But wait, if MOCK_TRIPS in Profile.tsx comes from the real file, `bookedTripIds` must contain IDs that exist in the real MOCK_TRIPS.
// To make the test robust and independent of real data, it is better to mock the constants module.

vi.mock('../constants', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MOCK_TRIPS: [
      {
        id: 't1',
        title: 'Test Trip',
        destination: 'Test Destination',
        image: 'http://example.com/trip.jpg',
        status: 'CONFIRMED',
      }
    ]
  };
});

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useUser as any).mockReturnValue({
      isLoading: true,
      user: null,
      profile: null,
      communities: [],
      joinedCommunityIds: [],
      bookedTripIds: [],
      followingUsernames: [],
    });

    render(<Profile />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders profile content correctly', () => {
    (useUser as any).mockReturnValue({
      isLoading: false,
      user: { id: 'user-1' },
      profile: mockProfile,
      communities: [mockCommunity],
      joinedCommunityIds: ['c1'],
      bookedTripIds: [],
      followingUsernames: [],
    });

    render(<Profile />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Bio')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockProfile.avatar_url);
  });

  it('renders "Profile Not Found" when no profile data', () => {
    (useUser as any).mockReturnValue({
      isLoading: false,
      user: { id: 'user-1' },
      profile: null,
      communities: [],
      joinedCommunityIds: [],
      bookedTripIds: [],
      followingUsernames: [],
    });

    render(<Profile />);

    expect(screen.getByText('Profile Not Found')).toBeInTheDocument();
  });

  it('defaults to "Communities" tab and shows joined communities', () => {
    (useUser as any).mockReturnValue({
      isLoading: false,
      user: { id: 'user-1' },
      profile: mockProfile,
      communities: [mockCommunity],
      joinedCommunityIds: ['c1'],
      bookedTripIds: [],
      followingUsernames: [],
    });

    render(<Profile />);

    // Check tabs
    const communitiesTab = screen.getByText('Communities', { selector: 'button' });
    const tripsTab = screen.getByText('Trips', { selector: 'button' });

    expect(communitiesTab).toHaveClass('bg-primary'); // Active style
    expect(tripsTab).not.toHaveClass('bg-primary'); // Inactive style (should verify class logic)

    // Check content
    expect(screen.getByText('My Communities')).toBeInTheDocument();
    expect(screen.getByText('Test Community')).toBeInTheDocument();
    expect(screen.queryByText('Recent Trips')).not.toBeInTheDocument();
  });

  it('switches to "Trips" tab and shows booked trips', () => {
    (useUser as any).mockReturnValue({
      isLoading: false,
      user: { id: 'user-1' },
      profile: mockProfile,
      communities: [],
      joinedCommunityIds: [],
      bookedTripIds: ['t1'],
      followingUsernames: [],
    });

    render(<Profile />);

    const tripsTab = screen.getByText('Trips', { selector: 'button' });
    fireEvent.click(tripsTab);

    // Check content
    expect(screen.getByText('Recent Trips')).toBeInTheDocument();
    expect(screen.getByText('Test Trip')).toBeInTheDocument();
    expect(screen.queryByText('My Communities')).not.toBeInTheDocument();
  });

  it('switches back to "Communities" tab', () => {
    (useUser as any).mockReturnValue({
      isLoading: false,
      user: { id: 'user-1' },
      profile: mockProfile,
      communities: [mockCommunity],
      joinedCommunityIds: ['c1'],
      bookedTripIds: ['t1'],
      followingUsernames: [],
    });

    render(<Profile />);

    const tripsTab = screen.getByText('Trips', { selector: 'button' });
    const communitiesTab = screen.getByText('Communities', { selector: 'button' });

    // Switch to Trips
    fireEvent.click(tripsTab);
    expect(screen.getByText('Recent Trips')).toBeInTheDocument();

    // Switch back to Communities
    fireEvent.click(communitiesTab);
    expect(screen.getByText('My Communities')).toBeInTheDocument();
  });
});
