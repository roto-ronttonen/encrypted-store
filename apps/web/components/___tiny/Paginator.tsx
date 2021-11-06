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
    if (currentPageAbs < 3) {
      return [0, 1, 2, 3, 4, 5];
    }
    if (currentPageAbs > numPages - 3) {
      return [
        currentPageAbs - 4,
        currentPageAbs - 3,
        currentPageAbs - 2,
        currentPageAbs - 1,
        currentPageAbs,
      ];
    }
    return [
      currentPageAbs - 2,
      currentPageAbs - 1,
      currentPageAbs,
      currentPageAbs + 1,
      currentPageAbs + 2,
    ];
  }, [currentPageAbs, numPages]);

  return (
    <div {...props}>
      <button
        disabled={currentPageAbs === 0}
        onClick={() => onPageClick(currentPageAbs - 1)}
      >
        <IoChevronBackSharp />
      </button>

      {pagesToShow.map((p) => (
        <button onClick={() => onPageClick(p)}>{p + 1}</button>
      ))}

      <button
        disabled={currentPageAbs === numPages - 1}
        onClick={() => onPageClick(currentPageAbs + 1)}
      >
        <IoChevronForwardSharp />
      </button>
    </div>
  );
}
