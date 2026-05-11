import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  imageUrls: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductsPageProps {
  lang: string;
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
}

export const ProductsPage = ({
  lang,
  products,
  categories,
  searchQuery,
  selectedCategory,
  currentPage,
  totalPages,
}: ProductsPageProps) => {
  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (currentPage > 1) params.set("page", String(currentPage));
    Object.entries(overrides).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    const qs = params.toString();
    return `/${lang}/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <Container maxW="container.xl" py="40px">
      <Heading mb="32px">
        Ürünler
        {searchQuery && ` — "${searchQuery}" sonuçları`}
      </Heading>

      <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap="40px">
        {/* Sidebar Filters */}
        <Box>
          <Heading size="md" mb="16px">
            Kategoriler
          </Heading>
          <Stack gap="8px">
            <Button
              asChild
              variant="ghost"
              justifyContent="flex-start"
              bg={!selectedCategory ? "teal.100" : "transparent"}
              colorPalette="teal"
            >
              <Link href={buildUrl({ category: "", page: "1" })}>
                Tümü
              </Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant="ghost"
                justifyContent="flex-start"
                bg={selectedCategory === cat.slug ? "teal.100" : "transparent"}
                colorPalette="teal"
              >
                <Link href={buildUrl({ category: cat.slug, page: "1" })}>
                  {cat.name}
                </Link>
              </Button>
            ))}
          </Stack>

          <Separator my="24px" />

          <Heading size="md" mb="16px">
            Fiyat Aralığı
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Yakında
          </Text>
        </Box>

        {/* Product Grid */}
        <Box>
          {products.length === 0 ? (
            <Text fontSize="lg" color="gray.500">
              Ürün bulunamadı.
            </Text>
          ) : (
            <>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap="24px"
              >
                {products.map((product) => (
                  <Link key={product.id} href={`/${lang}/product/${product.slug}`}>
                    <Card.Root _hover={{ shadow: "md" }} transition="all 0.2s">
                      <Box position="relative" h="200px" overflow="hidden">
                        {product.imageUrls?.[0] ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <Box
                            w="full"
                            h="full"
                            bg="gray.100"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text color="gray.400" fontSize="sm">
                              Görsel yok
                            </Text>
                          </Box>
                        )}
                      </Box>
                      <Card.Body>
                        <Card.Title truncate>{product.name}</Card.Title>
                        <Text color="gray.500" fontSize="sm">
                          {product.categoryName}
                        </Text>
                        <Card.Description
                          color="teal.600"
                          fontWeight="bold"
                          fontSize="lg"
                          mt="8px"
                        >
                          {product.price.toLocaleString("tr-TR")} ₺
                        </Card.Description>
                      </Card.Body>
                    </Card.Root>
                  </Link>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Stack direction="row" gap="8px" mt="32px" justify="center">
                  {currentPage > 1 && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildUrl({ page: String(currentPage - 1) })}>
                        ← Önceki
                      </Link>
                    </Button>
                  )}
                  <Text alignSelf="center" fontSize="sm" color="gray.600">
                    {currentPage} / {totalPages}
                  </Text>
                  {currentPage < totalPages && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildUrl({ page: String(currentPage + 1) })}>
                        Sonraki →
                      </Link>
                    </Button>
                  )}
                </Stack>
              )}
            </>
          )}
        </Box>
      </Grid>
    </Container>
  );
};
