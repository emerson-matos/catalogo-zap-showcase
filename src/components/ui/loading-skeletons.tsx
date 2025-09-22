import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-64 w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

interface CategorySkeletonProps {
  count?: number;
}

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  );
};

interface ListSkeletonProps {
  count?: number;
  itemHeight?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  itemHeight = 'h-16',
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`flex items-center space-x-4 ${itemHeight}`}>
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="flex space-x-4 pb-2 border-b">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

interface PageSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  children?: React.ReactNode;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  showHeader = true,
  showSidebar = false,
  children,
}) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <div className="border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto p-4">
        <div className={`flex gap-8 ${showSidebar ? 'grid-cols-4' : ''}`}>
          {showSidebar && (
            <div className="w-64 space-y-4">
              <Skeleton className="h-6 w-full" />
              <ListSkeleton count={8} itemHeight="h-8" />
            </div>
          )}
          
          <div className="flex-1">
            {children || (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <TextSkeleton lines={2} />
                </div>
                
                <ProductGridSkeleton count={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};