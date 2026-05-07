import { Metadata } from "next";
import { ProfilePageClient } from "@/features/profile/components/ProfilePageClient";
import { siteConfig } from "@/core/config/site";

export const metadata: Metadata = {
  title: `Profilim | ${siteConfig.name}`,
  description:
    "Hesap bilgilerinizi görüntüleyin ve güncelleyin, şifrenizi değiştirin.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="container">
      <ProfilePageClient />
    </div>
  );
}
