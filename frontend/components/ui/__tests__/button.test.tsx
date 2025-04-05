import { render, screen, fireEvent } from '@testing-library/react';
import { Button, buttonVariants } from '../button'; // Adjust path as necessary
import { cn } from '@/lib/utils'; // Assuming cn is needed for class checks
import React from 'react';

describe('Button Component', () => {
  test('renders default button correctly', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(cn(buttonVariants({ variant: 'default', size: 'default' })));
    expect(button).not.toBeDisabled();
  });

  // Test each variant
  const variants: Array<NonNullable<Parameters<typeof buttonVariants>[0]>['variant']> = [
    'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'
  ];
  variants.forEach(variant => {
    test(`renders with variant: ${variant}`, () => {
      render(<Button variant={variant}>Variant {variant}</Button>);
      const button = screen.getByRole('button', { name: new RegExp(`variant ${variant}`, 'i') });
      expect(button).toBeInTheDocument();
      // Check if the base class and variant-specific class logic applies (simplified check)
      expect(button).toHaveClass(cn(buttonVariants({ variant: variant })))});
  });

  // Test each size
  const sizes: Array<NonNullable<Parameters<typeof buttonVariants>[0]>['size']> = [
    'default', 'sm', 'lg', 'icon'
  ];
  sizes.forEach(size => {
    test(`renders with size: ${size}`, () => {
      render(<Button size={size}>{size === 'icon' ? '<i>Icon</i>' : `Size ${size}`}</Button>); // Use simple content for icon
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(cn(buttonVariants({ size: size })))});
  });

  test('renders as child component when asChild is true', () => {
    render(
      <Button asChild variant="link" size="sm">
        <a href="/test">Link Button</a>
      </Button>
    );

    // Should render an anchor tag, not a button
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    // The anchor tag should still have the button classes applied
    expect(link).toHaveClass(cn(buttonVariants({ variant: 'link', size: 'sm' })));
    expect(link).toHaveAttribute('href', '/test');
  });

  test('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders disabled button correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50'); // Check for disabled class
  });

  test('applies additional className', () => {
    render(<Button className="extra-class">Extra Class</Button>);
    const button = screen.getByRole('button', { name: /extra class/i });
    expect(button).toHaveClass('extra-class');
    // Check it still has default variant/size classes too
    expect(button).toHaveClass(cn(buttonVariants({ variant: 'default', size: 'default' })));
  });

  test('renders with specific button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });
}); 