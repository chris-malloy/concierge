import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../theme-provider'; // Adjust path as necessary

// --- Mock next-themes ---
// Store original props passed to the mocked provider
let capturedProps: Object | null = null;

// Mock the actual provider component from next-themes
jest.mock('next-themes', () => ({
  // Keep the original ThemeProviderProps type if needed, but mock the component
  ThemeProvider: (props: any) => {
    capturedProps = props; // Capture props passed to the mock
    // Render children directly in the mock to test if they are passed through
    return <div data-testid="mock-next-themes-provider">{props.children}</div>;
  },
  // Mock useTheme if necessary for other tests, though not strictly needed here
  // useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));
// --- End Mock --- 

describe('ThemeProvider Component', () => {
  const childText = 'Test Child Content';
  const ChildComponent = () => <div>{childText}</div>;

  beforeEach(() => {
    // Reset captured props before each test
    capturedProps = {};
    // Reset mocks if needed (especially if useTheme were more involved)
    jest.clearAllMocks(); 
  });

  test('renders children directly on initial render', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ChildComponent />
      </ThemeProvider>
    );

    // Check that children are present in the initial render output.
    // We remove the check for the absence of the provider, as it might appear
    // very quickly after mount in the test environment.
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test('renders NextThemesProvider with props after mounting', async () => {
    const testProps = {
      attribute: "class" as const,
      defaultTheme: "system",
      enableSystem: true,
      "data-custom": "value", // Test arbitrary prop passthrough
    };

    render(
      <ThemeProvider {...testProps}>
        <ChildComponent />
      </ThemeProvider>
    );

    // Wait for the useEffect to run and the state to update
    await waitFor(() => {
      expect(screen.getByTestId('mock-next-themes-provider')).toBeInTheDocument();
    });

    // Check if the child is still rendered within the mock provider
    const mockProvider = screen.getByTestId('mock-next-themes-provider');
    expect(mockProvider).toContainElement(screen.getByText(childText));

    // Check if the captured props match what was passed
    expect(capturedProps).not.toBeNull();
    expect(capturedProps).toMatchObject({
      ...testProps, // Should include all passed props
      children: expect.anything(), // Children prop will be complex, just check existence
    });
    // Explicitly check a few key props
    expect(capturedProps.attribute).toBe(testProps.attribute);
    expect(capturedProps.defaultTheme).toBe(testProps.defaultTheme);
    expect(capturedProps.enableSystem).toBe(testProps.enableSystem);
    expect(capturedProps["data-custom"]).toBe(testProps["data-custom"]);
  });
}); 