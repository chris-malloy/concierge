import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssetTable from '../AssetTable'; // Adjust path as necessary
import { fetchAssets } from '@/api/assets'; // Import the function to mock

// Mock the fetchAssets API call
jest.mock('@/api/assets', () => ({
  fetchAssets: jest.fn(),
}));

// Cast the mocked function to allow Jest mock function methods
const mockedFetchAssets = fetchAssets as jest.Mock;

describe('<AssetTable />', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedFetchAssets.mockClear();
  });

  test('displays loading state initially', () => {
    mockedFetchAssets.mockResolvedValueOnce([]); // Mock a pending promise that doesn't resolve immediately
    render(<AssetTable />);
    expect(screen.getByText(/loading assets.../i)).toBeInTheDocument();
  });

  test('displays assets when data is fetched successfully', async () => {
    const mockAssets = [
      { id: '1', name: 'Laptop A', type: 'Equipment', serialNumber: 'SN111', status: 'Active', customer: 'Cust A' },
      { id: '2', name: 'License B', type: 'License', serialNumber: '', status: 'Active', customer: 'Cust B' },
    ];
    mockedFetchAssets.mockResolvedValueOnce(mockAssets);

    render(<AssetTable />);

    // Wait for the loading state to disappear and data to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();
    });

    // Check for table headers (optional but good practice)
    expect(screen.getByRole('columnheader', { name: /asset id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();

    // Check for rendered asset data
    expect(screen.getByRole('cell', { name: /laptop a/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /sn111/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /cust a/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /license b/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /cust b/i })).toBeInTheDocument();
  });

  test('displays "no assets found" when fetch is successful but returns empty array', async () => {
    mockedFetchAssets.mockResolvedValueOnce([]); // Simulate empty response

    render(<AssetTable />);

    await waitFor(() => {
      expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/no assets found/i)).toBeInTheDocument();
  });

  test('displays error message when data fetching fails', async () => {
    const errorMessage = 'Failed to fetch assets from API';
    mockedFetchAssets.mockRejectedValueOnce(new Error(errorMessage));

    render(<AssetTable />);

    await waitFor(() => {
      expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();
    });

    // Check if the error container is displayed
    expect(screen.getByText(/error loading assets:/i)).toBeInTheDocument();
    // Check if the specific error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // Ensure no assets are shown
    expect(screen.queryByRole('cell')).not.toBeInTheDocument(); // No data cells should be present
  });
}); 