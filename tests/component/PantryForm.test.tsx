import { render, screen } from '@testing-library/react';
import PantryPage from '@/app/(authed)/pantry/page';

describe('Pantry form', () => {
  it('renders input and add button', () => {
    render(<PantryPage /> as any);
    expect(screen.getByPlaceholderText('Add item')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
});

