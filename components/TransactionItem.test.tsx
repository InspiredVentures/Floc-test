import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionItem } from './TransactionItem';

describe('TransactionItem', () => {
  it('renders transaction details correctly', () => {
    render(
      <TransactionItem
        title="Test Transaction"
        date="Jan 1, 2024"
        amount="+ $100.00"
        status="Completed"
      />
    );

    expect(screen.getByText('Test Transaction')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Jan 1, 2024'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Completed'))).toBeInTheDocument();
    expect(screen.getByText('+ $100.00')).toBeInTheDocument();
  });

  it('applies emerald color for positive amounts', () => {
    render(
      <TransactionItem
        title="Income"
        date="Jan 1, 2024"
        amount="+ $500.00"
        status="Received"
      />
    );

    const amountElement = screen.getByText('+ $500.00');
    expect(amountElement).toHaveClass('text-emerald-400');
    expect(amountElement).not.toHaveClass('text-slate-400');
  });

  it('applies slate color for negative amounts', () => {
    render(
      <TransactionItem
        title="Expense"
        date="Jan 1, 2024"
        amount="- $50.00"
        status="Paid"
      />
    );

    const amountElement = screen.getByText('- $50.00');
    expect(amountElement).toHaveClass('text-slate-400');
    expect(amountElement).not.toHaveClass('text-emerald-400');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <TransactionItem
        title="Snapshot Item"
        date="Dec 31, 2023"
        amount="+ $1,000.00"
        status="Pending"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
