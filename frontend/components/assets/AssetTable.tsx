"use client"; // Add use client if it interacts with client-side features or state

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAssets, type Asset } from "@/api/assets"; // Import fetchAssets

const AssetTable: React.FC = () => {
  // Add state for assets, error, and loading
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedAssets = await fetchAssets();
        setAssets(fetchedAssets);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching assets.");
        }
        setAssets([]); // Clear assets on error
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      {error && (
        <div className="text-red-600 bg-red-100 border border-red-400 p-4 rounded mb-4">
          <p>Error loading assets:</p>
          <p>{error}</p>
          {/* Consider removing API URL from user-facing error */}
          {/* <p>Please ensure the backend API is running and the URL ({process.env.NEXT_PUBLIC_API_URL}/api/assets) is correct.</p> */}
        </div>
      )}

      <Table>
        <TableCaption>A list of company assets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Asset ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading assets...</TableCell>
            </TableRow>
          )}
          {!isLoading && assets.length === 0 && !error && (
             <TableRow>
               <TableCell colSpan={6} className="text-center">No assets found.</TableCell>
            </TableRow>
          )}
          {!isLoading && assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.serialNumber}</TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>{asset.customer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AssetTable; 