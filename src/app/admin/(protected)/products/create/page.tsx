"use client"

import { Box, Button, Flex, Grid, GridItem, Heading, Input, VStack, Text, NativeSelect } from "@chakra-ui/react"
import { useState } from "react"
import { FiSave, FiUpload } from "react-icons/fi"

export default function AdminProductCreate() {
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      alert("Ürün başarıyla kaydedildi!")
      setLoading(false)
    }, 1000)
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={8} borderRadius="xl" shadow="sm" maxW="4xl">
      <Heading size="lg" mb={6}>Yeni Ürün Ekle</Heading>
      
      <form onSubmit={handleSave}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          
          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Ürün Adı</Text>
            <Input placeholder="Örn: iPhone 15 Pro" required />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Ürün Kodu</Text>
            <Input placeholder="Örn: PRD-001" required />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Marka</Text>
            <Input placeholder="Örn: Apple" required />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Kategori</Text>
            <Box 
              as="select" 
              w="full" 
              h="10" 
              px={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor="gray.200"
              bg="transparent"
              _dark={{ borderColor: "gray.700" }}
            >
              <option value="">Kategori Seçin</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Giyim">Giyim</option>
              <option value="Ev & Yaşam">Ev & Yaşam</option>
            </Box>
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Stok Adeti</Text>
            <Input type="number" placeholder="0" required min={0} />
          </VStack>

          <VStack align="stretch" gap={2}>
            <Text fontWeight="medium" fontSize="sm">Fiyat (₺)</Text>
            <Input type="number" step="0.01" placeholder="0.00" required min={0} />
          </VStack>

          {/* Image Upload spanning 2 columns */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="stretch" gap={2}>
              <Text fontWeight="medium" fontSize="sm">Ürün Görseli Ekle</Text>
              <Flex 
                border="2px dashed" 
                borderColor="gray.300"
                _dark={{ borderColor: "gray.600" }}
                borderRadius="md" 
                p={10} 
                direction="column" 
                align="center" 
                justify="center"
                bg="gray.50"
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                transition="all 0.2s"
                position="relative"
              >
                <FiUpload size={32} color="gray" />
                <Text mt={4} color="gray.500" fontWeight="medium">Görsel yüklemek için tıklayın veya sürükleyin (PNG, JPG)</Text>
                <Input type="file" opacity={0} position="absolute" w="full" h="full" cursor="pointer" accept="image/*" />
              </Flex>
            </VStack>
          </GridItem>

        </Grid>

        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" type="button">İptal</Button>
          <Button colorPalette="purple" type="submit" loading={loading as unknown as boolean}>
            <FiSave />
            <Text ml={2}>Kaydet</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
