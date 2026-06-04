'use client';

import { useParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import { MOCK_COLLECTIONS } from '@/data/dashboardData';

import ProductPage, {
  ProductPageItem,
} from '@/components/product/ProductPage';

import UserDashboardLayout from '@/app/user-dashboard/layout';
/**
 * Mock product-level data
 */
const PRODUCT_MOCK_DEFAULTS: Record<
  string,
  Partial<ProductPageItem>
> = {
  'col-1': {
    totalValuation: 5400000,
    pricePerFraction: 1000,
    lockupMonths: 12,
    totalFractions: 5400,
    fractionsRemaining: 3200,
  },

  'col-2': {
    totalValuation: 150000,
    pricePerFraction: 150,
    lockupMonths: 6,
    totalFractions: 1000,
    fractionsRemaining: 650,
  },

  'col-3': {
    totalValuation: 320000,
    pricePerFraction: 200,
    lockupMonths: 9,
    totalFractions: 1600,
    fractionsRemaining: 900,
  },

  'col-4': {
    totalValuation: 640000,
    pricePerFraction: 50,
    lockupMonths: 3,
    totalFractions: 12800,
    fractionsRemaining: 8000,
  },

  'col-5': {
    totalValuation: 900000,
    pricePerFraction: 500,
    lockupMonths: 18,
    totalFractions: 1800,
    fractionsRemaining: 1100,
  },

  'col-6': {
    totalValuation: 380000,
    pricePerFraction: 250,
    lockupMonths: 6,
    totalFractions: 1520,
    fractionsRemaining: 760,
  },

  'col-7': {
    totalValuation: 225000,
    pricePerFraction: 100,
    lockupMonths: 9,
    totalFractions: 2250,
    fractionsRemaining: 1400,
  },

  'col-8': {
    totalValuation: 300000,
    pricePerFraction: 125,
    lockupMonths: 6,
    totalFractions: 2400,
    fractionsRemaining: 1800,
  },
};

export default function ProductRoute() {
  const { id } = useParams<{ id: string }>();

  /**
   * Find collection using URL id
   */
  const col = MOCK_COLLECTIONS.find(
    (c) => c.id === id
  );

  /**
   * If no product found
   */
  if (!col) {
    return (
      <UserDashboardLayout>
        <Box sx={{ p: 5 }}>
          <Typography>
            Product not found.
          </Typography>
        </Box>
      </UserDashboardLayout>
    );
  }

  /**
   * Extra mock values
   */
  const extras =
    PRODUCT_MOCK_DEFAULTS[col.id] ?? {};

  /**
   * Final product object
   */
  const item: ProductPageItem = {
    id: col.id,

    title: col.title,

    category: col.category,

    custodyService:
      'Linkay Custody Services',

    images: col.previewImages as [
      string,
      string,
      string,
      string
    ],

    totalValuation:
      extras.totalValuation ?? 150000,

    pricePerFraction:
      extras.pricePerFraction ?? 150,

    compliance: 'ERC - 3643',

    lockupMonths:
      extras.lockupMonths ?? 6,

    totalFractions:
      extras.totalFractions ?? 1000,

    fractionsRemaining:
      extras.fractionsRemaining ?? 650,

    description:
      `${col.title} offers fractionalised ownership through blockchain tokenisation. ` +
      `Each fraction grants proportional rights and yield participation in this ` +
      `${col.category.toLowerCase()} asset, secured by Linkay Custody Services.`,

    ipfsUrl:
      `https://ipfs.io/ipfs/Qm_${col.id}`,

    ipfsMetadataUrl:
      `https://ipfs.io/ipfs/Qm_${col.id}_meta`,
  };

  return (
    <UserDashboardLayout>
      <ProductPage item={item} />
    </UserDashboardLayout>
  );
}