"use client"

import { useState, useEffect } from "react"
import {
  Box, Flex, Heading, Input, Table, IconButton,
  Text, Badge, Button, Menu, Spinner
} from "@chakra-ui/react"
import { FiPlus, FiMoreVertical, FiTrash2, FiSettings } from "react-icons/fi"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCategoriesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [rowCount, setRowCount] = useState(0)
  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState<string>("")

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/categories/getAllFilter", {
        params: {
          Page: page,
          PageSize: 10,
          Search: search || undefined,
          IsActive: isActive === "" ? undefined : isActive === "true",
          OrderBy: 0, // CreatedAt
          OrderType: 0,
        }
      })
      const paged = res.data?.data
      setCategories(paged?.results ?? [])
      setPageCount(paged?.pageCount ?? 1)
      setRowCount(paged?.rowCount ?? 0)
    } catch (error: any) {
      console.error("Kategorileri çekerken hata:", error)
      toast.error(error.response?.data?.message || "Kategorileri çekerken hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchCategories(), 400)
    return () => clearTimeout(timer)
  }, [page, search, isActive])

  return (
    <Box bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="xl" shadow="sm">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Kategori Listesi</Heading>
        <Link href="/admin/categories/create" passHref>
          <Button colorPalette="purple" size="sm">
            <FiPlus />
            <Text ml={2}>Yeni Kategori Ekle</Text>
          </Button>
        </Link>
      </Flex>

      {/* Filters */}
      <Flex mb={4} gap={3} wrap="wrap">
        <Input
          placeholder="İsim veya açıklama ile ara..."
          maxW="300px"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={{ height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'transparent', minWidth: '140px' }}
          value={isActive}
          onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
        >
          <option value="">Tüm Durumlar</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>
      </Flex>

      <Box overflowX="auto" position="relative" minH="200px">
        {loading && (
          <Flex position="absolute" top={0} left={0} w="full" h="full"
            bg="whiteAlpha.700" _dark={{ bg: "blackAlpha.600" }} zIndex={10}
            justify="center" align="center">
            <Spinner size="lg" color="purple.500" />
          </Flex>
        )}
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="60px" textAlign="center">İşlem</Table.ColumnHeader>
              <Table.ColumnHeader>Kategori Adı</Table.ColumnHeader>
              <Table.ColumnHeader>Üst Kategori</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Sıra</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Durum</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories?.length > 0 ? categories.map(c => (
              <Table.Row key={c.id}>
                <Table.Cell textAlign="center" position="relative" overflow="visible">
                  <Menu.Root positioning={{ placement: "bottom-start" }}>
                    <Menu.Trigger asChild>
                      <IconButton aria-label="Actions" variant="ghost" size="sm" color="gray.500">
                        <FiMoreVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner style={{ position: 'absolute', zIndex: 20 }}>
                      <Menu.Content
                        position="absolute" top="100%" mt={1} minW="160px"
                        bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                        boxShadow="xl" border="1px solid" borderColor="gray.100"
                        borderRadius="md" p={1} zIndex={20}
                      >
                        <Menu.Item value="view" asChild px={3} py={2} cursor="pointer"
                          _hover={{ bg: "gray.50" }} _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm">
                          <Link href={`/admin/categories/${c.id}`} style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}>
                            <FiSettings style={{ marginRight: '8px' }} color="gray" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="gray.700" _dark={{ color: "gray.200" }}>Detay Görüntüle</Text>
                          </Link>
                        </Menu.Item>
                        <Menu.Item value="delete" px={3} py={2} cursor="pointer"
                          _hover={{ bg: "red.50" }} _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                          borderRadius="sm">
                          <Flex align="center" w="full">
                            <FiTrash2 style={{ marginRight: '8px' }} color="red" />
                            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="medium" color="red.500">Sil</Text>
                          </Flex>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell fontWeight="medium">{c.name}</Table.Cell>
                <Table.Cell color="gray.500">{c.parentCategoryName ?? "—"}</Table.Cell>
                <Table.Cell textAlign="center">{c.displayOrder}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Badge colorPalette={c.isActive === false ? "red" : "green"}>
                    {c.isActive === false ? "Pasif" : "Aktif"}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            )) : (
              !loading && (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py={10} color="gray.500">
                    Kayıt bulunamadı.
                  </Table.Cell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="sm" color="gray.500">Sayfa {page} / {pageCount} &bull; Toplam {rowCount} kayıt</Text>
        <Flex gap={2}>
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Önceki</Button>
          <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Sonraki</Button>
        </Flex>
      </Flex>
    </Box>
  )
}
