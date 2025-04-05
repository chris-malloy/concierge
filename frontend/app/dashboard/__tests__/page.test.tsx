import { render, screen, within } from '@testing-library/react';
import DashboardPage from '../page'; // Adjust path as necessary

describe('Dashboard Page (/dashboard)', () => {
  beforeEach(() => {
    // Render the component before each test
    render(<DashboardPage />);
  });

  test('renders the main heading', () => {
    // Check if the main heading is present
    const heading = screen.getByRole('heading', {
      name: /dashboard - asset overview/i,
      level: 1, // Optional: Check if it's an h1
    });
    expect(heading).toBeInTheDocument();
  });

  test('renders the asset table with caption', () => {
    // Check if the table is present
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check if the caption within the table is present
    // Note: Table captions might not have an explicit role, so we query within the table
    const caption = within(table).getByText(/a list of company assets/i);
    expect(caption).toBeInTheDocument();
  });

  test('renders table headers correctly', () => {
    const table = screen.getByRole('table');
    // Get all rowgroups and assume the first one is the thead
    const rowgroups = within(table).getAllByRole('rowgroup');
    const thead = rowgroups[0]; // Typically thead is the first rowgroup
    const headerRow = within(thead).getByRole('row');

    // Check for each column header within the header row
    expect(within(headerRow).getByRole('columnheader', { name: /asset id/i })).toBeInTheDocument();
    expect(within(headerRow).getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(within(headerRow).getByRole('columnheader', { name: /type/i })).toBeInTheDocument();
    expect(within(headerRow).getByRole('columnheader', { name: /serial number/i })).toBeInTheDocument();
    expect(within(headerRow).getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(within(headerRow).getByRole('columnheader', { name: /customer/i })).toBeInTheDocument();
  });

  test('renders mock asset data in table rows', () => {
    const table = screen.getByRole('table');
    // Get all rowgroups and assume the second one is the tbody
    const rowgroups = within(table).getAllByRole('rowgroup');
    const tbody = rowgroups[1]; // Typically tbody is the second rowgroup

    // Check if the correct number of data rows are rendered (excluding header row)
    const rows = within(tbody).getAllByRole('row');
    expect(rows).toHaveLength(4); // Based on the 4 mock assets

    // Check the content of the first data row as a sample
    const firstRow = rows[0];
    expect(within(firstRow).getByRole('cell', { name: /asset-001/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: /office laptop 1/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: /equipment/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: /sn123456789/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: /active/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: /acme corp/i })).toBeInTheDocument();

    // Optional: Check another row if needed for more confidence
    const thirdRow = rows[2];
    expect(within(thirdRow).getByRole('cell', { name: /asset-003/i })).toBeInTheDocument();
    expect(within(thirdRow).getByRole('cell', { name: /software license a/i })).toBeInTheDocument();
    expect(within(thirdRow).getByRole('cell', { name: /inactive/i })).toBeInTheDocument();
  });
}); 