import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Components from '../src/pages/Components';

const cardCount = () => screen.queryAllByRole('button', { name: /open component/i }).length;

describe('Components search and filters', () => {
  it('shows every component by default', () => {
    render(<Components />);
    expect(cardCount()).toBe(10);
  });

  it('filters by name and description', () => {
    render(<Components />);
    fireEvent.change(screen.getByLabelText('Search components'), { target: { value: 'modal' } });
    expect(cardCount()).toBe(1);
    fireEvent.change(screen.getByLabelText('Search components'), { target: { value: 'labelled' } });
    expect(cardCount()).toBeGreaterThan(1);
  });

  it('combines search with a category filter', () => {
    render(<Components />);
    fireEvent.change(screen.getByLabelText('Filter by category'), { target: { value: 'Forms' } });
    expect(cardCount()).toBe(3);
    fireEvent.change(screen.getByLabelText('Search components'), { target: { value: 'checkbox' } });
    expect(cardCount()).toBe(1);
  });

  it('shows an empty state and can clear it', () => {
    render(<Components />);
    fireEvent.change(screen.getByLabelText('Search components'), { target: { value: 'zzzz' } });
    expect(screen.getByRole('status')).toHaveTextContent('No components match');
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(cardCount()).toBe(10);
  });
});
