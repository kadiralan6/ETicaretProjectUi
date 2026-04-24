"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
  Card,
} from "@chakra-ui/react";

import { useTranslation } from "@/providers/TranslationProvider";
import { PRODUCTS, CATEGORIES } from "@/lib/mock";

const SLIDER_DATA = [
  {
    id: 1,
    titleKey: "shop.slider1Title",
    descKey: "shop.slider1Desc",
    btnKey: "shop.slider1Btn",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80",
    bg: "teal.500",
    btnColor: "orange",
    link: "/products",
  },
  {
    id: 2,
    titleKey: "shop.slider2Title",
    descKey: "shop.slider2Desc",
    btnKey: "shop.slider2Btn",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    bg: "blue.600",
    btnColor: "cyan",
    link: "/products?category=Elektronik",
  },
  {
    id: 3,
    titleKey: "shop.slider3Title",
    descKey: "shop.slider3Desc",
    btnKey: "shop.slider3Btn",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&q=80",
    bg: "purple.500",
    btnColor: "pink",
    link: "/products?category=Ev%20%26%20Yaşam",
  },
];

export const HomePage = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDER_DATA[currentSlide];

  return (
    <Container maxW="container.xl" py="40px">
      <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap="40px">
        {/* Sidebar - Categories */}
        <Box>
          <Heading size="md" mb="16px">
            {t("nav.categories")}
          </Heading>
          <Stack gap="8px">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                passHref
                style={{ width: "100%" }}
              >
                <Button
                  variant="outline"
                  justifyContent="flex-start"
                  w="full"
                  size="lg"
                  colorPalette="teal"
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{
                    bg: "teal.50",
                    borderColor: "teal.400",
                    transform: "translateX(5px)",
                  }}
                  transition="all 0.2s"
                  _dark={{
                    bg: "gray.800",
                    borderColor: "gray.700",
                    _hover: { bg: "teal.900", borderColor: "teal.600" },
                  }}
                >
                  {cat}
                </Button>
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Main Content */}
        <Box>
          {/* Slider */}
          <Box
            bg={slide.bg}
            color="white"
            p="40px"
            borderRadius="xl"
            mb="40px"
            position="relative"
            overflow="hidden"
            transition="background-color 0.5s ease"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap="32px"
              position="relative"
              zIndex={1}
            >
              <Box flex={1}>
                <Heading size="3xl" mb="16px">
                  {t(slide.titleKey)}
                </Heading>
                <Text fontSize="xl" mb="24px">
                  {t(slide.descKey)}
                </Text>
                <Link href={slide.link} passHref>
                  <Button size="lg" colorPalette={slide.btnColor}>
                    {t(slide.btnKey)}
                  </Button>
                </Link>

                <Flex gap="8px" mt="32px">
                  {SLIDER_DATA.map((_, idx) => (
                    <Box
                      key={idx}
                      w={idx === currentSlide ? "6" : "3"}
                      h="3"
                      bg={idx === currentSlide ? "white" : "whiteAlpha.400"}
                      borderRadius="full"
                      cursor="pointer"
                      transition="all 0.3s"
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </Flex>
              </Box>
              <Box
                flex={{ base: "none", md: 1 }}
                display={{ base: "none", md: "block" }}
              >
                <Image
                  src={slide.image}
                  alt={t(slide.titleKey)}
                  borderRadius="lg"
                  shadow="dark-lg"
                  maxH="200px"
                  objectFit="cover"
                  w="full"
                  transition="opacity 0.5s ease"
                />
              </Box>
            </Flex>
          </Box>

          {/* Featured Products */}
          <Heading mb="24px">{t("shop.featuredProducts")}</Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap="24px"
          >
            {PRODUCTS.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card.Root
                  _hover={{ shadow: "lg", transform: "translateY(-5px)" }}
                  transition="all 0.2s"
                  h="full"
                >
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
        </Box>
      </Grid>
    </Container>
  );
};
