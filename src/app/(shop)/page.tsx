"use client"

import { Box, Button, Container, Grid, Heading, Input, VStack, Text, Image, Card, Stack, Separator, Flex } from "@chakra-ui/react"
import Link from "next/link"
import { PRODUCTS, CATEGORIES } from "@/lib/mock"
import { useState, useEffect } from "react"

const SLIDER_DATA = [
  {
    id: 1,
    title: "Yaz İndirimleri Başladı!",
    desc: "Seçili ürünlerde %50'ye varan indirimleri kaçırmayın.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80",
    bg: "teal.500",
    btnColor: "orange",
    btnText: "Ürünleri Keşfet",
    link: "/products"
  },
  {
    id: 2,
    title: "Yeni Teknoloji Harikaları",
    desc: "En son model telefonlar ve akıllı saatler stokta.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    bg: "blue.600",
    btnColor: "cyan",
    btnText: "Elektroniğe Git",
    link: "/products?category=Elektronik"
  },
  {
    id: 3,
    title: "Evinde Rahatlığı Yakala",
    desc: "Modern ev eşyaları ile yaşam alanınızı güzelleştirin.",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&q=80",
    bg: "purple.500",
    btnColor: "pink",
    btnText: "Ev İçi Ürünler",
    link: "/products?category=Ev%20%26%20Yaşam"
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_DATA.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Container maxW="container.xl" py={10}>
      <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={10}>

        {/* Sidebar - Categories */}
        <Box>
          <Heading size="md" mb={4}>Kategoriler</Heading>
          <Stack gap={2}>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`} passHref style={{ width: '100%' }}>
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
                  _hover={{ bg: "teal.50", borderColor: "teal.400", transform: "translateX(5px)" }}
                  transition="all 0.2s"
                  _dark={{ bg: "gray.800", borderColor: "gray.700", _hover: { bg: "teal.900", borderColor: "teal.600" } }}
                >
                  {cat}
                </Button>
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box>
          {/* Announcement / Banner Area (Slider) */}
          <Box
            bg={SLIDER_DATA[currentSlide].bg}
            color="white"
            p={10}
            borderRadius="xl"
            mb={10}
            position="relative"
            overflow="hidden"
            transition="background-color 0.5s ease"
          >
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={8} position="relative" zIndex={1}>
              <Box flex={1}>
                <Heading size="3xl" mb={4}>{SLIDER_DATA[currentSlide].title}</Heading>
                <Text fontSize="xl" mb={6}>{SLIDER_DATA[currentSlide].desc}</Text>
                <Link href={SLIDER_DATA[currentSlide].link} passHref>
                  <Button size="lg" colorPalette={SLIDER_DATA[currentSlide].btnColor}>{SLIDER_DATA[currentSlide].btnText}</Button>
                </Link>
                
                {/* Slider Indicators */}
                <Flex gap={2} mt={8}>
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
              <Box flex={{ base: "none", md: 1 }} display={{ base: "none", md: "block" }}>
                <Image
                  src={SLIDER_DATA[currentSlide].image}
                  alt={SLIDER_DATA[currentSlide].title}
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
          <Heading mb={6}>Öne Çıkan Ürünler</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={6}>
            {PRODUCTS.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card.Root _hover={{ shadow: "lg", transform: "translateY(-5px)" }} transition="all 0.2s" h="full">
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
                    <Text color="gray.500" fontSize="sm">{product.category}</Text>
                    <Card.Description color="teal.600" fontWeight="bold" fontSize="lg" mt={2}>
                      {product.price.toLocaleString('tr-TR')} ₺
                    </Card.Description>
                  </Card.Body>
                </Card.Root>
              </Link>
            ))}
          </Grid>
        </Box>

      </Grid>
    </Container>
  )
}
