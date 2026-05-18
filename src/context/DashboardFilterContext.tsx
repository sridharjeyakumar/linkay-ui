'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '@/data/dashboardData';

interface DashboardFilterContextValue {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextValue>({
  activeCategory: 'All Categories',
  setActiveCategory: () => {},
});

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All Categories');
  return (
    <DashboardFilterContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export const useDashboardFilter = () => useContext(DashboardFilterContext);
