import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock the Clerk components used in Navbar
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => 
    (global as any).__mockClerkState?.isSignedIn ? children : null,
  SignedOut: ({ children }: { children: React.ReactNode }) =>
    !(global as any).__mockClerkState?.isSignedIn ? children : null,
  SignInButton: ({ children }: { children: React.ReactNode }) => 
    !(global as any).__mockClerkState?.isSignedIn ? <div data-testid="signin-button-wrapper">{children}</div> : null,
  UserButton: () => 
    (global as any).__mockClerkState?.isSignedIn ? <div data-testid="user-button">Mock UserButton</div> : null,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset mock state before each test
    (global as any).__mockClerkState = { isSignedIn: false };
  });

  test('renders Sign In button when user is signed out', () => {
    (global as any).__mockClerkState.isSignedIn = false;
    render(<Navbar />);

    // Check if the shadcn Button inside SignInButton is rendered
    // We find it by the text 'Sign In'
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();

    // Check that the UserButton is not rendered
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
  });

  test('renders UserButton when user is signed in', () => {
    (global as any).__mockClerkState.isSignedIn = true;
    render(<Navbar />);

    // Check if the UserButton mock is rendered
    const userButton = screen.getByTestId('user-button');
    expect(userButton).toBeInTheDocument();

    // Check that the SignInButton is not rendered (its wrapper specifically)
    expect(screen.queryByTestId('signin-button-wrapper')).not.toBeInTheDocument();
  });

  test('renders the app title link', () => {
    render(<Navbar />);
    const titleLink = screen.getByRole('link', { name: /concierge app/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });
}); 