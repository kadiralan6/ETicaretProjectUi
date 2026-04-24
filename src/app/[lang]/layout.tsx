import { ReactNode } from "react";
import { TranslationProvider } from "@/providers/TranslationProvider";

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : "tr";

  return (
    <TranslationProvider lang={locale}>
      {children}
    </TranslationProvider>
  );
}
