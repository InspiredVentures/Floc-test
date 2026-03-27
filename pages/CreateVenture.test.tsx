import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateVenture from './CreateVenture';

// Mock react-router-dom
const { mockUseLocation } = vi.hoisted(() => {
  return { mockUseLocation: vi.fn() };
});

vi.mock('react-router-dom', () => ({
  useLocation: mockUseLocation
}));

describe('CreateVenture', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ state: {} });
  });

  it('renders step 1 initially', () => {
    // Override mock for this test if needed, but default is fine
    mockUseLocation.mockReturnValue({ state: {} });

    render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Check for Step 1 content
    expect(screen.getByText(/What's the/i)).toBeInTheDocument();
    expect(screen.getByText(/purpose/i)).toBeInTheDocument();

    // Check for inputs
    // Note: getByLabelText looks for associated label.
    // In the component: <label>Venture Name</label><input ... />
    // The label is not associated with htmlFor or nesting correctly?
    // Let's check the component code again.

    // <div>
    //   <label ...>Venture Name</label>
    //   <input ... />
    // </div>
    // The input is NOT inside the label, and there is no htmlFor/id pair.
    // So getByLabelText will fail.

    // I should use getByPlaceholderText or getByRole with name if applicable, or fix the component accessibility.
    // Given I am writing tests to cover existing code, I should use locators that work.
    // The input has a placeholder: "e.g. Amazon River Cleanup Journey"

    expect(screen.getByPlaceholderText(/e.g. Amazon River Cleanup Journey/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Where are we heading/i)).toBeInTheDocument();

    // Check for Continue button
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('navigates to step 2 when Continue is clicked', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Fill in inputs (optional as there is no validation currently)
    fireEvent.change(screen.getByPlaceholderText(/e.g. Amazon River Cleanup Journey/i), { target: { value: 'My Trip' } });
    fireEvent.change(screen.getByPlaceholderText(/Where are we heading/i), { target: { value: 'Paris' } });

    // Click Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Check for Step 2 content
    expect(screen.getByText(/Choose the/i)).toBeInTheDocument();
    expect(screen.getByText(/Vibe/i)).toBeInTheDocument();
  });

  it('navigates to step 3 when Continue is clicked from step 2', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Go to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Select a vibe (Eco is default)
    // Click Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Check for Step 3 content
    expect(screen.getByText(/Ready for Lift Off!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Launch Venture/i })).toBeInTheDocument();
  });

  it('updates budget when a vibe option is selected', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Go to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Select "Comfort Seekers" (mid)
    fireEvent.click(screen.getByText(/Comfort Seekers/i));

    // Go to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Verify "mid" is displayed in Step 3 review
    // The component displays uppercase budget: {budget} Impact
    expect(screen.getByText(/mid Impact/i)).toBeInTheDocument();
  });

  it('updates progress bar indicators', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    const { container } = render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Find the progress bar container
    // It has classes "mb-10 flex gap-2"
    // We'll use a specific selector to match it.
    const progressBar = container.querySelector('.mb-10.flex.gap-2');
    expect(progressBar).not.toBeNull();

    const getActiveSteps = () => progressBar!.querySelectorAll('.bg-primary').length;

    // Step 1
    expect(getActiveSteps()).toBe(1);

    // Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(getActiveSteps()).toBe(2);

    // Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(getActiveSteps()).toBe(3);
  });

  it('calls onComplete when Launch Venture is clicked', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    const handleComplete = vi.fn();
    render(<CreateVenture onBack={() => {}} onComplete={handleComplete} />);

    // Go to Step 3
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Step 1 -> 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Step 2 -> 3

    // Click Launch Venture
    fireEvent.click(screen.getByRole('button', { name: /Launch Venture/i }));

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when close button is clicked', () => {
    mockUseLocation.mockReturnValue({ state: {} });
    const handleBack = vi.fn();
    render(<CreateVenture onBack={handleBack} onComplete={() => {}} />);

    // Find close button (it has 'close' text in span)
    const closeIcon = screen.getByText('close');
    const closeButton = closeIcon.closest('button');
    fireEvent.click(closeButton!);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('initializes with state from location', () => {
    mockUseLocation.mockReturnValue({
      state: {
        proposal: {
          destination: 'Bali',
          budget: 'luxury'
        }
      }
    });

    render(<CreateVenture onBack={() => {}} onComplete={() => {}} />);

    // Should start at step 2 because destination is provided
    // Code: const [step, setStep] = useState(initialData.destination ? 2 : 1);

    expect(screen.getByText(/Choose the/i)).toBeInTheDocument();

    // Go to Step 3 to verify details
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Verify details in Step 3
    expect(screen.getByText('Bali')).toBeInTheDocument();
    expect(screen.getByText(/luxury/i)).toBeInTheDocument();
  });
});
