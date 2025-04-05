import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../theme-toggle'; // Adjust path

// --- Mock next-themes ---
// Keep track of the current theme in the mock
let currentMockTheme = 'light';
const mockSetTheme = jest.fn((newTheme) => {
  currentMockTheme = newTheme;
});

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: currentMockTheme,
    setTheme: mockSetTheme,
  }),
}));
// --- End Mock ---

describe('ThemeToggle Component', () => {

  beforeEach(() => {
    // Reset mocks and mock theme state before each test
    jest.clearAllMocks();
    currentMockTheme = 'light'; // Default to light theme for tests
  });

  test('renders the button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    // Icons are visually tested by their presence/absence via classes in the component,
    // explicitly checking icons can be brittle. We focus on the click behavior.
  });

  test('calls setTheme with "dark" when current theme is "light" on click', () => {
    // Arrange: Ensure mock starts with light theme
    currentMockTheme = 'light';
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('calls setTheme with "light" when current theme is "dark" on click', () => {
    // Arrange: Set mock to dark theme
    currentMockTheme = 'dark';
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  test('handles undefined or other themes by defaulting to setting "light"', () => {
    // Arrange: Set mock to an unexpected theme
    currentMockTheme = 'system'; // Or undefined, null, etc.
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Act
    fireEvent.click(button);

    // Assert: The logic `theme === "light" ? "dark" : "light")` means
    // anything not strictly "light" will result in setting "light"
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

}); 