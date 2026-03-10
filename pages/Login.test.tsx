import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Login from './Login';
import { authService } from '../services/authService';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock FlocLogo
vi.mock('../components/FlocLogo', () => ({
    FlocLogo: () => <div data-testid="floc-logo">FlocLogo</div>
}));

// Mock UserContext
const mockDebugLogin = vi.fn();
vi.mock('../contexts/UserContext', () => ({
    useUser: () => ({
        debugLogin: mockDebugLogin
    })
}));

// Mock authService
vi.mock('../services/authService', () => ({
    authService: {
        signInWithEmail: vi.fn(),
        signInAnonymously: vi.fn(),
    }
}));

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    isSupabaseConfigured: true,
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
        }
    }
}));

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService.signInWithEmail as any).mockResolvedValue({ error: null });
        (authService.signInAnonymously as any).mockResolvedValue({ error: null });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders login form correctly', () => {
        render(<Login />);

        expect(screen.getByPlaceholderText(/enter your explorer email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /magic link login/i })).toBeInTheDocument();
    });

    it('handles email submission correctly', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText(/enter your explorer email/i);
        const submitButton = screen.getByRole('button', { name: /magic link login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(authService.signInWithEmail).toHaveBeenCalledWith('test@example.com');
        });

        expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
    });

    it('handles protocol login with callback', () => {
        vi.useFakeTimers();
        const onLogin = vi.fn();
        render(<Login onLogin={onLogin} />);

        const protocolButton = screen.getByText(/inspired protocol/i);
        fireEvent.click(protocolButton);

        expect(screen.getByText(/connecting node/i)).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1800);
        });

        expect(onLogin).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles protocol login with navigation when callback is missing', () => {
        vi.useFakeTimers();
        render(<Login />);

        const protocolButton = screen.getByText(/inspired protocol/i);
        fireEvent.click(protocolButton);

        act(() => {
            vi.advanceTimersByTime(1800);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });
});
