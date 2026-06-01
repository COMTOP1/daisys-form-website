"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

function createPageNumbers(
  page: number,
  totalPages: number,
  maxVisible: number = 3,
): (number | string)[] {
  const pages: (number | string)[] = [];

  const start = Math.max(2, page - maxVisible);
  const end = Math.min(totalPages - 1, page + maxVisible);

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export default function Pagination({ page = 1, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const pages = createPageNumbers(page, totalPages, 3);

  const btnBase =
    "flex items-center justify-center h-8 min-w-8 rounded border text-sm transition-colors disabled:opacity-40";
  const btnIdle =
    "border-gray-500/50 text-gray-300 hover:bg-white/10 hover:text-white";
  const btnActive = "border-green-600 bg-green-700 text-white";

  return (
    <div className="flex justify-center mt-6 gap-1.5 py-4">
      <button
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
        className={`${btnBase} ${btnIdle} px-3`}
      >
        First
      </button>

      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} ${btnIdle} px-2`}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}-${page}`}
            className="flex items-center px-2 text-gray-500 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => handlePageChange(p as number)}
            className={`${btnBase} px-3 ${page === p ? btnActive : btnIdle}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} ${btnIdle} px-2`}
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
        className={`${btnBase} ${btnIdle} px-3`}
      >
        Last
      </button>
    </div>
  );
}
