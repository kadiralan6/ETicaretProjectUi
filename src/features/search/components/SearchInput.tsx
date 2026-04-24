"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  initialQuery: string;
}

export function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className={styles.input}
        placeholder="Ürün, marka veya kategori ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Arama"
        autoFocus
      />
      <button type="submit" className={styles.button}>
        Ara
      </button>
    </form>
  );
}
