"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, FormEvent } from "react";
import styles from "./SearchInput.module.css";

interface Suggestion {
  text: string;
  score: number;
}

interface SearchInputProps {
  initialQuery: string;
}

export function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on query change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(query)}&size=6`,
        );
        const data = await res.json();
        if (data?.isSuccess && Array.isArray(data.data)) {
          setSuggestions(data.data);
          setShowSuggestions(true);
          setActiveSuggestion(-1);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = (q: string) => {
    const params = new URLSearchParams();
    params.set("q", q);
    // Preserve category and brand if on search page
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    setShowSuggestions(false);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(query.trim());
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    navigate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      const text = suggestions[activeSuggestion].text;
      setQuery(text);
      navigate(text);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} role="search">
        <input
          type="search"
          className={styles.input}
          placeholder="Ürün, marka veya kategori ara..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") setSuggestions([]);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          aria-label="Arama"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          autoComplete="off"
        />
        <button type="submit" className={styles.button}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Ara
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.text}
              role="option"
              aria-selected={i === activeSuggestion}
              className={`${styles.suggestionItem} ${i === activeSuggestion ? styles.suggestionItemActive : ""}`}
              onMouseDown={() => handleSuggestionClick(s.text)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
