import { useMemo } from 'react';
import { Category, MOCK_COLLECTIONS, MOCK_AUCTIONS } from '@/data/dashboardData';

// TODO: When backend tables are ready, replace the mock imports above with
// real API calls. Example using React Query:
//   const { data: collections } = useQuery(['collections', activeCategory], () =>
//     fetchCollections(activeCategory === 'All Categories' ? undefined : activeCategory)
//   );
// The hook's return shape stays the same — no other files need to change.

export function useDashboardData(activeCategory: Category) {
  const collections = useMemo(
    () =>
      activeCategory === 'All Categories'
        ? MOCK_COLLECTIONS
        : MOCK_COLLECTIONS.filter((c) => c.category === activeCategory),
    [activeCategory],
  );

  const auctions = useMemo(
    () =>
      activeCategory === 'All Categories'
        ? MOCK_AUCTIONS
        : MOCK_AUCTIONS.filter((a) => a.category === activeCategory),
    [activeCategory],
  );

  return { collections, auctions };
}
