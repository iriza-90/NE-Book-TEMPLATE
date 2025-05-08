
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BookList from '@/components/books/BookList';
import BookTable from '@/components/books/BookTable';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutGrid, List, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">My Books</h1>
          {user?.verified && (
            <Badge variant="outline" className="ml-2 flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          )}
        </div>
        <div className="flex gap-2 bg-muted/30 p-1 rounded-md">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? "default" : "ghost"}
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'table' ? "default" : "ghost"}
            onClick={() => setViewMode('table')}
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>
      {viewMode === 'grid' ? <BookList /> : <BookTable />}
    </DashboardLayout>
  );
};

export default Dashboard;
