import { render, screen } from '@testing-library/react';
import Home from '../page'; // Adjust the path to your page component
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

// Mock the dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Define a type for the resolved value of the auth promise
type AuthReturnType = Awaited<ReturnType<typeof auth>>;

describe('Home Page (/)', () => {
  // Helper to mock the auth function return value
  const mockAuth = (userId: string | null) => {
    // Provide a minimal mock matching the expected structure
    const mockAuthResult: Partial<AuthReturnType> = {
      userId: userId,
      // Add other properties if needed by the component, otherwise keep minimal
    };
    (auth as jest.MockedFunction<typeof auth>).mockResolvedValue(mockAuthResult as AuthReturnType);
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('redirects to /dashboard if user is logged in', async () => {
    // Arrange: Simulate logged-in user
    mockAuth('test-user-123');

    // Act: Call the async Server Component directly and await its resolution
    // It should trigger the redirect internally
    try {
      await Home();
    } catch (error: any) {
      // Intercept the redirect error if necessary (Next.js might throw an error for redirect)
      // Depending on the exact Jest/Next.js interaction, the redirect might throw
      // If it doesn't throw, the assertions below will still run.
      // If it does throw, we might need to check the error type/message if specific checks are needed.
      // For now, we assume the redirect mock handles it or we just check the mock calls.
      // console.log("Caught potential redirect error:", error.message);
    }

    // Assert: Check if redirect was called *during* the component execution
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/dashboard');

    // Assert: Default content shouldn't be rendered because redirect happens first
    // We don't use screen queries here as nothing is rendered in this path.
  });

  test('renders default content if user is not logged in', async () => {
    // Arrange: Simulate logged-out user
    mockAuth(null);

    // Act: Call the async component directly and await the JSX it returns
    const PageComponent = await Home();

    // Act: Render the resolved JSX element
    render(PageComponent);

    // Assert: Check that redirect was NOT called
    expect(redirect).not.toHaveBeenCalled();

    // Assert: Use getBy* queries now, as rendering is synchronous after awaiting Home()
    expect(screen.getByRole('heading', { name: /welcome to concierge/i })).toBeInTheDocument();
    // Use a function matcher to handle text split across elements within the paragraph
    expect(screen.getByText((content, element) => {
      const hasText = (node: Element | null) => node?.textContent === "Please Sign In to continue.";
      const elementHasText = hasText(element);
      // Check children if the parent node doesn't have the full text directly
      const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
      // Match if the element itself has the text and its children don't (to avoid matching nested elements incorrectly)
      // Also check if it's a paragraph tag
      return element?.tagName.toLowerCase() === 'p' && elementHasText && childrenDontHaveText;
    })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });
}); 