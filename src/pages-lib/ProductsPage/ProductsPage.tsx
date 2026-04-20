"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Heading,
  Image,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useTranslation } from "@/providers/TranslationProvider";
import { PRODUCTS, CATEGORIES } from "@/lib/mock";

const ProductContent = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const selectedCategory = searchParams.get("category") || "";

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Container maxW="container.xl" py="40px">
      <Heading mb="32px">
        {t("nav.products")}
        {searchQuery && ` "${searchQuery}" ${t("shop.searchResultsFor")}`}
      </Heading>

      <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap="40px">
        {/* Sidebar Filters */}
        <Box>
          <Heading size="md" mb="16px">
            {t("nav.categories")}
          </Heading>
          <Stack gap="8px">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                justifyContent="flex-start"
                bg={selectedCategory === cat ? "teal.100" : "transparent"}
                onClick={() => handleCategoryChange(cat)}
                colorPalette="teal"
              >
                {cat}
              </Button>
            ))}
          </Stack>

          <Separator my="24px" />

          <Heading size="md" mb="16px">
            {t("shop.priceRange")}
          </Heading>
          <Text color="gray.500" fontSize="sm">
            {t("shop.filtersComingSoon")}
          </Text>
        </Box>

        {/* Product Grid */}
        <Box>
          {filteredProducts.length === 0 ? (
            <Text fontSize="lg" color="gray.500">
              {t("shop.noProductsFound")}
            </Text>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap="24px"
            >
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Card.Root _hover={{ shadow: "md" }} transition="all 0.2s">
                    <Box position="relative" h="200px" overflow="hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    </Box>
                    <Card.Body>
                      <Card.Title truncate>{product.name}</Card.Title>
                      <Text color="gray.500" fontSize="sm">
                        {product.category}
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
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export const ProductsPage = () => {
  return (
    <Suspense fallback={<Box p="40px">{""}</Box>}>
      <ProductContent />
    </Suspense>
  );
};
