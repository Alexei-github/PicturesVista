/** @jest-environment jsdom */
import Home from '@/page';
import { render, screen } from '@testing-library/react';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /PicturesVista/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
