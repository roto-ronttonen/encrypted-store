import clsx from "clsx";
import { useMemo } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
export type PaginatorProps = React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number; // Start at 0
  numPages: number;
  onPageClick: (page: number) => void;
};

export default function Paginator({
  currentPage,
  numPages,
  onPageClick,
  ...props
}: PaginatorProps) {
  const currentPageAbs = useMemo(() => {
    if (currentPage >= numPages) {
      return numPages - 1;
    }

    if (currentPage < 0) {
      return 0;
    }

    return currentPage;
  }, [numPages, currentPage]);

  const pagesToShow = useMemo(() => {
    let pages: number[] = [];
    if (currentPageAbs < 3) {
      pages = [0, 1, 2, 3, 4, 5];
    } else if (currentPageAbs > numPages - 3) {
      pages = [
        currentPageAbs - 4,
        currentPageAbs - 3,
        currentPageAbs - 2,
        currentPageAbs - 1,
        currentPageAbs,
      ];
    } else {
      pages = [
        currentPageAbs - 2,
        currentPageAbs - 1,
        currentPageAbs,
        currentPageAbs + 1,
        currentPageAbs + 2,
      ];
    }
    return pages.filter((p) => p < numPages);
  }, [currentPageAbs, numPages]);

  return (
    <div
      {...props}
      className={clsx("inline-flex items-center gap-2", props.className)}
    >
      <button
        className="disabled:cursor-default disabled:text-gray-100"
        disabled={currentPageAbs === 0}
        onClick={() => onPageClick(currentPageAbs - 1)}
      >
        <IoChevronBackSharp size={20} />
      </button>

      {pagesToShow.map((p) => (
        <button
          className={clsx(
            "disabled:cursor-default",
            currentPageAbs === p && "text-blue-500"
          )}
          disabled={currentPageAbs === p}
          key={p}
          onClick={() => onPageClick(p)}
        >
          {p + 1}
        </button>
      ))}

      <button
        className="disabled:cursor-default disabled:text-gray-100"
        disabled={currentPageAbs === numPages - 1}
        onClick={() => onPageClick(currentPageAbs + 1)}
      >
        <IoChevronForwardSharp size={20} />
      </button>
    </div>
  );
}
