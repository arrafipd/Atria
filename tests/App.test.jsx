import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Component', () => {
  it('mounts without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it('renders the ticker as a loop with its visual duplicate hidden from assistive technology', () => {
    render(<App />);
    const ticker = screen.getByRole('region', { name: 'Atria principles' });
    const groups = ticker.querySelectorAll('.ticker-group');

    expect(groups).toHaveLength(2);
    expect(groups[0].textContent).toBe(groups[1].textContent);
    expect(groups[1]).toHaveAttribute('aria-hidden', 'true');
  });
});
