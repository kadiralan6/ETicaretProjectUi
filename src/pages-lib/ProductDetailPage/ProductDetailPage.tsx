"use client";

import { useParams } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

import { useTranslation } from "@/providers/TranslationProvider";
import { PRODUCTS } from "@/lib/mock";

export const ProductDetailPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const slug = params.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <Container py="80px" textAlign="center">
        <Heading>{t("shop.productNotFound")}</Heading>
        <Text mt="16px">{t("shop.productNotFoundDesc")}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py="40px">
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="40px">
        {/* Image Section */}
        <Box borderRadius="xl" overflow="hidden" bg="gray.100">
          <Image src={product.image} alt={product.name} w="full" objectFit="cover" />
        </Box>

        {/* Details Section */}
        <Box>
          <Badge colorPalette="teal" mb="8px">
            {product.category}
          </Badge>
          <Heading size="3xl" mb="16px">
            {product.name}
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb="24px">
            {product.price.toLocaleString("tr-TR")} ₺
          </Text>

          <Text fontSize="lg" color="gray.600" mb="32px">
            {product.description}
          </Text>

          <Flex gap="16px">
            <Button size="xl" colorPalette="orange" flex={1}>
              {t("shop.addToCart")}
            </Button>
            <Button size="xl" variant="outline">
              {t("shop.addToFavorites")}
            </Button>
          </Flex>
        </Box>
      </Grid>
    </Container>
  );
};
