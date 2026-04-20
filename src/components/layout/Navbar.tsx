"use client";

import { Box, Container, Flex, Heading, HStack, Input, Button, Badge } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter, useSearchParams, useParams, usePathname } from "next/navigation";
import { useState, Suspense } from "react";

function SearchInput({ lang }: { lang: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${lang}/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/${lang}/products`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "500px" }}>
      <Flex gap="8px">
        <Input
          placeholder="Ürün ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="white"
          color="black"
          _dark={{ bg: "gray.700", color: "white" }}
        />
        <Button type="submit" colorPalette="blue">Ara</Button>
      </Flex>
    </form>
  );
}

export function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "tr";

  // Aktif sayfanın dil prefix'ini değiştirerek switcher linki oluştur
  const switchTo = (newLang: string) =>
    pathname.replace(/^\/(tr|en)/, `/${newLang}`);

  return (
    <Box bg="teal.600" py="16px" color="white" position="sticky" top={0} zIndex={100}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" gap="16px" wrap="wrap">
          <Link href={`/${lang}`}>
            <Heading size="lg" color="white">E-Ticaret</Heading>
          </Link>

          <Suspense fallback={<Box w="300px" />}>
            <Box flex={1} display="flex" justifyContent="center">
              <SearchInput lang={lang} />
            </Box>
          </Suspense>

          <HStack gap="24px">
            <Link href={`/${lang}/login`}>
              <Button variant="ghost" color="white" _hover={{ bg: "teal.700" }}>
                Giriş Yap
              </Button>
            </Link>
            <Link href={`/${lang}/cart`}>
              <Button variant="ghost" color="white" _hover={{ bg: "teal.700" }}>
                Sepet <Badge ml="8px" colorPalette="red">0</Badge>
              </Button>
            </Link>

            {/* Dil değiştirici */}
            <HStack gap="4px">
              <Link href={switchTo("tr")}>
                <Button
                  size="sm"
                  variant={lang === "tr" ? "solid" : "ghost"}
                  color="white"
                  _hover={{ bg: "teal.700" }}
                >
                  TR
                </Button>
              </Link>
              <Link href={switchTo("en")}>
                <Button
                  size="sm"
                  variant={lang === "en" ? "solid" : "ghost"}
                  color="white"
                  _hover={{ bg: "teal.700" }}>
                  EN
                </Button>
              </Link>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
