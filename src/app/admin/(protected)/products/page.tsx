"use client"

import { useState } from "react"
import { Box, Flex, Heading, Input, Table, IconButton, Text, Badge, Button, Menu } from "@chakra-ui/react"
import { FiSettings, FiPlus, FiMoreVertical, FiTrash2 } from "react-icons/fi"
import Link from "next/link"

const MOCK_PRODUCTS = [
  { id: 1, code: "PRD-001", name: "iPhone 15 Pro", brand: "Apple", category: "Elektronik", stock: 45, price: 65000 },
  { id: 2, code: "PRD-002", name: "Samsung Galaxy S24", brand: "Samsung", category: "Elektronik", stock: 15, price: 55000 },
  { id: 3, code: "PRD-003", name: "Nike Air Max", brand: "Nike", category: "Ayakkabı", stock: 120, price: 3500 },
  { id: 4, code: "PRD-004", name: "Kahve Makinesi", brand: "Philips", category: "Ev & Yaşam", stock: 5, price: 4200 },
  { id: 5, code: "PRD-005", name: "MacBook Air M3", brand: "Apple", category: "Bilgisayar", stock: 25, price: 42000 },
]

export default function AdminProductsList() {
  const [filters, setFilters] = useState({
    code: "", name: "", brand: "", category: "", stock: "", price: ""
  })

  // Filter logic
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    return (
      p.code.toLowerCase().includes(filters.code.toLowerCase()) &&
      p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      p.brand.toLowerCase().includes(filters.brand.toLowerCase()) &&
      p.category.toLowerCase().includes(filters.category.toLowerCase()) &&
      p.stock.toString().includes(filters.stock) &&
      p.price.toString().includes(filters.price)
    )
  })

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" shadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Ürün Listesi</Heading>
        <Link href="/admin/products/create" passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml={2}>Yeni Ürün Ekle</Text>
          </Button>
        </Link>
      </Flex>

      <Box overflowX="auto">
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">İşlem</Table.ColumnHeader>
              <Table.ColumnHeader>Ürün Kodu</Table.ColumnHeader>
              <Table.ColumnHeader>Ürün Adı</Table.ColumnHeader>
              <Table.ColumnHeader>Marka</Table.ColumnHeader>
              <Table.ColumnHeader>Kategori</Table.ColumnHeader>
              <Table.ColumnHeader>Stok</Table.ColumnHeader>
              <Table.ColumnHeader>Fiyat</Table.ColumnHeader>
            </Table.Row>
            {/* Filter Row */}
            <Table.Row bg="gray.50" _dark={{ bg: "gray.900" }}>
              <Table.Cell></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.code} onChange={(e) => handleFilterChange('code', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.stock} onChange={(e) => handleFilterChange('stock', e.target.value)} /></Table.Cell>
              <Table.Cell py={2}><Input size="sm" placeholder="Ara..." value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)} /></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredProducts.map(p => (
              <Table.Row key={p.id}>
                <Table.Cell textAlign="center" position="relative" overflow="visible">
                  <Menu.Root positioning={{ placement: "bottom-start" }}>
                    <Menu.Trigger asChild>
                      <IconButton aria-label="Settings" variant="ghost" size="sm" color="gray.500">
                        <FiMoreVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner style={{ position: 'absolute', zIndex: 20 }}>
                      <Menu.Content
                        position="absolute"
                        top="100%"
                        mt={1}
                        minW="160px"
                        bg="white"
                        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="gray.100"
                        borderRadius="md"
                        p={1}
                        zIndex={20}
                      >
                        <Menu.Item
                          value="view"
                          asChild
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.50" }}
                          _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm"
                        >
                          <Link href={`/admin/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                            <FiSettings style={{ marginRight: '8px' }} color="gray" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: "gray.200" }}>Detay Görüntüle</Text>
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          value="delete"
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "red.50" }}
                          _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm"
                        >
                          <Flex align="center" w="full">
                            <FiTrash2 style={{ marginRight: '8px' }} color="red" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="red.500">Sil</Text>
                          </Flex>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell fontWeight="medium">{p.code}</Table.Cell>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{p.brand}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="purple">{p.category}</Badge>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Text color={p.stock < 20 ? "red.500" : "green.500"} fontWeight="bold">{p.stock}</Text>
                </Table.Cell>
                <Table.Cell textAlign="end" fontWeight="semibold">
                  {p.price.toLocaleString('tr-TR')} ₺
                </Table.Cell>
              </Table.Row>
            ))}
            {filteredProducts.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign="center" py={10} color="gray.500">Kayıt bulunamadı.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
