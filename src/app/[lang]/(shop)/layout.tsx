import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  );
}
