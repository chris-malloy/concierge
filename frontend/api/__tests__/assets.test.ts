import { fetchAssets, type Asset } from '../assets';

// Helper to set environment variables for tests
const setEnv = (key: string, value: string | undefined) => {
  const originalValue = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
  // Return a function to restore the original value
  return () => {
    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  };
};

// Global fetch mock
global.fetch = jest.fn();

// Mock console.error
let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
  // Reset mocks and spies before each test
  (global.fetch as jest.Mock).mockClear();
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error output
});

afterEach(() => {
  // Restore console.error
  consoleErrorSpy.mockRestore();
});

describe('fetchAssets', () => {
  const MOCK_API_URL = 'http://test.api';

  test('should fetch and return assets successfully', async () => {
    const mockAssets: Asset[] = [
      { id: '1', name: 'Asset 1', type: 'TypeA', serialNumber: 'SN1', status: 'Active', customer: 'Cust1' },
    ];
    const restoreEnv = setEnv('NEXT_PUBLIC_API_URL', MOCK_API_URL);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAssets,
    } as Response);

    const assets = await fetchAssets();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${MOCK_API_URL}/api/assets`);
    expect(assets).toEqual(mockAssets);
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    restoreEnv(); // Clean up env var
  });

  test('should throw error if NEXT_PUBLIC_API_URL is not defined', async () => {
    const restoreEnv = setEnv('NEXT_PUBLIC_API_URL', undefined);

    await expect(fetchAssets()).rejects.toThrow('API URL is not configured.');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: NEXT_PUBLIC_API_URL is not defined.');
    expect(global.fetch).not.toHaveBeenCalled();

    restoreEnv();
  });

  test('should throw error on fetch network failure', async () => {
    const networkError = new Error('Network failure');
    const restoreEnv = setEnv('NEXT_PUBLIC_API_URL', MOCK_API_URL);

    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(fetchAssets()).rejects.toThrow(
      `Could not fetch assets from the backend: Error: ${networkError.message}`
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${MOCK_API_URL}/api/assets`);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch assets:', networkError);

    restoreEnv();
  });

  test('should throw error on non-OK response status', async () => {
    const restoreEnv = setEnv('NEXT_PUBLIC_API_URL', MOCK_API_URL);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(fetchAssets()).rejects.toThrow('Failed to fetch assets. Status: 500');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${MOCK_API_URL}/api/assets`);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching assets: 500 Internal Server Error');

    restoreEnv();
  });

  // Optional: Test for JSON parsing error if needed, though less common with standard fetch
  test('should throw error if response.json() fails', async () => {
    const jsonError = new Error('Invalid JSON');
    const restoreEnv = setEnv('NEXT_PUBLIC_API_URL', MOCK_API_URL);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw jsonError; }, // Simulate json parsing failure
    } as unknown as Response); // Cast to unknown first, then Response

    await expect(fetchAssets()).rejects.toThrow(
      `Could not fetch assets from the backend: Error: ${jsonError.message}`
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch assets:', jsonError);

    restoreEnv();
  });
}); 