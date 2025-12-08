"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
}

const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) => {
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center space-x-2 py-8'>
      {/* Previous Button */}
      <Link href={generatePageUrl(Math.max(1, currentPage - 1))}>
        <Button
          variant='outline'
          size='sm'
          disabled={currentPage === 1}
          className='flex items-center'>
          <ChevronLeft className='h-4 w-4 mr-1' />
          Previous
        </Button>
      </Link>

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <Link key={page} href={generatePageUrl(page)}>
          <Button
            variant={currentPage === page ? "default" : "outline"}
            size='sm'
            className='min-w-10'>
            {page}
          </Button>
        </Link>
      ))}

      {/* Next Button */}
      <Link href={generatePageUrl(Math.min(totalPages, currentPage + 1))}>
        <Button
          variant='outline'
          size='sm'
          disabled={currentPage === totalPages}
          className='flex items-center'>
          Next
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </Link>
    </div>
  );
};

export default Pagination;
