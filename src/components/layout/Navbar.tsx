"use client"

import { Box, Container, Flex, Heading, HStack, Input, Link as ChakraLink, Button, Badge } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/products")
    }
  }

  return (
    <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "500px" }}>
      <Flex gap={2}>
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
  )
}

export function Navbar() {
  return (
    <Box bg="teal.600" py={4} color="white" position="sticky" top={0} zIndex={100}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" gap={4} wrap="wrap">
          <Link href="/">
            <Heading size="lg" color="white">E-Ticaret</Heading>
          </Link>

          <Suspense fallback={<Box w="300px" />}>
            <Box flex={1} display="flex" justifyContent="center">
              <SearchInput />
            </Box>
          </Suspense>

          <HStack gap={6}>
            <Link href="/login">
              <Button variant="ghost" color="white" _hover={{ bg: "teal.700" }}>
                Giriş Yap
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" color="white" _hover={{ bg: "teal.700" }}>
                Sepet <Badge ml={2} colorPalette="red">0</Badge>
              </Button>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
