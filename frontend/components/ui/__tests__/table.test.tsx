import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table';

// Basic test structure - assumes `cn` utility works as expected

describe('Table Components', () => {
  const testId = 'test-element';
  const customClass = 'my-custom-class';

  describe('Table', () => {
    test('renders table with default classes and container', () => {
      render(<Table data-testid={testId} />);
      const tableElement = screen.getByTestId(testId);
      expect(tableElement.tagName).toBe('TABLE');
      expect(tableElement).toHaveClass('w-full', 'caption-bottom', 'text-sm');
      // Check the wrapping div
      expect(tableElement.parentElement).toHaveClass('relative', 'w-full', 'overflow-x-auto');
    });

    test('applies custom className', () => {
      render(<Table data-testid={testId} className={customClass} />);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });

    test('renders children', () => {
      render(<Table><tbody><tr><td>Child</td></tr></tbody></Table>);
      expect(screen.getByText('Child')).toBeInTheDocument();
    });
  });

  describe('TableHeader', () => {
    test('renders thead with default classes', () => {
      render(<Table><TableHeader data-testid={testId} /></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('THEAD');
      expect(element).toHaveClass('[&_tr]:border-b');
    });

    test('applies custom className', () => {
      render(<Table><TableHeader data-testid={testId} className={customClass} /></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableBody', () => {
    test('renders tbody with default classes', () => {
      render(<Table><TableBody data-testid={testId} /></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('TBODY');
      expect(element).toHaveClass('[&_tr:last-child]:border-0');
    });

    test('applies custom className', () => {
      render(<Table><TableBody data-testid={testId} className={customClass} /></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableFooter', () => {
    test('renders tfoot with default classes', () => {
      render(<Table><TableFooter data-testid={testId} /></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('TFOOT');
      expect(element).toHaveClass(
        'bg-muted/50', 
        'border-t',
        'font-medium',
        '[&>tr]:last:border-b-0'
      );
    });

    test('applies custom className', () => {
      render(<Table><TableFooter data-testid={testId} className={customClass} /></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableRow', () => {
    test('renders tr with default classes', () => {
      render(<Table><tbody><TableRow data-testid={testId} /></tbody></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('TR');
      expect(element).toHaveClass(
        'hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
        'border-b',
        'transition-colors'
      );
    });

    test('applies custom className', () => {
      render(<Table><tbody><TableRow data-testid={testId} className={customClass} /></tbody></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableHead', () => {
    test('renders th with default classes', () => {
      render(<Table><thead><tr><TableHead data-testid={testId} /></tr></thead></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('TH');
      expect(element).toHaveClass(
        'text-foreground',
        'h-10',
        'px-2',
        'text-left',
        'align-middle',
        'font-medium',
        'whitespace-nowrap',
        '[&:has([role=checkbox])]:pr-0',
        '[&>[role=checkbox]]:translate-y-[2px]'
      );
    });

    test('applies custom className', () => {
      render(<Table><thead><tr><TableHead data-testid={testId} className={customClass} /></tr></thead></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableCell', () => {
    test('renders td with default classes', () => {
      render(<Table><tbody><tr><TableCell data-testid={testId} /></tr></tbody></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('TD');
      expect(element).toHaveClass(
        'p-2',
        'align-middle',
        'whitespace-nowrap',
        '[&:has([role=checkbox])]:pr-0',
        '[&>[role=checkbox]]:translate-y-[2px]'
      );
    });

    test('applies custom className', () => {
      render(<Table><tbody><tr><TableCell data-testid={testId} className={customClass} /></tr></tbody></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
    });
  });

  describe('TableCaption', () => {
    const captionText = 'Test Caption';
    test('renders caption with default classes', () => {
      render(<Table><TableCaption data-testid={testId}>{captionText}</TableCaption></Table>);
      const element = screen.getByTestId(testId);
      expect(element.tagName).toBe('CAPTION');
      expect(element).toHaveTextContent(captionText);
      expect(element).toHaveClass('text-muted-foreground', 'mt-4', 'text-sm');
    });

    test('applies custom className', () => {
      render(<Table><TableCaption data-testid={testId} className={customClass}>{captionText}</TableCaption></Table>);
      expect(screen.getByTestId(testId)).toHaveClass(customClass);
      expect(screen.getByTestId(testId)).toHaveClass('text-muted-foreground'); // Ensure default is still there
    });
  });
}); 