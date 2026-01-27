import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-brand-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-slate-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border-brand-600');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('px-4', 'py-2');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toHaveClass('px-6', 'py-3');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('px-8', 'py-4');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('handles click events', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(clicked).toBe(true);
  });
});
