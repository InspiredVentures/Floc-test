import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import React from 'react';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock UserContext
vi.mock('../../contexts/UserContext', () => ({
  useUser: () => ({
    debugLogin: vi.fn(),
  }),
}));

// Mock Supabase and AuthService to avoid initialization issues
vi.mock('../../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    }
  }
}));

vi.mock('../../services/authService', () => ({
  authService: {
    signInWithEmail: vi.fn(),
    signInAnonymously: vi.fn(),
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles Google login selection', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const googleBtn = screen.getByText(/Continue with Google/i);
    fireEvent.click(googleBtn);

    // Verify loading state
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();

    // Fast-forward time
    vi.advanceTimersByTime(1800);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('handles Protocol login selection', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const protocolBtn = screen.getByText(/Inspired Protocol \(SSO\)/i);
    fireEvent.click(protocolBtn);

    // Verify loading state
    expect(screen.getByText('Connecting Node...')).toBeInTheDocument();

    // Fast-forward time
    vi.advanceTimersByTime(1800);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });
});
