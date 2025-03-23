import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="mt-4 flex items-center justify-end px-2">
      <div className="flex items-center space-x-4">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-teal-600 dark:text-teal-400">
          Page{' '}
          {table.getPageCount() === 0
            ? 0
            : table.getState().pagination.pageIndex + 1}{' '}
          of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="hidden h-8 w-8 bg-teal-900/10 p-0 text-teal-700 hover:bg-teal-900/20 disabled:text-teal-700 disabled:text-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            className="h-8 w-8 bg-teal-900/10 p-0 text-teal-700 hover:bg-teal-900/20 disabled:text-teal-700 disabled:text-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            className="h-8 w-8 bg-teal-900/10 p-0 text-teal-700 hover:bg-teal-900/20 disabled:text-teal-700 disabled:text-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            className="hidden h-8 w-8 bg-teal-900/10 p-0 text-teal-700 hover:bg-teal-900/20 disabled:text-teal-700 disabled:text-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
