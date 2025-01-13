import { fireEvent, render, screen } from '@testing-library/react';
import PinButton from '@/components/sidebar/PinButton';

describe('PinButton', () => {
  const onClick = jest.fn();
  // function timeout(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  it('renders a pushpin symbol', () => {
    render(<PinButton pinned={true} setPinned={onClick} />);

    const pin = screen.getByTestId('pushpin');
    expect(pin.innerHTML).toBe('📌');
    const styles = getComputedStyle(pin);
    expect(styles.transform).toBe('rotate(10deg)');

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    const stylesBtn = getComputedStyle(button);
    expect(stylesBtn.textShadow).toBe('0 0 0 blue');
  });

  it('rotetes pushpin symbol when not pinned', async () => {
    render(<PinButton pinned={false} setPinned={onClick} />);

    const pin = screen.getByTestId('pushpin');
    let styles = getComputedStyle(pin);
    expect(styles.transform).toBe('rotate(45deg)');

    const button = screen.getByRole('button');
    const stylesBtn = getComputedStyle(button);
    expect(stylesBtn.textShadow).toBe('0 0 0 rgb(99, 99, 99)');
  });

  it('calls passed function on button click', async () => {
    render(<PinButton pinned={false} setPinned={onClick} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
