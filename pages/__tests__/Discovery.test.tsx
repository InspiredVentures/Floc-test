import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Discovery from '../Discovery';
import { useUser } from '../../contexts/UserContext';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => (
      <div onClick={onClick} className={className} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

// Mock UserContext
const mockCommunities = [
  {
    id: '1',
    title: 'Eco Warriors',
    description: 'Saving the planet one step at a time',
    category: 'Global',
    memberCount: '150',
    image: 'eco.jpg',
    upcomingTrips: []
  },
  {
    id: '2',
    title: 'Mountain Hikers',
    description: 'Climbing the highest peaks',
    category: 'Planning',
    memberCount: '45',
    image: 'hike.jpg',
    upcomingTrips: []
  },
  {
    id: '3',
    title: 'City Explorers',
    description: 'Discovering urban gems',
    category: 'Confirmed',
    memberCount: '80',
    image: 'city.jpg',
    upcomingTrips: []
  },
];

vi.mock('../../contexts/UserContext', () => ({
  useUser: vi.fn(),
}));

describe('Discovery Component', () => {
  beforeEach(() => {
    (useUser as any).mockReturnValue({
      communities: mockCommunities,
      isMember: vi.fn(() => false),
      joinCommunity: vi.fn(),
      leaveCommunity: vi.fn(),
    });
  });

  it('renders communities correctly', async () => {
    render(<Discovery />);

    // Wait for loading to finish (simulated by setTimeout in component)
    await waitFor(() => {
      expect(screen.getByText('Eco Warriors')).toBeInTheDocument();
      expect(screen.getByText('Mountain Hikers')).toBeInTheDocument();
      expect(screen.getByText('City Explorers')).toBeInTheDocument();
    });
  });

  it('filters communities by category', async () => {
    render(<Discovery />);

    await waitFor(() => screen.getByText('Eco Warriors'));

    // Click on 'Planning' category
    const planningButton = screen.getByText('Planning', { selector: 'button' });
    fireEvent.click(planningButton);

    await waitFor(() => {
      expect(screen.queryByText('Eco Warriors')).not.toBeInTheDocument();
      expect(screen.getByText('Mountain Hikers')).toBeInTheDocument(); // Category: Planning
      expect(screen.queryByText('City Explorers')).not.toBeInTheDocument();
    });
  });

  it('filters communities by search query', async () => {
    render(<Discovery />);

    await waitFor(() => screen.getByText('Eco Warriors'));

    const searchInput = screen.getByPlaceholderText('Search niche or community...');
    fireEvent.change(searchInput, { target: { value: 'Mountain' } });

    await waitFor(() => {
      expect(screen.queryByText('Eco Warriors')).not.toBeInTheDocument();
      expect(screen.getByText('Mountain Hikers')).toBeInTheDocument();
      expect(screen.queryByText('City Explorers')).not.toBeInTheDocument();
    });
  });

  it('filters by search query description', async () => {
    render(<Discovery />);

    await waitFor(() => screen.getByText('Eco Warriors'));

    const searchInput = screen.getByPlaceholderText('Search niche or community...');
    fireEvent.change(searchInput, { target: { value: 'urban gems' } }); // From City Explorers description

    await waitFor(() => {
      expect(screen.queryByText('Eco Warriors')).not.toBeInTheDocument();
      expect(screen.queryByText('Mountain Hikers')).not.toBeInTheDocument();
      expect(screen.getByText('City Explorers')).toBeInTheDocument();
    });
  });

  it('shows empty state when no communities match', async () => {
    render(<Discovery />);

    await waitFor(() => screen.getByText('Eco Warriors'));

    const searchInput = screen.getByPlaceholderText('Search niche or community...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/No communities found for your selection/i)).toBeInTheDocument();
    });
  });
});
