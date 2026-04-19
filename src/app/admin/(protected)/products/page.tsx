"use client"

import { useEffect, useState } from "react"
import { Box, Flex, Heading, Input, Table, IconButton, Text, Badge, Button, Menu, Spinner } from "@chakra-ui/react"
import { FiSettings, FiPlus, FiMoreVertical, FiTrash2 } from "react-icons/fi"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"

interface AdminProductListItem {
  id: number
  code: string
  name: string
  price: number
  stockQuantity: number
  isActive: boolean
  categoryName: string
  brandName: string
}

export default function AdminProductsList() {
  const [products, setProducts] = useState<AdminProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [rowCount, setRowCount] = useState(0)
  const [filters, setFilters] = useState({
    code: "",
    name: "",
    isActive: "",
    minPrice: "",
    maxPrice: "",
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/products", {
        params: {
          Page: page,
          PageSize: 10,
          Name: filters.name || undefined,
          Code: filters.code || undefined,
          IsActive: filters.isActive === "" ? undefined : filters.isActive === "true",
          MinPrice: filters.minPrice || undefined,
          MaxPrice: filters.maxPrice || undefined,
          OrderBy: 0,
          OrderType: 0,
        },
      })

      const paged = res.data?.data
      setProducts(paged?.results ?? [])
      setPageCount(paged?.pageCount ?? 1)
      setRowCount(paged?.rowCount ?? 0)
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      toast.error(message || "Ürünler yüklenemedi.")
      setProducts([])
      setPageCount(1)
      setRowCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(timer)
  }, [page, filters])

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }

  const handleDelete = async (product: AdminProductListItem) => {
    const confirmed = window.confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)
    if (!confirmed) {
      return
    }

    try {
      await axios.delete(`/api/products/${product.id}`)
      toast.success("Ürün silindi.")
      fetchProducts()
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      toast.error(message || "Ürün silinemedi.")
    }
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

      <Flex mb={4} gap={3} wrap="wrap">
        <Input
          placeholder="Ürün adına göre ara..."
          maxW="240px"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <Input
          placeholder="Ürün koduna göre ara..."
          maxW="220px"
          value={filters.code}
          onChange={(e) => handleFilterChange("code", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Min fiyat"
          maxW="140px"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max fiyat"
          maxW="140px"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
        />
        <select
          style={{ height: "40px", padding: "0 12px", borderRadius: "6px", border: "1px solid #E2E8F0", background: "transparent", minWidth: "140px" }}
          value={filters.isActive}
          onChange={(e) => handleFilterChange("isActive", e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>
      </Flex>

      <Box overflowX="auto" position="relative" minH="200px">
        {loading && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bg="whiteAlpha.700"
            _dark={{ bg: "blackAlpha.600" }}
            zIndex={10}
            justify="center"
            align="center"
          >
            <Spinner size="lg" color="purple.500" />
          </Flex>
        )}

        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">İşlem</Table.ColumnHeader>
              <Table.ColumnHeader>Ürün Kodu</Table.ColumnHeader>
              <Table.ColumnHeader>Ürün Adı</Table.ColumnHeader>
              <Table.ColumnHeader>Marka</Table.ColumnHeader>
              <Table.ColumnHeader>Kategori</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
              <Table.ColumnHeader>Stok</Table.ColumnHeader>
              <Table.ColumnHeader>Fiyat</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.length > 0 ? products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell textAlign="center" position="relative" overflow="visible">
                  <Menu.Root positioning={{ placement: "bottom-start" }}>
                    <Menu.Trigger asChild>
                      <IconButton aria-label="Actions" variant="ghost" size="sm" color="gray.500">
                        <FiMoreVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner style={{ position: "absolute", zIndex: 20 }}>
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
                          <Link href={`/admin/products/${product.id}`} style={{ display: "flex", alignItems: "center", width: "100%", textDecoration: "none" }}>
                            <FiSettings style={{ marginRight: "8px" }} color="gray" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: "gray.200" }}>Detay Görüntüle</Text>
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          value="delete"
                          px={3}
                          py={2}
                          cursor="pointer"
                          onClick={() => handleDelete(product)}
                          _hover={{ bg: "red.50" }}
                          _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm"
                        >
                          <Flex align="center" w="full">
                            <FiTrash2 style={{ marginRight: "8px" }} color="red" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="red.500">Sil</Text>
                          </Flex>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell fontWeight="medium">{product.code}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.brandName}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="purple">{product.categoryName}</Badge>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Badge colorPalette={product.isActive ? "green" : "red"}>
                    {product.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="left">
                  <Text color={product.stockQuantity < 2 ? "red.500" : "green.500"} fontWeight="bold">{product.stockQuantity}</Text>
                </Table.Cell>
                <Table.Cell textAlign="left" fontWeight="semibold">
                  {product.price.toLocaleString("tr-TR")} ₺
                </Table.Cell>
              </Table.Row>
            )) : (!loading && (
              <Table.Row>
                <Table.Cell colSpan={8} textAlign="center" py={10} color="gray.500">Kayıt bulunamadı.</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="sm" color="gray.500">Sayfa {page} / {pageCount} • Toplam {rowCount} kayıt</Text>
        <Flex gap={2}>
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Önceki</Button>
          <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => setPage((prev) => prev + 1)}>Sonraki</Button>
        </Flex>
      </Flex>
    </Box>
  )
}
