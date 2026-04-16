"use client"

import { Box, Container, Grid, Heading, Stack, Text, Image, Card, Separator, Button, Checkbox } from "@chakra-ui/react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { PRODUCTS, CATEGORIES } from "@/lib/mock"
import { Suspense } from "react"

function ProductContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const searchQuery = searchParams.get("search")?.toLowerCase() || ""
  const selectedCategory = searchParams.get("category") || ""

  // Mock Filtering Logic
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery)
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === selectedCategory) {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={8}>Ürünler {searchQuery && `"${searchQuery}" için sonuçlar`}</Heading>

      <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={10}>
        {/* Sidebar Filters */}
        <Box>
          <Heading size="md" mb={4}>Kategoriler</Heading>
          <Stack gap={2}>
            {CATEGORIES.map(cat => (
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

          <Separator my={6} />

          <Heading size="md" mb={4}>Fiyat Aralığı</Heading>
          <Text color="gray.500" fontSize="sm">Filtreler yakında...</Text>
        </Box>

        {/* Product Grid */}
        <Box>
          {filteredProducts.length === 0 ? (
            <Text fontSize="lg" color="gray.500">Aradığınız kriterlere uygun ürün bulunamadı.</Text>
          ) : (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
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
                      <Text color="gray.500" fontSize="sm">{product.category}</Text>
                      <Card.Description color="teal.600" fontWeight="bold" fontSize="lg" mt={2}>
                        {product.price.toLocaleString('tr-TR')} ₺
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
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Box p={10}>Yükleniyor...</Box>}>
      <ProductContent />
    </Suspense>
  )
}
