import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssetTable from '../AssetTable';
import { fetchAssets } from '@/api/assets';

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
    mockedFetchAssets.mockResolvedValueOnce(new Promise(() => {})); // Keep promise pending
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

    // Use findBy* to wait for content dependent on async state updates
    expect(await screen.findByRole('cell', { name: /laptop a/i })).toBeInTheDocument();

    // Verify loading is gone after finding content
    expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();

    // Check other elements (already rendered)
    expect(screen.getByRole('columnheader', { name: /asset id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /sn111/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /cust a/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /license b/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /cust b/i })).toBeInTheDocument();
  });

  test('displays "no assets found" when fetch is successful but returns empty array', async () => {
    mockedFetchAssets.mockResolvedValueOnce([]);

    render(<AssetTable />);

    // Use findBy* to wait for the specific message
    expect(await screen.findByText(/no assets found/i)).toBeInTheDocument();

    // Verify loading is gone
    expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();
  });

  test('displays error message when data fetching fails', async () => {
    const errorMessage = 'Failed to fetch assets from API';
    mockedFetchAssets.mockRejectedValueOnce(new Error(errorMessage));

    render(<AssetTable />);

    // Use findBy* to wait for the error message container/text
    expect(await screen.findByText(/error loading assets:/i)).toBeInTheDocument();

    // Verify loading is gone
    expect(screen.queryByText(/loading assets.../i)).not.toBeInTheDocument();

    // Check if the specific error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // Ensure no assets are shown
    expect(screen.queryByRole('cell')).not.toBeInTheDocument();
  });
}); 