import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../page';

// Mock the AssetTable component
jest.mock('@/components/assets/AssetTable', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="mock-asset-table">Mock AssetTable Content</div>;
});

describe('Dashboard Page (/dashboard)', () => {
  beforeEach(() => {
    // Render the component before each test
    render(<DashboardPage />);
  });

  it('should render the main heading', () => {
    const heading = screen.getByRole('heading', {
      name: /dashboard - asset overview/i,
      level: 1, 
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the AssetTable component (mocked)', () => {
    // Check if the mock component's content is rendered
    const mockAssetTable = screen.getByTestId('mock-asset-table');
    expect(mockAssetTable).toBeInTheDocument();
    expect(mockAssetTable).toHaveTextContent('Mock AssetTable Content');
  });
}); 