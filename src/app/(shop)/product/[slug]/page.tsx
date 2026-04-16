"use client"

import { Box, Container, Grid, Heading, Text, Image, Button, Badge, Flex, Stack } from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { PRODUCTS } from "@/lib/mock"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const product = PRODUCTS.find(p => p.slug === slug)

  if (!product) {
    return (
      <Container py={20} textAlign="center">
        <Heading>Ürün Bulunamadı</Heading>
        <Text mt={4}>Aradığınız ürün mevcut değil veya kaldırılmış.</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10}>
        {/* Image Section */}
        <Box borderRadius="xl" overflow="hidden" bg="gray.100">
          <Image src={product.image} alt={product.name} w="full" objectFit="cover" />
        </Box>

        {/* Details Section */}
        <Box>
          <Badge colorPalette="teal" mb={2}>{product.category}</Badge>
          <Heading size="3xl" mb={4}>{product.name}</Heading>
          <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={6}>
            {product.price.toLocaleString('tr-TR')} ₺
          </Text>

          <Text fontSize="lg" color="gray.600" mb={8}>
            {product.description}
          </Text>

          <Flex gap={4}>
            <Button size="xl" colorPalette="orange" flex={1}>
              Sepete Ekle
            </Button>
            <Button size="xl" variant="outline">
              Favorilere Ekle
            </Button>
          </Flex>
        </Box>
      </Grid>
    </Container>
  )
}
