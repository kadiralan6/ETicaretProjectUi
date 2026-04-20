"use client";

import React, { createContext, useContext } from "react";
import tr from "@/dictionaries/tr.json";
import en from "@/dictionaries/en.json";

type Dictionary = typeof tr;
type Lang = "tr" | "en";

const dictionaries: Record<Lang, Dictionary> = { tr, en };

interface TranslationContextValue {
  t: (key: string) => string;
  lang: Lang;
}

const TranslationContext = createContext<TranslationContextValue>({
  t: (key) => key,
  lang: "tr",
});

interface TranslationProviderProps {
  children: React.ReactNode;
  lang?: Lang;
}

export const TranslationProvider = ({
  children,
  lang = "tr",
}: TranslationProviderProps) => {
  const dict = dictionaries[lang] as Record<string, unknown>;

  const t = (key: string): string => {
    // Flat lookup first
    if (typeof dict[key] === "string") {
      return dict[key] as string;
    }

    // Dotted path lookup (max 2 levels: "namespace.key")
    const [namespace, subKey] = key.split(".");
    if (namespace && subKey) {
      const ns = dict[namespace];
      if (ns && typeof ns === "object" && typeof (ns as Record<string, unknown>)[subKey] === "string") {
        return (ns as Record<string, string>)[subKey];
      }
    }

    return key;
  };

  return (
    <TranslationContext.Provider value={{ t, lang }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
