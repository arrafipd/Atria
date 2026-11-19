import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Tokens from '../src/pages/Tokens';

describe('Tokens validation', () => {
  beforeEach(() => localStorage.clear());

  it('does not add a token with an empty name or value and shows errors', () => {
    render(<Tokens />);
    const before = screen.getAllByLabelText('Token name').length;
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getAllByRole('alert').length).toBe(2);
    expect(screen.getAllByLabelText('Token name').length).toBe(before);
  });

  it('rejects a duplicate name', () => {
    render(<Tokens />);
    fireEvent.change(screen.getByLabelText('New token name'), { target: { value: 'space.1' } });
    fireEvent.change(screen.getByLabelText('New token value'), { target: { value: '#123456' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('already exists');
  });

  it('adds a valid token', () => {
    render(<Tokens />);
    const before = screen.getAllByLabelText('Token name').length;
    fireEvent.change(screen.getByLabelText('New token name'), { target: { value: 'color.accent' } });
    fireEvent.change(screen.getByLabelText('New token value'), { target: { value: '#112233' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.queryAllByRole('alert').length).toBe(0);
    expect(screen.getAllByLabelText('Token name').length).toBe(before + 1);
  });

  it('keeps an invalid edit out of storage and reverts on blur', () => {
    render(<Tokens />);
    const first = screen.getAllByLabelText('Token name')[0];
    const original = first.value;
    fireEvent.change(first, { target: { value: '' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(localStorage.getItem('atria:tokens')).toBeNull();
    fireEvent.blur(first);
    expect(screen.getAllByLabelText('Token name')[0].value).toBe(original);
  });
});
