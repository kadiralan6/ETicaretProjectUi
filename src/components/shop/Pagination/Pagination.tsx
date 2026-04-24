import Link from "next/link";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

function buildPageUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(searchParams);
  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getPageRange(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <nav aria-label="Sayfalama" className={styles.nav}>
      <ul className={styles.list}>
        {/* Previous */}
        <li className={styles.item}>
          {currentPage > 1 ? (
            <Link
              href={buildPageUrl(basePath, currentPage - 1, searchParams)}
              className={styles.link}
              rel="prev"
              aria-label="Önceki sayfa"
            >
              <svg
                className={styles.arrow}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : (
            <span
              className={`${styles.link} ${styles.disabled}`}
              aria-disabled="true"
            >
              <svg
                className={styles.arrow}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </li>

        {/* Page Numbers */}
        {pages.map((page, i) => (
          <li key={i} className={styles.item}>
            {page === "ellipsis" ? (
              <span className={styles.ellipsis}>...</span>
            ) : page === currentPage ? (
              <span className={styles.current} aria-current="page">
                {page}
              </span>
            ) : (
              <Link
                href={buildPageUrl(basePath, page, searchParams)}
                className={styles.link}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Next */}
        <li className={styles.item}>
          {currentPage < totalPages ? (
            <Link
              href={buildPageUrl(
                basePath,
                currentPage + 1,
                searchParams,
              )}
              className={styles.link}
              rel="next"
              aria-label="Sonraki sayfa"
            >
              <svg
                className={styles.arrow}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : (
            <span
              className={`${styles.link} ${styles.disabled}`}
              aria-disabled="true"
            >
              <svg
                className={styles.arrow}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
