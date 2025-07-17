import { Group, Button, Text, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconChevronLeftPipe, IconChevronRightPipe } from '@tabler/icons-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  showTotalItems?: boolean;
  showPageInfo?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  showTotalItems = true,
  showPageInfo = true
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-gray-200">
      {/* Left side - Items per page and total info */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <Text size="sm" className="text-gray-600">Show:</Text>
            <Select
              size="sm"
              value={itemsPerPage.toString()}
              onChange={(value) => onItemsPerPageChange(parseInt(value || '10'))}
              data={itemsPerPageOptions.map(option => ({ value: option.toString(), label: option.toString() }))}
              w={80}
            />
            <Text size="sm" className="text-gray-600">per page</Text>
          </div>
        )}
        
        {showTotalItems && (
          <Text size="sm" className="text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} items
          </Text>
        )}
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <Button
          variant="light"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          leftSection={<IconChevronLeftPipe size={16} />}
        >
          First
        </Button>

        {/* Previous page button */}
        <Button
          variant="light"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          leftSection={<IconChevronLeft size={16} />}
        >
          Previous
        </Button>

        {/* Page numbers */}
        <Group gap={2}>
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <Text size="sm" className="px-2 py-1 text-gray-500">...</Text>
              ) : (
                <Button
                  variant={currentPage === page ? 'filled' : 'light'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </Group>

        {/* Next page button */}
        <Button
          variant="light"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          rightSection={<IconChevronRight size={16} />}
        >
          Next
        </Button>

        {/* Last page button */}
        <Button
          variant="light"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          rightSection={<IconChevronRightPipe size={16} />}
        >
          Last
        </Button>
      </div>

      {/* Page info */}
      {showPageInfo && (
        <div className="sm:hidden w-full text-center">
          <Text size="sm" className="text-gray-600">
            Page {currentPage} of {totalPages}
          </Text>
        </div>
      )}
    </div>
  );
};

export default Pagination; 