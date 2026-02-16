import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateVenture from './CreateVenture';
import { describe, it, expect, vi } from 'vitest';

describe('CreateVenture', () => {
  it('renders step 1 initially', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText(/What's the/i)).toBeInTheDocument();
    expect(screen.getByText(/purpose/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Amazon River/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Where are we heading/i)).toBeInTheDocument();
  });

  it('updates inputs correctly', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/e.g. Amazon River/i);
    const destInput = screen.getByPlaceholderText(/Where are we heading/i);

    fireEvent.change(titleInput, { target: { value: 'My Trip' } });
    fireEvent.change(destInput, { target: { value: 'Paris' } });

    expect(titleInput).toHaveValue('My Trip');
    expect(destInput).toHaveValue('Paris');
  });

  it('navigates to step 2', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    const button = screen.getByText('Continue');
    fireEvent.click(button);

    expect(screen.getByText(/Choose the/i)).toBeInTheDocument();
    expect(screen.getByText(/Vibe/i)).toBeInTheDocument();
  });

  it('selects vibe in step 2', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    // Go to step 2
    fireEvent.click(screen.getByText('Continue'));

    const luxuryOption = screen.getByText('Impact Luxury');
    fireEvent.click(luxuryOption);

    // Verify selection by checking for active class on the button
    const button = luxuryOption.closest('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('navigates to step 3', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    // Step 1 -> 2
    fireEvent.click(screen.getByText('Continue'));
    // Step 2 -> 3
    fireEvent.click(screen.getByText('Continue'));

    expect(screen.getByText('Ready for Lift Off!')).toBeInTheDocument();
    expect(screen.getByText('Launch Venture')).toBeInTheDocument();
  });

  it('displays correct info in step 3', () => {
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    // Step 1
    fireEvent.change(screen.getByPlaceholderText(/e.g. Amazon River/i), { target: { value: 'Test Venture' } });
    fireEvent.change(screen.getByPlaceholderText(/Where are we heading/i), { target: { value: 'Mars' } });
    fireEvent.click(screen.getByText('Continue'));

    // Step 2
    fireEvent.click(screen.getByText('Impact Luxury'));
    fireEvent.click(screen.getByText('Continue'));

    // Step 3
    expect(screen.getByText('Test Venture')).toBeInTheDocument();
    expect(screen.getByText('Mars')).toBeInTheDocument();
    // Use regex to match case insensitive as the text content is "luxury Impact"
    expect(screen.getByText(/luxury Impact/i)).toBeInTheDocument();
  });

  it('calls onComplete when Launch Venture is clicked', () => {
    const onComplete = vi.fn();
    render(
      <MemoryRouter>
        <CreateVenture onBack={vi.fn()} onComplete={onComplete} />
      </MemoryRouter>
    );

    // Step 1 -> 2
    fireEvent.click(screen.getByText('Continue'));
    // Step 2 -> 3
    fireEvent.click(screen.getByText('Continue'));

    // Step 3 -> Complete
    fireEvent.click(screen.getByText('Launch Venture'));

    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onBack when close button is clicked', () => {
    const onBack = vi.fn();
    render(
      <MemoryRouter>
        <CreateVenture onBack={onBack} onComplete={vi.fn()} />
      </MemoryRouter>
    );

    const closeButton = screen.getByText('close').closest('button');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);

    expect(onBack).toHaveBeenCalled();
  });
});
